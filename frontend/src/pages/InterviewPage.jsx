/**
 * Interview Page — Premium Enterprise Redesign
 * Adds feature cards, proper empty state, staggered animations.
 * Removes blue card form background, updates form labels.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MessageSquare, Plus, ChevronRight, Award, Clock,
  Loader, CheckCircle, BarChart3, Lightbulb, X
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DIFFICULTY_CONFIG = {
  entry:  { label: 'Entry Level',    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  junior: { label: 'Junior',         badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  mid:    { label: 'Mid Level',      badge: 'text-primary border' },
  senior: { label: 'Senior',         badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  lead:   { label: 'Lead / Principal', badge: 'bg-red-50 text-red-700 border-red-200' },
};

const features = [
  {
    icon: MessageSquare,
    title: 'AI Mock Interview',
    description: 'Practice with realistic questions tailored to your target role and experience level'
  },
  {
    icon: BarChart3,
    title: 'Performance Scoring',
    description: 'Get scored on communication, technical accuracy, and answer structure'
  },
  {
    icon: Lightbulb,
    title: 'Smart Feedback',
    description: 'Receive detailed, actionable suggestions to sharpen your responses'
  }
];

const InterviewPage = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    jobTitle: '', company: '', industry: '',
    experienceLevel: 'mid', interviewType: 'mixed',
    questionCount: 8, resumeId: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [sessionsRes, resumesRes] = await Promise.all([
        interviewAPI.getAll(), resumeAPI.getAll()
      ]);
      if (sessionsRes.data.success) setSessions(sessionsRes.data.interviews || []);
      if (resumesRes.data.success) setResumes(resumesRes.data.resumes || []);
    } catch { /* use empty state */ }
    finally { setLoading(false); }
  };

  const createSession = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim()) return toast.error('Job title is required');
    setCreating(true);
    try {
      const { data } = await interviewAPI.create(form);
      if (data.success) {
        toast.success("Interview session created! Let's practice!");
        navigate(`/interview/${data.interview._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create session');
    } finally { setCreating(false); }
  };

  if (loading) return <LoadingSpinner text="Loading interview sessions..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 stagger-children">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">AI Mock Interview</h2>
          <p className="text-gray-500 text-sm mt-1">Practice with our AI recruiter to sharpen your skills</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center justify-center gap-2">
          {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Session</>}
        </button>
      </div>

      {/* Create Session Form */}
      {showForm && (
        <div className="card animate-page-enter">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}>
              <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="section-title">Setup Interview Session</h3>
          </div>
          <form onSubmit={createSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Job Title <span style={{ color: 'var(--destructive)' }}>*</span></label>
                <input className="input" placeholder="e.g. Senior React Developer"
                  value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Company</label>
                <input className="input" placeholder="e.g. Google (optional)"
                  value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Experience Level</label>
                <select className="input" value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                  {Object.entries(DIFFICULTY_CONFIG).map(([val, cfg]) => (
                    <option key={val} value={val}>{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Interview Type</label>
                <select className="input" value={form.interviewType}
                  onChange={(e) => setForm({ ...form, interviewType: e.target.value })}>
                  <option value="mixed">Mixed (Recommended)</option>
                  <option value="technical">Technical</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="case-study">Case Study</option>
                  <option value="mcq-only">Only MCQ</option>
                </select>
              </div>
              <div>
                <label className="form-label">
                  Questions: <span className="font-semibold" style={{ color: 'var(--primary)' }}>{form.questionCount}</span>
                </label>
                <input type="range" min="5" max="15" step="1"
                  value={form.questionCount}
                  onChange={(e) => setForm({ ...form, questionCount: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: 'var(--primary)' }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  <span>5</span><span>15</span>
                </div>
              </div>
              <div>
                <label className="form-label">Based on Resume (optional)</label>
                <select className="input" value={form.resumeId}
                  onChange={(e) => setForm({ ...form, resumeId: e.target.value })}>
                  <option value="">-- Generic Questions --</option>
                  {resumes.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={creating} className="btn-primary flex items-center gap-2">
                {creating
                  ? <><Loader size={16} className="animate-spin" /> Generating Questions...</>
                  : <><MessageSquare size={18} /> Start Interview</>
                }
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Feature Cards — always visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(feature => (
          <div key={feature.title} className="card card-hover text-center" style={{ padding: '1.5rem' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                 style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
              <feature.icon size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <h4 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>{feature.title}</h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Sessions List or Empty State */}
      {sessions.length === 0 ? (
        <div className="card py-14 text-center">
          {/* Branded illustration */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
                 style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
                 style={{ background: 'color-mix(in srgb, var(--primary) 10%, var(--muted))' }}>
              <MessageSquare size={22} style={{ color: 'var(--primary)' }} className="opacity-70" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No Sessions Yet</h3>
          <p className="text-sm max-w-md mx-auto leading-relaxed mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Start your first mock interview session. Choose a role, answer AI-generated questions,
            and get instant, detailed feedback to improve.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} /> Create Practice Session
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: 'var(--muted-foreground)' }}>Recent Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => {
              const cfg = DIFFICULTY_CONFIG[session.experienceLevel] || DIFFICULTY_CONFIG.mid;
              return (
                <button
                  key={session._id}
                  onClick={() => navigate(`/interview/${session._id}`)}
                  className="card card-hover text-left group"
                  style={{ padding: '1.25rem' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors"
                          style={{ color: 'var(--foreground)' }}>
                        {session.jobTitle}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {session.company || 'Practice Session'}
                      </p>
                    </div>
                    <span className={`badge text-[10px] shrink-0 ml-2 border ${
                      session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : session.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'border-border'
                    }`} style={session.status === 'pending' ? { color: 'var(--muted-foreground)', background: 'var(--muted)' } : {}}>
                      {session.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={18} /> {session.totalQuestions} questions
                    </span>
                    {session.overallScore != null && (
                      <span className="flex items-center gap-1">
                        <Award size={18} className="text-amber-500" /> {session.overallScore}/100
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={18} /> {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {session.status === 'completed' && (
                    <div className="flex items-center gap-1.5 text-xs font-medium"
                         style={{ color: 'oklch(0.45 0.14 145)' }}>
                      <CheckCircle size={18} /> Completed · Score: {session.overallScore}/100
                    </div>
                  )}
                  {session.status === 'in-progress' && (
                    <div className="w-full h-1.5 rounded-full overflow-hidden mt-1" style={{ background: 'var(--muted)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.round((session.answeredQuestions / session.totalQuestions) * 100)}%`,
                          background: 'var(--primary)'
                        }}
                      />
                    </div>
                  )}

                  <ChevronRight size={18} className="mt-3 ml-auto group-hover:translate-x-0.5 transition-transform"
                                style={{ color: 'var(--muted-foreground)' }} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;
