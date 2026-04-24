/**
 * Upload Page - Resume file upload with drag & drop
 */
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, analysisAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, X, CheckCircle, Loader, Brain, RefreshCw } from 'lucide-react';

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
    if (!validTypes.includes(selected.type) && !selected.name.match(/\.(pdf|docx?|)$/i)) {
      return toast.error('Please upload a PDF or DOCX file');
    }
    if (selected.size > 10 * 1024 * 1024) {
      return toast.error('File size must be under 10MB');
    }
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

      if (!uploadData.success) {
        throw new Error(uploadData.message);
      }

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
        } catch (analyzeError) {
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

  const reset = () => {
    setFile(null);
    setTitle('');
    setUploadState('idle');
    setResult(null);
  };

  if (uploadState === 'done' && result) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {result.analysis ? 'Upload & Analysis Complete!' : 'Upload Complete!'}
          </h2>
          {result.analysis && (
            <div className="my-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <p className="text-gray-600 text-sm mb-1">Your ATS Score</p>
              <p className="text-5xl font-black text-blue-600">{result.analysis.atsScore}</p>
              <p className="text-gray-500 text-sm">/100</p>
            </div>
          )}
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={() => navigate('/analysis')} className="btn-primary">
              View Full Analysis
            </button>
            <button onClick={reset} className="btn-secondary flex items-center gap-2">
              <RefreshCw size={16} /> Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Upload Resume</h2>
        <p className="text-gray-500 mt-1">Upload your PDF or DOCX resume for AI-powered analysis</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragOver ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileRef.current?.click()}
      >
        {file ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText size={28} className="text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.includes('pdf') ? 'PDF' : 'DOCX'}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="ml-auto p-2 hover:bg-red-100 rounded-lg transition-colors">
              <X size={18} className="text-red-500" />
            </button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload size={28} className="text-blue-600" />
            </div>
            <p className="font-bold text-gray-900 text-lg">Drop your resume here</p>
            <p className="text-gray-500 mt-1 text-sm">or click to browse</p>
            <p className="text-gray-400 text-xs mt-3">Supports PDF and DOCX · Max 10MB</p>
          </>
        )}
      </div>

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} className="hidden" />

      {/* Title Input */}
      {file && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resume Title</label>
          <input type="text" className="input" placeholder="e.g. Senior Developer Resume 2024"
            value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      )}

      {/* Options */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl cursor-pointer" onClick={() => setAutoAnalyze(!autoAnalyze)}>
        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${autoAnalyze ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
          {autoAnalyze && <CheckCircle size={12} className="text-white" />}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
            <Brain size={14} className="text-blue-600" /> Auto-analyze with AI after upload
          </p>
          <p className="text-gray-500 text-xs">Get instant ATS score and suggestions</p>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleSubmit}
        disabled={!file || uploadState !== 'idle'}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
      >
        {uploadState === 'uploading' && <><Loader size={20} className="animate-spin" /> Uploading & Parsing...</>}
        {uploadState === 'analyzing' && <><Loader size={20} className="animate-spin" /> Running AI Analysis...</>}
        {uploadState === 'idle' && <><Upload size={20} /> Upload & Analyze Resume</>}
      </button>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-0">
        <h4 className="font-bold text-gray-900 mb-3 text-sm">💡 Tips for a Higher ATS Score</h4>
        <ul className="space-y-1.5">
          {[
            'Use standard section headings (Experience, Education, Skills)',
            'Include keywords from the job description',
            'Quantify achievements with numbers and percentages',
            'Use a clean, single-column format for better ATS parsing',
            'Include your email, phone, and LinkedIn profile'
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-blue-500 font-bold mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UploadPage;
