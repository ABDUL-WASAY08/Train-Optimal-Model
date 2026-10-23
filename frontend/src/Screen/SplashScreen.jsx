import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitBranch,
  Users,
  Globe,
  Code2,
  Check,
  ArrowRight,
  Bot,
  FileText,
  BarChart3,
  Sparkles,
  Zap,
  Briefcase,
  Star,
  Search,
  Database,
  Layers,
  Cat
} from 'lucide-react';
import SplasNavbar from '../Components/SplasNavbar';

function SplashScreen() {
  const navigate = useNavigate();

  // Platform Features Section
  const platformFeatures = [
    {
      icon: Bot,
      title: 'Repository AI',
      desc: 'Connect GitHub repositories and keep them synced with a single click.',
    },
    {
      icon: BarChart3,
      title: 'Code Analysis',
      desc: 'Quality, security and maintainability scoring across your whole codebase.',
    },
    {
      icon: Zap,
      title: 'AI Code Improvement',
      desc: 'Refactor code snippet with explanations directly from structured AI suggestions.',
    },
    {
      icon: FileText,
      title: 'README Generation',
      desc: 'Structured, formatted READMEs generated from your repository structure.',
    },
    {
      icon: Code2,
      title: 'Project Documentation',
      desc: 'Architecture, workflows, functions and non-functional requirements on demand.',
    },
    {
      icon: Users,
      title: 'Developer Portfolio',
      desc: 'A shareable public portfolio built from your selected repositories.',
    },
    {
      icon: Briefcase,
      title: 'Client Marketplace',
      desc: 'Post projects, receive bids and hire verified developers with ratings.',
    },
    {
      icon: Sparkles,
      title: 'Full requirements overview',
      desc: 'Functional & non-functional requirements documented in the About page.',
      hasLink: true,
    },
  ];

  // How It Works Steps
  const steps = [
    {
      step: '01',
      title: 'Connect GitHub',
      desc: 'Link your account and pick the repositories you want TOM to understand.',
    },
    {
      step: '02',
      title: 'Analyze Repository',
      desc: 'Quality, security and maintainability scores calculated across every file.',
    },
    {
      step: '03',
      title: 'Ask AI',
      desc: 'Get grounded answers about your own codebase with instant citations.',
    },
    {
      step: '04',
      title: 'Improve & Document',
      desc: 'Get clean code suggestions, READMEs, and full documentation.',
    },
    {
      step: '05',
      title: 'Build Portfolio',
      desc: 'Select your best repositories and publish an interactive developer profile.',
    },
    {
      step: '06',
      title: 'Connect with Clients',
      desc: 'Bid on projects, deliver work and get paid through secure milestones.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Navigation Bar */}
      <SplasNavbar />
      
      <div className="flex-1 w-full space-y-20 sm:space-y-28">
        
        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-10">
          <div className="max-w-3xl space-y-6">

            <h1 className="text-slate-900 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
              TOM — Train <span className="text-indigo-600">Optimal</span> Model
            </h1>

            <p className="text-slate-600 text-base sm:text-xl font-normal leading-relaxed">
              AI-powered repository intelligence and a developer marketplace. <br className="hidden sm:inline" />
              Understand your codebase, improve your projects, build your portfolio, and connect with clients.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">            
              <button
                onClick={() => navigate('/Authorization')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* PLATFORM FEATURES SECTION */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Platform Features</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything a developer needs, in one platform
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-2xl">
              From repository intelligence to getting paid — TOM covers the full developer workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {platformFeatures.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50/50 transition-all group"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <IconComp size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{feat.title}</h3>
                      <p className="text-xs text-slate-500 mt-1.5 sm:mt-2 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                  {feat.hasLink && (
                    <div className="pt-4 mt-2 border-t border-slate-100">
                      <a href="/Features" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1">
                        Read more &rarr;
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <div id="working" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">How It Works</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Six steps from codebase to client delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl relative space-y-3 sm:space-y-4 hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {item.step}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 select-none">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULL-WIDTH DARK SECTION - CORE AI CONCEPT (RAG VISUAL EXPLANATION) */}
        <div id="architecture" className="w-full bg-[#0B0F19] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Column Text */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Core AI Concept</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Retrieval-Augmented Generation, explained visually
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                TOM never guesses. Your repository is filtered, chunked, and embedded, so that every question triggers a vector search that retrieves the most relevant code before the LLM drafts an answer with citations.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-1">
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>Repository-aware answers with file-level citations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>Scores for quality, security, and maintainability</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </div>
                  <span>Improvement suggestions mapped to exact lines</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/Authorization')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <span>Try the AI Assistant</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right Column RAG Visual Process Grid */}
            <div className="lg:col-span-7 bg-[#131B2E] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">How RAG works in TOM</span>
                </div>
                <span className="text-[10px] bg-indigo-950 border border-indigo-800 text-indigo-300 px-2 py-0.5 rounded">
                  Interactive flow
                </span>
              </div>

              {/* RAG Nodes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <GitBranch size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">GitHub Repository</p>
                  <p className="text-[9px] text-slate-400">Owner & public/private</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <Search size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">File Filtering</p>
                  <p className="text-[9px] text-slate-400">Skip binaries, node_modules</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <Code2 size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">Code Chunking</p>
                  <p className="text-[9px] text-slate-400">AST & function level</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <Database size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">Embeddings</p>
                  <p className="text-[9px] text-slate-400">Vector space storage</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <Layers size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">Vector Search</p>
                  <p className="text-[9px] text-slate-400">Cosine similarity</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <FileText size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">Relevant Context</p>
                  <p className="text-[9px] text-slate-400">Extracted code snippets</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <Bot size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">LLM</p>
                  <p className="text-[9px] text-slate-400">Grounded prompt generation</p>
                </div>

                <div className="bg-[#1A233A] p-2.5 sm:p-3 rounded-xl border border-slate-700/60 space-y-1 text-center">
                  <Zap size={16} className="mx-auto text-indigo-400 mb-1" />
                  <p className="text-[11px] font-bold text-white">AI Response</p>
                  <p className="text-[9px] text-slate-400">Answers + citations</p>
                </div>
              </div>

              <div className="text-center pt-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  Vector Search &rarr; Fault-tolerant RAG
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-500">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white font-bold text-xs">
                T
              </span>
              <span className="font-bold text-slate-900 text-sm">TOM</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              TOM — Train Optimal Model. AI-powered repository intelligence and a developer marketplace.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">Product</p>
            <ul className="space-y-1.5 text-slate-500">
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#architecture" className="hover:text-indigo-600 transition-colors">Architecture</a></li>
              <li><a href="#working" className="hover:text-indigo-600 transition-colors">Requirements</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">Portals</p>
            <ul className="space-y-1.5 text-slate-500">
              <li><button onClick={() => navigate('/Authorization')} className="hover:text-indigo-600 transition-colors cursor-pointer">Developer</button></li>
              <li><button onClick={() => navigate('/Authorization')} className="hover:text-indigo-600 transition-colors cursor-pointer">Client</button></li>
              <li><button onClick={() => navigate('/Authorization')} className="hover:text-indigo-600 transition-colors cursor-pointer">Admin</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-slate-900">Legal</p>
            <ul className="space-y-1.5 text-slate-500">
              <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Privacy Policy</span></li>
              <li><span className="cursor-pointer hover:text-indigo-600 transition-colors">Terms of Service</span></li>
              <li className="pt-2 text-[10px] font-mono text-slate-400">© 2026 TOM</li>
            </ul>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default SplashScreen;