/**
 * Layout Component — Premium Enterprise Redesign
 * Sidebar: Grouped nav, left-border accent active state, user pill
 * Header: Breadcrumb, search, notifications, avatar
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Upload, Brain, FileText, Briefcase,
  MessageSquare, LogOut, Menu, X, Star, Users,
  Shield, Crosshair, Bell, Search, ChevronRight,
  BarChart3, Settings2, Sparkles, UserSearch, Cpu
} from 'lucide-react';
import LogoIcon from './LogoIcon';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { label: 'Upload Resume', icon: Upload, path: '/upload' },
      { label: 'Analysis', icon: BarChart3, path: '/analysis' },
    ]
  },
  {
    label: 'Tools',
    items: [
      { label: 'Resume Screening', icon: Shield, path: '/screening' },
      { label: 'Skill Gap Analyzer', icon: Crosshair, path: '/skill-gap' },
      { label: 'Resume Builder', icon: FileText, path: '/builder' },
      { label: 'Job Finder', icon: Briefcase, path: '/jobs' },
      { label: 'Interview Prep', icon: MessageSquare, path: '/interview' },
    ]
  },
  {
    label: '',
    items: [
      { label: 'Feedback', icon: Star, path: '/feedback' },
    ]
  }
];

const allNavItems = [
  ...navGroups.flatMap(g => g.items)
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const currentPage = allNavItems.find(n => n.path === location.pathname);
  const pageLabel = currentPage?.label || (location.pathname === '/profile' ? 'Profile' : 'Home');

  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      onClick={() => setIsMobileMenuOpen(false)}
      className={`sidebar-link touch-target ${isActive(item.path) ? 'sidebar-link-active' : ''}`}
      aria-current={isActive(item.path) ? 'page' : undefined}
    >
      <item.icon size={20} className="shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );

  return (
    <div 
      className="grid h-screen overflow-hidden grid-cols-1 lg:grid-cols-[var(--sidebar-width)_1fr] transition-all duration-300 ease-in-out" 
      style={{ background: 'var(--background)', '--sidebar-width': '264px' }}
    >
      
      {/* 1. Mobile Overlay — show only when sidebar open on mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.50)',
            zIndex: 45,
            backdropFilter: 'blur(2px)',
          }}
          className="lg:hidden"
        />
      )}

      {/* 2. Sidebar Container */}
      <aside 
        style={{
          background: 'var(--sidebar)', 
          borderRight: '1px solid var(--sidebar-border)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease',
        }}
        className={`
          flex flex-col z-50 w-[var(--sidebar-width)]
          fixed inset-y-0 left-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:top-0 lg:col-start-1 lg:h-screen lg:translate-x-0 lg:overflow-y-auto
        `}
        aria-modal="true"
        role="dialog"
      >
        {/* Logo */}
        <div className="px-5 py-6 bg-gradient-to-r from-[rgba(110,86,207,0.06)] to-transparent" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
          <Link to="/dashboard" className="flex items-center gap-3 group touch-target">
            <div className="relative group/logo">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover/logo:scale-110" 
                   style={{ backgroundColor: 'var(--primary)' }}>
                <LogoIcon size={18} className="text-white" />
              </div>
            </div>
            <span className="text-[17px] font-black tracking-tighter leading-none flex items-baseline" style={{ color: 'var(--foreground)' }}>
              Resume<span style={{ color: 'var(--primary)', fontStyle: 'italic', fontWeight: 900, fontSize: '18px', padding: '0 1px' }}>X</span>pert<span style={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '11px', marginLeft: '3px' }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
          {navGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest"
                   style={{ color: 'var(--muted-foreground)' }}>
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavLink key={item.path} item={item} />
                ))}
              </div>
              {gi < navGroups.length - 1 && group.label && (
                <div className="mt-4" style={{ borderTop: '1px solid var(--sidebar-border)' }} />
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Pill */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer group"
               style={{ background: 'transparent' }}
               onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-accent)'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0 touch-target">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0"
                   style={{ backgroundColor: 'var(--primary)' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                  {user?.name || 'User'}
                </p>
                <p className="text-[11px] capitalize" style={{ color: 'var(--muted-foreground)' }}>
                  {user?.role || 'Job Seeker'}
                </p>
              </div>
            </Link>
            <button
              onClick={logout}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 rounded-lg transition-colors shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-[0.97] touch-target"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Main content */}
      <div className="flex flex-col overflow-hidden lg:col-start-2 min-w-0">
        {/* ─── Top Header ─── */}
        <header
          className="h-14 shrink-0 sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] shadow-[0_1px_0_rgba(0,0,0,0.05)] w-full safe-top"
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-3 text-sm">
              {/* Mobile: Logo */}
              <div className="lg:hidden flex items-center">
                <Link to="/dashboard" className="flex items-center gap-2 touch-target">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-md bg-[var(--primary)]">
                    <LogoIcon size={16} className="text-[var(--primary-foreground)]" />
                  </div>
                  <span className="text-[15px] font-black tracking-tighter leading-none flex items-baseline text-[var(--foreground)]">
                    Resume<span className="text-[var(--primary)] italic font-black text-[16px] px-[1px]">X</span>pert
                  </span>
                </Link>
              </div>

              {/* Desktop: Breadcrumb */}
              <div className="hidden lg:flex items-center gap-1.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span>Home</span>
                <ChevronRight size={16} className="opacity-60" />
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                  {pageLabel}
                </span>
              </div>
            </div>

            {/* Right: Search + Bell + Avatar + Mobile Toggle */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search button — hide on small screens */}
              <div className="hidden md:flex">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors hover:bg-accent transition-all duration-200 active:scale-[0.97] hover:-translate-y-px"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                  aria-label="Search (Ctrl+K)"
                >
                  <Search size={20} />
                  <span>Search...</span>
                  <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono rounded border"
                       style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}>
                    ⌘K
                  </kbd>
                </button>
              </div>

              {/* Notification Bell */}
              <button
                className="hidden sm:flex relative p-2 rounded-lg transition-colors hover:bg-accent transition-all duration-200 active:scale-[0.97] hover:-translate-y-px touch-target"
                style={{ color: 'var(--muted-foreground)' }}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span
                  className="absolute top-2 right-2 w-2 h-2 rounded-full border-2"
                  style={{
                    backgroundColor: 'var(--primary)',
                    borderColor: 'var(--background)'
                  }}
                />
              </button>

              {/* Avatar */}
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm ring-2"
                style={{
                  backgroundColor: 'var(--primary)',
                  ringColor: 'var(--background)'
                }}
                aria-label="Go to profile"
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Link>

              {/* Mobile Toggle (Hamburger) */}
              <button
                className="lg:hidden p-2 ml-1 rounded-lg transition-colors hover:bg-accent transition-all duration-200 active:scale-[0.97] flex items-center justify-center touch-target"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--foreground)',
                }}
                aria-label="Toggle sidebar"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </header>

        {/* ─── Page Content ─── */}
        <main className="flex-1 overflow-y-auto min-h-screen page-wrapper">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
