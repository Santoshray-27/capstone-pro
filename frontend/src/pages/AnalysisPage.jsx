/**
 * Analysis Page - View AI resume analysis results
 */
import React, { useState, useEffect } from 'react';
import { analysisAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, CheckCircle, XCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, RefreshCw, Loader } from 'lucide-react';
import ScoreCircle from '../components/common/ScoreCircle';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const AnalysisPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analysesRes, resumesRes] = await Promise.all([
        analysisAPI.getAll(),
        resumeAPI.getAll()
      ]);
      if (analysesRes.data.success) {
        setAnalyses(analysesRes.data.analyses || []);
        if (analysesRes.data.analyses?.length > 0) {
          setSelected(analysesRes.data.analyses[0]);
        }
      }
      if (resumesRes.data.success) {
        setResumes(resumesRes.data.resumes || []);
      }
    } catch (err) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Resume Analysis</h2>
          <p className="text-gray-500 text-sm mt-1">AI-powered ATS scoring and feedback</p>
        </div>
      </div>

      {/* Run New Analysis */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
        <h3 className="font-bold text-gray-900 mb-3">Analyze a Resume</h3>
        <div className="flex gap-3">
          <select
            className="input flex-1"
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
          >
            <option value="">-- Select a resume --</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>{r.title}</option>
            ))}
          </select>
          <button
            onClick={runAnalysis}
            disabled={analyzing || !selectedResumeId}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            {analyzing ? <><Loader size={16} className="animate-spin" /> Analyzing...</> : <><Brain size={16} /> Analyze</>}
          </button>
        </div>
        {resumes.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">
            No resumes found. <Link to="/upload" className="text-blue-600 font-medium hover:underline">Upload one first →</Link>
          </p>
        )}
      </div>

      {analyses.length === 0 ? (
        <div className="card text-center py-16">
          <Brain size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Analyses Yet</h3>
          <p className="text-gray-400 mb-4">Upload and analyze your resume to see AI feedback</p>
          <Link to="/upload" className="btn-primary inline-flex">Upload Resume</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Analyses List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-semibold text-gray-700 text-sm mb-3">Analysis History</h3>
            {analyses.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelected(a)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                  selected?._id === a._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-lg font-black ${a.atsScore >= 75 ? 'text-green-600' : a.atsScore >= 50 ? 'text-blue-600' : 'text-red-500'}`}>
                    {a.atsScore}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{a.resume?.title || 'Resume'}</p>
              </button>
            ))}
          </div>

          {/* Analysis Detail */}
          {selected && (
            <div className="lg:col-span-3 space-y-4">
              {/* Score Summary */}
              <div className="card">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">ATS Analysis Report</h3>
                    <p className="text-gray-500 text-sm">{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                  <ScoreCircle score={selected.atsScore} size={120} />
                </div>

                {/* Score breakdown bars */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selected.scoreBreakdown || {}).filter(([k]) => k !== 'overall').map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 capitalize">{key}</span>
                        <span className="font-semibold">{val}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${val >= 75 ? 'bg-green-500' : val >= 55 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar & Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h4 className="font-bold text-gray-900 mb-3">Quality Radar</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                      <Tooltip formatter={(v) => [`${v}%`]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Keywords */}
                <div className="card">
                  <h4 className="font-bold text-gray-900 mb-3">Keyword Analysis</h4>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-green-600 mb-2">✅ Found Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.keywordsFound || []).slice(0, 8).map((kw) => (
                        <span key={kw} className="badge-success">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-500 mb-2">❌ Missing Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selected.keywordsMissing || []).slice(0, 6).map((kw) => (
                        <span key={kw} className="badge-error">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths, Weaknesses, Suggestions */}
              {[
                { key: 'strengths', label: '✅ Strengths', items: selected.strengths, color: 'green', icon: CheckCircle },
                { key: 'weaknesses', label: '⚠️ Weaknesses', items: selected.weaknesses, color: 'yellow', icon: AlertTriangle },
                { key: 'missingSkills', label: '🎯 Missing Skills', items: selected.missingSkills, color: 'red', icon: XCircle },
                { key: 'suggestions', label: '💡 Suggestions', items: selected.suggestions, color: 'blue', icon: Lightbulb }
              ].map(({ key, label, items, color, icon: Icon }) => (
                <div key={key} className="card">
                  <button
                    className="flex items-center justify-between w-full"
                    onClick={() => toggle(key)}
                  >
                    <h4 className="font-bold text-gray-900">{label} <span className="text-gray-400 font-normal text-sm">({items?.length || 0})</span></h4>
                    {expanded[key] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {(expanded[key] || true) && (
                    <ul className="mt-3 space-y-2">
                      {(items || []).map((item, i) => (
                        <li key={i} className={`flex items-start gap-2 text-sm p-2 rounded-lg bg-${color}-50`}>
                          <Icon size={14} className={`text-${color}-600 mt-0.5 flex-shrink-0`} />
                          <span className="text-gray-700">{item}</span>
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
