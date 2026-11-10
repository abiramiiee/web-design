import React, { useState } from 'react';
import {
  Palette,
  X,
  Check,
  RotateCcw,
  Sun,
  Moon,
  Sparkles,
  Eye,
  Type,
  Maximize2,
  Sliders,
  Save,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { BUILT_IN_THEMES } from '../../data/themes';
import { ThemeId, ThemeConfig } from '../../types';

export const ThemeStudioModal: React.FC = () => {
  const {
    theme,
    previewTheme,
    setThemeById,
    setPreview,
    applyPreview,
    updateCustomColors,
    setFontFamily,
    setFontSize,
    toggleDarkMode,
    setAnimationIntensity,
    resetToDefault,
    isThemeStudioOpen,
    closeThemeStudio,
  } = useTheme();

  const { updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'presets' | 'customize' | 'typography'>('presets');

  // Custom colors working state
  const [customPrimary, setCustomPrimary] = useState(theme.primary);
  const [customBgMain, setCustomBgMain] = useState(theme.bgMain);
  const [customSecondary, setCustomSecondary] = useState(theme.secondary);
  const [customAccent, setCustomAccent] = useState(theme.accent);

  if (!isThemeStudioOpen) return null;

  const handleSelectPreset = (id: ThemeId) => {
    setThemeById(id);
    const selected = BUILT_IN_THEMES[id];
    if (selected) {
      setCustomPrimary(selected.primary);
      setCustomBgMain(selected.bgMain);
      setCustomSecondary(selected.secondary);
      setCustomAccent(selected.accent);
    }
  };

  const handlePreviewPreset = (preset: ThemeConfig) => {
    setPreview(preset);
  };

  const handleSaveToAccount = () => {
    updateProfile({ preferredTheme: theme.id });
    closeThemeStudio();
  };

  const handleApplyCustomColors = () => {
    updateCustomColors({
      primary: customPrimary,
      bgMain: customBgMain,
      secondary: customSecondary,
      accent: customAccent,
      clayShadowDark: `${customPrimary}33`,
    });
  };

  const fontOptions: ThemeConfig['fontFamily'][] = [
    'Fredoka',
    'Plus Jakarta Sans',
    'Quicksand',
    'Outfit',
    'Inter',
  ];

  const fontSizeOptions: { id: ThemeConfig['fontSize']; label: string }[] = [
    { id: 'small', label: 'Compact' },
    { id: 'medium', label: 'Standard' },
    { id: 'large', label: 'Large (Senior friendly)' },
    { id: 'xlarge', label: 'Extra Large' },
  ];

  const animationOptions: { id: ThemeConfig['animationIntensity']; label: string }[] = [
    { id: 'subtle', label: 'Subtle' },
    { id: 'normal', label: 'Balanced' },
    { id: 'bouncy', label: 'Bouncy Clay' },
    { id: 'none', label: 'Reduced Motion' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl my-6 rounded-3xl p-6 md:p-8 clay-card bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg md:text-xl text-gray-900 dark:text-white">
                3D Clay Theme Studio
              </h2>
              <p className="text-xs text-gray-500">
                Active Theme: <strong className="text-purple-600">{theme.name}</strong> • Real-time site-wide customization
              </p>
            </div>
          </div>
          <button
            onClick={closeThemeStudio}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            8 Built-in Themes
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'customize'
                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Color Swatches & Dark Mode
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'typography'
                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Typography & Motion
          </button>
        </div>

        {/* Tab 1: 8 Built-in Themes */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500">
              Select or hover to preview any of the 8 signature clay themes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Object.values(BUILT_IN_THEMES).map((t) => {
                const isSelected = theme.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => handleSelectPreset(t.id as ThemeId)}
                    onMouseEnter={() => handlePreviewPreset(t)}
                    onMouseLeave={() => setPreview(null)}
                    className={`p-4 rounded-3xl clay-card cursor-pointer transition-all duration-200 flex items-center justify-between border-2 ${
                      isSelected
                        ? 'border-pink-500 ring-2 ring-pink-300 dark:ring-pink-800 scale-102 bg-white dark:bg-slate-800 shadow-md'
                        : 'border-transparent bg-gray-50/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Swatch circle */}
                      <div
                        className="w-12 h-12 rounded-2xl shadow-md border-2 border-white flex items-center justify-center shrink-0 relative overflow-hidden"
                        style={{ backgroundColor: t.primary }}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-white absolute bottom-1 right-1"
                          style={{ backgroundColor: t.accent }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-gray-900 dark:text-white">
                            {t.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <Check className="w-5 h-5 text-pink-500 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-purple-600">
                        Apply
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Customize Colors */}
        {activeTab === 'customize' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">
                  Primary Clay Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={customPrimary}
                    onChange={(e) => setCustomPrimary(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-700 border text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">
                  Background Backdrop Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customBgMain}
                    onChange={(e) => setCustomBgMain(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={customBgMain}
                    onChange={(e) => setCustomBgMain(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-700 border text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">
                  Secondary Soft Tint
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={customSecondary}
                    onChange={(e) => setCustomSecondary(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-700 border text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
                <label className="font-bold text-gray-700 dark:text-gray-300 block">
                  Accent Highlight Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={customAccent}
                    onChange={(e) => setCustomAccent(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-700 border text-xs"
                  />
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700">
              <div>
                <span className="font-bold text-gray-800 dark:text-white block">Light / Dark Clay Atmosphere</span>
                <span className="text-gray-500">Toggle dark clay studio mode for night sessions.</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="clay-button-secondary px-4 py-2 font-bold flex items-center gap-2"
              >
                {theme.isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-purple-600" />}
                <span>{theme.isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
              </button>
            </div>

            <button
              onClick={handleApplyCustomColors}
              className="w-full clay-button-primary py-2.5 font-bold"
            >
              Apply Custom Palette
            </button>
          </div>
        )}

        {/* Tab 3: Typography & Motion */}
        {activeTab === 'typography' && (
          <div className="space-y-4 text-xs">
            
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">
                Font Family Selection
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font}
                    onClick={() => setFontFamily(font)}
                    className={`p-3 rounded-xl border text-xs transition cursor-pointer ${
                      theme.fontFamily === font
                        ? 'bg-purple-100 dark:bg-purple-950 border-purple-500 text-purple-900 dark:text-purple-200 font-bold'
                        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-gray-600'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    <span>{font}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">
                Font Size Accessibility Scaling
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {fontSizeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFontSize(opt.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      theme.fontSize === opt.id
                        ? 'bg-pink-100 dark:bg-pink-950 border-pink-500 text-pink-700'
                        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-gray-700 space-y-2">
              <label className="font-bold text-gray-700 dark:text-gray-300 block">
                Clay Animation Intensity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {animationOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnimationIntensity(opt.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      theme.animationIntensity === opt.id
                        ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-800'
                        : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 font-bold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={closeThemeStudio}
              className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 font-bold"
            >
              Done
            </button>
            <button
              onClick={handleSaveToAccount}
              className="clay-button-primary px-5 py-2 font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save to Account</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
