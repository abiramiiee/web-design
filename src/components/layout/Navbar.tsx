import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Compass,
  LayoutDashboard,
  Box,
  Sprout,
  GitBranch,
  Activity,
  Award,
  Image,
  Mic,
  Moon,
  Sun,
  Contrast,
  HelpCircle,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useData, AppView } from '../../context/DataContext';

export const Navbar: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { theme, openThemeStudio, toggleDarkMode } = useTheme();
  const { mode, toggleMode, highContrast, toggleHighContrast, openOnboarding } = useAccessibility();
  const { currentView, setCurrentView, openAiModal } = useData();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { view: 'board-editor', label: 'Dream Boards', icon: <Compass className="w-4 h-4" /> },
    { view: 'rooms', label: '3D Clay Rooms', icon: <Box className="w-4 h-4" /> },
    { view: 'garden', label: 'Dream Garden', icon: <Sprout className="w-4 h-4" /> },
    { view: 'dependencies', label: 'Dependency Map', icon: <GitBranch className="w-4 h-4" /> },
    { view: 'drift', label: 'Drift Detector', icon: <Activity className="w-4 h-4" /> },
    { view: 'memories', label: 'Memory Wall', icon: <Image className="w-4 h-4" /> },
    { view: 'achievements', label: 'Trophies', icon: <Award className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 md:px-6 py-2.5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5 rounded-2xl md:rounded-3xl clay-card backdrop-blur-md bg-white/85 dark:bg-slate-900/85">
        
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 group text-left cursor-pointer"
          title="DreamBoard AI Home"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 text-white shadow-md group-hover:scale-105 transition-transform">
            🎨
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                DreamBoard AI
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                Clay 3D
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Dream It • Design It • Grow Into It
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & User */}
        <div className="flex items-center gap-2">
          
          {/* Quick AI Action Converter Button */}
          <button
            onClick={() => openAiModal()}
            className="clay-button-primary px-3 py-1.5 text-xs flex items-center gap-1.5 font-bold shadow-md cursor-pointer"
            title="Convert Dream to Action with Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Planner</span>
            <Mic className="w-3 h-3 opacity-90" />
          </button>

          {/* Theme Studio Button */}
          <button
            onClick={openThemeStudio}
            className="clay-button-secondary p-2 text-xs flex items-center gap-1.5 cursor-pointer"
            title="Open 3D Theme Studio"
          >
            <Palette className="w-4 h-4 text-pink-500" />
            <span
              className="w-3 h-3 rounded-full border border-white/80 shadow-inner hidden md:inline-block"
              style={{ backgroundColor: theme.primary }}
            />
          </button>

          {/* Accessibility Mode Toggle: Simple vs Advanced */}
          <button
            onClick={toggleMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 border cursor-pointer ${
              mode === 'simple'
                ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title="Toggle Simple Friendly Mode vs Advanced Creator Mode"
          >
            <span className="text-xs">{mode === 'simple' ? '🧸 Simple' : '⚡ Pro'}</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            title="Toggle Light / Dark Clay Atmosphere"
          >
            {theme.isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            className={`p-2 rounded-xl transition cursor-pointer ${
              highContrast ? 'bg-black text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Toggle High Contrast Mode"
          >
            <Contrast className="w-4 h-4" />
          </button>

          {/* Onboarding Tutorial */}
          <button
            onClick={openOnboarding}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer hidden md:block"
            title="Guided Dream Tour"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile or Guest Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-sm shadow-inner">
                  {user.avatar || '✨'}
                </div>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 p-3 rounded-2xl clay-card bg-white dark:bg-slate-900 shadow-xl border border-purple-100 dark:border-purple-900 z-50 animate-fade-in">
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-lg">
                      {user.avatar}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs truncate text-gray-800 dark:text-gray-100">{user.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 text-gray-600 dark:text-gray-300">
                      <span>Active Streak:</span>
                      <span className="font-bold text-orange-500">🔥 {user.currentStreak} Days</span>
                    </div>
                    <div className="flex justify-between py-1 text-gray-600 dark:text-gray-300">
                      <span>Dream XP:</span>
                      <span className="font-bold text-purple-600">{user.xpPoints} XP</span>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="clay-button-secondary px-3 py-1.5 text-xs font-bold cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl clay-card bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 shadow-2xl animate-fade-in space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
