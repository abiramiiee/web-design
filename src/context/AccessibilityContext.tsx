import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  mode: 'simple' | 'advanced';
  setMode: (mode: 'simple' | 'advanced') => void;
  toggleMode: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  announce: (message: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const LOCAL_STORAGE_ACCESSIBILITY = 'dreamboard_ai_a11y';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<'simple' | 'advanced'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ACCESSIBILITY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.mode || 'advanced';
      }
    } catch {}
    return 'advanced';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ACCESSIBILITY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.highContrast;
      }
    } catch {}
    return false;
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ACCESSIBILITY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed.reducedMotion;
      }
    } catch {}
    return false;
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_ACCESSIBILITY,
        JSON.stringify({ mode, highContrast, reducedMotion })
      );
    } catch (e) {
      console.warn('Could not store accessibility settings:', e);
    }

    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [mode, highContrast, reducedMotion]);

  const setMode = (newMode: 'simple' | 'advanced') => {
    setModeState(newMode);
    announce(`Switched to ${newMode === 'simple' ? 'Simple Friendly Mode' : 'Advanced Creator Mode'}`);
  };

  const toggleMode = () => {
    setMode(mode === 'simple' ? 'advanced' : 'simple');
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const next = !prev;
      announce(next ? 'High contrast enabled' : 'High contrast disabled');
      return next;
    });
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      announce(next ? 'Reduced motion enabled' : 'Reduced motion disabled');
      return next;
    });
  };

  const announce = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        mode,
        setMode,
        toggleMode,
        highContrast,
        toggleHighContrast,
        reducedMotion,
        toggleReducedMotion,
        isOnboardingOpen,
        openOnboarding: () => setIsOnboardingOpen(true),
        closeOnboarding: () => setIsOnboardingOpen(false),
        announce,
      }}
    >
      {/* Hidden ARIA live region for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-live-region"
      >
        {announcement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
