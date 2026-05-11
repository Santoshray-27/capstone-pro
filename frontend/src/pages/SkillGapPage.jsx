/**
 * SkillGapPage - Skill Gap Analyzer
 * Analyze skill gaps between current profile and target role
 */
import React, { useState, useEffect } from 'react';
import { screeningAPI } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import {
  Crosshair, Loader, BookOpen, TrendingUp, AlertCircle, Award,
  ChevronDown, Sparkles, Clock, DollarSign, Building2, GraduationCap,
  ArrowRight, CheckCircle2, XCircle, Minus, Target, Zap, Rocket
} from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreCircle from '../components/common/ScoreCircle';

const SkillGapPage = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [form, setForm] = useState({
    targetRole: '',
    experienceLevel: 'mid',
    currentSkills: ''
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
      // proceed without resumes
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.targetRole.trim()) {
      return toast.error('Please provide a target role');
    }
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        resumeId: selectedResume || undefined,
        targetRole: form.targetRole,
        experienceLevel: form.experienceLevel,
        currentSkills: form.currentSkills
          ? form.currentSkills.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };
      const { data } = await screeningAPI.analyzeSkillGap(payload);
      if (data.success) {
        setResult(data.skillGap);
        toast.success('Analysis complete!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getReadinessConfig = (level) => {
    switch (level) {
      case 'ready': return { label: 'Ready', color: '#22c55e', bg: 'bg-emerald-50', text: 'text-emerald-600' };
      case 'almost_ready': return { label: 'Almost Ready', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600' };
      case 'developing': return { label: 'Developing', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600' };
      case 'significant_gaps': return { label: 'Significant Gaps', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600' };
      default: return { label: 'Unknown', color: '#6b7280', bg: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical': return <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Critical</span>;
      case 'important': return <span className="bg-amber-100 text-amber-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Important</span>;
      case 'nice_to_have': return <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Nice to Have</span>;
      default: return null;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'strong': return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'adequate': return <Minus size={18} className="text-amber-500" />;
      case 'weak': return <AlertCircle size={18} className="text-orange-500" />;
      case 'missing': return <XCircle size={18} className="text-red-500" />;
      default: return <Minus size={18} className="text-gray-400" />;
    }
  };

  const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'];

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div>
        <h1 className="page-title">Skill Gap Analyzer</h1>
        <p className="page-subtitle">Discover exactly which skills you need to land your target role</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Form — 3 columns */}
        <div className="lg:col-span-3">
          <div className="card sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}>
                <Crosshair size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="section-title">Analysis Setup</h3>
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
                      <option key={r._id} value={r._id}>{r.title || r.originalName}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'oklch(0.98 0.04 85)', border: '1px solid oklch(0.88 0.07 85)' }}>
                    <AlertCircle size={18} className="mt-0.5 shrink-0" style={{ color: 'oklch(0.55 0.13 85)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'oklch(0.35 0.08 85)' }}>No resumes uploaded yet</p>
                      <p className="text-xs mt-0.5" style={{ color: 'oklch(0.50 0.10 85)' }}>Skills will be entered manually instead.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Target Role */}
              <div>
                <label className="form-label">Target Role <span style={{ color: 'var(--destructive)' }}>*</span></label>
                <input type="text" className="input" placeholder="e.g., Senior Full Stack Developer"
                  value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} required />
              </div>

              {/* Experience Level */}
              <div>
                <label className="form-label">Experience Level</label>
                <select className="input" value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
                  <option value="entry">Entry Level (0-2 yrs)</option>
                  <option value="mid">Mid Level (2-5 yrs)</option>
                  <option value="senior">Senior Level (5+ yrs)</option>
                  <option value="lead">Lead / Principal (8+ yrs)</option>
                </select>
              </div>

              {/* Current Skills */}
              <div>
                <label className="form-label">Current Skills <span className="font-normal" style={{ color: 'var(--muted-foreground)' }}>(comma-separated)</span></label>
                <textarea className="input min-h-[80px] resize-y" placeholder="React, Node.js, Python, SQL..."
                  value={form.currentSkills} onChange={(e) => setForm({ ...form, currentSkills: e.target.value })} />
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Leave blank to auto-detect from resume</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? <><Loader size={18} className="animate-spin" /> Analyzing...</> : <><Crosshair size={18} /> Analyze Skill Gap</>}
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
                  <Crosshair size={22} style={{ color: 'var(--primary)' }} className="opacity-70" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Ready to Analyze</h3>
              <p className="text-sm max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
                Enter your target role and skills to get a detailed analysis with a personalized learning path.
              </p>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-14 h-14 border-4 rounded-full animate-spin mb-4"
                   style={{ borderColor: 'color-mix(in srgb, var(--primary) 20%, var(--border))', borderTopColor: 'var(--primary)' }} />
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Analyzing Skills...</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Building your personalized skill gap report</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Readiness Overview */}
              {(() => {
                const r = getReadinessConfig(result.readinessLevel);
                return (
                  <div className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <ScoreCircle score={result.overallReadiness || 0} size={110} strokeWidth={8} />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Role Readiness</p>
                          <p className={`text-xl font-black ${r.text}`}>{r.label}</p>
                          {result.timeToReady && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <Clock size={18} /> Est. {result.timeToReady} to fully ready
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-row gap-3">
                        {result.criticalGaps?.length > 0 && (
                          <div className="bg-red-50 rounded-xl p-3 text-center flex-1 sm:flex-none">
                            <p className="text-xl font-black text-red-600">{result.criticalGaps.length}</p>
                            <p className="text-[10px] text-red-500 uppercase font-semibold">Critical Gaps</p>
                          </div>
                        )}
                        {result.strengthsToLeverage && (
                          <div className="bg-emerald-50 rounded-xl p-3 text-center flex-1 sm:flex-none">
                            <p className="text-xl font-black text-emerald-600">{result.strengthsToLeverage.length}</p>
                            <p className="text-[10px] text-emerald-500 uppercase font-semibold">Strengths</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">{result.summary}</p>
                  </div>
                );
              })()}

              {/* Skill Categories with Charts */}
              {result.skillCategories?.length > 0 && (
                <div className="space-y-4">
                  {result.skillCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <Zap size={18} className="text-violet-500" /> {cat.category}
                        </h3>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Gap:</span>
                          <span className={`font-bold ${cat.gap > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {cat.gap > 0 ? `−${cat.gap}` : `+${Math.abs(cat.gap)}`}
                          </span>
                        </div>
                      </div>
                      {/* Progress Bars for each skill */}
                      <div className="space-y-3">
                        {cat.skills?.map((skill, sIdx) => (
                          <div key={sIdx} className="group">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(skill.status)}
                                <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                                {getPriorityBadge(skill.priority)}
                              </div>
                              <span className="text-xs text-gray-400">{skill.current}/{skill.required}</span>
                            </div>
                            <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              {/* Required level marker */}
                              <div
                                className="absolute top-0 h-full w-0.5 bg-gray-400 z-10"
                                style={{ left: `${skill.required}%` }}
                                title={`Required: ${skill.required}`}
                              />
                              {/* Current level bar */}
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${skill.current}%`,
                                  background: skill.current >= skill.required
                                    ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                    : skill.current >= skill.required * 0.7
                                      ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                                      : 'linear-gradient(90deg, #ef4444, #dc2626)'
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Strengths & Critical Gaps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {result.strengthsToLeverage?.length > 0 && (
                  <div className="card">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp size={18} className="text-emerald-500" /> Strengths to Leverage
                    </h3>
                    <ul className="space-y-2">
                      {result.strengthsToLeverage.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.criticalGaps?.length > 0 && (
                  <div className="card">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} className="text-red-500" /> Critical Gaps
                    </h3>
                    <ul className="space-y-2">
                      {result.criticalGaps.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Learning Path */}
              {result.learningPath?.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Rocket size={18} className="text-fuchsia-500" /> Personalized Learning Path
                  </h3>
                  <div className="space-y-3">
                    {result.learningPath.map((step, i) => (
                      <div className="flex items-start gap-4 p-4 rounded-xl group transition-colors"
                         style={{ background: 'var(--muted)' }}
                         onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in srgb, var(--primary) 5%, var(--muted))'}
                         onMouseLeave={e => e.currentTarget.style.background = 'var(--muted)'}>
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                           style={{ background: 'var(--primary)' }}>
                        {step.step}
                      </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{step.skill}</p>
                            {getPriorityBadge(step.priority)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <BookOpen size={18} /> {step.resource}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={18} /> {step.timeEstimate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Market Insights */}
              {result.marketInsights && (
                <div className="card" style={{ background: 'color-mix(in srgb, var(--primary) 3%, var(--card))', borderColor: 'color-mix(in srgb, var(--primary) 15%, var(--border))' }}>
                  <h3 className="section-title mb-4 flex items-center gap-2">
                    <Target size={18} style={{ color: 'var(--primary)' }} /> Market Insights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/80 rounded-xl p-3 text-center shadow-sm">
                      <TrendingUp size={20} className="text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Demand</p>
                      <p className="text-sm font-bold text-gray-800 capitalize">{result.marketInsights.demandLevel}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 text-center shadow-sm">
                      <DollarSign size={20} className="text-emerald-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Salary Range</p>
                      <p className="text-sm font-bold text-gray-800">{result.marketInsights.salaryRange}</p>
                    </div>
                    <div className="bg-white/80 rounded-xl p-3 text-center shadow-sm sm:col-span-2 md:col-span-2">
                      <Building2 size={20} className="text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Top Employers</p>
                      <p className="text-sm font-bold text-gray-800">{result.marketInsights.topEmployers?.join(', ')}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-600 leading-relaxed">{result.marketInsights.growthOutlook}</p>
                </div>
              )}

              {/* Certifications */}
              {result.certifications?.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap size={18} className="text-amber-500" /> Recommended Certifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.certifications.map((cert, i) => (
                      <div key={i} className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Award size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                            cert.importance === 'critical' ? 'bg-red-100 text-red-600' :
                            cert.importance === 'recommended' ? 'bg-amber-100 text-amber-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>{cert.importance}</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mt-2">{cert.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cert.provider}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillGapPage;
