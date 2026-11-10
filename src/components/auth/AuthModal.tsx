import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, signup, loginGuestDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      if (!email || !password) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      await login(email, password);
    } else if (mode === 'signup') {
      if (!email || !password || !name) {
        setErrorMsg('Please complete all fields.');
        return;
      }
      await signup(name, email, password);
    } else if (mode === 'forgot') {
      if (!email) {
        setErrorMsg('Please enter your registered email.');
        return;
      }
      setForgotSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 md:p-8 rounded-3xl clay-card bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900 shadow-2xl space-y-6 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-xl text-white shadow-md">
              🎨
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join DreamBoard AI' : 'Reset Password'}
              </h3>
              <p className="text-xs text-gray-500">
                {mode === 'login' ? 'Sign in to access your dream universe' : mode === 'signup' ? 'Start designing your future today' : 'We will send you a reset link'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Guest Demo Mode Button */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 border border-purple-200 dark:border-purple-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-900 dark:text-purple-300">College Expo / Guest Demo</p>
            <p className="text-[11px] text-gray-500">Instant access with rich sample boards & 3D rooms</p>
          </div>
          <button
            onClick={loginGuestDemo}
            className="clay-button-primary px-3 py-1.5 text-xs font-bold shrink-0 cursor-pointer"
          >
            Instant Demo 🚀
          </button>
        </div>

        {forgotSent ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-xs text-emerald-800 dark:text-emerald-200 space-y-2 text-center">
            <p className="font-bold">Password reset email sent!</p>
            <p>Check your inbox for instructions to restore access.</p>
            <button
              onClick={() => {
                setForgotSent(false);
                setMode('login');
              }}
              className="text-purple-600 font-bold hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Dreamer"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dreamer@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 outline-none"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-gray-100 outline-none"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-rose-500 font-semibold text-[11px]">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full clay-button-primary py-3 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Footer links */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => setMode('forgot')}
                className="hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-purple-600 hover:underline cursor-pointer"
              >
                Sign Up →
              </button>
            </>
          ) : (
            <button
              onClick={() => setMode('login')}
              className="w-full text-center font-bold text-purple-600 hover:underline cursor-pointer"
            >
              Already have an account? Sign In
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
