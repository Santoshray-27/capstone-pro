import React, { useState, useEffect } from 'react';
import { jobsAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Briefcase, MapPin, DollarSign, Clock, ExternalLink,
  Loader, Bookmark, Search, SlidersHorizontal, FileText, Globe, Star, TrendingUp, AlertCircle
} from 'lucide-react';

const JobCard = ({ job, onBookmark }) => {
  const getMatchColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  // Convert date format "2026-05-09..." to "X days ago"
  const getDaysAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    return diff === 0 ? 'Today' : `${diff}d ago`;
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-[var(--primary)]/5 to-transparent rounded-bl-[100px] -z-10 group-hover:from-[var(--primary)]/10 transition-all" />

      {/* Header & Logo */}
      <div className="flex gap-4 items-start mb-4">
        <div className="w-12 h-12 rounded-xl border border-[var(--border)] overflow-hidden shrink-0 bg-white flex items-center justify-center p-1">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain" />
          ) : (
            <Briefcase size={22} className="text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mt-1">
            <span className="font-medium text-[var(--foreground)]">{job.company}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><MapPin size={18}/> {job.location}</span>
          </div>
        </div>
        {/* Bookmark Action */}
        <button 
          onClick={() => onBookmark(job.id)}
          className="text-gray-400 hover:text-[var(--primary)] transition-colors p-2 rounded-full hover:bg-[var(--primary)]/10"
        >
          <Bookmark size={20} />
        </button>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.salary && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <DollarSign size={18}/> {job.salary}
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Clock size={18}/> {job.type}
        </span>
        {job.isRemote && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Globe size={18}/> Remote
          </span>
        )}
      </div>

      {/* Description Snippet */}
      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-4 leading-relaxed">
        {job.description}
      </p>

      {/* Skills */}
      {job.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.requiredSkills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-2 py-0.5 text-[11px] rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]">
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 3 && (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] opacity-70">
              +{job.requiredSkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Missing Skills Warning */}
      {job.missingSkills?.length > 0 && (
        <div className="mt-auto mb-4 p-2.5 rounded-lg bg-orange-50 border border-orange-100 flex items-start gap-2">
          <AlertCircle size={18} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-800">
            <strong>Missing Skills:</strong> {job.missingSkills.join(', ')}. <span className="underline cursor-pointer opacity-80 hover:opacity-100">View courses</span>
          </p>
        </div>
      )}

      <div className={job.missingSkills?.length ? "mt-0" : "mt-auto"} />

      {/* Footer Info & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[var(--border)] mt-auto gap-4">
        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          <span className={`px-2 py-1 text-xs font-bold border rounded-md ${getMatchColor(job.matchScore)} flex items-center gap-1`}>
            <Star size={18} className="fill-current" /> {job.matchScore}% Match
          </span>
          <span className="text-xs text-[var(--muted-foreground)]">
            {getDaysAgo(job.postedAt)}
          </span>
        </div>
        {job.applyUrl && job.applyUrl.startsWith('https://') ? (
          <a 
            href={job.applyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary py-2 px-6 text-sm flex items-center gap-2 justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
          >
            Apply Now <ExternalLink size={18} />
          </a>
        ) : (
          <button 
            disabled
            className="btn-primary py-2 px-6 text-sm flex items-center gap-2 justify-center shadow-none opacity-50 cursor-not-allowed w-full sm:w-auto"
            title="Application link is currently unavailable"
          >
            Apply <ExternalLink size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search State
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  
  // Filters State
  const [filters, setFilters] = useState({
    employmentType: '',
    datePosted: 'all',
    source: '',
  });
  
  // Resume Parsing State
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [parsingResume, setParsingResume] = useState(false);

  useEffect(() => {
    fetchResumes();
    // Load initial recommended jobs
    handleSearch(true);
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await resumeAPI.getAll();
      if (data.success && data.resumes.length > 0) {
        setResumes(data.resumes);
        setSelectedResumeId(data.resumes[0]._id);
      }
    } catch (err) {
      console.error("Failed to load resumes");
    }
  };

  const handleSearch = async (isInitial = false) => {
    setLoading(true);
    try {
      const searchPayload = {
        query: query,
        location: location,
        employmentType: filters.employmentType,
        datePosted: filters.datePosted,
        source: filters.source,
        resumeId: isInitial || !query ? selectedResumeId : null // If no query, use resume as base
      };
      
      const { data } = await jobsAPI.searchJobs(searchPayload);
      if (data.success) {
        setJobs(data.jobs);
        if (!isInitial) toast.success(`Found ${data.count} jobs from aggregated sources!`);
      }
    } catch (error) {
      toast.error('Failed to search jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeAutoFill = async () => {
    if (!selectedResumeId) return toast.error("Please upload or select a resume first");
    setParsingResume(true);
    // Triggering search with resumeId will automatically use AI to extract keywords
    await handleSearch();
    setParsingResume(false);
    toast.success("Job search personalized based on your resume!");
  };

  const toggleBookmark = (id) => {
    toast.success("Job saved to your bookmarks!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SIDEBAR: FILTERS & RESUME UPLOAD */}
      <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
        
        {/* Auto-Match / Resume Integration */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--foreground)]">Smart Auto-Match</h3>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
            Upload your resume to automatically extract skills, experience, and search parameters.
          </p>
          
          <div className="mb-4">
            <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">Select Resume</label>
            <select 
              className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-lg px-3 py-2 outline-none focus:border-[var(--primary)] transition-colors"
              value={selectedResumeId}
              onChange={e => setSelectedResumeId(e.target.value)}
            >
              <option value="">No Resume Selected</option>
              {resumes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
            </select>
          </div>
          
          <button 
            onClick={handleResumeAutoFill}
            disabled={parsingResume || !selectedResumeId}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[var(--primary)] to-blue-600 hover:opacity-90 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {parsingResume ? <Loader size={16} className="animate-spin" /> : <FileText size={18} />}
            {parsingResume ? 'Analyzing Profile...' : 'Auto-Match Jobs'}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal size={18} className="text-[var(--primary)]" />
            <h3 className="font-semibold text-[var(--foreground)]">Filters</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[var(--foreground)] block mb-2">Job Type</label>
              <select 
                value={filters.employmentType}
                onChange={e => setFilters({...filters, employmentType: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              >
                <option value="">Any Type</option>
                <option value="FULLTIME">Full-time</option>
                <option value="PARTTIME">Part-time</option>
                <option value="CONTRACTOR">Contract</option>
                <option value="INTERN">Internship</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--foreground)] block mb-2">Date Posted</label>
              <select 
                value={filters.datePosted}
                onChange={e => setFilters({...filters, datePosted: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              >
                <option value="all">Any Time</option>
                <option value="today">Past 24 hours</option>
                <option value="3days">Past 3 days</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--foreground)] block mb-2">Platform / Source</label>
              <select 
                value={filters.source}
                onChange={e => setFilters({...filters, source: e.target.value})}
                className="w-full bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
              >
                <option value="">All Platforms</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Wellfound">Wellfound</option>
                <option value="ZipRecruiter">ZipRecruiter</option>
                <option value="Upwork">Upwork</option>
                <option value="Naukri">Naukri.com</option>
              </select>
            </div>
            
            <button 
              onClick={() => handleSearch()}
              className="w-full py-2.5 bg-[var(--muted)] hover:bg-[var(--accent)] text-[var(--foreground)] text-sm font-medium rounded-lg transition-colors border border-[var(--border)]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT: SEARCH & RESULTS */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* Search Header */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-2 shadow-sm flex flex-col sm:flex-row items-center relative z-10 gap-1 sm:gap-0">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 w-full border-b sm:border-b-0 sm:border-r border-[var(--border)]">
            <Search size={20} className="text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              placeholder="Job title, skills, or keywords" 
              className="w-full bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-sm font-medium"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 w-full">
            <MapPin size={20} className="text-[var(--muted-foreground)]" />
            <input 
              type="text" 
              placeholder="City, state, or 'Remote'" 
              className="w-full bg-transparent border-none outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] text-sm font-medium"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="p-1 w-full sm:w-auto">
            <button 
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-[var(--primary)]/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader size={18} className="animate-spin" /> : 'Search'}
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            {jobs.length > 0 ? `${jobs.length} Real-Time Job Opportunities` : 'Search Jobs'}
          </h2>
          <div className="text-sm text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full border border-[var(--border)]">
            Aggregated from LinkedIn, Indeed & More
          </div>
        </div>

        {/* Job Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 mt-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[300px] bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 animate-pulse flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[var(--muted)] rounded-xl" />
                  <div className="flex-1">
                    <div className="h-5 bg-[var(--muted)] rounded w-3/4 mb-2" />
                    <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-[var(--muted)] rounded w-full mt-4" />
                <div className="h-4 bg-[var(--muted)] rounded w-5/6" />
                <div className="mt-auto h-10 bg-[var(--muted)] rounded w-full" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onBookmark={toggleBookmark} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--card)] border border-[var(--border)] rounded-2xl border-dashed">
            <div className="w-16 h-16 bg-[var(--muted)] rounded-full flex items-center justify-center mb-4">
              <Search size={22} className="text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">No jobs found</h3>
            <p className="text-[var(--muted-foreground)] max-w-sm">
              We couldn't find any jobs matching your exact criteria. Try broadening your search or adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
