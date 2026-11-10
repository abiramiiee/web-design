import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, ThemeId } from '../types';
import { BUILT_IN_THEMES } from '../data/themes';

interface ThemeContextType {
  theme: ThemeConfig;
  previewTheme: ThemeConfig | null;
  setThemeById: (id: ThemeId) => void;
  setPreview: (theme: ThemeConfig | null) => void;
  applyPreview: () => void;
  updateCustomColors: (colors: Partial<ThemeConfig>) => void;
  setFontFamily: (font: ThemeConfig['fontFamily']) => void;
  setFontSize: (size: ThemeConfig['fontSize']) => void;
  toggleDarkMode: () => void;
  setAnimationIntensity: (intensity: ThemeConfig['animationIntensity']) => void;
  resetToDefault: () => void;
  isThemeStudioOpen: boolean;
  openThemeStudio: () => void;
  closeThemeStudio: () => void;
  getBoardTheme: (boardThemeId?: ThemeId) => ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'dreamboard_ai_active_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading stored theme:', e);
    }
    return BUILT_IN_THEMES['clay-dream-world'];
  });

  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = useState(false);

  const activeTheme = previewTheme || theme;

  // Sync theme variables to CSS root
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--bg-main', activeTheme.bgMain);
    root.style.setProperty('--bg-surface', activeTheme.bgSurface);
    root.style.setProperty('--bg-card', activeTheme.bgCard);
    root.style.setProperty('--primary', activeTheme.primary);
    root.style.setProperty('--primary-text', activeTheme.primaryText);
    root.style.setProperty('--secondary', activeTheme.secondary);
    root.style.setProperty('--accent', activeTheme.accent);
    root.style.setProperty('--clay-shadow-light', activeTheme.clayShadowLight);
    root.style.setProperty('--clay-shadow-dark', activeTheme.clayShadowDark);
    root.style.setProperty('--clay-inset', activeTheme.clayInset);
    root.style.setProperty('--clay-border', activeTheme.clayBorder);
    root.style.setProperty('--text-primary', activeTheme.textPrimary);
    root.style.setProperty('--text-secondary', activeTheme.textSecondary);
    root.style.setProperty('--text-muted', activeTheme.textMuted);
    root.style.setProperty('--font-app', `'${activeTheme.fontFamily}', sans-serif`);

    // Font size scaling
    let rootFontSize = '16px';
    if (activeTheme.fontSize === 'small') rootFontSize = '14px';
    if (activeTheme.fontSize === 'large') rootFontSize = '18px';
    if (activeTheme.fontSize === 'xlarge') rootFontSize = '20px';
    root.style.fontSize = rootFontSize;

    // Dark class
    if (activeTheme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save active theme (non-preview)
    if (!previewTheme) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
      } catch (err) {
        console.warn('Could not save theme:', err);
      }
    }
  }, [activeTheme, previewTheme, theme]);

  const setThemeById = (id: ThemeId) => {
    if (BUILT_IN_THEMES[id]) {
      setTheme({ ...BUILT_IN_THEMES[id] });
    }
  };

  const setPreview = (preview: ThemeConfig | null) => {
    setPreviewTheme(preview);
  };

  const applyPreview = () => {
    if (previewTheme) {
      setTheme(previewTheme);
      setPreviewTheme(null);
    }
  };

  const updateCustomColors = (colors: Partial<ThemeConfig>) => {
    setTheme((prev) => ({
      ...prev,
      ...colors,
      id: 'custom',
      name: 'Custom Clay Studio',
    }));
  };

  const setFontFamily = (fontFamily: ThemeConfig['fontFamily']) => {
    setTheme((prev) => ({ ...prev, fontFamily }));
  };

  const setFontSize = (fontSize: ThemeConfig['fontSize']) => {
    setTheme((prev) => ({ ...prev, fontSize }));
  };

  const toggleDarkMode = () => {
    setTheme((prev) => {
      const nextDark = !prev.isDark;
      if (nextDark) {
        return {
          ...prev,
          isDark: true,
          bgMain: '#13111C',
          bgSurface: '#1D1A2B',
          bgCard: '#252136',
          textPrimary: '#F1EEF7',
          textSecondary: '#C4B9DC',
          clayShadowLight: 'rgba(60, 50, 85, 0.45)',
          clayShadowDark: 'rgba(0, 0, 0, 0.65)',
        };
      } else {
        return {
          ...prev,
          isDark: false,
          bgMain: '#FBF7F4',
          bgSurface: '#F3E8FA',
          bgCard: '#FFFFFF',
          textPrimary: '#2E2238',
          textSecondary: '#6B5B7B',
          clayShadowLight: 'rgba(255, 255, 255, 0.95)',
          clayShadowDark: 'rgba(190, 160, 205, 0.28)',
        };
      }
    });
  };

  const setAnimationIntensity = (animationIntensity: ThemeConfig['animationIntensity']) => {
    setTheme((prev) => ({ ...prev, animationIntensity }));
  };

  const resetToDefault = () => {
    setTheme(BUILT_IN_THEMES['clay-dream-world']);
    setPreviewTheme(null);
  };

  const getBoardTheme = (boardThemeId?: ThemeId): ThemeConfig => {
    if (boardThemeId && BUILT_IN_THEMES[boardThemeId]) {
      return BUILT_IN_THEMES[boardThemeId];
    }
    return activeTheme;
  };

  return (
    <ThemeContext.Provider
      value={{
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
        openThemeStudio: () => setIsThemeStudioOpen(true),
        closeThemeStudio: () => {
          setPreviewTheme(null);
          setIsThemeStudioOpen(false);
        },
        getBoardTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
