import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FileText, Sparkles, Eye, EyeOff, Loader, User, Briefcase, ArrowLeft, BarChart3, Zap, Users, Mail, Lock, UserSearch, Cpu } from 'lucide-react';
import LogoIcon from '../components/common/LogoIcon';

const RegisterPage = () => {
  const { register, guestLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'jobseeker' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

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

  return (
    <div className="min-h-screen w-full bg-white flex overflow-hidden font-['Inter',_sans-serif]">
      {/* Left Side: Auth Form (60%) */}
      <div className="w-full lg:w-[60%] flex flex-col p-6 sm:p-8 md:p-12 relative overflow-y-auto">
        {/* Logo Area */}
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative group/logo">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover/logo:scale-110" style={{ background: 'var(--primary)' }}>
                <LogoIcon size={24} className="text-white" />
              </div>
            </div>
            <span className="font-black text-2xl tracking-tighter text-[var(--foreground)] flex items-baseline">
              Resume<span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', padding: '0 1px' }}>X</span>pert<span style={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '14px', marginLeft: '4px' }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Center: Register Form */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="w-full max-w-[440px] flex flex-col items-center px-4 sm:px-0">
            <div className="w-full text-left mb-6">
              <h1 className="text-[36px] font-bold text-[var(--foreground)] tracking-tight leading-tight mb-1">Create Your Account</h1>
              <p className="text-[16px] font-normal text-[var(--muted-foreground)]">Join ResumeXpert AI to build a career that gets you hired.</p>
            </div>



            <form onSubmit={handleSubmit} className="w-full space-y-5">
              <div>
                <label className="text-[14px] font-medium text-[var(--foreground)] mb-2 block">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                  <input
                    type="text"
                    className="input pl-11"
                    placeholder="Roger Gerrard"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[14px] font-medium text-[var(--foreground)] mb-2 block">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                  <input
                    type="email"
                    className="input pl-11"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[14px] font-medium text-[var(--foreground)] mb-2 block">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input pl-11 pr-12"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--foreground)] p-1">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[var(--primary)] text-white py-4 rounded-xl font-semibold text-[16px] shadow-xl shadow-[var(--primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-1">
                {loading ? <><Loader size={18} className="animate-spin" /> Creating Account...</> : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <Link to="/login" className="text-[15px] font-medium text-[var(--muted-foreground)]">
                Already have an account? <span className="text-[var(--primary)] font-semibold hover:underline">Log in.</span>
              </Link>
              
              <button 
                onClick={handleGuestLogin}
                type="button"
                disabled={guestLoading || loading}
                className="flex items-center gap-2 text-[14px] font-semibold text-gray-400 hover:text-[var(--foreground)] transition-colors py-1 px-4 rounded-lg hover:bg-gray-50"
              >
                {guestLoading ? <Loader size={16} className="animate-spin" /> : <Users size={18} />}
                {guestLoading ? 'Opening Workspace...' : 'Explore as a Guest'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="flex justify-between items-center text-[11px] font-medium text-gray-400 mt-auto">
          <p>© 2025 ResumeXpert AI</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Panel (40%) */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden bg-white">
        <div className="absolute inset-0 m-4 rounded-[40px] overflow-hidden flex flex-col items-center justify-center text-white p-12 shadow-2xl"
             style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #FF8A65 100%)' }}>
          
          {/* Abstract blobs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-xs text-center mb-16">
            <h2 className="text-4xl font-bold leading-tight mb-6 tracking-tight">Unlock the full potential of your career.</h2>
            <p className="text-lg font-normal opacity-90 leading-relaxed">Join thousands of professionals using AI to land their dream jobs.</p>
          </div>

          {/* Mock Dashboard Preview */}
          <div className="relative w-full max-w-[360px] bg-white/95 backdrop-blur-sm rounded-[32px] shadow-2xl overflow-hidden border border-white/20 scale-110">
            <div className="p-6">
               {/* Mock UI Elements */}
               <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-2">
                      <BarChart3 size={18} className="text-[var(--primary)]" />
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Match</div>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">94%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center mb-2">
                      <Zap size={18} className="text-emerald-600" />
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Growth</div>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">Top 1%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center mb-2">
                      <FileText size={18} className="text-amber-600" />
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Network</div>
                    <div className="text-lg font-bold text-gray-900 mt-0.5">500+</div>
                  </div>
               </div>
               <div className="space-y-3">
                 {[
                   { role: "Senior Software Engineer", company: "Google", match: "98%", icon: <Zap size={18} className="text-amber-500" />, color: "bg-amber-50" },
                   { role: "Product Designer", company: "Meta", match: "94%", icon: <Users size={18} className="text-blue-500" />, color: "bg-blue-50" },
                   { role: "Data Scientist", company: "Amazon", match: "89%", icon: <BarChart3 size={18} className="text-emerald-500" />, color: "bg-emerald-50" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm hover:translate-x-1 transition-transform cursor-default">
                     <div className="flex items-center gap-3">
                       <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shadow-sm`}>
                         {item.icon}
                       </div>
                       <div>
                         <div className="text-[12px] font-bold text-gray-900 leading-none mb-1">{item.role}</div>
                         <div className="text-[10px] font-medium text-gray-400">{item.company} • 2h ago</div>
                       </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <div className="text-[11px] font-bold text-[var(--primary)]">{item.match}</div>
                        <div className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Match</div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
