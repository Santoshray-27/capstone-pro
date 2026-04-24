/**
 * Interview Session Page - Active interview Q&A with AI evaluation
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, ChevronLeft, ChevronRight, Send, CheckCircle, Award, Loader, Clock } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ScoreCircle from '../components/common/ScoreCircle';

const InterviewSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completedData, setCompletedData] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    try {
      const { data } = await interviewAPI.getById(id);
      if (data.success) {
        setSession(data.interview);
        if (data.interview.status === 'completed') {
          setCompletedData({ summary: data.interview });
        }
        // Find first unanswered question
        const firstUnanswered = data.interview.questions.findIndex(q => !q.isAnswered);
        if (firstUnanswered !== -1) setCurrentQ(firstUnanswered);
      }
    } catch (err) {
      toast.error('Failed to load session');
      navigate('/interview');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || answer.trim().length < 5) {
      return toast.error('Please provide a meaningful answer');
    }
    setSubmitting(true);
    try {
      const { data } = await interviewAPI.submitAnswer(id, {
        questionIndex: currentQ,
        answer: answer.trim()
      });

      if (data.success) {
        // Update local session
        setSession(prev => {
          const updated = { ...prev };
          updated.questions[currentQ].userAnswer = answer;
          updated.questions[currentQ].isAnswered = true;
          updated.questions[currentQ].evaluation = data.evaluation;
          return updated;
        });
        setAnswer('');
        setShowFeedback(true);
        toast.success(`Scored ${data.evaluation.score}/10!`);
      }
    } catch (err) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    if (currentQ < session.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswer('');
    }
  };

  const completeSession = async () => {
    setCompleting(true);
    try {
      const { data } = await interviewAPI.complete(id);
      if (data.success) {
        setCompletedData(data);
        toast.success('Interview completed! Great job!');
      }
    } catch (err) {
      toast.error('Failed to complete session');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading interview..." />;
  if (!session) return null;

  const progress = Math.round((session.questions.filter(q => q.isAnswered).length / session.totalQuestions) * 100);
  const allAnswered = session.questions.every(q => q.isAnswered);

  // Completed state
  if (completedData) {
    const summary = completedData.summary || session;
    const score = summary.overallScore || 0;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Interview Complete!</h2>
          <p className="text-gray-500 mb-6">Here's your performance summary</p>

          <div className="flex justify-center mb-6">
            <ScoreCircle score={score} size={160} />
          </div>

          {summary.readinessLevel && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm mb-4 ${
              summary.readinessLevel === 'excellent' ? 'bg-green-100 text-green-700' :
              summary.readinessLevel === 'good' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              <CheckCircle size={16} /> {summary.readinessLevel?.replace('-', ' ').toUpperCase()}
            </div>
          )}

          {summary.overallFeedback && (
            <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">{summary.overallFeedback}</p>
          )}

          {/* Strengths & Improvements */}
          {summary.topStrengths?.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4 text-left mb-4">
              <p className="font-semibold text-green-800 mb-2 text-sm">✅ Your Strengths</p>
              <ul className="space-y-1">
                {summary.topStrengths.map((s, i) => (
                  <li key={i} className="text-green-700 text-xs flex items-start gap-1">
                    <span className="mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {summary.areasToImprove?.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4 text-left mb-6">
              <p className="font-semibold text-yellow-800 mb-2 text-sm">🎯 Areas to Improve</p>
              <ul className="space-y-1">
                {summary.areasToImprove.map((s, i) => (
                  <li key={i} className="text-yellow-700 text-xs flex items-start gap-1">
                    <span className="mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/interview')} className="btn-primary">
              Back to Interviews
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = session.questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-black text-gray-900">{session.jobTitle}</h2>
            <p className="text-gray-500 text-sm">{session.company || 'Practice Session'} · {session.experienceLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {session.questions.filter(q => q.isAnswered).length} / {session.totalQuestions}
            </p>
            <p className="text-xs text-gray-400">answered</p>
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Navigator */}
      <div className="flex gap-1.5 flex-wrap">
        {session.questions.map((q, i) => (
          <button
            key={i}
            onClick={() => { setCurrentQ(i); setShowFeedback(q.isAnswered); setAnswer(''); }}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
              i === currentQ ? 'bg-blue-600 text-white shadow-md scale-110' :
              q.isAnswered ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
            question.type === 'technical' ? 'bg-blue-100 text-blue-700' :
            question.type === 'behavioral' ? 'bg-purple-100 text-purple-700' :
            'bg-green-100 text-green-700'
          }`}>
            {question.type}
          </div>
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
            question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {question.difficulty}
          </div>
          <span className="ml-auto text-xs text-gray-400">Q{currentQ + 1} of {session.totalQuestions}</span>
        </div>

        <p className="text-gray-900 font-semibold text-lg leading-relaxed mb-4">
          {question.question}
        </p>

        {/* Already answered - show feedback */}
        {question.isAnswered && showFeedback ? (
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 mb-1">Your Answer:</p>
              <p className="text-sm text-gray-700">{question.userAnswer}</p>
            </div>

            {question.evaluation && (
              <>
                <div className={`p-4 rounded-xl ${
                  question.evaluation.score >= 7 ? 'bg-green-50 border border-green-100' :
                  question.evaluation.score >= 5 ? 'bg-blue-50 border border-blue-100' :
                  'bg-yellow-50 border border-yellow-100'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 text-sm">AI Evaluation</p>
                    <span className={`text-lg font-black ${
                      question.evaluation.score >= 7 ? 'text-green-600' :
                      question.evaluation.score >= 5 ? 'text-blue-600' : 'text-yellow-600'
                    }`}>{question.evaluation.score}/10</span>
                  </div>
                  <p className="text-sm text-gray-700">{question.evaluation.feedback}</p>

                  {question.evaluation.strengths?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-green-700">Strengths:</p>
                      {question.evaluation.strengths.map((s, i) => (
                        <p key={i} className="text-xs text-green-700">• {s}</p>
                      ))}
                    </div>
                  )}
                  {question.evaluation.improvements?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-yellow-700">To Improve:</p>
                      {question.evaluation.improvements.map((s, i) => (
                        <p key={i} className="text-xs text-yellow-700">• {s}</p>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-2">
              {currentQ < session.questions.length - 1 && (
                <button onClick={nextQuestion} className="btn-primary flex items-center gap-2">
                  Next Question <ChevronRight size={16} />
                </button>
              )}
              {allAnswered && !completedData && (
                <button onClick={completeSession} disabled={completing}
                  className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2">
                  {completing ? <Loader size={16} className="animate-spin" /> : <Award size={16} />}
                  Complete Interview
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Answer Input */
          !question.isAnswered && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Answer</label>
              <textarea
                className="input resize-none text-sm"
                rows={6}
                placeholder="Type your answer here... Use the STAR method: Situation, Task, Action, Result"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{answer.split(/\s+/).filter(Boolean).length} words</span>
                <span className="text-xs text-gray-400">Recommended: 100-200 words</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={submitAnswer}
                  disabled={submitting || !answer.trim()}
                  className="btn-primary flex items-center gap-2"
                >
                  {submitting ? <><Loader size={16} className="animate-spin" /> Evaluating...</> : <><Send size={16} /> Submit Answer</>}
                </button>
                {currentQ > 0 && (
                  <button onClick={() => { setCurrentQ(currentQ - 1); setAnswer(''); }}
                    className="btn-secondary flex items-center gap-1">
                    <ChevronLeft size={16} /> Prev
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Complete Button if all answered */}
      {allAnswered && !completedData && (
        <div className="card bg-green-50 border-green-200 flex items-center justify-between">
          <div>
            <p className="font-bold text-green-900">All questions answered! 🎉</p>
            <p className="text-green-700 text-sm">Click to complete and get your final score</p>
          </div>
          <button onClick={completeSession} disabled={completing}
            className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-2">
            {completing ? <Loader size={16} className="animate-spin" /> : <Award size={16} />}
            Get Final Score
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewSessionPage;
