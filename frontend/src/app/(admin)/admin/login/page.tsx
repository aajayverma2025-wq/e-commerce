"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/userSlice';
import { ShieldAlert, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { adminCredentials, user, isAuthenticated } = useAppSelector(state => state.user);
  
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect to admin page
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, user, router]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Get expected credentials from Redux, fallback to defaults
    const expectedUser = adminCredentials?.username || 'admin';
    const expectedPass = adminCredentials?.password || 'admin123';

    setTimeout(() => {
      if (usernameInput === expectedUser && passwordInput === expectedPass) {
        dispatch(login({
          email: 'admin@megamart.com',
          name: 'Super Admin',
          role: 'admin'
        }));
        router.push('/admin');
      } else {
        setError('Invalid User ID or Password. Access denied.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl">
          {/* Logo Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
              <ShieldAlert className="text-white" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">Super Admin Access</h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">Authorized Personnel Only</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 rounded-2xl p-4 flex items-start gap-3 mb-6 text-red-400 text-xs animate-shake">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Failed</p>
                <p className="opacity-90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLoginSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">User ID</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#1f2937]/50 border border-gray-800 focus:border-orange-500/50 rounded-2xl py-3.5 pl-11 pr-4 text-white text-sm placeholder-gray-500 outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
                />
                <User size={18} className="text-gray-500 absolute left-4 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#1f2937]/50 border border-gray-800 focus:border-orange-500/50 rounded-2xl py-3.5 pl-11 pr-11 text-white text-sm placeholder-gray-500 outline-none transition-all focus:ring-4 focus:ring-orange-500/10"
                />
                <Lock size={18} className="text-gray-500 absolute left-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 absolute right-4 top-3.5 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 mt-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify Credentials
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <a href="/" className="text-xs font-bold text-gray-500 hover:text-orange-400 transition-colors uppercase tracking-widest">
              Back to Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
