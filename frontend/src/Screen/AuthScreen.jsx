import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, User2, Cat } from 'lucide-react';

function AuthScreen() {
  const [role, setRole] = useState('developer');
  const [brole, setBrole] = useState('users');

  // 1. State for Admin Form inputs and error feedback
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

  const handleAuth = (e) => {
    if (e) e.preventDefault();

    if (brole === 'users') {
      if (role === 'client') {
        console.log('Google Sign In clicked');
      } else {
        console.log('GitHub Sign In clicked');
      }
      navigate('/Main');
    } else {
      const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      if (adminData.email === envEmail && adminData.password === envPassword) {
        console.log('Admin login successful!');
        setError('');
        navigate('/Main');
      } else {
        setError('Invalid Admin Email or Password!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-main flex flex-col font-sans selection:bg-pulse-cyan/20 selection:text-pulse-cyan">

      <nav className="flex items-center justify-between px-6 py-4 bg-main border-b border-slate w-full">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="p-1.5 rounded-xl border border-slate text-heading">
            <Cat className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-heading">
            TOM
          </span>
        </div>
        <div className="flex gap-5">
          <p
            className={`cursor-pointer font-bold hover:border-b transition-all ${brole === 'admin' ? 'text-pulse-cyan border-b border-pulse-cyan' : 'text-heading'}`}
            onClick={() => { setBrole('admin'); setError(''); }}
          >
            Admin
          </p>
          <p
            className={`cursor-pointer font-bold hover:border-b transition-all ${brole === 'users' ? 'text-pulse-cyan border-b border-pulse-cyan' : 'text-heading'}`}
            onClick={() => { setBrole('users'); setError(''); }}
          >
            User
          </p>
        </div>
      </nav>

      {brole === "users" ? (
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-pulse-cyan/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 bg-surface border border-slate rounded-2xl shadow-2xl max-w-lg w-full p-8 transition-all duration-300">
            <h1 className="text-heading text-3xl font-bold text-center mb-2">
              Welcome to TOM
            </h1>
            <p className="text-subheading text-center mb-8 text-sm">
              Select your Profession
            </p>
            <div className="bg-main p-1.5 rounded-xl border border-slate grid grid-cols-2 gap-2 mb-8">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${role === 'client'
                    ? 'bg-main text-main font-semibold shadow-[0_0_12px_rgba(62,207,255,0.3)]'
                    : 'text-subheading hover:text-heading'
                  }`}
              >
                <User2 className="w-4 h-4" />
                <span>Client</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('developer')}
                className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${role === 'developer'
                    ? 'bg-main text-main font-semibold shadow-[0_0_12px_rgba(62,207,255,0.3)]'
                    : 'text-subheading hover:text-heading'
                  }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Developer</span>
              </button>
            </div>
            <div key={role} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-main border border-slate flex items-center justify-center mb-4 text-pulse-cyan">
                {role === 'client' ? (
                  <User2 className="w-8 h-8" />
                ) : (
                  <Code2 className="w-8 h-8" />
                )}
              </div>

              <h2 className="text-heading text-2xl font-semibold mb-2 capitalize">
                {role} Account
              </h2>

              <p className="text-subheading text-sm mb-8 leading-relaxed max-w-sm min-h-[48px]">
                {role === 'client'
                  ? 'For clients who want to collaborate, review projects, and post new requirements.'
                  : 'For developers who push code to GitHub, build features, and contribute to projects.'}
              </p>

              <button
                onClick={handleAuth}
                className="w-full py-3 px-6 rounded-lg font-bold text-xs bg-main hover:bg-blue-900/10 text-main flex items-center justify-center gap-3 transition-all cursor-pointer"
              >
                {role === 'client' ? (
                  <span>Sign in with Google</span>
                ) : (
                  <span>Sign in with GitHub</span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-pulse-cyan/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 bg-surface border border-slate rounded-2xl shadow-2xl max-w-lg w-full p-8 transition-all duration-300">
            <h1 className="text-heading text-3xl font-bold text-center mb-2">
              Welcome Sir
            </h1>
            <p className="text-subheading text-center mb-8 text-sm">
              Good to see you again
            </p>

            <div className="bg-main p-1.5 rounded-xl border border-slate mb-8">
              <form onSubmit={handleAuth} className="p-3 w-full flex flex-col gap-4">
                {error && (
                  <div className="p-2 text-xs text-red-400 bg-red-950/40 border border-red-500/30 rounded text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label htmlFor="admin-email" className="text-heading text-sm font-medium w-24 shrink-0">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="admin-email"
                    name="email"
                    value={adminData.email}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    required
                    className="w-full bg-transparent text-white border border-slate rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pulse-cyan transition-colors"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label htmlFor="admin-password" className="text-heading text-sm font-medium w-24 shrink-0">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="admin-password"
                    name="password"
                    value={adminData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full bg-transparent text-white border border-slate rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-pulse-cyan transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg font-bold text-xs bg-main hover:bg-blue-900/10 text-main flex items-center justify-center gap-3 transition-all cursor-pointer border border-slate mt-2"
                >
                  Sign in as Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthScreen;