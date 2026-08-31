import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  GitBranch, Users, Globe, Code2, Check, Send, Cat, LogIn
} from 'lucide-react';

function SplashScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <nav className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-1.5 rounded-xl" style={{ border: `1px solid ${theme.border}`, color: theme.text }}>
            <Cat className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight" style={{ color: theme.text }}>TOM</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#pricing" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ border: `1px solid ${theme.border}`, color: theme.accent, backgroundColor: theme.card }}>
            <span>Upgrade to Pro</span>
          </a>
          <button
            onClick={() => navigate('Authorization')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}
          >
            <LogIn className="w-3.5 h-3.5" style={{ color: theme.subtext }} />
            <span>Sign In</span>
          </button>
        </div>
      </nav>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: theme.glowCyan }} />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: theme.glowViolet }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: theme.glowPurple }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-28">
        {/* Hero */}
        <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full w-fit" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}`, color: theme.accent }}>
                <span>TOM</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight" style={{ color: theme.text }}>
                Train Optimal Model
              </h1>
              <p className="text-base sm:text-lg font-medium leading-relaxed" style={{ color: theme.subtext }}>
                An ML powered GitHub Intelligence, Documentation and Developer Recruiter Marketplace Platform.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  { icon: GitBranch, text: "Make the repo to train the model" },
                  { icon: Users, text: "Make strong relations with clients and developers" },
                  { icon: Globe, text: "Sell your model in the world" },
                  { icon: Code2, text: "Enhance coding skills with RAG and Scorecards" },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md" style={{ backgroundColor: theme.card, color: theme.accent, border: `1px solid ${theme.border}` }}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <span className="text-xs font-medium" style={{ color: theme.subtext }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigate('/Authorization')}
                className="px-6 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer"
                style={{ backgroundColor: theme.card, color: theme.text, border: `1px solid ${theme.border}` }}
              >
                Explore Platform
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center hidden md:flex pointer-events-none">
            <div className="relative p-1 animate-pulse shadow-2xl">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="p-10 rounded-full" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
                  <Cat className="w-62 h-62" style={{ color: theme.text }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="space-y-8">
          <div className="text-center space-y-2 pointer-events-none">
            <h2 className="text-3xl font-extrabold" style={{ color: theme.text }}>Choose Your Tier</h2>
            <p className="text-xs" style={{ color: theme.subtext }}>Flexible options for individual developers, teams, and recruiters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic */}
            <div className="rounded-2xl p-8 flex flex-col justify-between space-y-6 transition-colors" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
              <div className="space-y-4 pointer-events-none">
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase" style={{ backgroundColor: theme.bg, color: theme.subtext, border: `1px solid ${theme.border}` }}>BASIC TIER</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold" style={{ color: theme.text }}>$0</span>
                  <span className="text-xs" style={{ color: theme.subtext }}>/ forever free</span>
                </div>
                <p className="text-xs" style={{ color: theme.subtext }}>Explore basic features and build your initial developer presence.</p>
                <ul className="space-y-3 pt-4 text-xs">
                  {[
                    { text: "See and sync public repositories", active: true },
                    { text: "Analyze repo quality and security scores", active: true },
                    { text: "Full access to personal developer portfolio", active: true },
                    { text: "Train custom AI models (LoRA/QLoRA)", active: false },
                    { text: "AI Model Marketplace seller access", active: false },
                  ].map(({ text, active }, i) => (
                    <li key={i} className="flex items-center gap-2" style={{ color: active ? theme.text : theme.subtext, textDecoration: active ? "none" : "line-through" }}>
                      <Check className="w-4 h-4 shrink-0" style={{ color: active ? theme.accent : theme.subtext }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => navigate('/Authorization')} className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer" style={{ backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}` }}>
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl p-8 flex flex-col justify-between space-y-6 relative" style={{ backgroundColor: theme.card, borderWidth: "2px", borderStyle: "solid", borderColor: theme.accent }}>
              <div>
                <div className="absolute -top-3 right-6 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider" style={{ backgroundColor: theme.accent, color: theme.bg }}>RECOMMENDED</div>
                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase" style={{ backgroundColor: theme.bg, color: theme.accent, border: `1px solid ${theme.accent}40` }}>PRO TIER</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold" style={{ color: theme.text }}>$19</span>
                    <span className="text-xs" style={{ color: theme.subtext }}>/ month</span>
                  </div>
                  <p className="text-xs" style={{ color: theme.subtext }}>Unlock full AI model training, marketplace selling, and VS Code integration.</p>
                  <ul className="space-y-3 pt-4 text-xs">
                    {[
                      "Includes everything in Basic",
                      "Train custom AI models (LoRA/QLoRA and RAG)",
                      "Sell models on the AI Model Marketplace",
                      "Private repository sync and automated .docx docs",
                      "VS Code extension inline code completion",
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-2" style={{ color: theme.text }}>
                        <Check className="w-4 h-4 shrink-0" style={{ color: theme.accent }} />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={() => navigate('/Authorization')} className="w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-colors cursor-pointer" style={{ backgroundColor: theme.accent, color: theme.bg }}>
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Contributors */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold" style={{ color: theme.text }}>Project Contributors</h2>
            <p className="text-xs" style={{ color: theme.subtext }}>The development team behind Train Optimal Model</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { initials: "AW", name: "Abdul Wasay", id: "FA23-BCS-004", accent: theme.accent },
              { initials: "AT", name: "Alishba Tanoli", id: "FA23-BCS-010", accent: theme.accentViolet },
              { initials: "AJ", name: "Aiman Jadoon", id: "FA23-BCS-008", accent: theme.accentViolet },
            ].map(({ initials, name, id, accent }, i) => (
              <div key={i} className="p-6 rounded-xl flex flex-col items-center text-center space-y-3 transition-colors" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold pointer-events-none" style={{ backgroundColor: theme.bg, color: accent, border: `1px solid ${accent}30` }}>
                  {initials}
                </div>
                <div className="pointer-events-none">
                  <p className="text-sm font-bold" style={{ color: theme.text }}>{name}</p>
                  <p className="text-[10px] font-mono" style={{ color: theme.subtext }}>{id}</p>
                  <p className="text-xs mt-1" style={{ color: accent }}>Core Developer</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div id="contact" className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 pointer-events-none">
            <h2 className="text-3xl font-extrabold" style={{ color: theme.text }}>Have Questions?</h2>
            <p className="text-xs" style={{ color: theme.subtext }}>Send us a query and our team will get back to you shortly.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="p-8 rounded-2xl space-y-4 shadow-xl" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium" style={{ color: theme.subtext }}>Your Name</label>
                <input type="text" placeholder="John Doe" style={{ width: "100%", backgroundColor: theme.input, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 12px", fontSize: "12px", outline: "none" }} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium" style={{ color: theme.subtext }}>Email Address</label>
                <input type="email" placeholder="john@example.com" style={{ width: "100%", backgroundColor: theme.input, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 12px", fontSize: "12px", outline: "none" }} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium" style={{ color: theme.subtext }}>Message</label>
              <textarea rows={4} placeholder="Write your query here..." style={{ width: "100%", backgroundColor: theme.input, color: theme.inputText, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "8px 12px", fontSize: "12px", outline: "none", resize: "none" }} />
            </div>
            <button type="submit" className="w-full py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer" style={{ backgroundColor: theme.accent, color: theme.bg }}>
              <Send className="w-3.5 h-3.5" />
              <span>Submit Query</span>
            </button>
          </form>
        </div>

        <footer className="pt-8 flex justify-end">
          <p className="font-mono text-[10px]" style={{ color: theme.subtext }}>COMSATS University Islamabad, Abbottabad Campus</p>
        </footer>
      </div>
    </div>
  );
}

export default SplashScreen;
