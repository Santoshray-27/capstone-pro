/**
 * HomePage - Marketing landing page overhaul
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Upload, BarChart3, Briefcase, MessageSquare, 
  FileText, Star, CheckCircle, ArrowRight, Zap, 
  Shield, Globe, Layout as LayoutIcon, Sparkles,
  Search, Rocket, UserSearch, Cpu, Menu, X, ChevronRight
} from 'lucide-react';
import Antigravity from '../components/common/Antigravity';
import LogoIcon from '../components/common/LogoIcon';

const features = [
  { 
    icon: Upload, 
    title: 'Smart Resume Parsing', 
    desc: 'Instantly extract and structure your career data from any PDF or DOCX file using advanced OCR and natural language processing.',
    bullets: ['Format-agnostic parsing', 'Data structuring', 'Immediate feedback'],
    stat: '99% Accuracy'
  },
  { 
    icon: Brain, 
    title: 'Deep ATS Scoring', 
    desc: 'Our AI simulates enterprise Applicant Tracking Systems to predict exactly how top companies will evaluate your resume.',
    bullets: ['Keyword optimization', 'Impact analysis', 'Readability score'],
    stat: 'Simulates 50+ ATS'
  },
  { 
    icon: FileText, 
    title: 'Dynamic Resume Builder', 
    desc: 'Generate perfectly formatted, pixel-perfect resumes that pass automated screenings and impress human recruiters.',
    bullets: ['1-Click ATS Templates', 'Live Markdown Preview', 'PDF Export'],
    stat: '4 Premium Layouts'
  },
  { 
    icon: Briefcase, 
    title: 'Intelligent Job Matcher', 
    desc: 'Stop scrolling through irrelevant listings. We analyze your unique skill footprint and bring the highest-probability matches to you.',
    bullets: ['Semantic matching', 'Salary insights', 'Culture fit analysis'],
    stat: 'Real-time API'
  },
  { 
    icon: MessageSquare, 
    title: 'AI Mock Interviews', 
    desc: 'Practice makes perfect. Face an AI recruiter that asks dynamic, contextual questions based strictly on your resume and target role.',
    bullets: ['Behavioral questions', 'Technical screens', 'Tone analysis'],
    stat: '24/7 Availability'
  },
  { 
    icon: BarChart3, 
    title: 'Career Analytics', 
    desc: 'Measure what matters. Track your application volume, interview conversion rates, and skill growth over time.',
    bullets: ['Conversion funnels', 'Skill gap analysis', 'Market trends'],
    stat: 'Comprehensive Dashboard'
  },
];

const testimonials = [
  { name: 'Varun Srivastava', role: 'Software Engineer', text: 'Got my ATS score from 45 to 89! Landed a job at Google within 2 months.', rating: 5 },
  { name: 'Vaibhav Khatri', role: 'Product Manager', text: 'The AI feedback was incredibly specific. It pointed out exactly what recruiters look for.', rating: 5 },
  { name: 'Priyani Tiwari', role: 'Data Scientist', text: 'Interview prep feature is a game changer. AI questions were better than real interviews!', rating: 5 },
];

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <nav 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.40)',
          backdropFilter: isScrolled ? 'blur(24px)' : 'blur(8px)',
          WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(8px)',
          borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 4px 24px rgba(0, 0, 0, 0.04)' : 'none',
        }}
        className="px-4 py-2 md:py-3 h-14 md:h-[72px] flex items-center"
      >
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 group cursor-pointer touch-target">
            <div className="relative group/logo">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover/logo:scale-110 bg-[var(--primary)]">
                <LogoIcon size={20} className="text-[var(--primary-foreground)]" />
              </div>
            </div>
            <span className="font-black text-xl md:text-2xl tracking-tighter text-[var(--foreground)] transition-colors flex items-baseline">
              Resume<span className="text-[var(--primary)] italic font-black text-[22px] md:text-[26px] px-[1px]">X</span>pert<span className="text-[var(--muted-foreground)] font-semibold text-[12px] md:text-[14px] ml-1">AI</span>
            </span>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 mr-auto ml-12 h-full">
            <div className="relative group h-full flex items-center">
              <a href="#features" className="text-sm font-bold text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors flex items-center gap-1 py-4">
                Features
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </a>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 pt-2">
                <div className="bg-[var(--card)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden p-6 grid grid-cols-2 gap-4">
                  {features.map((f) => (
                    <div key={f.title} className="flex gap-4 p-4 rounded-2xl hover:bg-[var(--muted)]/50 transition-colors group/item cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                        <f.icon size={20} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <div className="text-sm font-black text-[var(--foreground)] mb-1">{f.title}</div>
                        <div className="text-xs text-[var(--muted-foreground)] leading-snug line-clamp-2">{f.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <a href="#testimonials" className="text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Success Stories</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-6 shadow-[var(--shadow-lg)] shadow-[var(--primary)]/20">
                Get Started Free
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-[var(--foreground)] touch-target rounded-lg hover:bg-[var(--muted)]" onClick={() => setMobileNavOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Slide-in Panel */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-[150]">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[var(--background)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--primary)]">
                    <LogoIcon size={18} className="text-[var(--primary-foreground)]" />
                  </div>
                  <span className="font-black text-lg tracking-tighter text-[var(--foreground)] flex items-baseline">
                    Resume<span className="text-[var(--primary)] italic font-black text-[20px] px-[1px]">X</span>pert
                  </span>
                </div>
                <button className="p-2 text-[var(--muted-foreground)] touch-target rounded-lg hover:bg-[var(--muted)]" onClick={() => setMobileNavOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col flex-1 p-4 overflow-y-auto gap-2">
                <a href="#features" onClick={() => setMobileNavOpen(false)} className="flex items-center min-h-[48px] px-4 text-base font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-xl transition-all">Features</a>
                <a href="#testimonials" onClick={() => setMobileNavOpen(false)} className="flex items-center min-h-[48px] px-4 text-base font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-xl transition-all">Success Stories</a>
              </div>
              <div className="p-4 border-t border-[var(--border)] space-y-3 bg-[var(--card)] safe-bottom">
                <Link to="/login" onClick={() => setMobileNavOpen(false)} className="flex items-center justify-center w-full min-h-[48px] text-base font-bold text-[var(--foreground)] bg-[var(--muted)] rounded-xl">Sign In</Link>
                <Link to="/register" onClick={() => setMobileNavOpen(false)} className="btn-primary w-full text-center text-base min-h-[48px] justify-center rounded-xl">Get Started Free</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* CONTENT WRAPPER WITH ANIMATION */}
      <div className="page-enter">
        {/* HERO SECTION — UPGRADE 1 */}
        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden min-h-[100svh] pt-24 pb-16 px-4 md:pt-[160px] md:pb-[160px]">
          {/* Backgrounds */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(100, 74, 64, 0.12) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(100, 74, 64, 0.08) 0%, transparent 40%),
                              radial-gradient(circle at 60% 80%, rgba(100, 74, 64, 0.06) 0%, transparent 35%)`,
          }} />
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{
            backgroundImage: 'radial-gradient(circle, rgba(100,74,64,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />

          {/* Top Badge Wrapper */}
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs font-semibold tracking-wide text-[var(--primary)] bg-[rgba(100,74,64,0.08)] border border-[rgba(100,74,64,0.20)]">
            <Sparkles size={16} />
            <span className="hidden sm:inline">Next-Gen AI Analysis Powered by ResumeXpert</span>
            <span className="sm:hidden">Powered by ResumeXpert AI</span>
          </div>

          {/* Main Headline Wrapper */}
          <h1 className="relative z-10 text-center font-black leading-tight tracking-tight text-[var(--foreground)] w-[95vw] md:max-w-[900px] mb-6">
            Stop Guessing.{' '}
            <span className="text-[var(--primary)]">
              Start Getting Hired.
            </span>
          </h1>

          {/* Subtext Wrapper */}
          <p className="relative z-10 text-center font-medium leading-relaxed text-[var(--muted-foreground)] w-[90vw] sm:max-w-[580px] mb-10 text-sm md:text-lg">
            Your AI Resume Expert and Career Coach. <br className="hidden sm:block" /> Analyze. Optimize. Prepare. Get Hired.
          </p>

          {/* CTA Buttons Row Wrapper */}
          <div className="relative z-10 w-full px-4 flex flex-col sm:flex-row gap-3 items-center justify-center mb-12">
            <Link to="/register" className="btn-primary w-full sm:w-auto text-base md:text-lg py-4 px-10 flex items-center gap-2 justify-center shadow-xl shadow-[var(--primary)]/20 rounded-xl">
              Analyze Your Resume <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary w-full sm:w-auto text-base md:text-lg py-4 px-10 border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] rounded-xl justify-center flex">
              View Demo Session
            </Link>
          </div>

          {/* Trust Badges Row Wrapper */}
          <div className="relative z-10 w-full flex flex-wrap gap-x-6 gap-y-3 items-center justify-center mb-12 md:mb-16 px-4">
            <span className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[var(--muted-foreground)]"><CheckCircle size={16} className="text-emerald-500" /> No Credit Card</span>
            <span className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[var(--muted-foreground)]"><CheckCircle size={16} className="text-emerald-500" /> Free Analysis</span>
            <span className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-[var(--muted-foreground)]"><CheckCircle size={16} className="text-emerald-500" /> ATS Optimized</span>
          </div>

          {/* Hero Visual — Dashboard Preview Card (Hide on very small screens) */}
          <div className="hidden xs:block relative z-10 w-full max-w-[900px] px-4 mx-auto">
            <div style={{
              background: 'rgba(255,255,255,0.70)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(100, 74, 64, 0.12)',
              borderRadius: '20px',
              padding: 'clamp(16px, 4vw, 24px)',
              boxShadow: '0 20px 60px rgba(100, 74, 64, 0.15), 0 4px 16px rgba(0,0,0,0.06)',
            }}>
              {/* Browser chrome bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <div className="hidden sm:flex" style={{
                  flex: 1, height: 24, background: 'rgba(100,74,64,0.06)',
                  borderRadius: 6, marginLeft: 8, alignItems: 'center',
                  paddingLeft: 10, fontSize: '0.7rem', color: 'var(--muted-foreground)'
                }}>
                  resumexpert.ai/dashboard
                </div>
              </div>

              {/* Mock Dashboard Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 sm:mb-6">
                {[
                  { label: 'ATS Score', value: '94%', color: '#10B981' },
                  { label: 'Resumes', value: '12', color: 'var(--primary)' },
                  { label: 'Interviews', value: '8', color: '#6366f1' },
                  { label: 'Matched', value: '47', color: '#F59E0B' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: 'rgba(100,74,64,0.04)',
                    border: '1px solid rgba(100,74,64,0.08)',
                    borderRadius: '12px',
                    padding: 'clamp(10px, 3vw, 14px)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: '2px', fontWeight: 600 }}>{stat.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              {/* Mock Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: 'Keywords Match', pct: 88 },
                  { label: 'Format Score', pct: 95 },
                  { label: 'Experience Fit', pct: 76 },
                  { label: 'ATS Compatibility', pct: 91 },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 14px', background: 'rgba(100,74,64,0.03)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--foreground)' }}>{item.label}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{item.pct}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(100,74,64,0.10)', borderRadius: '99px' }}>
                      <div style={{
                        height: '100%', width: `${item.pct}%`,
                        background: 'linear-gradient(90deg, var(--primary), rgba(100,74,64,0.60))',
                        borderRadius: '99px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Marquee Section */}
        <section className="py-6 md:py-10 border-y border-[var(--border)] flex opacity-90 hover:opacity-100 transition-opacity duration-500 group bg-[var(--primary)] scroll-x-mobile">
          <div className="flex w-max animate-marquee md:group-hover:[animation-play-state:paused] cursor-default shrink-0">
            {[...Array(4)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex shrink-0 items-center justify-around">
                 {features.map((f, i) => (
                   <div key={`${arrayIndex}-${i}`} className="flex items-center gap-3 md:gap-4 text-[var(--primary-foreground)] font-bold text-sm md:text-lg tracking-widest uppercase px-6 md:px-16 shrink-0">
                      <f.icon size={18} className="md:w-[22px] md:h-[22px] shrink-0" />
                      <span className="whitespace-nowrap">{f.title}</span>
                   </div>
                 ))}
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES — UPGRADE 2: BENTO GRID (Responsive) */}
        <section id="features" className="py-16 md:py-[120px] px-4 max-w-screen-xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight mb-4 text-[var(--foreground)]">
              A Complete <span className="text-[var(--primary)]">Career OS</span>
            </h2>
            <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed font-medium">
              We've built the most comprehensive toolkit for modern job seekers, powered by state-of-the-art AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* CARD 1 — Smart Resume Parsing (Large) */}
            <div className="md:col-span-2 lg:col-span-7 group bg-[var(--card)] border border-[var(--border)] rounded-[20px] p-[clamp(24px,5vw,36px)] relative overflow-hidden min-h-auto md:min-h-[280px]">
              <div className="absolute -right-10 -bottom-10 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(100,74,64,0.08)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm bg-[rgba(100,74,64,0.1)]">
                  <Upload size={22} className="text-[var(--primary)]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)] mb-3">{features[0].title}</h3>
                <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-6 max-w-sm">{features[0].desc}</p>
                <div className="flex flex-col gap-2 mb-6">
                  {features[0].bullets.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
                      <CheckCircle size={14} className="text-emerald-500" /> {b}
                    </div>
                  ))}
                </div>
                <div className="md:absolute md:bottom-6 md:right-6 inline-flex px-4 py-1.5 rounded-full bg-[var(--background)] border border-[var(--border)] text-[10px] font-black uppercase tracking-widest text-[var(--primary)] mt-4 md:mt-0">
                  {features[0].stat}
                </div>
              </div>
            </div>

            {/* CARD 2 — Deep ATS Scoring (Colored) */}
            <div className="md:col-span-1 lg:col-span-5 group bg-[var(--primary)] rounded-[20px] p-[clamp(24px,5vw,36px)] text-white relative overflow-hidden min-h-auto md:min-h-[280px]">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/20">
                <Brain size={22} className="text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-3">{features[1].title}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">{features[1].desc}</p>
              <div className="flex flex-col gap-2">
                {features[1].bullets.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-white/90">
                    <CheckCircle size={14} className="text-white" /> {b}
                  </div>
                ))}
              </div>
              <div className="hidden sm:block mt-8 text-4xl font-black text-white/20 absolute -bottom-2 -right-2">
                {features[1].stat.split(' ')[1]}
              </div>
            </div>

            {/* CARD 3 — Resume Builder */}
            <div className="md:col-span-1 lg:col-span-4 bg-[rgba(100,74,64,0.06)] border border-[rgba(100,74,64,0.12)] rounded-[20px] p-7 min-h-auto md:min-h-[260px]">
               <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[var(--card)] shadow-sm">
                  <FileText size={18} className="text-[var(--primary)]" />
               </div>
               <h3 className="text-lg font-black text-[var(--foreground)] mb-2">{features[2].title}</h3>
               <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-4">{features[2].desc}</p>
               <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">{features[2].stat}</div>
            </div>

            {/* CARD 4 — Job Matcher */}
            <div className="md:col-span-1 lg:col-span-4 bg-[var(--card)] border border-[var(--border)] rounded-[20px] p-7 min-h-auto md:min-h-[260px]">
               <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[rgba(100,74,64,0.1)]">
                  <Briefcase size={18} className="text-[var(--primary)]" />
               </div>
               <h3 className="text-lg font-black text-[var(--foreground)] mb-2">{features[3].title}</h3>
               <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-4">{features[3].desc}</p>
               <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">{features[3].stat}</div>
            </div>

            {/* CARD 5 — Mock Interviews */}
            <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-[rgba(100,74,64,0.08)] to-[rgba(100,74,64,0.03)] border border-[rgba(100,74,64,0.12)] rounded-[20px] p-7 min-h-auto md:min-h-[260px]">
               <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-[var(--card)] shadow-sm">
                  <MessageSquare size={18} className="text-[var(--primary)]" />
               </div>
               <h3 className="text-lg font-black text-[var(--foreground)] mb-2">{features[4].title}</h3>
               <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-4">{features[4].desc}</p>
               <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">{features[4].stat}</div>
            </div>

            {/* CARD 6 — Career Analytics (Wide) */}
            <div className="md:col-span-2 lg:col-span-12 group bg-[var(--card)] border border-[var(--border)] rounded-[20px] p-[clamp(24px,5vw,40px)] min-h-auto md:min-h-[200px]">
               <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-[rgba(100,74,64,0.1)]">
                        <BarChart3 size={22} className="text-[var(--primary)]" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)]">{features[5].title}</h3>
                    </div>
                    <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{features[5].desc}</p>
                 </div>
                 <div className="flex flex-wrap gap-6 items-center w-full lg:w-auto">
                    <div className="flex flex-col gap-2">
                      {features[5].bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
                          <CheckCircle size={14} className="text-emerald-500" /> {b}
                        </div>
                      ))}
                    </div>
                    <div className="hidden lg:block h-12 w-[1px] bg-[var(--border)]" />
                    <div className="text-center sm:text-left">
                       <div className="text-[10px] font-black text-[var(--muted-foreground)] uppercase mb-1">Impact</div>
                       <div className="text-xl font-black text-[var(--foreground)]">{features[5].stat.split(' ')[0]}</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — UPGRADE 3 (Responsive) */}
        <section id="testimonials" className="py-20 md:py-[120px] px-4 bg-white/40 border-y border-[var(--border)]">
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight mb-4 text-[var(--foreground)]">
                Trusted by <span className="text-[var(--primary)]">Ambitious</span> Professionals
              </h2>
              <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] text-[var(--muted-foreground)] max-w-lg mx-auto leading-relaxed font-medium">
                Join 10,000+ users who have transformed their career search with AI.
              </p>
            </div>
            
            <div className="flex md:grid flex-nowrap md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scroll-x-mobile pb-8">
              {testimonials.map((t) => (
                <div key={t.name} className="card w-[85vw] sm:w-[60vw] md:w-auto shrink-0 snap-center flex flex-col gap-4 relative overflow-hidden p-7 transition-all duration-250 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
                  {/* Top decorative quote mark */}
                  <div className="absolute top-4 right-5 text-6xl leading-none font-serif font-black text-[rgba(100,74,64,0.05)] pointer-events-none">
                    "
                  </div>

                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--foreground)] font-medium italic leading-relaxed text-sm">"{t.text}"</p>
                  
                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-[var(--border)]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[rgba(100,74,64,0.15)] text-[var(--primary)]">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[var(--foreground)] text-sm leading-tight">{t.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[var(--muted-foreground)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION — UPGRADE 5 (Responsive) */}
        <section className="py-16 md:py-[140px] px-4 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(100,74,64,0.07)_0%,transparent_70%)] pointer-events-none" />

          {/* Decorative rings */}
          <div className="hidden xs:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(300px,60vw,600px)] h-[clamp(300px,60vw,600px)] rounded-full border border-[rgba(100,74,64,0.06)] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-black text-[var(--foreground)] mb-6 tracking-tight leading-[1.1]">
              Ready to Build Your <br />
              <span className="text-[var(--primary)]">Professional Future?</span>
            </h2>
            <p className="text-[clamp(1rem,2vw,1.2rem)] text-[var(--muted-foreground)] max-w-lg mx-auto mb-12 leading-relaxed font-medium">
              Take the first step today. It only takes 30 seconds to upload your resume and see where you stand.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center px-4">
               <Link to="/register" className="btn-primary w-full sm:w-auto text-lg md:text-xl py-4 md:py-5 px-12 inline-flex items-center justify-center gap-3 shadow-2xl shadow-[var(--primary)]/30 transition-transform hover:scale-105 active:scale-95 rounded-xl">
                  Get Started Now <Rocket size={22} />
               </Link>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center gap-3">
               <Shield size={18} /> Data is Encrypted & Private
            </p>
          </div>
        </section>

        {/* Footer (Responsive) */}
        <footer className="border-t border-[var(--border)] pt-16 pb-8 md:pt-20 md:pb-10 px-4 bg-gradient-to-b from-transparent to-[var(--muted)]/50 text-[var(--muted-foreground)]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-16 md:mb-20">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative group/logo">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover/logo:scale-110 bg-[var(--primary)]">
                    <LogoIcon size={24} className="text-[var(--primary-foreground)]" />
                  </div>
                </div>
                <span className="font-black text-2xl tracking-tighter text-[var(--foreground)] flex items-baseline">
                  Resume<span className="text-[var(--primary)] italic font-black text-[26px] px-[1px]">X</span>pert<span className="text-[var(--muted-foreground)] font-semibold text-[14px] ml-1">AI</span>
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] font-medium leading-relaxed">
                Empowering job seekers with enterprise-grade AI tools to accelerate their career growth and land dream roles.
              </p>
            </div>
            
            {/* Accordion-style on mobile using <details> */}
            <details className="group md:hidden border-b border-[var(--border)] pb-2" open>
              <summary className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest flex items-center justify-between cursor-pointer list-none py-2 touch-target">
                Product
                <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
              </summary>
              <ul className="space-y-3 mt-4 mb-2 text-sm font-medium text-[var(--muted-foreground)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">ATS Analyzer</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">Resume Builder</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">Job Finder</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">Interview Prep</a></li>
              </ul>
            </details>
            <div className="hidden md:block">
              <h4 className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">ATS Analyzer</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Resume Builder</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Job Finder</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Interview Prep</a></li>
              </ul>
            </div>

            <details className="group md:hidden border-b border-[var(--border)] pb-2">
              <summary className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest flex items-center justify-between cursor-pointer list-none py-2 touch-target">
                Company
                <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
              </summary>
              <ul className="space-y-3 mt-4 mb-2 text-sm font-medium text-[var(--muted-foreground)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">About Us</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors py-1 block">Contact Support</a></li>
              </ul>
            </details>
            <div className="hidden md:block">
              <h4 className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Contact Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest mb-4 md:mb-6 mt-4 md:mt-0">Trust</h4>
              <ul className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
                <li className="flex items-center gap-2"><Globe size={18} /> Available Worldwide</li>
                <li className="flex items-center gap-2"><Shield size={18} /> SOC2 Compliant</li>
                <li className="flex items-center gap-2"><Zap size={18} /> Real-time Sync</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-center md:text-left">
              © 2025 ResumeXpert AI. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6">
               {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                 <a key={social} href="#" className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] uppercase tracking-widest transition-colors touch-target py-1">{social}</a>
               ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
