/**
 * Jobs Page - AI Job Recommendations
 */
import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, DollarSign, Clock, Zap, ExternalLink, RefreshCw, Loader, Star } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const JobCard = ({ job }) => {
  const matchColor = job.matchScore >= 85 ? 'text-green-600 bg-green-50' :
    job.matchScore >= 70 ? 'text-blue-600 bg-blue-50' : 'text-yellow-600 bg-yellow-50';

  return (
    <div className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium text-sm">{job.company}</p>
        </div>
        {job.matchScore && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${matchColor}`}>
            <Star size={12} className="fill-current" />
            {job.matchScore}% Match
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {job.type}
        </span>
        {job.salary && (
          <span className="flex items-center gap-1">
            <DollarSign size={14} /> {job.salary}
          </span>
        )}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {job.description}
      </p>

      {job.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.slice(0, 4).map((skill) => (
            <span key={skill} className="badge-info">{skill}</span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="badge bg-gray-100 text-gray-600">+{job.requiredSkills.length - 4}</span>
          )}
        </div>
      )}

      {job.whyMatch && (
        <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-xl mb-4">
          <Zap size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-blue-700 text-xs font-medium">{job.whyMatch}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-1">
          Apply Now <ExternalLink size={14} />
        </button>
        <button className="btn-secondary text-sm py-2 px-4">Save</button>
      </div>
    </div>
  );
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const { data } = await jobsAPI.getRecommendations();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      toast.error('Failed to load recommendations');
      // Use mock data
      setJobs(getMockJobs());
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
    toast.success('Jobs refreshed!');
  };

  const getMockJobs = () => [
    { title: 'Full Stack Developer', company: 'TechCorp', location: 'San Francisco (Hybrid)', type: 'Full-time', salary: '$95K-$130K', matchScore: 92, requiredSkills: ['React', 'Node.js', 'MongoDB'], description: 'Build scalable web applications.', whyMatch: 'Strong skill alignment' },
    { title: 'Software Engineer II', company: 'StartupCo', location: 'Remote', type: 'Full-time', salary: '$100K-$140K', matchScore: 87, requiredSkills: ['JavaScript', 'Python', 'AWS'], description: 'Join our growing engineering team.', whyMatch: 'JavaScript expertise matches 87%' },
    { title: 'Frontend Engineer', company: 'DesignFirst', location: 'New York, NY', type: 'Full-time', salary: '$85K-$115K', matchScore: 85, requiredSkills: ['React', 'TypeScript', 'CSS'], description: 'Create beautiful interfaces.', whyMatch: 'Frontend skills are a great fit' },
    { title: 'Backend Developer', company: 'DataStream', location: 'Austin, TX', type: 'Full-time', salary: '$90K-$125K', matchScore: 80, requiredSkills: ['Node.js', 'PostgreSQL', 'Redis'], description: 'High-performance backend systems.', whyMatch: 'Node.js aligns well' },
    { title: 'DevOps Engineer', company: 'CloudBase', location: 'Seattle, WA', type: 'Full-time', salary: '$105K-$145K', matchScore: 75, requiredSkills: ['Docker', 'Kubernetes', 'CI/CD'], description: 'Manage cloud infrastructure.', whyMatch: 'Dev background transfers to DevOps' },
  ];

  const filteredJobs = filter === 'top' ? jobs.filter(j => j.matchScore >= 85) : jobs;

  if (loading) return <LoadingSpinner text="Finding your best job matches..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Job Recommendations</h2>
          <p className="text-gray-500 text-sm mt-1">AI-curated jobs based on your resume profile</p>
        </div>
        <button onClick={refresh} disabled={refreshing}
          className="btn-secondary flex items-center gap-2 text-sm">
          {refreshing ? <Loader size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: `All Jobs (${jobs.length})` },
          { value: 'top', label: `Top Matches (${jobs.filter(j => j.matchScore >= 85).length})` }
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredJobs.map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="card text-center py-12">
          <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No jobs match your current filter</p>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
