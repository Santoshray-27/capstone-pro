/**
 * Interview Page - Create and list interview sessions
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { MessageSquare, Plus, ChevronRight, Award, Clock, Loader, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DIFFICULTY_CONFIG = {
  entry: { label: 'Entry Level', color: 'text-green-600 bg-green-50' },
  junior: { label: 'Junior', color: 'text-blue-600 bg-blue-50' },
  mid: { label: 'Mid Level', color: 'text-purple-600 bg-purple-50' },
  senior: { label: 'Senior', color: 'text-orange-600 bg-orange-50' },
  lead: { label: 'Lead / Principal', color: 'text-red-600 bg-red-50' },
};

const InterviewPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    industry: '',
    experienceLevel: 'mid',
    interviewType: 'mixed',
    questionCount: 8,
    resumeId: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sessionsRes, resumesRes] = await Promise.all([
        interviewAPI.getAll(),
        resumeAPI.getAll()
      ]);
      if (sessionsRes.data.success) setSessions(sessionsRes.data.interviews || []);
      if (resumesRes.data.success) setResumes(resumesRes.data.resumes || []);
    } catch (err) {
      // Use empty state
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim()) return toast.error('Job title is required');
    setCreating(true);
    try {
      const { data } = await interviewAPI.create(form);
      if (data.success) {
        toast.success('Interview session created! Let\'s practice!');
        navigate(`/interview/${data.interview._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create session');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading interview sessions..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Interview Preparation</h2>
          <p className="text-gray-500 text-sm mt-1">Practice with AI-generated questions and get instant feedback</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Session
        </button>
      </div>

      {/* Create Session Form */}
      {showForm && (
        <div className="card border-blue-200 bg-blue-50/30">
          <h3 className="font-bold text-gray-900 mb-4">Setup Interview Session</h3>
          <form onSubmit={createSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Title *</label>
                <input className="input" placeholder="e.g. Senior React Developer"
                  value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company</label>
                <input className="input" placeholder="e.g. Google (optional)"
                  value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Level</label>
                <select className="input" value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                  {Object.entries(DIFFICULTY_CONFIG).map(([val, cfg]) => (
                    <option key={val} value={val}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Interview Type</label>
                <select className="input" value={form.interviewType}
                  onChange={(e) => setForm({ ...form, interviewType: e.target.value })}>
                  <option value="mixed">Mixed (Recommended)</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="case-study">Case Study</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Questions: {form.questionCount}</label>
                <input type="range" min="5" max="15" step="1"
                  value={form.questionCount}
                  onChange={(e) => setForm({ ...form, questionCount: parseInt(e.target.value) })}
                  className="w-full accent-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Based on Resume (optional)</label>
                <select className="input" value={form.resumeId}
                  onChange={(e) => setForm({ ...form, resumeId: e.target.value })}>
                  <option value="">-- Generic Questions --</option>
                  {resumes.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2">
                {creating ? <><Loader size={16} className="animate-spin" /> Generating Questions...</> : <><MessageSquare size={16} /> Start Interview</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="card text-center py-16">
          <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Interview Sessions Yet</h3>
          <p className="text-gray-400 mb-4">Create your first practice session to get AI feedback</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} /> Create Practice Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <button
              key={session._id}
              onClick={() => navigate(`/interview/${session._id}`)}
              className="card text-left hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {session.jobTitle}
                  </h3>
                  <p className="text-gray-500 text-sm">{session.company || 'Practice Session'}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  session.status === 'completed' ? 'bg-green-100 text-green-700' :
                  session.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {session.status}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <MessageSquare size={13} /> {session.totalQuestions} questions
                </span>
                {session.overallScore !== null && session.overallScore !== undefined && (
                  <span className="flex items-center gap-1">
                    <Award size={13} className="text-yellow-500" /> {session.overallScore}/100
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>

              {session.status === 'completed' && (
                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <CheckCircle size={13} /> Completed · Score: {session.overallScore}/100
                </div>
              )}
              {session.status === 'in-progress' && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.round((session.answeredQuestions / session.totalQuestions) * 100)}%` }}
                  />
                </div>
              )}

              <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors ml-auto mt-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
