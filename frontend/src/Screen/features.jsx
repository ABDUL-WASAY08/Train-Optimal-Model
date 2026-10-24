import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShieldCheck,
    LayoutDashboard,
    BrainCircuit,
    FileSearch,
    UserCheck,
    Store,
    Code,
    ShieldAlert,
    Check,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import SplashNavbar from '../Components/SplasNavbar';

function Features() {
    const navigate = useNavigate();
    const [selectedFeature, setSelectedFeature] = useState(0);

    const featuresList = [
        {
            icon: ShieldCheck,
            title: 'Authentication & Roles',
            tagline: 'Secure GitHub and Google sign-in with role-based access control.',
            description: 'Provides distinct entry portals and role-based permissions for Developers, Clients, and Administrators across the platform workspaces[cite: 4].',
            details: [
                'GitHub OAuth integration for developers[cite: 4]',
                'Google authentication for clients and admins[cite: 4]',
                'Strict role-based workspace segregation[cite: 4]'
            ],
            stat: 'Multi-Role Security',
            architectureNote: 'Managed via passport strategies and middleware role-checks on every protected Express.js route.'
        },
        {
            icon: LayoutDashboard,
            title: 'Role-Based Dashboards',
            tagline: 'Customized workspaces tailored to user permissions.',
            description: 'Dedicated operational dashboards empowering developers, clients, and admins to perform role-specific actions efficiently[cite: 4].',
            details: [
                'Developer workspace for repo and portfolio management',
                'Client workspace for project posting and tracking',
                'Admin control center for system monitoring'
            ],
            stat: '3 Role Workspaces[cite: 4]',
            architectureNote: 'Dynamic UI rendering based on JWT claims and user role permissions stored in MongoDB.'
        },
        {
            icon: BrainCircuit,
            title: 'RAG Repository AI',
            tagline: 'Codebase-grounded AI assistant powered by vector retrieval.',
            description: 'Chunks, embeds, stores, and retrieves code context using MongoDB Atlas Vector Search to answer questions directly from authorized repositories[cite: 4].',
            details: [
                'Automatic MERN-stack source file filtering[cite: 4]',
                'Vector embedding and semantic chunking[cite: 4]',
                'Precise file-level citations in every AI response[cite: 4]'
            ],
            stat: 'Grounded RAG Pipeline',
            architectureNote: 'Skips binary files, splits code into AST-aware 512-token chunks, and executes cosine similarity searches.'
        },
        {
            icon: FileSearch,
            title: 'Code Analysis & Docs',
            tagline: 'Automated error detection, static analysis, and documentation.',
            description: 'Inspects code quality, detects flaws using static analyzers like ESLint and Semgrep, and automatically generates structured README files and documentation[cite: 4].',
            details: [
                'Static analysis and code flaw detection[cite: 4]',
                'Automated README generation from repo layout[cite: 4]',
                'Comprehensive architectural doc generation[cite: 4]'
            ],
            stat: 'Automated Auditing',
            architectureNote: 'Runs background workers via Redis/BullMQ to parse abstract syntax trees and calculate quality scorecards.'
        },
        {
            icon: UserCheck,
            title: 'Automated Developer Portfolio',
            tagline: 'Portfolios built automatically from real GitHub activity.',
            description: 'Eliminates fake or exaggerated self-reported claims by pulling verified project statistics, code contributions, and AI scorecards directly from authorized repositories[cite: 4].',
            details: [
                'Direct synchronization with GitHub profiles[cite: 4]',
                'Verified code contribution metrics',
                'Shareable public developer showcase'
            ],
            stat: '100% Verified Work',
            architectureNote: 'Aggregates commit histories, pull requests, and repository scorecards into an immutable developer profile.'
        },
        {
            icon: Store,
            title: 'Marketplace & Projects',
            tagline: 'Project posting, bidding system, and extension marketplace.',
            description: 'A comprehensive freelance ecosystem allowing clients to post projects, developers to submit bids, and creators to list or purchase VS Code extensions[cite: 4].',
            details: [
                'Project bidding and tracking workflow[cite: 4]',
                'Milestone management and progress tracking[cite: 4]',
                'Marketplace listing for developer extensions[cite: 4]'
            ],
            stat: 'Active Freelance Hub',
            architectureNote: 'Facilitates secure milestone tracking, bid evaluations, and digital asset distribution.'
        },
        {
            icon: Code,
            title: 'VS Code Extension',
            tagline: 'Repository AI assistance directly inside your code editor.',
            description: 'Extends the power of TOM straight into your development environment via authorized API key access for real-time coding support[cite: 4].',
            details: [
                'In-editor repository AI assistant[cite: 4]',
                'Secure token-based API authentication',
                'Distributed via the platform marketplace[cite: 4]'
            ],
            stat: 'Editor Integration',
            architectureNote: 'Connects via secure REST endpoints and token keys to query the same RAG backend engine.'
        },
        {
            icon: ShieldAlert,
            title: 'Admin, Security & Alerts',
            tagline: 'Centralized platform management, complaints, and live alerts.',
            description: 'Provides administrators with complete oversight over user activity, system complaints, data protection policies, and real-time Socket.IO notifications[cite: 4].',
            details: [
                'User and complaint management system[cite: 4]',
                'Live system alerts via Socket.IO[cite: 4]',
                'Robust data security and access control[cite: 4]'
            ],
            stat: 'Full System Oversight',
            architectureNote: 'Event-driven architecture leveraging Socket.IO for instant system alerts and administrative moderation.'
        }
    ];

    const activeData = featuresList[selectedFeature];
    const ActiveIcon = activeData.icon;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
            <SplashNavbar />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
                <div className="space-y-4 mx-4 sm:mx-12 border-b border-slate-200 pb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full">
                        <Sparkles size={14} />
                        <span>Platform Capabilities</span>
                    </div>
                    <h1 className="text-slate-900 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
                        Core Modules & Features
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg max-w-4xl leading-relaxed">
                        An in-depth look into the 8 core building blocks of Train Optimal Model (TOM). Select any module below to inspect its detailed specifications, workflow mechanisms, and architectural implementation[cite: 4].
                    </p>
                </div>
                <div className="mx-4 sm:mx-12 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Left Grid: Feature Selection Cards (7 Cols) */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {featuresList.map((feat, idx) => {
                                const IconComp = feat.icon;
                                const isSelected = selectedFeature === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedFeature(idx)}
                                        className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                                            isSelected
                                                ? 'bg-gradient-to-b from-indigo-600 to bg-[#131B2E] text-white border-indigo-600 shadow-lg shadow-indigo-200 scale-[1.02]'
                                                : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                isSelected ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                            }`}>
                                                <IconComp size={20} />
                                            </div>
                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                                isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                Module 0{idx + 1}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold">{feat.title}</h3>
                                            <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                                                {feat.tagline}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Panel: Detailed View Box (5 Cols) */}
                        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl mt-10 top-24">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                        <ActiveIcon size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Module Specification</span>
                                        <h3 className="text-lg font-extrabold text-slate-900">{activeData.title}</h3>
                                    </div>
                                </div>
                                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                                    {activeData.stat}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-800">{activeData.tagline}</p>
                                <p className="text-xs text-slate-500 leading-relaxed">{activeData.description}</p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">Key Functionalities:</p>
                                <ul className="space-y-2">
                                    {activeData.details.map((detail, dIdx) => (
                                        <li key={dIdx} className="flex items-center gap-2.5 text-xs text-slate-600">
                                            <div className="w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                                                <Check size={10} />
                                            </div>
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
                                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Backend Implementation Note:</p>
                                <p className="text-xs text-slate-600 italic">{activeData.architectureNote}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <button
                                    onClick={() => navigate('/Authorization')}
                                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm cursor-pointer"
                                >
                                    <span>Test Module Live</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="mx-4 sm:mx-12 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 shadow-sm">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Workflow Depth</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How the TOM Modules Interoperate</h2>
                        <p className="text-slate-500 text-sm">A unified lifecycle from repository ingestion to client delivery and developer verification[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 font-bold">
                                01
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Ingestion & Analysis</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Users sign in via GitHub OAuth. Repositories are cloned, filtered for MERN source files, chunked via AST analysis, and embedded into MongoDB Atlas Vector Search[cite: 4].
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 font-bold">
                                02
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">RAG Assistance & Docs</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Queries trigger cosine similarity lookups against stored embeddings. Retrieved source snippets power the LLM to provide grounded answers with exact file citations[cite: 4].
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 font-bold">
                                03
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Marketplace & Hiring</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Verified code statistics automatically populate developer portfolios. Clients review verified scorecards, post projects, submit bids, and manage deliverables[cite: 4].
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mx-4 sm:mx-12 bg-gradient-to-b from-indigo-600 to bg-[#131B2E] text-white rounded-3xl p-10 sm:p-12 text-center space-y-6 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to experience these features live?</h2>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto">
                        Sign in to test role-based dashboards, GitHub syncing, and repository AI capabilities[cite: 4].
                    </p>
                    <div className="flex items-center justify-center gap-4 pt-2">
                        <button
                            onClick={() => navigate('/Authorization')}
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

export default Features;