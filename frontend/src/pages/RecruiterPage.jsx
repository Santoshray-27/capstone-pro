import React, { useState, useEffect } from 'react';
import { recruiterAPI, jobsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Users, Briefcase, Search, Plus, Loader } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RecruiterPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', 'company.name': '', description: '', requiredSkills: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await recruiterAPI.getDashboard();
      if (data.success) setDashboard(data.dashboard);
    } catch (err) {
      setDashboard({ myJobs: [], totalJobs: 0, totalApplications: 0, recentCandidates: [] });
    } finally {
      setLoading(false);
    }
  };

  const postJob = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const { data } = await jobsAPI.create({
        title: jobForm.title,
        company: { name: jobForm['company.name'] },
        description: jobForm.description,
        requiredSkills: jobForm.requiredSkills.split(',').map(s => s.trim())
      });
      if (data.success) {
        toast.success('Job posted!');
        setShowJobForm(false);
        loadDashboard();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading recruiter dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Recruiter Hub</h2>
          <p className="text-gray-500 text-sm">Manage jobs and find top candidates</p>
        </div>
        <button onClick={() => setShowJobForm(!showJobForm)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Post Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Jobs', value: dashboard?.totalJobs || 0, icon: Briefcase, color: 'text-blue-600 bg-blue-50' },
          { label: 'Total Applications', value: dashboard?.totalApplications || 0, icon: Users, color: 'text-green-600 bg-green-50' },
          { label: 'Candidates', value: dashboard?.recentCandidates?.length || 0, icon: Search, color: 'text-purple-600 bg-purple-50' }
        ].map((s) => (
          <div key={s.label} className="card">
            <div className={`w-10 h-10 ${s.color.split(' ')[1]} rounded-xl flex items-center justify-center mb-2`}>
              <s.icon size={20} className={s.color.split(' ')[0]} />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Post Job Form */}
      {showJobForm && (
        <div className="card border-blue-200">
          <h3 className="font-bold text-gray-900 mb-4">Post New Job</h3>
          <form onSubmit={postJob} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title *</label>
                <input className="input" placeholder="Senior React Developer"
                  value={jobForm.title} onChange={(e) => setJobForm({...jobForm, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Company *</label>
                <input className="input" placeholder="Your Company"
                  value={jobForm['company.name']} onChange={(e) => setJobForm({...jobForm, 'company.name': e.target.value})} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea className="input resize-none" rows={3}
                value={jobForm.description} onChange={(e) => setJobForm({...jobForm, description: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Required Skills (comma separated)</label>
              <input className="input" placeholder="React, TypeScript, Node.js"
                value={jobForm.requiredSkills} onChange={(e) => setJobForm({...jobForm, requiredSkills: e.target.value})} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={posting} className="btn-primary flex items-center gap-2">
                {posting ? <><Loader size={16} className="animate-spin" /> Posting...</> : <><Briefcase size={16} /> Post Job</>}
              </button>
              <button type="button" onClick={() => setShowJobForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* My Jobs */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">My Job Postings</h3>
        {dashboard?.myJobs?.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Briefcase size={32} className="mx-auto mb-2 opacity-50" />
            <p>No jobs posted yet. Create your first listing.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.myJobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-gray-900">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.company?.name} · {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge-success">{job.applicationCount || 0} apps</span>
                  <span className={job.isActive ? 'badge-success' : 'badge-error'}>{job.isActive ? 'Active' : 'Closed'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterPage;
