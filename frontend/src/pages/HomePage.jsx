/**
 * HomePage - Marketing landing page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Upload, BarChart3, Briefcase, MessageSquare, FileText, Star, CheckCircle, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const features = [
  { icon: Upload, title: 'Resume Upload', desc: 'Upload PDF or DOCX resumes for instant AI-powered analysis', color: 'from-blue-500 to-cyan-500' },
  { icon: Brain, title: 'AI ATS Scoring', desc: 'Get detailed ATS scores with strengths, weaknesses & suggestions', color: 'from-purple-500 to-pink-500' },
  { icon: FileText, title: 'Resume Builder', desc: '4 professional templates with live preview and PDF export', color: 'from-orange-500 to-red-500' },
  { icon: Briefcase, title: 'Job Matching', desc: 'AI-powered job recommendations based on your skills and experience', color: 'from-green-500 to-emerald-500' },
  { icon: MessageSquare, title: 'Interview Prep', desc: 'Practice with AI-generated questions and get instant feedback', color: 'from-indigo-500 to-blue-500' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track your progress with detailed charts and metrics', color: 'from-yellow-500 to-orange-500' },
];

const stats = [
  { value: '10K+', label: 'Resumes Analyzed' },
  { value: '95%', label: 'User Satisfaction' },
  { value: '3x', label: 'Interview Success Rate' },
  { value: '500+', label: 'Job Placements' },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'Software Engineer', text: 'Got my ATS score from 45 to 89! Landed a job at Google within 2 months.', rating: 5 },
  { name: 'Mike Chen', role: 'Product Manager', text: 'The AI feedback was incredibly specific. It pointed out exactly what recruiters look for.', rating: 5 },
  { name: 'Priya Sharma', role: 'Data Scientist', text: 'Interview prep feature is a game changer. AI questions were better than real interviews!', rating: 5 },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900">SmartResume<span className="text-blue-600">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-4 bg-gradient-to-b from-blue-50 via-purple-50/30 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Zap size={14} className="text-yellow-500" />
            Powered by Gemini & OpenAI
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Land Your Dream Job with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Resume Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Upload your resume, get instant ATS scoring, personalized AI feedback, job recommendations, and prepare for interviews — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg py-4 px-8 flex items-center gap-2 justify-center">
              Analyze Your Resume Free <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg py-4 px-8">
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-1">
            <CheckCircle size={14} className="text-green-500" />
            No credit card required · Free to start · PDF & DOCX support
          </p>
        </div>

        {/* Mock UI Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="mx-auto text-white text-sm font-medium opacity-80">Smart Resume Analyzer</div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6">
              <div className="col-span-1 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                <div className="text-5xl font-black text-blue-600">87</div>
                <div className="text-sm text-gray-600 font-medium">ATS Score</div>
                <div className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-semibold">Excellent</div>
              </div>
              <div className="col-span-2 space-y-3">
                {['Keywords Match', 'Formatting', 'Experience', 'Skills'].map((item, i) => (
                  <div key={item}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item}</span>
                      <span className="font-semibold text-gray-900">{[92, 85, 88, 82][i]}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${[92, 85, 88, 82][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Everything You Need to <span className="text-blue-600">Get Hired</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Our AI-powered platform covers every step of your job search journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-14">
            Loved by Job Seekers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Join thousands of job seekers who improved their resume and aced their interviews
          </p>
          <Link to="/register" className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2">
            Start Free Analysis <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <span className="text-white font-bold">SmartResumeAI</span>
        </div>
        <p className="text-sm">© 2024 Smart AI Resume Analyzer. Built with ❤️ for job seekers worldwide.</p>
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <span className="flex items-center gap-1"><Shield size={12} /> Privacy Protected</span>
          <span className="flex items-center gap-1"><Globe size={12} /> Available Worldwide</span>
          <span className="flex items-center gap-1"><Zap size={12} /> AI Powered</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
