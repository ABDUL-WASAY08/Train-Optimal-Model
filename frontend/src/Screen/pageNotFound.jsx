import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Cat, Home, ArrowLeft } from 'lucide-react';

function PageNotFound() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen font-sans flex flex-col justify-between p-6 relative overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: theme.glowCyan }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: theme.glowViolet }} />
      </div>

      <header className="relative z-10 flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
        <div className="p-1.5 rounded-xl" style={{ border: `1px solid ${theme.border}`, color: theme.text }}>
          <Cat className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-lg tracking-tight" style={{ color: theme.text }}>TOM</span>
      </header>

      <main className="relative z-10 max-w-lg mx-auto w-full text-center space-y-6 my-auto">
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight" style={{ color: theme.text }}>
            40<span style={{ color: theme.accent }}>4</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: theme.text }}>YOU LOST?</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: theme.subtext }} />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            style={{ backgroundColor: theme.accent, color: theme.bg }}
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </main>

      <footer className="relative z-10 text-center sm:text-right">
        <p className="font-mono text-[10px]" style={{ color: theme.subtext }}>COMSATS University Islamabad, Abbottabad Campus</p>
      </footer>
    </div>
  );
}

export default PageNotFound;
