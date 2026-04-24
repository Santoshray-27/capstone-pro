/**
 * Dashboard Page - Analytics overview with Recharts
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
  TrendingUp, Award, Target, Clock, CheckCircle2, AlertTriangle
} from 'lucide-react';
import ScoreCircle from '../components/common/ScoreCircle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const DashboardPage = () => {
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
        setError(err.response?.data?.message || 'Could not connect to server. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;

  if (error) return (
    <div className="card border-red-100 bg-red-50 text-center py-12">
      <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
      <h3 className="font-bold text-red-700 mb-1">Dashboard Unavailable</h3>
      <p className="text-red-500 text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 btn-primary bg-red-600 hover:bg-red-700">
        Retry
      </button>
    </div>
  );

  const overview = stats?.overview || {};

  const statCards = [
    { label: 'Resumes', value: overview.totalResumes || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: '/upload' },
    { label: 'Analyses', value: overview.totalAnalyses || 0, icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50', link: '/analysis' },
    { label: 'Interviews', value: overview.totalInterviews || 0, icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50', link: '/interview' },
    { label: 'Best Score', value: `${overview.maxAtsScore || 0}/100`, icon: Award, color: 'text-orange-600', bg: 'bg-orange-50', link: '/analysis' },
  ];

  const radarData = [
    { subject: 'Keywords', A: stats?.latestAnalysis?.score || 70 },
    { subject: 'Format', A: Math.min((stats?.latestAnalysis?.score || 70) + 5, 100) },
    { subject: 'Skills', A: Math.max((stats?.latestAnalysis?.score || 70) - 8, 0) },
    { subject: 'Experience', A: Math.min((stats?.latestAnalysis?.score || 70) + 2, 100) },
    { subject: 'Education', A: Math.min((stats?.latestAnalysis?.score || 70) + 10, 100) },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-blue-100 text-sm">
              {overview.totalResumes === 0
                ? "Let's start by uploading your resume for AI analysis"
                : `You have ${overview.totalResumes} resume${overview.totalResumes > 1 ? 's' : ''} and ${overview.totalAnalyses} analysis result${overview.totalAnalyses !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-sm font-semibold">
              Profile {overview.profileCompletion || 0}% Complete
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link to="/upload" className="bg-white text-blue-700 font-semibold py-2 px-5 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Upload size={16} /> Upload Resume
          </Link>
          <Link to="/interview" className="bg-white/20 text-white font-semibold py-2 px-5 rounded-xl text-sm hover:bg-white/30 transition-colors flex items-center gap-2">
            <MessageSquare size={16} /> Practice Interview
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} to={card.link} className="card hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <card.icon size={20} className={card.color} />
            </div>
            <div className="text-2xl font-black text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500 font-medium">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Trend */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">ATS Score Progress</h3>
              <p className="text-gray-500 text-xs">Your score improvement over time</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
              <TrendingUp size={14} /> Improving
            </div>
          </div>
          {stats?.scoreTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={stats.scoreTrend}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(-5)} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
                  formatter={(v) => [`${v}/100`, 'ATS Score']}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
              <Brain size={32} className="mb-2 opacity-40" />
              <p className="text-sm">Upload and analyze a resume to see your progress</p>
              <Link to="/upload" className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                Upload Now →
              </Link>
            </div>
          )}
        </div>

        {/* Latest ATS Score */}
        <div className="card flex flex-col items-center justify-center text-center">
          <h3 className="font-bold text-gray-900 mb-4">Latest ATS Score</h3>
          {stats?.latestAnalysis ? (
            <>
              <ScoreCircle score={stats.latestAnalysis.score} size={140} />
              <p className="mt-3 text-sm text-gray-500">
                {stats.latestAnalysis.resumeTitle || 'Last Analysis'}
              </p>
              <Link to="/analysis" className="mt-4 text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
                View Full Report <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                <Target size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm mb-3">No analysis yet</p>
              <Link to="/upload" className="btn-primary text-sm py-2 px-4">Analyze Resume</Link>
            </div>
          )}
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Distribution */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Top Skills</h3>
          {stats?.topSkills?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.topSkills} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 12 }} width={70} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              Upload a resume to see your skills
            </div>
          )}
        </div>

        {/* Resume Quality Radar */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Resume Quality</h3>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={(v) => [`${v}%`]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions + Recent */}
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2 mb-4">
            {stats?.quickActions?.map((action) => (
              <Link key={action.label} to={action.link}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className={action.done ? 'text-green-500' : 'text-gray-300'} />
                  <span className={`text-sm font-medium ${action.done ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                    {action.label}
                  </span>
                </div>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>
            ))}
          </div>

          {stats?.recentInterviews?.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-gray-500 mb-2 mt-4">Recent Interviews</h4>
              {stats.recentInterviews.slice(0, 2).map((iv) => (
                <Link key={iv._id} to={`/interview/${iv._id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">{iv.jobTitle}</span>
                  </div>
                  <span className={`text-xs font-bold ${iv.overallScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {iv.overallScore}/100
                  </span>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>

      {/* AI Suggestions if available */}
      {stats?.latestAnalysis?.suggestions?.length > 0 && (
        <div className="card border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stats.latestAnalysis.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2 bg-blue-50 p-3 rounded-xl">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
