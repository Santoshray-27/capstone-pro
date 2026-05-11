/**
 * ScreeningPage - AI-Based Resume Screening
 * Screen your resume against any job description
 */
import React, { useState, useEffect } from 'react';
import { screeningAPI } from '../services/api';
import {
  Shield, FileText, Loader, CheckCircle2, XCircle, AlertTriangle,
  ChevronDown, Sparkles, TrendingUp, Target, Users, Eye, Zap, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreCircle from '../components/common/ScoreCircle';

const ScreeningPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [form, setForm] = useState({
    jobTitle: '',
    jobDescription: '',
    requiredSkills: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await screeningAPI.getResumes();
      if (data.success) setResumes(data.resumes);
    } catch {
      // user may not have resumes yet
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobTitle.trim() || !form.jobDescription.trim()) {
      return toast.error('Please provide both job title and job description');
    }
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        resumeId: selectedResume || undefined,
        jobTitle: form.jobTitle,
        jobDescription: form.jobDescription,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };
      const { data } = await screeningAPI.screenResume(payload);
      if (data.success) {
        setResult(data.screening);
        toast.success('Screening complete!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Screening failed. Make sure you have uploaded a resume.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictConfig = (verdict) => {
    switch (verdict) {
      case 'shortlisted':
        return { label: 'Shortlisted', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', gradient: 'from-emerald-500 to-green-600' };
      case 'maybe':
        return { label: 'Under Review', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', gradient: 'from-amber-500 to-yellow-600' };
      case 'rejected':
        return { label: 'Not a Match', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-500 to-rose-600' };
      default:
        return { label: 'Pending', icon: Eye, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'met': return <span className="badge-success">✓ Met</span>;
      case 'partial': return <span className="badge-warning">~ Partial</span>;
      case 'unmet': return <span className="badge-error">✗ Unmet</span>;
      default: return <span className="badge-info">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div>
        <h1 className="page-title">Resume Screening</h1>
        <p className="page-subtitle">Screen your resume against any job description with AI-powered analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Form — 3 columns */}
        <div className="lg:col-span-3">
          <div className="card sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}>
                <Shield size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="section-title">Screen Configuration</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resume Selector */}
              <div>
                <label className="form-label">Select Resume</label>
                {loadingResumes ? (
                  <div className="input flex items-center gap-2" style={{ color: 'var(--muted-foreground)' }}>
                    <Loader size={16} className="animate-spin" /> Loading...
                  </div>
                ) : resumes.length > 0 ? (
                  <select
                    className="input"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                  >
                    <option value="">Latest resume (auto)</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.title || r.originalName} {r.atsScore ? `(ATS: ${r.atsScore})` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'oklch(0.98 0.04 85)', border: '1px solid oklch(0.88 0.07 85)' }}>
                    <AlertTriangle size={18} className="mt-0.5 shrink-0" style={{ color: 'oklch(0.55 0.13 85)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'oklch(0.35 0.08 85)' }}>No resumes uploaded yet</p>
                      <p className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.10 85)' }}>Upload a resume first for auto-detection.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="form-label">Job Title <span style={{ color: 'var(--destructive)' }}>*</span></label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Full Stack Developer"
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  required
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="form-label">Job Description <span style={{ color: 'var(--destructive)' }}>*</span></label>
                <textarea
                  className="input min-h-[140px] resize-y"
                  placeholder="Paste the complete job description here..."
                  value={form.jobDescription}
                  onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                  required
                />
              </div>

              {/* Required Skills */}
              <div>
                <label className="form-label">Required Skills <span className="font-normal" style={{ color: 'var(--muted-foreground)' }}>(comma-separated)</span></label>
                <input
                  type="text"
                  className="input"
                  placeholder="React, Node.js, Python, AWS"
                  value={form.requiredSkills}
                  onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading || resumes.length === 0}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <><Loader size={18} className="animate-spin" /> Screening...</> : <><Shield size={18} /> Screen Resume</>}
              </button>
            </form>
          </div>
        </div>

        {/* Results Panel — 2 columns */}
        <div className="lg:col-span-2 space-y-5">
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--primary) 10%, var(--muted))' }}>
                  <Shield size={22} style={{ color: 'var(--primary)' }} className="opacity-70" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Ready to Screen</h3>
              <p className="text-sm max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
                Fill in the job details and click "Screen Resume" to get an AI-powered screening verdict.
              </p>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-14 h-14 border-4 rounded-full animate-spin mb-4"
                   style={{ borderColor: 'color-mix(in srgb, var(--primary) 20%, var(--border))', borderTopColor: 'var(--primary)' }} />
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>AI is Screening...</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Analyzing resume against job requirements</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Verdict Card */}
              {(() => {
                const v = getVerdictConfig(result.verdict);
                return (
                  <div className={`card border-2 ${v.border} relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${v.gradient} opacity-5 rounded-full -translate-y-8 translate-x-8`} />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center`}>
                          <v.icon size={22} className={v.color} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Screening Verdict</p>
                          <p className={`text-2xl font-black ${v.color}`}>{v.label}</p>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <ScoreCircle score={result.matchScore || 0} size={100} strokeWidth={8} />
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {result.summary}
                    </p>
                  </div>
                );
              })()}

              {/* Skills Analysis */}
              {result.skillsAnalysis && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> Skills Analysis
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-emerald-600 uppercase mb-2">Matched ({result.skillsAnalysis.matched?.length || 0})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.skillsAnalysis.matched || []).map((s, i) => (
                          <span key={i} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-lg font-medium">{s}</span>
                        ))}
                        {(!result.skillsAnalysis.matched || result.skillsAnalysis.matched.length === 0) && (
                          <span className="text-emerald-400 text-xs">None detected</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-red-600 uppercase mb-2">Missing ({result.skillsAnalysis.missing?.length || 0})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.skillsAnalysis.missing || []).map((s, i) => (
                          <span key={i} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-lg font-medium">{s}</span>
                        ))}
                        {(!result.skillsAnalysis.missing || result.skillsAnalysis.missing.length === 0) && (
                          <span className="text-red-400 text-xs">None</span>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Bonus ({result.skillsAnalysis.bonus?.length || 0})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.skillsAnalysis.bonus || []).map((s, i) => (
                          <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements Match */}
              {result.matchedRequirements?.length > 0 && (
                <div className="card">
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <Target size={18} style={{ color: 'var(--primary)' }} /> Requirements Match
                  </h3>
                  <div className="space-y-3">
                    {result.matchedRequirements.map((req, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{req.requirement}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{req.evidence}</p>
                        </div>
                        {getStatusBadge(req.status)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Red Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {result.strengths?.length > 0 && (
                  <div className="card">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp size={18} className="text-green-500" /> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.redFlags?.length > 0 && (
                  <div className="card">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-red-500" /> Red Flags
                    </h3>
                    <ul className="space-y-2">
                      {result.redFlags.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Experience Match */}
              {result.experienceMatch && (
                <div className="card">
                  <h3 className="section-title mb-3 flex items-center gap-2">
                    <Users size={18} style={{ color: 'var(--primary)' }} /> Experience Match
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="rounded-xl p-4" style={{ background: 'color-mix(in srgb, var(--primary) 6%, var(--muted))' }}>
                      <p className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{result.experienceMatch.requiredYears || '?'}</p>
                      <p className="text-xs text-gray-500 mt-1">Required Years</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-2xl font-black text-blue-600">{result.experienceMatch.estimatedYears || '?'}</p>
                      <p className="text-xs text-gray-500 mt-1">Your Experience</p>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-4">
                      <p className="text-2xl font-black text-indigo-600">{result.experienceMatch.relevanceScore || 0}%</p>
                      <p className="text-xs text-gray-500 mt-1">Relevance</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendation & Interview Focus */}
              {result.recommendation && (
                <div className="card border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles size={18} className="text-indigo-500" /> AI Recommendation
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.recommendation}</p>
                  {result.interviewFocus?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Interview Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {result.interviewFocus.map((area, i) => (
                          <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
                            <ArrowRight size={18} /> {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreeningPage;
