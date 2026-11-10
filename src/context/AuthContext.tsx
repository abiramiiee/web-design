import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  loginGuestDemo: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'dreamboard_ai_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn('Could not save user to storage:', e);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    // Simulate real auth validation
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      name: email.split('@')[0] || 'Dreamer',
      avatar: '🌟',
      bio: 'Ready to dream big and craft my miniature universe!',
      preferredTheme: 'clay-dream-world',
      mode: 'advanced',
      dreamsCount: 3,
      completedCount: 1,
      currentStreak: 5,
      xpPoints: 1200,
      isGuest: false,
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signup = async (name: string, email: string, _pass: string): Promise<boolean> => {
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      email,
      name: name.trim() || 'New Dreamer',
      avatar: '🎨',
      bio: 'New Dreamer designing my life path step by step.',
      preferredTheme: 'clay-dream-world',
      mode: 'advanced',
      dreamsCount: 1,
      completedCount: 0,
      currentStreak: 1,
      xpPoints: 300,
      isGuest: false,
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginGuestDemo = () => {
    setUser({
      ...INITIAL_USER,
      id: 'guest_' + Date.now(),
      name: 'Guest Explorer',
      avatar: '🚀',
      isGuest: true,
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        signup,
        loginGuestDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
