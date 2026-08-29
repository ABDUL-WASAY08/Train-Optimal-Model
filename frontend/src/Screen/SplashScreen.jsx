import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitBranch, Users, Globe, Code2, Check, Send, Cat,
  LogIn
} from 'lucide-react';

function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-main text-body-custom font-sans selection:bg-pulse-cyan/20 selection:text-pulse-cyan">
      <nav className="flex items-center justify-between px-6 py-4 bg-main border-b border-slate">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={()=>navigate('/')}>
          <div className="p-1.5 rounded-xl border border-slate text-heading">
            <Cat className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-heading">
            TOM
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#pricing"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-bg-main to-bg-surface border border-white text-pulse-cyan text-xs font-semibold hover:border-pulse-cyan transition-all"
          >
            <span>Upgrade to Pro</span>
          </a>
          <button
            onClick={() => navigate('/Autorization')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-slate-800 border border-slate text-body-custom text-xs font-medium transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-subheading" />
            <span>Sign In</span>
          </button>
        </div>
      </nav>

      {/* Background filters */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-pulse-cyan/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pulse-violet/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-28">
        {/* First Hero Section */}
        <div className="min-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-white text-pulse-cyan text-xs font-semibold rounded-full w-fit">
                <span>TOM</span>
              </div>
              <h1 className="text-subheading text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                Train Optimal Model
              </h1>
              <p className="text-subheading text-base sm:text-lg font-medium leading-relaxed">
                An ML powered GitHub Intelligence, Documentation and Developer Recruiter Marketplace Platform.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-surface text-pulse-cyan border border-slate">
                    <GitBranch className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-subheading text-xs font-medium">
                    Make the repo to train the model
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-surface text-pulse-cyan border border-slate">
                    <Users className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-subheading text-xs font-medium">
                    Make strong relations with clients and developers
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-surface text-pulse-cyan border border-slate">
                    <Globe className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-subheading text-xs font-medium">
                    Sell your model in the world
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-surface text-pulse-cyan border border-slate">
                    <Code2 className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-subheading text-xs font-medium">
                    Enhance coding skills with RAG & Scorecards
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigate('/Autorization')}
                className="px-6 py-3 bg-surface hover:bg-slate-800 text-body-custom border border-slate text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Explore Platform
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center hidden md:flex pointer-events-none">
            <div className="relative p-1 animate-pulse shadow-2xl">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="p-10 bg-surface rounded-full border border-pulse-cyan/30">
                  <Cat className="w-62 h-62 text-heading" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tier Section */}
        <div id="pricing" className="space-y-8">
          <div className="text-center space-y-2 pointer-events-none">
            <h2 className="text-3xl font-extrabold text-heading">Choose Your Tier</h2>
            <p className="text-subheading text-xs">Flexible options for individual developers, teams, and recruiters</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Tier */}
            <div className="bg-surface border border-slate rounded-2xl p-8 flex flex-col justify-between space-y-6 hover:border-slate/80 transition-colors">
              <div className="space-y-4 pointer-events-none">
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-main text-subheading rounded-md uppercase border border-slate">
                  BASIC TIER
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-heading">$0</span>
                  <span className="text-xs text-subheading">/ forever free</span>
                </div>
                <p className="text-xs text-subheading">Explore basic features and build your initial developer presence.</p>

                <ul className="space-y-3 pt-4 text-xs text-body-custom">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                    <span>See and sync public repositories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                    <span>Analyze repo quality and security scores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                    <span>Full access to personal developer portfolio</span>
                  </li>
                  <li className="flex items-center gap-2 text-subheading/50 line-through">
                    <span>Train custom AI models (LoRA/QLoRA)</span>
                  </li>
                  <li className="flex items-center gap-2 text-subheading/50 line-through">
                    <span>AI Model Marketplace seller access</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/Autorization')}
                className="w-full py-2.5 px-4 bg-main hover:bg-slate-800 text-body-custom text-xs font-semibold rounded-lg border border-slate transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-surface border-2 border-pulse-cyan rounded-2xl p-8 flex flex-col justify-between space-y-6 relative shadow-lg shadow-cyan-950/50">
              <div>
                <div className="absolute -top-3 right-6 bg-pulse-cyan text-main text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  RECOMMENDED
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 bg-main text-pulse-cyan border border-pulse-cyan/40 rounded-md uppercase">
                    PRO TIER
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-heading">$19</span>
                    <span className="text-xs text-subheading">/ month</span>
                  </div>
                  <p className="text-xs text-subheading">Unlock full AI model training, marketplace selling, and VS Code integration.</p>

                  <ul className="space-y-3 pt-4 text-xs text-body-custom">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                      <span>Includes everything in Basic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                      <span>Train custom AI models (LoRA/QLoRA & RAG)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                      <span>Sell models on the AI Model Marketplace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                      <span>Private repository sync & automated .docx docs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-pulse-cyan shrink-0" />
                      <span>VS Code extension inline code completion</span>
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => navigate('/Autorization')}
                className="w-full py-2.5 px-4 bg-pulse-cyan hover:bg-cyan-400 text-main text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-heading">Project Contributors</h2>
            <p className="text-subheading text-xs">The development team behind Train Optimal Model</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {/* Contributor 1 */}
            <div className="bg-surface border border-slate p-6 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-pulse-cyan/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-main border border-pulse-cyan/30 flex items-center justify-center text-pulse-cyan text-xl font-bold pointer-events-none">
                AW
              </div>
              <div className="pointer-events-none">
                <p className="text-sm font-bold text-heading">Abdul Wasay</p>
                <p className="text-[10px] text-subheading font-mono">FA23-BCS-004</p>
                <p className="text-xs text-pulse-cyan mt-1">Core Developer</p>
              </div>
            </div>

            {/* Contributor 2 */}
            <div className="bg-surface border border-slate p-6 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-pulse-violet/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-main border border-pulse-violet/30 flex items-center justify-center text-pulse-violet text-xl font-bold pointer-events-none">
                AT
              </div>
              <div className="pointer-events-none">
                <p className="text-sm font-bold text-heading">Alishba Tanoli</p>
                <p className="text-[10px] text-subheading font-mono">FA23-BCS-010</p>
                <p className="text-xs text-pulse-violet mt-1">Core Developer</p>
              </div>
            </div>

            {/* Contributor 3 */}
            <div className="bg-surface border border-slate p-6 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-purple-500/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-main border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl font-bold pointer-events-none">
                AJ
              </div>
              <div className="pointer-events-none">
                <p className="text-sm font-bold text-heading">Aiman Jadoon</p>
                <p className="text-[10px] text-subheading font-mono">FA23-BCS-008</p>
                <p className="text-xs text-purple-400 mt-1">Core Developer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div id="contact" className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 pointer-events-none">
            <h2 className="text-3xl font-extrabold text-heading">Have Questions?</h2>
            <p className="text-subheading text-xs">Send us a query and our team will get back to you shortly.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="bg-surface border border-slate p-8 rounded-2xl space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-subheading">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-main border border-slate rounded-lg px-3 py-2 text-xs text-body-custom focus:outline-none focus:border-pulse-cyan"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-subheading">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-main border border-slate rounded-lg px-3 py-2 text-xs text-body-custom focus:outline-none focus:border-pulse-cyan"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-subheading">Message</label>
              <textarea
                rows={4}
                placeholder="Write your query here..."
                className="w-full bg-main border border-slate rounded-lg px-3 py-2 text-xs text-body-custom focus:outline-none focus:border-pulse-cyan resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900/20 hover:bg-blue-900/30 text-main text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Query</span>
            </button>
          </form>
        </div>

        <footer className="pt-8 flex text-subheading justify-end">
          <p className="font-mono text-[10px]">COMSATS University Islamabad, Abbottabad Campus</p>
        </footer>
      </div>
    </div>
  );
}

export default SplashScreen;