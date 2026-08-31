import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Code2, User2, Cat, Loader2 } from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';

function AuthScreen() {
  const [role, setRole] = useState('developer');
  const [brole, setBrole] = useState('users');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { theme } = useTheme();

  const loginWithGithub = useAuthStore((state) => state.loginWithGithub);

  const [adminData, setAdminData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleAuth = (e) => {
    if (e) e.preventDefault();
    if (brole === 'users') {
      if (role === 'client') {
        console.log('Google Sign In clicked');
      } else {
        setIsLoggingIn(true);
        loginWithGithub();
      }
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

  const inputStyle = {
    width: "100%",
    backgroundColor: theme.input,
    color: theme.inputText,
    border: `1px solid ${theme.border}`,
    borderRadius: "8px",
    padding: "10px 16px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <nav className="flex items-center justify-between px-6 py-4 w-full" style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-1.5 rounded-xl" style={{ border: `1px solid ${theme.border}`, color: theme.text }}>
            <Cat className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: theme.text }}>TOM</span>
        </div>
        <div className="flex gap-5">
          <p
            className="cursor-pointer font-bold transition-all"
            style={{ color: brole === 'admin' ? theme.accent : theme.text, borderBottom: brole === 'admin' ? `2px solid ${theme.accent}` : 'none' }}
            onClick={() => { setBrole('admin'); setError(''); }}
          >
            Admin
          </p>
          <p
            className="cursor-pointer font-bold transition-all"
            style={{ color: brole === 'users' ? theme.accent : theme.text, borderBottom: brole === 'users' ? `2px solid ${theme.accent}` : 'none' }}
            onClick={() => { setBrole('users'); setError(''); }}
          >
            User
          </p>
        </div>
      </nav>

      {brole === "users" ? (
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full blur-3xl" style={{ backgroundColor: theme.glowCyan }} />
          </div>

          <div className="relative z-10 rounded-2xl shadow-2xl max-w-lg w-full p-8 transition-all duration-300" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
            <h1 className="text-3xl font-bold text-center mb-2" style={{ color: theme.text }}>Welcome to TOM</h1>
            <p className="text-center mb-8 text-sm" style={{ color: theme.subtext }}>Select your Profession</p>
            <div className="p-1.5 rounded-xl grid grid-cols-2 gap-2 mb-8" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
              <button
                type="button"
                onClick={() => setRole('client')}
                className="py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: role === 'client' ? theme.hover : "transparent",
                  color: role === 'client' ? theme.text : theme.subtext,
                  boxShadow: role === 'client' ? `0 0 12px ${theme.glowCyan}` : "none",
                }}
              >
                <User2 className="w-4 h-4" />
                <span>Client</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('developer')}
                className="py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: role === 'developer' ? theme.hover : "transparent",
                  color: role === 'developer' ? theme.text : theme.subtext,
                  boxShadow: role === 'developer' ? `0 0 12px ${theme.glowCyan}` : "none",
                }}
              >
                <Code2 className="w-4 h-4" />
                <span>Developer</span>
              </button>
            </div>
            <div key={role} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.accent }}>
                {role === 'client' ? <User2 className="w-8 h-8" /> : <Code2 className="w-8 h-8" />}
              </div>
              <h2 className="text-2xl font-semibold mb-2 capitalize" style={{ color: theme.text }}>{role} Account</h2>
              <p className="text-sm mb-8 leading-relaxed max-w-sm min-h-[48px]" style={{ color: theme.subtext }}>
                {role === 'client'
                  ? 'For clients who want to collaborate, review projects, and post new requirements.'
                  : 'For developers who push code to GitHub, build features, and contribute to projects.'}
              </p>
              <button
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="w-full py-3 px-6 rounded-lg font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to GitHub...</span>
                  </>
                ) : role === 'client' ? (
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
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full blur-3xl" style={{ backgroundColor: theme.glowCyan }} />
          </div>

          <div className="relative z-10 rounded-2xl shadow-2xl max-w-lg w-full p-8 transition-all duration-300" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
            <h1 className="text-3xl font-bold text-center mb-2" style={{ color: theme.text }}>Welcome Sir</h1>
            <p className="text-center mb-8 text-sm" style={{ color: theme.subtext }}>Good to see you again</p>

            <div className="p-1.5 rounded-xl mb-8" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
              <form onSubmit={handleAuth} className="p-3 w-full flex flex-col gap-4">
                {error && (
                  <div className="p-2 text-xs rounded text-center" style={{ color: theme.error, backgroundColor: `${theme.error}15` }}>
                    {error}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label htmlFor="admin-email" className="text-sm font-medium w-24 shrink-0" style={{ color: theme.text }}>Email:</label>
                  <input type="email" id="admin-email" name="email" value={adminData.email} onChange={handleInputChange} placeholder="admin@example.com" required style={inputStyle} />
                </div>
                <div className="flex items-center gap-4">
                  <label htmlFor="admin-password" className="text-sm font-medium w-24 shrink-0" style={{ color: theme.text }}>Password:</label>
                  <input type="password" id="admin-password" name="password" value={adminData.password} onChange={handleInputChange} placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;" required style={inputStyle} />
                </div>
                <button type="submit" className="w-full py-3 px-6 rounded-lg font-bold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer mt-2" style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}>
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
