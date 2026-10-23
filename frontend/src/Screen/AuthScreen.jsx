import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, User2, Cat, Sparkles, ShieldCheck, ArrowRight, Code, Mail, Lock, Terminal } from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';

function AuthScreen() {
  const [role, setRole] = useState('developer');
  const [brole, setBrole] = useState('users');

  const loginWithGithub = useAuthStore((state) => state.loginWithGithub);

  const [adminData, setAdminData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleAuth = async (e) => {
    if (e) e.preventDefault();

    if (brole === 'users') {
      if (role === 'developer') {
        await loginWithGithub('developer');
        return;
      }

      console.log(`${role} login is still dummy for now`);
      return;
    }

    console.log('Admin login is still dummy for now');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

        <div
          className="relative flex items-center gap-3 w-fit cursor-pointer group transition-transform duration-300 hover:scale-[1.02]"
          onClick={() => navigate('/')}
        >
          <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-all duration-300">
            <Cat size={20} className="text-white" />
          </span>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight">TOM</span>
            <span className="text-xs text-slate-400 border-l border-slate-700 pl-2.5 font-medium">
              Train Optimal Model
            </span>
          </div>
        </div>

        <div className="relative space-y-4 max-w-lg transition-all duration-500 transform">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider shadow-inner">
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>{brole === 'users' ? `${role} portal` : 'admin oversight'}</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight leading-[1.2]">
            {brole === 'users'
              ? 'Ship better code with repository-aware AI'
              : 'Secure platform control & telemetry'}
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
            {brole === 'users'
              ? 'Connect your repositories, execute static analysis, and publish verified portfolios that clients can fully trust.'
              : 'Monitor users, active projects, escrow payments, complaints, and system health metrics in real-time.'}
          </p>
        </div>

        <div className="relative flex items-center gap-2.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl w-fit backdrop-blur-md shadow-lg">
          <ShieldCheck size={18} className="text-indigo-400 shrink-0" />
          <span>Developer sign in is handled securely via GitHub OAuth API.</span>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div
              className="flex lg:hidden items-center gap-2.5 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <span className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
                T
              </span>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight">TOM</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-200/80 border border-slate-300/70 rounded-2xl p-1 ml-auto shadow-inner">
              <button
                type="button"
                onClick={() => { setBrole('users'); setError(''); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  brole === 'users' 
                    ? 'bg-white text-indigo-700 shadow-md scale-[1.02]' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                User Portal
              </button>
              <button
                type="button"
                onClick={() => { setBrole('admin'); setError(''); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  brole === 'admin' 
                    ? 'bg-white text-indigo-700 shadow-md scale-[1.02]' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-2xl shadow-slate-200/50 space-y-6 transition-all duration-500">
            {brole === "users" ? (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 rounded-full px-3.5 py-1 uppercase tracking-wider">
                    <span>{role} portal</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                    Welcome to TOM
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    Select your profession to proceed with authentication
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-100 border border-slate-200/80 rounded-2xl p-1.5">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      role === 'client'
                        ? 'bg-white text-indigo-700 shadow-md scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User2 className="w-4 h-4" />
                    <span>Client</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('developer')}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                      role === 'developer'
                        ? 'bg-white text-indigo-700 shadow-md scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Developer</span>
                  </button>
                </div>

                <div key={role} className="flex flex-col items-center text-center pt-2 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-md shadow-indigo-100 transform transition-transform duration-300 hover:scale-105">
                    {role === 'client' ? (
                      <User2 className="w-8 h-8" />
                    ) : (
                      <Code2 className="w-8 h-8" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 capitalize">
                      {role} Workspace
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">
                      {role === 'client'
                        ? 'For clients who want to post projects, review code scorecards, and hire vetted developers.'
                        : 'For developers who connect GitHub repos, run RAG assistance, and publish verified portfolios.'}
                    </p>
                  </div>

                  <button
                    onClick={handleAuth}
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    {role === 'client' ? <User2 size={16} /> : <Code size={16} />}
                    <span>{role === 'client' ? 'Sign in with Google' : 'Sign in with GitHub'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 rounded-full px-3.5 py-1 uppercase tracking-wider">
                    <span>administrator</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                    Admin Sign In
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    Enter your administrative credentials to manage system operations.
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {error && (
                    <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 font-medium animate-shake">
                      {error}
                    </p>
                  )}

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="admin-email" className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Mail size={13} className="text-indigo-600" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      id="admin-email"
                      name="email"
                      value={adminData.email}
                      onChange={handleInputChange}
                      placeholder="admin@example.com"
                      required
                      className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label htmlFor="admin-password" className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Lock size={13} className="text-indigo-600" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      id="admin-password"
                      name="password"
                      value={adminData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 transition-all duration-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer mt-2"
                  >
                    <span>Authenticate as Admin</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;