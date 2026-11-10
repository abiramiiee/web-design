import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Box,
  Sprout,
  GitBranch,
  Activity,
  Award,
  Palette,
  CheckCircle2,
  Mic,
  Camera,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { LandingHero3D } from './LandingHero3D';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BUILT_IN_THEMES } from '../../data/themes';
import { DreamCategory, ThemeId } from '../../types';

export const LandingPage: React.FC = () => {
  const { setCurrentView, openAiModal } = useData();
  const { setThemeById, openThemeStudio } = useTheme();

  const categories: { title: DreamCategory; icon: string; desc: string; color: string }[] = [
    { title: 'Career', icon: '💼', desc: 'Accelerate tech milestones, build studios, and launch products.', color: 'from-amber-400 to-orange-400' },
    { title: 'Education', icon: '🎓', desc: 'Degrees, certifications, languages, and deep reading habits.', color: 'from-blue-400 to-indigo-400' },
    { title: 'Travel', icon: '✈️', desc: 'Cultural retreats, expeditions, sanctuaries, and wanderlust.', color: 'from-teal-400 to-cyan-400' },
    { title: 'Creativity', icon: '🎨', desc: 'Ceramics, painting, digital art, novels, and music synthesis.', color: 'from-pink-400 to-rose-400' },
    { title: 'Health & Wellness', icon: '🧘', desc: 'Marathons, morning yoga routines, nutrition, and mental peace.', color: 'from-emerald-400 to-green-500' },
    { title: 'Personal Growth', icon: '🌱', desc: 'Mindfulness rituals, daily journaling, resilience, and joy.', color: 'from-purple-400 to-violet-500' },
  ];

  const features = [
    {
      icon: <Box className="w-6 h-6 text-pink-500" />,
      title: 'Interactive 3D Clay Rooms',
      desc: 'Step into miniature isometric environments for Education, Career, Travel, and Creativity with responsive 3D objects and completed milestone trophies.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: 'AI Dream-to-Action Converter',
      desc: 'Speak or type any dream in natural language. Gemini 3.8 Flash automatically extracts milestones, estimated hours, learning paths, and alternate routes.',
    },
    {
      icon: <Sprout className="w-6 h-6 text-emerald-500" />,
      title: 'Dream Garden Growth System',
      desc: 'Watch your real achievements sprout from seeds into colorful 3D sunflowers, bonsai trees, and succulents as you conquer milestones.',
    },
    {
      icon: <GitBranch className="w-6 h-6 text-blue-500" />,
      title: 'Dream Dependency Map',
      desc: 'Connect your dreams as interactive visual nodes to see prerequisites, logical pathways, and how small habits unlock monumental breakthroughs.',
    },
    {
      icon: <Activity className="w-6 h-6 text-amber-500" />,
      title: 'Dream Drift Detector',
      desc: 'Detect discrepancies between planned dates and actual pace with gentle, non-judgmental AI diagnostics and catch-up recommendations.',
    },
    {
      icon: <Palette className="w-6 h-6 text-rose-500" />,
      title: 'Theme Studio (8 Tactile Worlds)',
      desc: 'From Clay Dream World to Candy Pop, Nature Bloom, and Midnight Creative. Switch palettes, customize fonts, and style individual dream boards.',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300 text-xs font-bold shadow-sm border border-pink-200 dark:border-pink-800">
            <span className="text-base">✨</span>
            <span>Welcome to the Next Generation of Vision Boards</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.12]">
            Your Dreams Deserve a{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              World of Their Own
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            Visualize your goals, design your future, and turn your imagination into meaningful action with tactile 3D clay rooms and AI goal planning.
          </p>

          {/* Hero CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="clay-button-primary px-7 py-3.5 text-base font-bold flex items-center gap-2.5 shadow-xl hover:shadow-2xl cursor-pointer"
            >
              <span>Create My Dream World</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="clay-button-secondary px-6 py-3.5 text-base font-bold flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Explore Features</span>
            </button>
          </div>

          {/* Quick Voice / Natural Language Prompt Pill */}
          <div className="pt-2">
            <button
              onClick={() => openAiModal('I want to build my own independent creative technology lab')}
              className="clay-card p-3 rounded-2xl flex items-center gap-3 w-full max-w-md bg-white/90 dark:bg-slate-800/90 hover:scale-[1.02] cursor-pointer text-left border border-purple-100 dark:border-purple-900"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white shadow-sm">
                <Mic className="w-4 h-4 animate-pulse" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Try AI Dream Converter
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-200 truncate">
                  "I want to build my own creative tech studio in 6 months..."
                </p>
              </div>
              <span className="text-xs font-bold text-pink-500">Transform →</span>
            </button>
          </div>

        </div>

        {/* Right 3D Interactive Miniature World */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="w-full max-w-lg rounded-3xl p-3 clay-card bg-gradient-to-br from-pink-50/50 via-purple-50/40 to-blue-50/40 dark:from-slate-900 dark:to-slate-800 relative">
            <LandingHero3D />
          </div>
        </div>

      </section>

      {/* Dream Categories Showcase */}
      <section className="w-full max-w-7xl px-4 py-12">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-pink-600 dark:text-pink-400">
            Versatile Dream Ecosystem
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Whatever You Aspire, Give It Form
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            From coding mastery to world journeys, physical endurance, and ceramic pottery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.title}
              onClick={() => {
                setCurrentView('rooms');
              }}
              className="clay-card p-6 rounded-3xl hover:-translate-y-1.5 transition-all cursor-pointer group bg-white/80 dark:bg-slate-900/80 border border-purple-50 dark:border-slate-800"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">
                    {cat.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    Explore 3D Room →
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features Showcase */}
      <section id="features-section" className="w-full max-w-7xl px-4 py-16 scroll-mt-20">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Unrivaled Experience
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Designed for Real Achievement, Not Generic Lists
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Unlike sterile spreadsheet task apps, DreamBoard AI turns vision planning into a joyful sensory adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className="clay-card p-6 rounded-3xl space-y-3 bg-white/85 dark:bg-slate-900/85 border border-purple-100/60 dark:border-purple-950"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center shadow-inner">
                {feat.icon}
              </div>
              <h4 className="font-extrabold text-base text-gray-900 dark:text-white">
                {feat.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Theme Studio Gallery Showcase */}
      <section className="w-full max-w-7xl px-4 py-12">
        <div className="clay-card p-8 rounded-3xl bg-gradient-to-r from-pink-50/70 via-purple-50/70 to-indigo-50/70 dark:from-slate-900 dark:to-slate-800 border border-purple-100 dark:border-purple-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                Full Aesthetic Agency
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                8 Built-in Clay Palettes & Custom Studio
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Click any palette below to instantly bathe the entire application in its world.
              </p>
            </div>
            <button
              onClick={openThemeStudio}
              className="clay-button-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Palette className="w-4 h-4" />
              <span>Customize in Theme Studio</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {Object.values(BUILT_IN_THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeById(t.id as ThemeId)}
                className="clay-card p-3 rounded-2xl flex flex-col items-center gap-2 text-center group cursor-pointer hover:scale-105 transition-all bg-white dark:bg-slate-800"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs"
                  style={{ backgroundColor: t.primary }}
                >
                  <span className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: t.accent }} />
                </div>
                <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                  {t.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Step-by-Step */}
      <section className="w-full max-w-7xl px-4 py-16">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            How DreamBoard AI Works
          </h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Three Steps from Aspiration to Reality
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="clay-card p-6 rounded-3xl space-y-3 bg-white/90 dark:bg-slate-900/90 text-left">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 font-extrabold text-lg flex items-center justify-center shadow-inner">
              1
            </div>
            <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Dream It (Voice or Text)
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Express your wildest ambition in natural language. Gemini 3.8 Flash automatically extracts timeline, difficulty, recommended habits, and milestones.
            </p>
          </div>

          <div className="clay-card p-6 rounded-3xl space-y-3 bg-white/90 dark:bg-slate-900/90 text-left">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-extrabold text-lg flex items-center justify-center shadow-inner">
              2
            </div>
            <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Design It (Boards & 3D Rooms)
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Arrange clay stickers, mantras, photos, and visual cards. Rotate miniature 3D clay rooms and inspect physical props tied to active goals.
            </p>
          </div>

          <div className="clay-card p-6 rounded-3xl space-y-3 bg-white/90 dark:bg-slate-900/90 text-left">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center shadow-inner">
              3
            </div>
            <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Grow Into It (Garden & Wall)
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Complete milestones to bloom plants in the Dream Garden, earn 3D clay trophies, and pin milestone reflection memories on your Memory Wall.
            </p>
          </div>
        </div>
      </section>

      {/* College Expo Showcase Banner */}
      <section className="w-full max-w-7xl px-4 py-8">
        <div className="clay-card p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
              <span>🌟</span>
              <span>Interactive Demonstration Ready</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Ready to Design Your Dream World?
            </h3>
            <p className="text-sm text-purple-100 max-w-xl">
              Experience the personalized dashboard, create custom vision boards, explore the 3D rooms, or plan your next dream with Gemini AI.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-8 py-4 rounded-2xl bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            Launch Dashboard Now →
          </button>
        </div>
      </section>

    </div>
  );
};
