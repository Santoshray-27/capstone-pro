/**
 * Layout Component
 * Main app shell with sidebar and top navigation
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Upload, Brain, FileText, Briefcase,
  MessageSquare, User, LogOut, Menu, X, Star, Users,
<<<<<<< HEAD
  ChevronRight, Bell, Search, Shield, Crosshair
=======
  ChevronRight, Bell, Search
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Upload Resume', icon: Upload, path: '/upload' },
  { label: 'Analysis', icon: Brain, path: '/analysis' },
<<<<<<< HEAD
  { label: 'Resume Screening', icon: Shield, path: '/screening' },
  { label: 'Skill Gap Analyzer', icon: Crosshair, path: '/skill-gap' },
=======
>>>>>>> c93f3bf6b7e410f6c3efdff9c53ce3ba77b7c3a2
  { label: 'Resume Builder', icon: FileText, path: '/builder' },
  { label: 'Job Matches', icon: Briefcase, path: '/jobs' },
  { label: 'Interview Prep', icon: MessageSquare, path: '/interview' },
  { label: 'Feedback', icon: Star, path: '/feedback' },
];

const recruiterItems = [
  { label: 'Recruiter Hub', icon: Users, path: '/recruiter' },
];

const Layout = ({ children }) => {
  const { user, logout, isRecruiter } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ item }) => (
    <Link
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
    >
      <item.icon size={20} />
      <span>{item.label}</span>
      {isActive(item.path) && <ChevronRight size={16} className="ml-auto opacity-70" />}
    </Link>
  );

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">Smart Resume</p>
            <p className="text-blue-600 font-semibold text-xs">AI Analyzer</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}

        {isRecruiter && (
          <>
            <div className="border-t border-gray-100 my-3" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-3">
              Recruiter
            </p>
            {recruiterItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Job Seeker'}</p>
          </div>
          <User size={16} className="text-gray-400" />
        </Link>
        <button
          onClick={logout}
          className="mt-2 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 z-50 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Page title based on route */}
            <h1 className="font-semibold text-gray-900 text-lg">
              {navItems.find(n => n.path === location.pathname)?.label || 
               recruiterItems.find(n => n.path === location.pathname)?.label ||
               (location.pathname === '/profile' ? 'Profile' : 'Dashboard')}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell (cosmetic) */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            </button>
            {/* Avatar */}
            <Link to="/profile" className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
