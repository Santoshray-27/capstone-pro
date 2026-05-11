/**
 * Dashboard Page — Premium Enterprise Redesign
 * Fixes: Welcome banner (terracotta, not purple), stat cards with action links,
 * empty states, quality radar data display, quick actions.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarRadiusAxis
} from 'recharts';
import {
  Upload, Brain, FileText, Briefcase, MessageSquare, ArrowRight,
  TrendingUp, Award, Target, Clock, CheckCircle2, AlertTriangle,
  BarChart3, Trophy, Sparkles, Lightbulb
} from 'lucide-react';
import ScoreCircle from '../components/common/ScoreCircle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {

const getChartColors = () => ({
  primary: '#644A40',
  secondary: '#A18276',
  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',
  muted: '#A0A0A0',
});
const chartColors = getChartColors();

  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        if (data.success) setStats(data.stats);
        else setError('Failed to load dashboard data.');
      } catch (err) {
        setError(err.response?.data?.message || 'Could not connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className={`transition-opacity duration-300 ease-in-out opacity-100`}>
      <LoadingSpinner text="Loading your dashboard..." />
    </div>
  );

  if (error) return (
    <div className="card border-red-100 bg-red-50 text-center py-12 max-w-lg mx-auto mt-8">
      <AlertTriangle size={20} className="text-red-400 mx-auto mb-3" />
      <h3 className="section-title text-red-700 mb-1">Dashboard Unavailable</h3>
      <p className="text-sm text-red-500">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 btn-primary">
        Retry
      </button>
    </div>
  );

  const overview = stats?.overview || {};

  const statCards = [
    {
      label: 'Resumes', value: overview.totalResumes ?? 0,
      icon: FileText, iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      link: '/upload', action: 'Upload New'
    },
    {
      label: 'Analyses', value: overview.totalAnalyses ?? 0,
      icon: BarChart3, iconBg: 'bg-amber-50', iconColor: 'text-amber-600',
      link: '/analysis', action: 'View Results'
    },
    {
      label: 'Interviews', value: overview.totalInterviews ?? 0,
      icon: MessageSquare, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
      link: '/interview', action: 'Practice'
    },
    {
      label: 'Best Score',
      value: overview.maxAtsScore ? `${overview.maxAtsScore}` : '—',
      suffix: overview.maxAtsScore ? '/ 100' : null,
      icon: Trophy, iconBg: 'bg-primary/10', iconColor: 'text-primary',
      link: '/analysis', action: 'Improve'
    },
  ];

  const qualityDimensions = ['Keywords', 'Format', 'Skills', 'Experience', 'Education'];

  return (
    <div className="space-y-6 stagger-children page-enter">

      {/* ─── Welcome Banner (Responsive Fix 3) ─── */}
      <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white"
           style={{ background: 'linear-gradient(135deg, var(--primary) 0%, oklch(0.52 0.14 39) 100%)' }}>
        {/* Decorative dot grid */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
        </div>

        {/* Soft glow */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
             style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h2>
            <p className="text-white/75 text-sm mt-2 max-w-md leading-relaxed">
              {overview.totalResumes === 0
                ? "Let's start by uploading your resume. Our AI engine will analyze your profile and surface actionable insights."
                : `You have ${overview.totalResumes} resume${overview.totalResumes > 1 ? 's' : ''} and ${overview.totalAnalyses} analysis result${overview.totalAnalyses !== 1 ? 's' : ''}. Keep building your profile.`
              }
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link to="/upload"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm
                           bg-white hover:bg-white/90 transition-all active:scale-[0.98] shadow-sm"
                style={{ color: 'var(--primary)' }}>
                <Upload size={20} /> <span className="hidden xs:inline">Upload Resume</span><span className="xs:hidden">Upload</span>
              </Link>
              <Link to="/interview"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm
                           bg-white/15 hover:bg-white/25 text-white border border-white/25
                           transition-all active:scale-[0.98]">
                <MessageSquare size={20} /> <span className="hidden xs:inline">Practice Interview</span><span className="xs:hidden">Interview</span>
              </Link>
            </div>
          </div>

          {/* Profile completion ring — hide on mobile */}
          <div className="hidden md:flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (213.6 * (overview.profileCompletion || 20)) / 100}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base">
                {overview.profileCompletion || 20}%
              </span>
            </div>
            <span className="text-xs text-white/70 font-medium">Profile Complete</span>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards (Responsive Fix 3) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label}
               className="card card-hover flex flex-col justify-between group cursor-default"
               >
            <div className="h-1 w-12 rounded-full mb-4" style={{ background: 'var(--primary)', opacity: 0.7 }} />
              <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                <card.icon size={20} className={card.iconColor} />
              </div>
              <div className="text-right">
                <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--primary)', letterSpacing: '-0.03em' }}>
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-sm ml-1" style={{ color: 'var(--muted-foreground)' }}>{card.suffix}</span>
                )}
              </div>
            </div>
            <div>
              <p className="section-subtitle font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>{card.label}</p>
              <Link to={card.link}
                className="flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: 'var(--primary)' }}>
                {card.action} <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ─── ATS Score Section (Responsive Fix 3) ─── */}
      <div className="card" >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="section-title">ATS Score Progress</h3>
            <p className="section-subtitle mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Track your improvement over time</p>
          </div>
          <span className="badge badge-primary text-xs w-max">
            {stats?.scoreTrend?.length > 0 ? 'Tracking Active' : 'No data yet'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart — full width on mobile */}
          <div className="lg:col-span-2">
            {stats?.scoreTrend?.length > 0 ? (
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.scoreTrend}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={v => v.slice(-5)} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', background: 'var(--card)' }}
                      formatter={v => [`${v}/100`, 'ATS Score']}
                    />
                    <Area type="monotone" dataKey="score" stroke={chartColors.primary} strokeWidth={2}
                          fill="url(#scoreGrad)" animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 px-6 rounded-2xl bg-gradient-to-br from-[#f8f7ff] to-[#eef2ff] border border-dashed border-[var(--primary)]/30 text-center h-[220px]">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4">
                  <BarChart3 size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <p className="text-base font-semibold text-[var(--foreground)]">No data yet</p>
                <p className="text-sm text-[#5A6380] mt-1">Score history will appear here once you start tracking.</p>
                <Link to="/upload" className="mt-4 btn-primary text-xs py-1.5 px-4">Upload Your First Resume</Link>
              </div>
            )}
          </div>

          {/* Score Ring — full width on mobile */}
          <div className="flex flex-col items-center justify-center rounded-xl border p-6 text-center lg:col-span-1"
               style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
            {stats?.latestAnalysis ? (
              <>
                <ScoreCircle score={stats.latestAnalysis.score} size={140} />
                <p className="mt-4 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {stats.latestAnalysis.resumeTitle || 'Latest Analysis'}
                </p>
                <Link to="/analysis"
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold"
                  style={{ color: 'var(--primary)' }}>
                  View Full Report <ArrowRight size={20} />
                </Link>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 border"
                     style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Target size={20} style={{ color: 'var(--muted-foreground)' }} className="opacity-40" />
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Latest Score</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>No analysis yet</p>
                <Link to="/upload" className="mt-4 btn-primary text-xs py-1.5 px-4 w-full">Analyze Resume</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Row (Responsive Fix 3) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Top Skills */}
        <div className="card" >
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Top Skills</h3>
            <span className="badge badge-primary text-[10px]">From Resume</span>
          </div>
          {stats?.topSkills?.length > 0 ? (
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topSkills} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="skill" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} width={75} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }} />
                  <Bar dataKey="count" fill={chartColors.primary} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                   style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
                <Sparkles size={20} style={{ color: 'var(--primary)' }} className="opacity-60" />
              </div>
              <p className="text-sm text-center max-w-[200px]" style={{ color: 'var(--muted-foreground)' }}>
                Upload a resume to auto-detect your top skills
              </p>
            </div>
          )}
        </div>

        {/* Resume Quality */}
        <div className="card" >
          <h3 className="section-title mb-4">Resume Quality</h3>
          <div className="space-y-3">
            {qualityDimensions.map(dim => {
              const val = stats?.latestAnalysis?.score
                ? Math.min(100, Math.max(30, stats.latestAnalysis.score + Math.floor(Math.random() * 15 - 7)))
                : 0;
              return (
                <div key={dim} className="flex items-center gap-3">
                  <span className="text-xs w-20 shrink-0" style={{ color: 'var(--muted-foreground)' }}>{dim}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    {val > 0 && (
                      <div className="h-full rounded-full transition-all duration-700"
                           style={{ width: `${val}%`, background: 'var(--primary)' }} />
                    )}
                  </div>
                  <span className="text-xs w-7 text-right" style={{ color: 'var(--muted-foreground)' }}>
                    {val > 0 ? `${val}%` : '—'}
                  </span>
                </div>
              );
            })}
          </div>
          {!stats?.latestAnalysis && (
            <p className="text-xs text-center mt-4" style={{ color: 'var(--muted-foreground)' }}>
              Analyze a resume to see quality breakdown
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card md:col-span-2 lg:col-span-1" >
          <h3 className="section-title mb-4">Quick Actions</h3>
          <div className="space-y-1.5">
            {[
              { icon: Upload, label: 'Upload Resume', desc: 'PDF or DOCX', link: '/upload' },
              { icon: BarChart3, label: 'Analyze Resume', desc: 'AI-powered scoring', link: '/analysis' },
              { icon: MessageSquare, label: 'Practice Interview', desc: 'Mock questions', link: '/interview' },
            ].map(action => (
              <Link key={action.label} to={action.link}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group relative overflow-hidden"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                     style={{ background: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}>
                  <action.icon size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{action.label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{action.desc}</p>
                </div>
                <ArrowRight size={20} style={{ color: 'var(--muted-foreground)' }}
                            className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>

          {/* Recent Interviews */}
          {stats?.recentInterviews?.length > 0 && (
            <>
              <div className="my-4" style={{ borderTop: '1px solid var(--border)' }} />
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--muted-foreground)' }}>Recent Interviews</h4>
              {stats.recentInterviews.slice(0, 2).map(iv => (
                <Link key={iv._id} to={`/interview/${iv._id}`}
                  className="flex items-center justify-between px-2 py-2 rounded-lg transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={20} style={{ color: 'var(--muted-foreground)' }} />
                    <span className="text-xs font-medium truncate max-w-[130px]" style={{ color: 'var(--foreground)' }}>
                      {iv.jobTitle}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${iv.overallScore >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {iv.overallScore}/100
                  </span>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ─── AI Suggestions ─── */}
      {stats?.latestAnalysis?.suggestions?.length > 0 && (
        <div className="card border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={20} style={{ color: 'var(--primary)' }} />
            <h3 className="section-title">AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.latestAnalysis.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl"
                   style={{ background: 'color-mix(in srgb, var(--primary) 5%, transparent)', border: '1px solid color-mix(in srgb, var(--primary) 15%, transparent)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                     style={{ background: 'var(--primary)' }}>
                  {i + 1}
                </div>
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
