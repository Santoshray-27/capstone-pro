/**
 * Analysis Page — Premium Redesign
 * Fixes: Remove blue/purple gradient card, native select → styled select,
 * proper empty state, themed analysis history cards.
 */
import React, { useState, useEffect } from 'react';
import { analysisAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Brain, CheckCircle, XCircle, AlertTriangle, Lightbulb,
  ChevronDown, ChevronUp, Loader, BarChart3, Upload
} from 'lucide-react';
import ScoreCircle from '../components/common/ScoreCircle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const AnalysisPage = () => {

const getChartColors = () => ({
  primary: '#644A40',
  secondary: '#A18276',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  muted: '#A0A0A0',
});
const chartColors = getChartColors();

  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [analysesRes, resumesRes] = await Promise.all([
        analysisAPI.getAll(), resumeAPI.getAll()
      ]);
      if (analysesRes.data.success) {
        setAnalyses(analysesRes.data.analyses || []);
        if (analysesRes.data.analyses?.length > 0) setSelected(analysesRes.data.analyses[0]);
      }
      if (resumesRes.data.success) setResumes(resumesRes.data.resumes || []);
    } catch {
      toast.error('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!selectedResumeId) return toast.error('Please select a resume');
    setAnalyzing(true);
    try {
      const { data } = await analysisAPI.analyze(selectedResumeId, {});
      if (data.success) {
        toast.success('Analysis complete!');
        setAnalyses(prev => [data.analysis, ...prev]);
        setSelected(data.analysis);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const toggle = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  if (loading) return <LoadingSpinner text="Loading analyses..." />;

  const radarData = selected ? [
    { subject: 'Formatting', A: selected.scoreBreakdown?.formatting || 70 },
    { subject: 'Keywords', A: selected.scoreBreakdown?.keywords || 65 },
    { subject: 'Experience', A: selected.scoreBreakdown?.experience || 60 },
    { subject: 'Skills', A: selected.scoreBreakdown?.skills || 68 },
    { subject: 'Education', A: selected.scoreBreakdown?.education || 75 },
  ] : [];

  const scoreColor = (score) =>
    score >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
    : score >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200';

  return (
    <div className="space-y-6 stagger-children">
      {/* Header */}
      <div>
        <h1 className="page-title">Resume Analysis</h1>
        <p className="page-subtitle">AI-powered ATS scoring and personalized feedback</p>
      </div>

      {/* Analyze a Resume — clean card */}
      <div className="card">
        <h3 className="section-title mb-4">Select a Resume to Analyze</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="input flex-1"
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
          >
            <option value="">Choose a resume...</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>{r.title}</option>
            ))}
          </select>
          <button
            onClick={runAnalysis}
            disabled={analyzing || !selectedResumeId}
            className="btn-primary flex items-center gap-2 whitespace-nowrap px-6 justify-center"
          >
            {analyzing
              ? <><Loader size={16} className="animate-spin" /> Analyzing...</>
              : <><BarChart3 size={18} /> Analyze</>
            }
          </button>
        </div>
        {resumes.length === 0 && (
          <div className="flex items-center gap-2 mt-3 p-3 rounded-lg"
               style={{ background: 'oklch(0.98 0.04 85)', border: '1px solid oklch(0.88 0.07 85)' }}>
            <AlertTriangle size={18} style={{ color: 'oklch(0.55 0.13 85)' }} />
            <p className="text-sm" style={{ color: 'oklch(0.40 0.08 85)' }}>
              No resumes found.{' '}
              <Link to="/upload" className="font-medium underline-offset-2 hover:underline"
                    style={{ color: 'var(--primary)' }}>
                Upload one first →
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Empty State */}
      {analyses.length === 0 ? (
        <div className="card py-16 text-center">
          {/* Branded SVG illustration */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
                 style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
                 style={{ background: 'color-mix(in srgb, var(--primary) 10%, var(--muted))' }}>
              <BarChart3 size={22} style={{ color: 'var(--primary)' }} className="opacity-70" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No Analyses Yet</h3>
          <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Upload and analyze your resume to get detailed AI feedback including ATS compatibility scoring,
            keyword analysis, and actionable improvement suggestions.
          </p>
          {/* Tips */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Takes less than 30 seconds', 'Scored across 5 dimensions', 'Actionable suggestions'].map(tip => (
              <span key={tip} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)' }} />
                {tip}
              </span>
            ))}
          </div>
          <Link to="/upload" className="btn-primary inline-flex items-center gap-2 mt-8">
            <Upload size={18} /> Upload Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* History List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest px-1 mb-3"
                style={{ color: 'var(--muted-foreground)' }}>Analysis History</h3>
            {analyses.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelected(a)}
                className="w-full text-left p-3 rounded-xl border-2 transition-all"
                style={{
                  borderColor: selected?._id === a._id ? 'var(--primary)' : 'var(--border)',
                  background: selected?._id === a._id
                    ? 'color-mix(in srgb, var(--primary) 6%, var(--card))'
                    : 'var(--card)'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-lg font-black ${a.atsScore >= 75 ? 'text-emerald-600' : a.atsScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                    {a.atsScore}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                  {a.resume?.title || 'Resume'}
                </p>
              </button>
            ))}
          </div>

          {/* Analysis Detail */}
          {selected && (
            <div className="lg:col-span-3 space-y-4">
              {/* Score Summary */}
              <div className="card">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="section-title">ATS Analysis Report</h3>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <ScoreCircle score={selected.atsScore} size={120} />
                </div>

                {/* Score breakdown bars */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selected.scoreBreakdown || {}).filter(([k]) => k !== 'overall').map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="capitalize" style={{ color: 'var(--muted-foreground)' }}>{key}</span>
                        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{val}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${val}%`,
                            background: val >= 75 ? 'oklch(0.55 0.15 145)' : val >= 55 ? 'var(--primary)' : 'oklch(0.65 0.14 50)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h4 className="section-title mb-4">Quality Radar</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} animationDuration={1200} />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }}
                        formatter={v => [`${v}%`]}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <h4 className="section-title mb-4">Keyword Analysis</h4>
                  <div className="mb-4">
                    <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                      <CheckCircle size={18} style={{ color: 'oklch(0.45 0.14 145)' }} />
                      <span style={{ color: 'oklch(0.45 0.14 145)' }}>Found Keywords</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.keywordsFound || []).slice(0, 8).map((kw) => (
                        <span key={kw} className="badge badge-success">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                      <XCircle size={18} style={{ color: 'oklch(0.55 0.19 25)' }} />
                      <span style={{ color: 'oklch(0.55 0.19 25)' }}>Missing Keywords</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.keywordsMissing || []).slice(0, 6).map((kw) => (
                        <span key={kw} className="badge badge-error">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Sections */}
              {[
                { key: 'strengths', label: 'Strengths', items: selected.strengths, icon: CheckCircle, colorClass: 'text-emerald-700', bg: 'oklch(0.97 0.05 145)', border: 'oklch(0.88 0.08 145)' },
                { key: 'weaknesses', label: 'Weaknesses', items: selected.weaknesses, icon: AlertTriangle, colorClass: 'text-amber-700', bg: 'oklch(0.98 0.05 85)', border: 'oklch(0.88 0.08 85)' },
                { key: 'missingSkills', label: 'Missing Skills', items: selected.missingSkills, icon: XCircle, colorClass: 'text-red-700', bg: 'oklch(0.98 0.04 20)', border: 'oklch(0.92 0.06 20)' },
                { key: 'suggestions', label: 'Suggestions', items: selected.suggestions, icon: Lightbulb, colorClass: 'text-primary', bg: 'color-mix(in srgb, var(--primary) 4%, var(--card))', border: 'color-mix(in srgb, var(--primary) 15%, var(--border))' },
              ].map(({ key, label, items, icon: Icon, colorClass, bg, border }) => (
                <div key={key} className="card">
                  <button
                    className="flex items-center justify-between w-full transition-all duration-200 active:scale-[0.97] hover:-translate-y-px"
                    onClick={() => toggle(key)}
                    aria-expanded={expanded[key]}
                  >
                    <h4 className="section-title flex items-center gap-2">
                      <Icon size={18} className={colorClass} />
                      {label}
                      <span className="text-xs font-normal" style={{ color: 'var(--muted-foreground)' }}>
                        ({items?.length || 0})
                      </span>
                    </h4>
                    {expanded[key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {(expanded[key] || true) && (
                    <ul className="mt-3 space-y-2">
                      {(items || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm p-2.5 rounded-lg"
                            style={{ background: bg, border: `1px solid ${border}` }}>
                          <Icon size={18} className={`${colorClass} mt-0.5 shrink-0`} />
                          <span style={{ color: 'var(--foreground)' }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
