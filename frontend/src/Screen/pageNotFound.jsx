import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cat, Home, ArrowLeft, Terminal } from 'lucide-react';

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-main text-body-custom font-sans flex flex-col justify-between p-6 relative overflow-hidden selection:bg-pulse-cyan/20 selection:text-pulse-cyan">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pulse-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pulse-violet/10 rounded-full blur-3xl" />
      </div>

      {/* Header Logo */}
      <header className="relative z-10 flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
        <div className="p-1.5 rounded-xl border border-slate text-heading">
          <Cat className="w-5 h-5" />
        </div>
        <span className="font-extrabold text-lg tracking-tight text-heading">
          TOM
        </span>
      </header>
      <main className="relative z-10 max-w-lg mx-auto w-full text-center space-y-6 my-auto">
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-heading">
            40<span className="text-pulse-cyan">4</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-heading">
            YOU LOST?
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 bg-surface hover:bg-slate-800 text-body-custom border border-slate text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 text-main text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center sm:text-right">
        <p className="font-mono text-[10px] text-subheading">
          COMSATS University Islamabad, Abbottabad Campus
        </p>
      </footer>
    </div>
  );
}

export default PageNotFound;