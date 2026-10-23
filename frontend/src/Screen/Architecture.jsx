import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Layers, 
    Server, 
    Cpu, 
    Database, 
    Workflow, 
    ShieldCheck, 
    Zap, 
    Bell, 
    GitBranch, 
    Bot, 
    Search, 
    CheckCircle2, 
    ArrowRight,
    Code2,
    HardDrive
} from 'lucide-react';
import SplashNavbar from '../Components/SplasNavbar';

function Architecture() {
    const navigate = useNavigate();

    const requestPath = [
        {
            step: '1',
            title: 'React Frontend',
            desc: 'SPA with role-based portals, built by Vite and served as static assets[cite: 4].',
            tier: 'client'
        },
        {
            step: '2',
            title: 'Nginx',
            desc: 'Reverse proxy, TLS termination, static caching and rate limiting at the edge[cite: 4].',
            tier: 'edge'
        },
        {
            step: '3',
            title: 'Node.js / Express',
            desc: 'REST API with auth, RBAC, validation and service-layer business logic[cite: 4].',
            tier: 'edge'
        },
        {
            step: '4',
            title: 'MongoDB',
            desc: 'Document store for users, repositories, projects, bids, payments and logs[cite: 4].',
            tier: 'server'
        },
        {
            step: '5',
            title: 'Redis / BullMQ',
            desc: 'Queue and cache powering background analysis, generation and notification jobs[cite: 4].',
            tier: 'server'
        },
        {
            step: '6',
            title: 'GitHub API',
            desc: 'Repository metadata, file trees and webhook-driven synchronisation[cite: 4].',
            tier: 'external'
        },
        {
            step: '7',
            title: 'LLM',
            desc: 'Generates grounded answers, improvements, README and documentation[cite: 4].',
            tier: 'external'
        },
        {
            step: '8',
            title: 'Vector Search',
            desc: 'Similarity search over code embeddings to retrieve relevant context[cite: 4].',
            tier: 'external'
        }
    ];

    const crossCutting = [
        {
            icon: ShieldCheck,
            title: 'Authentication',
            desc: 'JWT access + refresh tokens, OAuth placeholders for GitHub and Google[cite: 4].'
        },
        {
            icon: Layers,
            title: 'RBAC',
            desc: 'Developer, Client and Admin role guards on every protected route[cite: 4].'
        },
        {
            icon: Zap,
            title: 'Rate Limiting',
            desc: 'Sliding-window limits per API key and per user session[cite: 4].'
        },
        {
            icon: Server,
            title: 'Background Processing',
            desc: 'Queue workers for analysis, embeddings and document generation[cite: 4].'
        },
        {
            icon: Bell,
            title: 'Notifications',
            desc: 'Event-driven in-app notification feed simulated in this prototype[cite: 4].'
        }
    ];

    const ragPipeline = [
        { num: '1', title: 'GitHub Repository', desc: 'Clone / webhook sync[cite: 4]' },
        { num: '2', title: 'File Filtering', desc: 'Drop binaries & lockfiles[cite: 4]' },
        { num: '3', title: 'Code Chunking', desc: 'AST-aware 512-token chunks[cite: 4]' },
        { num: '4', title: 'Embeddings', desc: 'Vector representation[cite: 4]' },
        { num: '5', title: 'Vector Search', desc: 'Top-k similarity[cite: 4]' },
        { num: '6', title: 'Relevant Context', desc: 'Ranked source snippets[cite: 4]' },
        { num: '7', title: 'LLM', desc: 'Grounded generation[cite: 4]' },
        { num: '8', title: 'AI Response', desc: 'Answer + citations[cite: 4]' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
            <SplashNavbar />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
                
                {/* PAGE HEADER */}
                <div className="space-y-4 mx-4 sm:mx-12 border-b border-slate-200 pb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full">
                        <Layers size={14} />
                        <span>System Design & Infrastructure</span>
                    </div>
                    <h1 className="text-slate-900 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
                        Architecture & Infrastructure
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg max-w-4xl leading-relaxed">
                        A layered architecture with a queue-backed background processing tier. The prototype mocks every external system behind identical interfaces[cite: 4].
                    </p>
                </div>

                {/* REQUEST PATH SECTION */}
                <div className="mx-4 sm:mx-12 space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Request Pipeline</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Request Path</h2>
                        <p className="text-slate-500 text-sm">Step-by-step traversal from the client interface down to external LLM and vector tiers[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {requestPath.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm relative overflow-hidden flex flex-col justify-between">
                                <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-600 font-mono text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-indigo-100">
                                    {item.tier.toUpperCase()}
                                </div>
                                <div className="space-y-2 pt-2">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                        {item.step}
                                    </span>
                                    <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RAG PIPELINE SECTION */}
                <div className="mx-4 sm:mx-12 space-y-8 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-2 relative z-10">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Core Intelligence</span>
                        <h2 className="text-3xl font-extrabold tracking-tight">RAG Pipeline Architecture</h2>
                        <p className="text-slate-400 text-sm">How repository data transforms into grounded, cited AI answers[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-4">
                        {ragPipeline.map((rag, rIdx) => (
                            <div key={rIdx} className="bg-slate-800 border border-slate-700/80 p-5 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold text-indigo-400">Phase {rag.num}</span>
                                    <Cpu size={16} className="text-slate-500" />
                                </div>
                                <h3 className="font-bold text-white text-sm">{rag.title}</h3>
                                <p className="text-xs text-slate-400">{rag.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CROSS-CUTTING CONCERNS SECTION */}
                <div className="mx-4 sm:mx-12 space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Security & Operations</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cross-Cutting Concerns</h2>
                        <p className="text-slate-500 text-sm">Global system layers governing security, role access, and background queues[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {crossCutting.map((cc, cIdx) => {
                            const IconComponent = cc.icon;
                            return (
                                <div key={cIdx} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <IconComponent size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-base">{cc.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{cc.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* PROTOTYPE NOTE NOTICE BOX */}
                <div className="mx-4 sm:mx-12 bg-indigo-50 border border-indigo-200 rounded-3xl p-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                            <HardDrive size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-950 text-base">Prototype Implementation Note</h3>
                            <p className="text-xs text-indigo-700">Seamless transition from prototype services to production infrastructure[cite: 4].</p>
                        </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                        MongoDB, Redis, GitHub API, LLM and payment gateway are mocked in <code className="bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono text-indigo-900">src/services</code> with identical signatures, so switching to production requires no UI changes[cite: 4].
                    </p>
                </div>

                {/* BOTTOM CALL TO ACTION */}
                <div className="mx-4 sm:mx-12 bg-indigo-600 text-white rounded-3xl p-10 sm:p-12 text-center space-y-6 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to test the system live?</h2>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto">
                        Explore core modules or sign in to evaluate the platform workspace workflows[cite: 4].
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            onClick={() => navigate('/authorization')}
                            className="px-6 py-3 bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                            Sign In / Get Started
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Architecture;