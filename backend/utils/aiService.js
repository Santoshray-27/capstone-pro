/**
 * AI Service Module
 * Handles all AI operations: resume analysis, job matching, interview Q&A
 * Supports both Gemini and OpenAI with graceful fallback to mock data
 */

const https = require('https');

// ========================
// Helper: Make HTTP request
// ========================
const makeRequest = (url, options, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

// ========================
// Gemini API Call
// ========================
const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`);

  const body = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 4096,
    }
  };

  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(url.toString().replace('https://', ''), options, body);

  if (response.error) {
    throw new Error(response.error.message || 'Gemini API error');
  }

  return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

// ========================
// OpenAI API Call
// ========================
const callOpenAI = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Use node-fetch for OpenAI
  const fetch = require('node-fetch');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR consultant and ATS resume specialist. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 4096
    })
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || 'OpenAI API error');
  }

  return data.choices?.[0]?.message?.content || '';
};

// ========================
// Call AI with Fallback
// ========================
const callAI = async (prompt) => {
  // Try Gemini first
  try {
    const result = await callGemini(prompt);
    return { text: result, model: 'gemini' };
  } catch (geminiError) {
    console.warn('Gemini failed, trying OpenAI:', geminiError.message);
  }

  // Try OpenAI
  try {
    const result = await callOpenAI(prompt);
    return { text: result, model: 'openai' };
  } catch (openaiError) {
    console.warn('OpenAI failed, using mock data:', openaiError.message);
  }

  // Return null to indicate we need mock data
  return null;
};

// ========================
// Parse JSON from AI response
// ========================
const parseAIJson = (text) => {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1].trim());
    }
    // Try direct parse
    return JSON.parse(text.trim());
  } catch (e) {
    // Try to extract JSON object from text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
};

// ========================
// Mock Analysis Data (fallback)
// ========================
const getMockAnalysis = (resumeText) => {
  const wordCount = resumeText.split(/\s+/).length;
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeText);
  const hasPhone = /[\+\(]?[\d\s\-\(\)]{10,}/.test(resumeText);
  const hasLinkedIn = /linkedin/i.test(resumeText);
  const hasGitHub = /github/i.test(resumeText);
  const skillWords = ['javascript', 'python', 'react', 'node', 'java', 'sql', 'css', 'html', 'typescript', 'aws', 'docker', 'kubernetes', 'git', 'agile', 'scrum'];
  const foundSkills = skillWords.filter(s => resumeText.toLowerCase().includes(s));

  // Calculate a realistic score
  let score = 45;
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLinkedIn) score += 5;
  if (hasGitHub) score += 5;
  if (wordCount > 300) score += 10;
  if (wordCount > 500) score += 5;
  score += Math.min(foundSkills.length * 3, 15);

  return {
    atsScore: Math.min(score, 92),
    scoreBreakdown: {
      formatting: Math.floor(Math.random() * 20) + 65,
      keywords: Math.floor(Math.random() * 20) + 60,
      experience: Math.floor(Math.random() * 20) + 55,
      skills: Math.floor(Math.random() * 20) + 60,
      education: Math.floor(Math.random() * 15) + 70,
      overall: Math.min(score, 92)
    },
    strengths: [
      'Clear contact information provided',
      'Good work experience documentation',
      'Relevant technical skills listed',
      'Professional formatting and layout',
      'Quantifiable achievements mentioned'
    ],
    weaknesses: [
      'Summary section could be more impactful',
      'Some bullet points lack quantification',
      'Keywords could better match ATS systems',
      'Action verbs could be stronger'
    ],
    missingSkills: [
      'Cloud platforms (AWS/GCP/Azure)',
      'CI/CD pipeline experience',
      'Unit testing frameworks',
      'API design and documentation'
    ],
    suggestions: [
      'Add a compelling professional summary (3-4 lines)',
      'Quantify achievements with numbers and percentages',
      'Include industry-specific keywords in each section',
      'Add certifications section to boost credibility',
      'Tailor resume keywords to match job description',
      'Use consistent date formatting throughout',
      'Add links to GitHub portfolio or projects',
      'Ensure all experience has strong action verbs'
    ],
    sectionFeedback: {
      summary: 'Professional summary could be expanded to highlight unique value proposition.',
      experience: 'Work experience is well documented. Add metrics to show impact.',
      skills: 'Skills section present. Consider categorizing (Technical/Soft/Tools).',
      education: 'Education details look good. Add GPA if above 3.5.',
      formatting: 'Clean formatting. Ensure consistent font and spacing.'
    },
    keywordsFound: foundSkills,
    keywordsMissing: skillWords.filter(s => !resumeText.toLowerCase().includes(s)).slice(0, 5),
    keywordDensity: Math.floor(foundSkills.length / skillWords.length * 100),
    industryMatch: Math.floor(Math.random() * 30) + 60,
    aiModel: 'mock'
  };
};

// ========================
// 1. RESUME ANALYSIS
// ========================
const analyzeResume = async (resumeText, jobTitle = '', jobDescription = '') => {
  const startTime = Date.now();

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and career coach.
Analyze this resume comprehensively and return a JSON response.

RESUME TEXT:
${resumeText.substring(0, 3000)}

${jobTitle ? `TARGET JOB: ${jobTitle}` : ''}
${jobDescription ? `JOB DESCRIPTION: ${jobDescription.substring(0, 1000)}` : ''}

Return ONLY valid JSON with this exact structure:
{
  "atsScore": <number 0-100>,
  "scoreBreakdown": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>,
    "education": <number 0-100>,
    "overall": <number 0-100>
  },
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "missingSkills": ["skill1", "skill2", "skill3", "skill4"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5"],
  "sectionFeedback": {
    "summary": "feedback text",
    "experience": "feedback text",
    "skills": "feedback text",
    "education": "feedback text",
    "formatting": "feedback text"
  },
  "keywordsFound": ["keyword1", "keyword2"],
  "keywordsMissing": ["keyword1", "keyword2"],
  "keywordDensity": <number 0-100>,
  "industryMatch": <number 0-100>
}
`;

  try {
    const aiResult = await callAI(prompt);

    if (!aiResult) {
      // Use mock data as fallback
      const mockData = getMockAnalysis(resumeText);
      return { ...mockData, processingTime: Date.now() - startTime };
    }

    const parsed = parseAIJson(aiResult.text);
    if (!parsed || !parsed.atsScore) {
      const mockData = getMockAnalysis(resumeText);
      return { ...mockData, processingTime: Date.now() - startTime };
    }

    return {
      ...parsed,
      aiModel: aiResult.model,
      processingTime: Date.now() - startTime
    };

  } catch (error) {
    console.error('Resume analysis error:', error.message);
    const mockData = getMockAnalysis(resumeText);
    return { ...mockData, processingTime: Date.now() - startTime };
  }
};

// ========================
// 2. JOB RECOMMENDATIONS
// ========================
const getJobRecommendations = async (resumeData, count = 5) => {
  const skillsList = Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : '';
  const experienceText = resumeData.experience ? JSON.stringify(resumeData.experience).substring(0, 500) : '';

  const prompt = `
Based on this candidate profile, generate ${count} realistic job recommendations.

CANDIDATE PROFILE:
- Skills: ${skillsList}
- Experience: ${experienceText}
- Education: ${JSON.stringify(resumeData.education || []).substring(0, 300)}

Return ONLY valid JSON array:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, State or Remote",
    "type": "Full-time",
    "salary": "$80,000 - $100,000",
    "matchScore": <number 70-99>,
    "requiredSkills": ["skill1", "skill2"],
    "description": "Brief job description (2 sentences)",
    "whyMatch": "Why this matches the candidate's profile",
    "industry": "Industry name",
    "experienceLevel": "Mid/Senior/Entry"
  }
]
`;

  try {
    const aiResult = await callAI(prompt);

    if (!aiResult) {
      return getMockJobRecommendations(skillsList);
    }

    const parsed = parseAIJson(aiResult.text);
    if (!parsed || !Array.isArray(parsed)) {
      return getMockJobRecommendations(skillsList);
    }

    return parsed;

  } catch (error) {
    console.error('Job recommendations error:', error.message);
    return getMockJobRecommendations(skillsList);
  }
};

// ========================
// Mock Job Recommendations
// ========================
const getMockJobRecommendations = (skills = '') => {
  return [
    {
      title: 'Full Stack Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA (Hybrid)',
      type: 'Full-time',
      salary: '$95,000 - $130,000',
      matchScore: 92,
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
      description: 'Build and maintain scalable web applications using modern tech stack. Work with cross-functional teams.',
      whyMatch: 'Strong alignment with your React and Node.js skills',
      industry: 'Software Development',
      experienceLevel: 'Mid'
    },
    {
      title: 'Software Engineer II',
      company: 'StartupVentures Inc',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100,000 - $140,000',
      matchScore: 87,
      requiredSkills: ['JavaScript', 'Python', 'AWS', 'Docker'],
      description: 'Join our engineering team to build next-generation cloud products. Fast-paced startup environment.',
      whyMatch: 'Your JavaScript expertise matches 87% of requirements',
      industry: 'Cloud Computing',
      experienceLevel: 'Mid'
    },
    {
      title: 'Frontend Engineer',
      company: 'DesignFirst Agency',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$85,000 - $115,000',
      matchScore: 85,
      requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
      description: 'Create beautiful user interfaces for enterprise clients. Strong design sense required.',
      whyMatch: 'Your frontend skills are a great match',
      industry: 'Design & Technology',
      experienceLevel: 'Mid'
    },
    {
      title: 'Backend Developer',
      company: 'DataStream Analytics',
      location: 'Austin, TX (Remote)',
      type: 'Full-time',
      salary: '$90,000 - $125,000',
      matchScore: 83,
      requiredSkills: ['Node.js', 'PostgreSQL', 'Redis', 'Microservices'],
      description: 'Design and build high-performance backend systems processing millions of events daily.',
      whyMatch: 'Node.js and database experience aligns well',
      industry: 'Data & Analytics',
      experienceLevel: 'Senior'
    },
    {
      title: 'DevOps Engineer',
      company: 'CloudBase Technologies',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$105,000 - $145,000',
      matchScore: 78,
      requiredSkills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform'],
      description: 'Manage cloud infrastructure and deployment pipelines. Enable engineering team efficiency.',
      whyMatch: 'Your development background transfers to DevOps practices',
      industry: 'Cloud Infrastructure',
      experienceLevel: 'Senior'
    }
  ];
};

// ========================
// 3. INTERVIEW QUESTION GENERATOR
// ========================
const generateInterviewQuestions = async (jobTitle, skills = [], experienceLevel = 'mid', count = 10) => {
  const prompt = `
Generate ${count} high-quality interview questions for a ${experienceLevel}-level ${jobTitle} position.

RELEVANT SKILLS: ${skills.join(', ')}

Return ONLY valid JSON array:
[
  {
    "question": "Detailed interview question here?",
    "type": "behavioral|technical|situational|cultural",
    "difficulty": "easy|medium|hard",
    "expectedAnswer": "Key points to look for in an ideal answer",
    "followUpQuestions": ["Follow-up 1?", "Follow-up 2?"]
  }
]

Mix: 40% technical, 30% behavioral, 20% situational, 10% cultural fit
Include questions about: problem-solving, teamwork, specific technical skills, past experiences
`;

  try {
    const aiResult = await callAI(prompt);

    if (!aiResult) {
      return getMockInterviewQuestions(jobTitle);
    }

    const parsed = parseAIJson(aiResult.text);
    if (!parsed || !Array.isArray(parsed)) {
      return getMockInterviewQuestions(jobTitle);
    }

    return parsed;

  } catch (error) {
    console.error('Interview questions error:', error.message);
    return getMockInterviewQuestions(jobTitle);
  }
};

// ========================
// Mock Interview Questions
// ========================
const getMockInterviewQuestions = (jobTitle) => {
  return [
    {
      question: `Tell me about yourself and why you're interested in this ${jobTitle} role.`,
      type: 'behavioral',
      difficulty: 'easy',
      expectedAnswer: 'Clear narrative of background, relevant experience, motivation for role',
      followUpQuestions: ['What specifically attracted you to our company?', 'Where do you see yourself in 5 years?']
    },
    {
      question: 'Describe a challenging technical problem you solved. Walk me through your approach.',
      type: 'technical',
      difficulty: 'medium',
      expectedAnswer: 'Structured problem-solving, clear methodology, outcome-focused',
      followUpQuestions: ['What would you do differently?', 'How did you measure success?']
    },
    {
      question: 'Tell me about a time you had a conflict with a teammate. How did you resolve it?',
      type: 'behavioral',
      difficulty: 'medium',
      expectedAnswer: 'Shows communication skills, empathy, conflict resolution',
      followUpQuestions: ['What did you learn from that experience?']
    },
    {
      question: 'How do you handle tight deadlines and multiple competing priorities?',
      type: 'situational',
      difficulty: 'medium',
      expectedAnswer: 'Time management, prioritization frameworks, communication skills',
      followUpQuestions: ['Give me a specific example', 'What tools do you use?']
    },
    {
      question: 'Explain a complex technical concept to a non-technical stakeholder. Give an example.',
      type: 'technical',
      difficulty: 'medium',
      expectedAnswer: 'Communication skills, ability to simplify, audience awareness',
      followUpQuestions: ['How did you know they understood?']
    },
    {
      question: 'Describe your experience with agile development methodologies.',
      type: 'technical',
      difficulty: 'easy',
      expectedAnswer: 'Sprint planning, standups, retrospectives, continuous delivery',
      followUpQuestions: ["What's your favorite part of agile?", "Any challenges with agile?"]
    },
    {
      question: "What's your approach to code reviews? How do you give/receive feedback?",
      type: 'technical',
      difficulty: 'medium',
      expectedAnswer: 'Collaborative, constructive, focus on code quality and learning',
      followUpQuestions: ['What do you look for in a code review?']
    },
    {
      question: 'Where do you see the industry heading in the next 3-5 years?',
      type: 'cultural',
      difficulty: 'hard',
      expectedAnswer: 'Industry awareness, continuous learning mindset, strategic thinking',
      followUpQuestions: ['How are you preparing for these changes?']
    },
    {
      question: "What's the most innovative solution you've built? Walk me through the technical decisions.",
      type: 'technical',
      difficulty: 'hard',
      expectedAnswer: 'Creative problem solving, technical depth, ownership mentality',
      followUpQuestions: ['What constraints did you face?', 'Would you make different tradeoffs today?']
    },
    {
      question: 'Why are you leaving your current/previous role?',
      type: 'behavioral',
      difficulty: 'easy',
      expectedAnswer: 'Positive framing, growth motivation, professional reasons',
      followUpQuestions: ['What did you enjoy most about that role?']
    }
  ];
};

// ========================
// 4. INTERVIEW ANSWER EVALUATOR
// ========================
const evaluateInterviewAnswer = async (question, answer, jobTitle = '', expectedAnswer = '') => {
  if (!answer || answer.trim().length < 20) {
    return {
      score: 0,
      feedback: 'Answer too short. Please provide a detailed response.',
      strengths: [],
      improvements: ['Provide a complete, detailed answer', 'Use specific examples'],
      modelAnswer: expectedAnswer || 'Please provide a thoughtful, detailed answer with specific examples.',
      aiModel: 'mock'
    };
  }

  const prompt = `
You are an experienced hiring manager evaluating an interview response.

QUESTION: ${question}
CANDIDATE'S ANSWER: ${answer}
${expectedAnswer ? `EXPECTED ANSWER OUTLINE: ${expectedAnswer}` : ''}
${jobTitle ? `ROLE: ${jobTitle}` : ''}

Evaluate this answer and return ONLY valid JSON:
{
  "score": <number 0-10>,
  "feedback": "Overall assessment in 2-3 sentences",
  "strengths": ["what they did well 1", "what they did well 2"],
  "improvements": ["what to improve 1", "what to improve 2"],
  "modelAnswer": "A strong model answer for this question"
}
`;

  try {
    const aiResult = await callAI(prompt);

    if (!aiResult) {
      return getMockEvaluation(answer);
    }

    const parsed = parseAIJson(aiResult.text);
    if (!parsed || parsed.score === undefined) {
      return getMockEvaluation(answer);
    }

    return { ...parsed, aiModel: aiResult.model };

  } catch (error) {
    console.error('Answer evaluation error:', error.message);
    return getMockEvaluation(answer);
  }
};

// ========================
// Mock Answer Evaluation
// ========================
const getMockEvaluation = (answer) => {
  const words = answer.split(/\s+/).length;
  const hasExample = /example|situation|time when|case|project/i.test(answer);
  const hasResult = /result|outcome|achieved|improved|reduced|increased/i.test(answer);
  const hasStar = hasExample && hasResult;

  let score = 5;
  if (words > 50) score++;
  if (words > 100) score++;
  if (hasExample) score++;
  if (hasResult) score++;
  if (hasStar) score++;

  return {
    score: Math.min(score, 10),
    feedback: `Your answer ${hasStar ? 'effectively uses the STAR method' : 'could benefit from more structure'}. ${words > 100 ? 'Good detail provided.' : 'Consider adding more context.'}`,
    strengths: [
      words > 50 ? 'Provided sufficient detail' : 'Attempted to answer the question',
      hasExample ? 'Used a concrete example' : 'Addressed the core question'
    ].filter(Boolean),
    improvements: [
      !hasExample ? 'Use the STAR method: Situation, Task, Action, Result' : null,
      !hasResult ? 'Quantify your impact with numbers or metrics' : null,
      words < 50 ? 'Provide more detail and context' : null,
      'Practice structured storytelling for clarity'
    ].filter(Boolean),
    modelAnswer: `A strong answer would use the STAR method: describe a specific Situation, the Task you were assigned, the Actions you took, and the measurable Results achieved. Include specific metrics where possible.`,
    aiModel: 'mock'
  };
};

module.exports = {
  analyzeResume,
  getJobRecommendations,
  generateInterviewQuestions,
  evaluateInterviewAnswer
};
