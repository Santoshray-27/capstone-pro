import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Eye, EyeOff, Loader, User, Briefcase } from 'lucide-react';

const RegisterPage = () => {
<<<<<<< HEAD
  const { register, guestLogin } = useAuth();
=======
  const { register } = useAuth();
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const [guestLoading, setGuestLoading] = useState(false);
=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const result = await register(form);
      if (result.success) {
        toast.success('Account created! Welcome aboard 🎉');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const result = await guestLogin(form.role);
      if (result.success) {
        toast.success(result.message);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Guest login failed. Please try again.');
    } finally {
      setGuestLoading(false);
    }
  };

=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Start analyzing resumes with AI</p>
        </div>

        <div className="card shadow-xl border-0">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { value: 'jobseeker', label: 'Job Seeker', icon: User, desc: 'I want to get hired' },
              { value: 'recruiter', label: 'Recruiter', icon: Briefcase, desc: 'I want to hire' }
            ].map((r) => (
              <button key={r.value} type="button"
                onClick={() => setForm({ ...form, role: r.value })}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  form.role === r.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <r.icon size={16} className={form.role === r.value ? 'text-blue-600' : 'text-gray-500'} />
                  <span className={`font-semibold text-sm ${form.role === r.value ? 'text-blue-600' : 'text-gray-700'}`}>
                    {r.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{r.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input type="text" className="input" placeholder="John Doe"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" className="input" placeholder="john@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-12"
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader size={18} className="animate-spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>
<<<<<<< HEAD

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={handleGuestLogin}
              disabled={guestLoading || loading}
              className="w-full py-2.5 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {guestLoading ? <Loader size={16} className="animate-spin" /> : null}
              {guestLoading ? 'Entering as Guest...' : 'Try Guest Login'}
            </button>
          </div>
=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
