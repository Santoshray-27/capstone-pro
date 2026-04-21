import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Save, Lock, Loader } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    profile: {
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      bio: user?.profile?.bio || '',
      linkedIn: user?.profile?.linkedIn || '',
      github: user?.profile?.github || '',
      targetRole: user?.profile?.targetRole || '',
      experience: user?.profile?.experience || 0,
      skills: user?.profile?.skills?.join(', ') || ''
    }
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        profile: {
          ...form.profile,
          skills: form.profile.skills.split(',').map(s => s.trim()).filter(Boolean)
        }
      };
      const { data } = await authAPI.updateProfile(payload);
      if (data.success) {
        updateUser(data.user);
        toast.success('Profile updated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword.length < 6) return toast.error('Password must be 6+ characters');
    setChangingPwd(true);
    try {
      const { data } = await authAPI.changePassword(pwdForm);
      if (data.success) {
        toast.success('Password changed!');
        setPwdForm({ currentPassword: '', newPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setChangingPwd(false);
    }
  };

  const updateProfile = (field, value) => setForm(prev => ({
    ...prev, profile: { ...prev.profile, [field]: value }
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Profile Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
      </div>

      {/* Avatar */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className={`badge ${user?.role === 'recruiter' ? 'badge-warning' : 'badge-info'} mt-1 capitalize`}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={saveProfile} className="card space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><User size={18} /> Personal Info</h3>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Phone', field: 'phone', placeholder: '(555) 000-0000' },
            { label: 'Location', field: 'location', placeholder: 'City, State' },
            { label: 'LinkedIn', field: 'linkedIn', placeholder: 'linkedin.com/in/...' },
            { label: 'GitHub', field: 'github', placeholder: 'github.com/...' },
            { label: 'Target Role', field: 'targetRole', placeholder: 'Senior Engineer' },
            { label: 'Years Experience', field: 'experience', placeholder: '0', type: 'number' }
          ].map((f) => (
            <div key={f.field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input className="input" type={f.type || 'text'} placeholder={f.placeholder}
                value={form.profile[f.field]} onChange={(e) => updateProfile(f.field, e.target.value)} />
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
          <textarea className="input resize-none" rows={3} placeholder="Tell us about yourself..."
            value={form.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills (comma separated)</label>
          <input className="input" placeholder="React, Node.js, Python..."
            value={form.profile.skills} onChange={(e) => updateProfile('skills', e.target.value)} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Profile</>}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={changePassword} className="card space-y-4">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Lock size={18} /> Change Password</h3>
        {[
          { label: 'Current Password', field: 'currentPassword' },
          { label: 'New Password', field: 'newPassword' }
        ].map((f) => (
          <div key={f.field}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
            <input type="password" className="input" placeholder="••••••••"
              value={pwdForm[f.field]} onChange={(e) => setPwdForm({...pwdForm, [f.field]: e.target.value})} required />
          </div>
        ))}
        <button type="submit" disabled={changingPwd} className="btn-secondary flex items-center gap-2">
          {changingPwd ? <><Loader size={16} className="animate-spin" /> Changing...</> : <><Lock size={16} /> Change Password</>}
        </button>
      </form>

      {/* Stats */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">Account Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Resumes', value: user?.stats?.resumesUploaded || 0 },
            { label: 'Analyses', value: user?.stats?.analysisCount || 0 },
            { label: 'Interviews', value: user?.stats?.interviewsCompleted || 0 }
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-2xl font-black text-blue-600">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
