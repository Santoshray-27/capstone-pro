/**
 * HomePage - Marketing landing page overhaul
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Upload, BarChart3, Briefcase, MessageSquare, 
  FileText, Star, CheckCircle, ArrowRight, Zap, 
  Shield, Globe, Layout as LayoutIcon, Sparkles,
  Search, Rocket, UserSearch, Cpu, Menu, X
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
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.85)' 
            : 'rgba(255, 255, 255, 0.40)',
          backdropFilter: isScrolled ? 'blur(24px)' : 'blur(8px)',
          WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(8px)',
          borderBottom: isScrolled 
            ? '1px solid var(--border)' 
            : '1px solid transparent',
          boxShadow: isScrolled 
            ? '0 4px 24px rgba(100, 74, 64, 0.08)' 
            : 'none',
        }}
        className="px-4 py-3"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative group/logo">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover/logo:scale-110" style={{ background: 'var(--primary)' }}>
                <LogoIcon size={24} className="text-white" />
              </div>
            </div>
            <span className="font-black text-2xl tracking-tighter text-[var(--foreground)] transition-colors flex items-baseline">
              Resume<span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', padding: '0 1px' }}>X</span>pert<span style={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '14px', marginLeft: '4px' }}>AI</span>
            </span>
          </div>
          
          {/* Desktop Nav Links — hide on mobile */}
          <div className="hidden md:flex items-center gap-8 mr-auto ml-12 h-full">
            <div className="relative group h-full flex items-center">
              <a href="#features" className="text-sm font-bold text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors flex items-center gap-1 py-4">
                Features
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </a>
              
              {/* Features Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 pt-2">
                <div className="bg-white rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden p-6 grid grid-cols-2 gap-4">
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
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/login" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-6 shadow-[var(--shadow-lg)] shadow-[var(--primary)]/20">
                Get Started Free
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-[var(--foreground)]" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[var(--border)] shadow-xl overflow-hidden animate-page-enter">
            <div className="flex flex-col p-4 gap-2">
              <a href="#features" onClick={() => setMobileNavOpen(false)} className="px-4 py-3 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-xl transition-all">Features</a>
              <a href="#testimonials" onClick={() => setMobileNavOpen(false)} className="px-4 py-3 text-sm font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)] rounded-xl transition-all">Success Stories</a>
              <div className="h-px bg-[var(--border)] my-2" />
              <Link to="/login" onClick={() => setMobileNavOpen(false)} className="px-4 py-3 text-sm font-bold text-[var(--muted-foreground)]">Sign In</Link>
              <Link to="/register" onClick={() => setMobileNavOpen(false)} className="btn-primary text-center py-3">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* CONTENT WRAPPER WITH ANIMATION */}
      <div className="page-enter">
        {/* HERO SECTION — UPGRADE 1 */}
        <section style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: 'clamp(120px, 15vh, 160px) 24px 80px',
        }}>
          {/* Background Pattern Layer */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(100, 74, 64, 0.12) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(100, 74, 64, 0.08) 0%, transparent 40%),
                              radial-gradient(circle at 60% 80%, rgba(100, 74, 64, 0.06) 0%, transparent 35%)`,
            pointerEvents: 'none',
          }} />

          {/* Dot Grid Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(100,74,64,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            pointerEvents: 'none',
            opacity: 0.5,
          }} />

          {/* Top Badge Wrapper */}
          <div className="relative z-10" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(100, 74, 64, 0.08)',
            border: '1px solid rgba(100, 74, 64, 0.20)',
            borderRadius: '999px',
            padding: '6px 16px',
            marginBottom: '32px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--primary)',
            letterSpacing: '0.03em',
          }}>
            <Sparkles size={16} />
            <span className="hidden xs:inline">Next-Gen AI Analysis Powered by ResumeXpert</span>
            <span className="xs:hidden">Powered by ResumeXpert AI</span>
          </div>

          {/* Main Headline Wrapper */}
          <h1 className="relative z-10" style={{
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 auto 24px',
            color: 'var(--foreground)'
          }}>
            Stop Guessing.{' '}
            <span style={{ color: 'var(--primary)' }}>
              Start Getting Hired.
            </span>
          </h1>

          {/* Subtext Wrapper */}
          <p className="relative z-10" style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            maxWidth: '580px',
            textAlign: 'center',
            margin: '0 auto 40px',
            lineHeight: 1.7,
            color: 'var(--muted-foreground)',
            fontWeight: 500
          }}>
            Your AI Resume Expert and Career Coach. <br className="hidden sm:block" /> Analyze. Optimize. Prepare. Get Hired.
          </p>

          {/* CTA Buttons Row Wrapper */}
          <div className="relative z-10 w-full px-4" style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '48px',
          }}>
            <Link to="/register" className="btn-primary w-full sm:w-auto text-lg py-4 px-10 flex items-center gap-2 justify-center shadow-xl shadow-[var(--primary)]/20">
              Analyze Your Resume <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary w-full sm:w-auto text-lg py-4 px-10 border-[var(--border)] bg-white hover:bg-[var(--muted)] transition-all duration-200 active:scale-[0.97] hover:-translate-y-px">
              View Demo Session
            </Link>
          </div>

          {/* Trust Badges Row Wrapper */}
          <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-4 items-center justify-center mb-16 px-4">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--muted-foreground)]"><CheckCircle size={18} className="text-emerald-500" /> No Credit Card</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--muted-foreground)]"><CheckCircle size={18} className="text-emerald-500" /> Free Analysis</span>
            <span className="hidden xs:flex items-center gap-1.5 text-sm font-semibold text-[var(--muted-foreground)]"><CheckCircle size={18} className="text-emerald-500" /> ATS Optimized</span>
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
        <section className="py-10 border-y border-[var(--border)] overflow-hidden flex opacity-85 hover:opacity-100 transition-opacity duration-500 group" style={{ background: 'var(--primary)' }}>
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] cursor-default">
            {[...Array(4)].map((_, arrayIndex) => (
              <div key={arrayIndex} className="flex shrink-0 items-center justify-around">
                 {features.map((f, i) => (
                   <div key={`${arrayIndex}-${i}`} className="flex items-center gap-4 text-[var(--primary-foreground)] font-bold text-base md:text-lg tracking-widest uppercase px-8 md:px-16">
                      <f.icon size={22} />
                      <span className="whitespace-nowrap">{f.title}</span>
                   </div>
                 ))}
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES — UPGRADE 2: BENTO GRID (Responsive) */}
        <section id="features" style={{ padding: 'clamp(60px, 8vw, 120px) 24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px md:64px' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
              color: 'var(--foreground)'
            }}>
              A Complete <span style={{ color: 'var(--primary)' }}>Career OS</span>
            </h2>
            <p style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              color: 'var(--muted-foreground)',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.65,
              fontWeight: 500
            }}>
              We've built the most comprehensive toolkit for modern job seekers, powered by state-of-the-art AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
            {/* CARD 1 — Smart Resume Parsing (Large) */}
            <div className="md:col-span-2 lg:col-span-7 group" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: 'clamp(24px, 5vw, 36px)',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
            }}>
              <div style={{
                position: 'absolute', right: '-40px', bottom: '-40px',
                width: '200px', height: '200px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(100,74,64,0.08) 0%, transparent 70%)',
              }} />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm" style={{ background: 'rgba(100, 74, 64, 0.1)' }}>
                  <Upload size={22} style={{ color: 'var(--primary)' }} />
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
                <div className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-white/80 border border-[var(--border)] text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>
                  {features[0].stat}
                </div>
              </div>
            </div>

            {/* CARD 2 — Deep ATS Scoring (Colored) */}
            <div className="md:col-span-1 lg:col-span-5 group" style={{
              background: 'var(--primary)',
              borderRadius: '20px',
              padding: 'clamp(24px, 5vw, 36px)',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '280px',
            }}>
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
              <div className="mt-8 text-4xl font-black text-white/20 absolute -bottom-2 -right-2">
                {features[1].stat.split(' ')[1]}
              </div>
            </div>

            {/* CARD 3 — Resume Builder */}
            <div className="md:col-span-1 lg:col-span-4" style={{
              background: 'rgba(100, 74, 64, 0.06)',
              border: '1px solid rgba(100, 74, 64, 0.12)',
              borderRadius: '20px',
              padding: '28px',
              minHeight: '260px',
            }}>
               <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-white shadow-sm">
                  <FileText size={18} style={{ color: 'var(--primary)' }} />
               </div>
               <h3 className="text-lg font-black text-[var(--foreground)] mb-2">{features[2].title}</h3>
               <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-4">{features[2].desc}</p>
               <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{features[2].stat}</div>
            </div>

            {/* CARD 4 — Job Matcher */}
            <div className="md:col-span-1 lg:col-span-4" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: '28px',
              minHeight: '260px',
            }}>
               <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(100,74,64,0.1)' }}>
                  <Briefcase size={18} style={{ color: 'var(--primary)' }} />
               </div>
               <h3 className="text-lg font-black text-[var(--foreground)] mb-2">{features[3].title}</h3>
               <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-4">{features[3].desc}</p>
               <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{features[3].stat}</div>
            </div>

            {/* CARD 5 — Mock Interviews */}
            <div className="md:col-span-2 lg:col-span-4" style={{
              background: 'linear-gradient(135deg, rgba(100,74,64,0.08) 0%, rgba(100,74,64,0.03) 100%)',
              border: '1px solid rgba(100,74,64,0.12)',
              borderRadius: '20px',
              padding: '28px',
              minHeight: '260px',
            }}>
               <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-white/50">
                  <MessageSquare size={18} style={{ color: 'var(--primary)' }} />
               </div>
               <h3 className="text-lg font-black text-[var(--foreground)] mb-2">{features[4].title}</h3>
               <p className="text-[var(--muted-foreground)] text-xs leading-relaxed mb-4">{features[4].desc}</p>
               <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{features[4].stat}</div>
            </div>

            {/* CARD 6 — Career Analytics (Wide) */}
            <div className="md:col-span-2 lg:col-span-12 group" style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: 'clamp(24px, 5vw, 40px)',
              minHeight: '200px',
            }}>
               <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'rgba(100,74,64,0.1)' }}>
                        <BarChart3 size={22} style={{ color: 'var(--primary)' }} />
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
        <section id="testimonials" style={{ padding: 'clamp(80px, 10vw, 120px) 24px', background: 'white/40', borderY: '1px solid var(--border)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                color: 'var(--foreground)'
              }}>
                Trusted by <span style={{ color: 'var(--primary)' }}>Ambitious</span> Professionals
              </h2>
              <p style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                color: 'var(--muted-foreground)',
                maxWidth: '520px',
                margin: '0 auto',
                lineHeight: 1.65,
                fontWeight: 500
              }}>Join 10,000+ users who have transformed their career search with AI.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="card" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '28px',
                }}>
                  {/* Top decorative quote mark */}
                  <div style={{
                    position: 'absolute', top: '16px', right: '20px',
                    fontSize: '4rem', lineHeight: 1,
                    color: 'rgba(100,74,64,0.08)',
                    fontFamily: 'Georgia, serif',
                    fontWeight: 900,
                    pointerEvents: 'none',
                  }}>
                    "
                  </div>

                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--foreground)] font-medium italic leading-relaxed text-sm">"{t.text}"</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'rgba(100,74,64,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)'
                    }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[var(--foreground)] text-sm leading-tight">{t.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--muted-foreground)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION — UPGRADE 5 (Responsive) */}
        <section style={{
          padding: 'clamp(80px, 10vw, 140px) 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(100,74,64,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Decorative rings */}
          <div className="hidden xs:block" style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(300px, 60vw, 600px)', height: 'clamp(300px, 60vw, 600px)',
            borderRadius: '50%',
            border: '1px solid rgba(100,74,64,0.06)',
            pointerEvents: 'none',
          }} />

          <div className="relative z-10">
            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              color: 'var(--foreground)',
              marginBottom: '24px',
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              Ready to Build Your <br />
              <span style={{ color: 'var(--primary)' }}>Professional Future?</span>
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--muted-foreground)',
              maxWidth: '580px',
              margin: '0 auto 48px',
              lineHeight: 1.6,
              fontWeight: 500
            }}>
              Take the first step today. It only takes 30 seconds to upload your resume and see where you stand.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center px-4">
               <Link to="/register" className="btn-primary w-full sm:w-auto text-xl py-5 px-12 inline-flex items-center gap-3 shadow-2xl shadow-[var(--primary)]/30 transition-transform hover:scale-105 active:scale-95">
                  Get Started Now <Rocket size={22} />
               </Link>
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] flex items-center justify-center gap-3">
               <Shield size={18} /> Data is Encrypted & Private
            </p>
          </div>
        </section>

        {/* Footer (Responsive) */}
        <footer className="border-t border-[var(--border)] pt-20 pb-10 px-4 bg-gradient-to-b from-transparent to-[#f4f2ff] text-[#5A6380]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative group/logo">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover/logo:scale-110" style={{ background: 'var(--primary)' }}>
                    <LogoIcon size={24} className="text-white" />
                  </div>
                </div>
                <span className="font-black text-2xl tracking-tighter text-[var(--foreground)] flex items-baseline">
                  Resume<span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 900, fontSize: '26px', padding: '0 1px' }}>X</span>pert<span style={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '14px', marginLeft: '4px' }}>AI</span>
                </span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] font-medium leading-relaxed">
                Empowering job seekers with enterprise-grade AI tools to accelerate their career growth and land dream roles.
              </p>
            </div>
            <div>
              <h4 className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">ATS Analyzer</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Resume Builder</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Job Finder</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Interview Prep</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-[var(--foreground)] uppercase text-xs tracking-widest mb-6">Trust</h4>
              <ul className="space-y-4 text-sm font-medium text-[var(--muted-foreground)]">
                <li className="flex items-center gap-2"><Globe size={18} /> Available Worldwide</li>
                <li className="flex items-center gap-2"><Shield size={18} /> SOC2 Compliant</li>
                <li className="flex items-center gap-2"><Zap size={18} /> Real-time Sync</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-[var(--border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-center md:text-left">
              © 2025 ResumeXpert AI. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6">
               {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                 <a key={social} href="#" className="text-xs font-bold text-[var(--muted-foreground)] hover:text-[var(--primary)] uppercase tracking-widest transition-colors">{social}</a>
               ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
