import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Eye, EyeOff, Loader } from 'lucide-react';

const LoginPage = () => {
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    try {
      const result = await guestLogin('jobseeker');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain size={22} className="text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Welcome back!</h1>
          <p className="text-gray-500 mt-1">Sign in to your SmartResume account</p>
        </div>

        {/* Form Card */}
        <div className="card shadow-xl border-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader size={18} className="animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

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
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
