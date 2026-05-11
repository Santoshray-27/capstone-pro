/**
 * Upload Page — Premium Enterprise Redesign
 * Branded drag & drop zone with decorative corners, improved tips card,
 * proper contrast on CTA, primary-colored toggle.
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, analysisAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Upload, FileText, X, CheckCircle, Loader, Brain, RefreshCw,
  Lightbulb, Star, Check
} from 'lucide-react';

const UploadPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | analyzing | done
  const [result, setResult] = useState(null);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  const handleFile = (selected) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selected.type) && !selected.name.match(/\.(pdf|docx?)$/i)) {
      return toast.error('Please upload a PDF or DOCX file');
    }
    if (selected.size > 10 * 1024 * 1024) return toast.error('File size must be under 10MB');
    setFile(selected);
    if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file) return toast.error('Please select a file');
    setUploadState('uploading');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('title', title || 'My Resume');
      const { data: uploadData } = await resumeAPI.upload(formData);
      if (!uploadData.success) throw new Error(uploadData.message);
      toast.success('Resume uploaded successfully!');

      if (autoAnalyze) {
        setUploadState('analyzing');
        try {
          const { data: analysisData } = await analysisAPI.analyze(uploadData.resume._id, {});
          if (analysisData.success) {
            toast.success('AI analysis complete!');
            setResult({ resume: uploadData.resume, analysis: analysisData.analysis });
            setUploadState('done');
            return;
          }
        } catch {
          toast('Analysis skipped. You can analyze manually.', { icon: '⚠️' });
        }
      }
      setResult({ resume: uploadData.resume });
      setUploadState('done');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Try again.');
      setUploadState('idle');
    }
  };

  const reset = () => { setFile(null); setTitle(''); setUploadState('idle'); setResult(null); };

  const tips = [
    'Use standard section headings (Experience, Education, Skills)',
    'Include exact keywords from the target job description',
    'Quantify achievements with numbers and percentages',
    'Use a clean, single-column format for better ATS parsing',
    'Include your email, phone, and professional links'
  ];

  if (uploadState === 'done' && result) {
    return (
      <div className="max-w-xl mx-auto mt-8">
        <div className="card text-center p-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border"
               style={{ background: 'oklch(0.97 0.05 145)', borderColor: 'oklch(0.85 0.08 145)' }}>
            <CheckCircle size={22} style={{ color: 'oklch(0.45 0.14 145)' }} />
          </div>
          <h2 className="page-title text-center mb-3">
            {result.analysis ? 'Analysis Complete' : 'Upload Successful'}
          </h2>
          {result.analysis && (
            <div className="my-6 rounded-2xl p-6"
                 style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
              <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--muted-foreground)' }}>
                ATS Match Score
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.04em' }}>
                  {result.analysis.atsScore}
                </span>
                <span style={{ color: 'var(--muted-foreground)' }}>/100</span>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <button onClick={() => navigate('/analysis')} className="btn-primary px-6">
              View Detailed Report
            </button>
            <button onClick={reset} className="btn-secondary flex items-center gap-2 justify-center px-6">
              <RefreshCw size={18} /> Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="page-title">Upload Resume</h1>
        <p className="page-subtitle">Upload your PDF or DOCX resume for AI-powered intelligence</p>
      </div>

      {/* Drop Zone — branded with decorative corners */}
      <div
        role="button"
        tabIndex={0}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                    transition-all duration-300 ease-out flex flex-col items-center justify-center
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        style={{
          borderColor: dragOver ? 'var(--primary)' : 'color-mix(in srgb, var(--primary) 30%, var(--border))',
          background: dragOver
            ? 'color-mix(in srgb, var(--primary) 6%, var(--card))'
            : 'color-mix(in srgb, var(--primary) 3%, var(--card))',
          transform: dragOver ? 'scale(1.01)' : 'scale(1)',
          boxShadow: dragOver ? 'var(--shadow-md)' : 'none'
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !file && fileRef.current?.click()}
      >
        {/* Decorative corners */}
        {['top-3 left-3 border-t-2 border-l-2 rounded-tl-lg',
          'top-3 right-3 border-t-2 border-r-2 rounded-tr-lg',
          'bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg',
          'bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg'].map((cls, i) => (
          <div key={i} className={`absolute w-4 h-4 ${cls}`}
               style={{ borderColor: 'color-mix(in srgb, var(--primary) 25%, transparent)' }} />
        ))}

        {file ? (
          <div className="flex items-center gap-4 w-full max-w-sm rounded-xl p-4"
               style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                 style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <FileText size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--foreground)' }}>{file.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              aria-label="Remove file"
              className="p-2 rounded-lg transition-colors shrink-0 hover:bg-red-50 hover:text-red-600"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                 style={{ background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }}>
              <Upload size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Drag &amp; drop your resume
            </h3>
            <p className="text-sm mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
              or{' '}
              <span className="font-medium underline underline-offset-2" style={{ color: 'var(--primary)' }}>
                click to browse
              </span>
            </p>
            <p className="text-xs mt-3 uppercase tracking-wider font-medium" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
              PDF · DOCX · Max 10MB
            </p>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} className="hidden" />

      {/* Title Input — only when file selected */}
      {file && (
        <div className="animate-page-enter">
          <label className="form-label">Resume Title</label>
          <input type="text" className="input" placeholder="e.g. Senior Developer Resume 2024"
            value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      )}

      {/* Auto-analyze Toggle */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3.5 cursor-pointer transition-colors"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        onClick={() => setAutoAnalyze(!autoAnalyze)}
        role="switch"
        aria-checked={autoAnalyze}
      >
        <div className="flex items-center gap-3">
          <Brain size={20} style={{ color: 'var(--primary)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Auto-analyze with AI after upload</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Get instant ATS score and actionable suggestions</p>
          </div>
        </div>
        {/* Toggle switch */}
        <div className="relative w-11 h-6 rounded-full transition-colors shrink-0"
             style={{ background: autoAnalyze ? 'var(--primary)' : 'var(--border)' }}>
          <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
               style={{ left: autoAnalyze ? '22px' : '2px' }} />
        </div>
      </div>

      {/* Upload CTA */}
      <button
        onClick={handleSubmit}
        disabled={!file || uploadState !== 'idle'}
        className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base font-bold"
        style={{ height: '3.5rem' }}
      >
        {uploadState === 'uploading' && <><Loader size={20} className="animate-spin" /> Uploading &amp; Parsing...</>}
        {uploadState === 'analyzing' && <><Loader size={20} className="animate-spin" /> Running AI Analysis...</>}
        {uploadState === 'idle' && <><Upload size={20} /> Upload &amp; Analyze Resume</>}
      </button>

      {/* Tips — amber card */}
      <div className="rounded-xl p-6 mt-4"
           style={{ background: 'oklch(0.98 0.03 85)', border: '1px solid oklch(0.88 0.07 85)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} style={{ color: 'oklch(0.55 0.13 85)' }} />
          <h4 className="text-sm font-semibold" style={{ color: 'oklch(0.35 0.08 85)' }}>
            Tips for a Higher ATS Score
          </h4>
        </div>
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm"
                style={{ color: 'oklch(0.40 0.08 85)' }}>
              <Check size={18} className="mt-0.5 shrink-0" style={{ color: 'oklch(0.50 0.12 85)' }} />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
