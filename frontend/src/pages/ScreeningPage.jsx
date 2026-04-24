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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Shield size={22} />
            </div>
            <h2 className="text-2xl font-black">AI Resume Screening</h2>
          </div>
          <p className="text-indigo-100 text-sm max-w-xl">
            Screen your resume against any job description. Get an instant verdict with detailed match analysis, skill alignment, and hiring recommendations powered by AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" />
              Screen Configuration
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resume Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Resume</label>
                {loadingResumes ? (
                  <div className="input flex items-center gap-2 text-gray-400"><Loader size={16} className="animate-spin" /> Loading...</div>
                ) : resumes.length > 0 ? (
                  <div className="relative">
                    <select
                      className="input appearance-none pr-10"
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
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
                    No resumes found. Upload one first from the Upload page.
                  </p>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Title *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Job Description *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Skills (comma-separated)</label>
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

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-5">
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-4">
                <Shield size={36} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-1">Ready to Screen</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                Fill in the job details and click "Screen Resume" to get an AI-powered screening analysis with a detailed verdict.
              </p>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-bold text-gray-700 mb-1">AI is Screening...</h3>
              <p className="text-gray-400 text-sm">Analyzing resume against job requirements</p>
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
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center`}>
                          <v.icon size={28} className={v.color} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Screening Verdict</p>
                          <p className={`text-2xl font-black ${v.color}`}>{v.label}</p>
                        </div>
                      </div>
                      <ScoreCircle score={result.matchScore || 0} size={100} strokeWidth={8} />
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
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target size={18} className="text-indigo-500" /> Requirements Match
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
                          <CheckCircle2 size={15} className="text-green-500 mt-0.5 flex-shrink-0" /> {s}
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
                          <XCircle size={15} className="text-red-400 mt-0.5 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Experience Match */}
              {result.experienceMatch && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={18} className="text-purple-500" /> Experience Match
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-purple-50 rounded-xl p-4">
                      <p className="text-2xl font-black text-purple-600">{result.experienceMatch.requiredYears || '?'}</p>
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
                <div className="card border-l-4 border-indigo-500">
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
                            <ArrowRight size={12} /> {area}
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
