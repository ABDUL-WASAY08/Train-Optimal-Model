import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, 
    Target, 
    Users, 
    Layers, 
    Workflow, 
    CheckCircle2, 
    AlertCircle, 
    ArrowRight,
    Building2,
    Calendar,
    GraduationCap
} from 'lucide-react';
import SplashNavbar from '../Components/SplasNavbar';

function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
            <SplashNavbar />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-20">
                
                {/* PAGE HEADER */}
                <div className="space-y-4 mx-4 sm:mx-12 border-b border-slate-200 pb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full">
                        <GraduationCap size={14} />
                        <span>COMSATS University Islamabad, Abbottabad Campus</span>
                    </div>
                    <h1 className="text-slate-900 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
                        About Train Optimal Model (TOM)
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg max-w-4xl leading-relaxed">
                        A comprehensive Final Year Project (Proposal Ref: <span className="font-mono font-semibold text-slate-900">FYP-26F-0039</span>) bridging the gap between repository intelligence, automated documentation, and verified developer-client collaboration[cite: 4].
                    </p>
                    <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-600" />
                            <span>Fall 2026 Presentation</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-indigo-600" />
                            <span>Department of Computer Science</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={14} className="text-indigo-600" />
                            <span>Supervisor: Areej Bashir, Lecturer</span>
                        </div>
                    </div>
                </div>

                {/* SECTION 1: PROBLEM & MOTIVATION */}
                <div className="mx-4 sm:mx-12 space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">01. Problem & Motivation</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why TOM Was Built</h2>
                        <p className="text-slate-500 text-sm">Addressing fragmented workflows and unverified claims in modern software development[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 font-bold">
                                01
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Fragmented Tooling</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Developers constantly jump between GitHub, external AI chat tools, documentation builders, and freelance marketplaces without unified context[cite: 4].
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 font-bold">
                                02
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Unaware AI Assistants</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Standard general-purpose AI assistants lack direct context regarding a developer's private or specific code repositories, resulting in generic suggestions[cite: 4].
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 font-bold">
                                03
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Unverified Portfolios</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Clients struggle on traditional platforms because portfolios are self-reported and easily exaggerated or fabricated using text-based AI[cite: 4].
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: PROPOSED SOLUTION & OBJECTIVES */}
                <div className="mx-4 sm:mx-12 space-y-8 bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">02. Proposed Solution & Objectives</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">The TOM Ecosystem</h2>
                        <p className="text-slate-500 text-sm">A centralized platform connecting GitHub codebases directly to retrieval-augmented generation (RAG) and hiring pipelines[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Target className="text-indigo-600" size={20} />
                                <span>Core Objectives</span>
                            </h3>
                            <ul className="space-y-3 text-xs text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span>Develop role-based sign-in structures supporting Developers, Clients, and Administrators[cite: 4].</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span>Build a repository-aware AI assistant accessible via both web dashboard and VS Code extension[cite: 4].</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span>Automate code analysis, error detection, README formation, and documentation drafting[cite: 4].</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span>Generate verified public developer portfolios directly from actual GitHub contributions[cite: 4].</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Workflow className="text-indigo-600" size={20} />
                                <span>Target Stakeholders</span>
                            </h3>
                            <ul className="space-y-3 text-xs text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span><strong>Developers & Interns:</strong> Accelerate onboarding into large repositories, debug quickly, and showcase real work[cite: 4].</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span><strong>Clients:</strong> Hire verified talent based on actual code scorecards rather than unverified claims[cite: 4].</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span><strong>Administrators:</strong> Monitor platform activity, manage disputes, and maintain data security standards[cite: 4].</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: SCOPE & CONSTRAINTS */}
                <div className="mx-4 sm:mx-12 space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">03. Project Boundaries</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Scope & System Constraints</h2>
                        <p className="text-slate-500 text-sm">Defined boundaries under the academic semester timeline and team capacity[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-emerald-50/50 border border-emerald-200 p-6 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-600" />
                                <span>In Scope (Included in FYP)</span>
                            </h3>
                            <ul className="space-y-2 text-xs text-emerald-800">
                                <li className="flex items-center gap-2">• Three role workspaces: Developer, Client, Admin[cite: 4]</li>
                                <li className="flex items-center gap-2">• GitHub OAuth & Google Authentication[cite: 4]</li>
                                <li className="flex items-center gap-2">• RAG pipeline with MongoDB Atlas Vector Search[cite: 4]</li>
                                <li className="flex items-center gap-2">• Project bidding, tracking, and VS Code extension marketplace[cite: 4]</li>
                            </ul>
                        </div>

                        <div className="bg-rose-50/50 border border-rose-200 p-6 rounded-2xl space-y-4">
                            <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle size={16} className="text-rose-600" />
                                <span>Out of Scope & Limitations</span>
                            </h3>
                            <ul className="space-y-2 text-xs text-rose-800">
                                <li className="flex items-center gap-2">• Full enterprise escrow payment automation[cite: 4]</li>
                                <li className="flex items-center gap-2">• Training custom foundational LLM models (Inference only)[cite: 4]</li>
                                <li className="flex items-center gap-2">• Repositories outside the MERN-stack scope (initial phase)[cite: 4]</li>
                                <li className="flex items-center gap-2">• Native mobile application development[cite: 4]</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: DEVELOPMENT TEAM */}
                <div className="mx-4 sm:mx-12 space-y-8">
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">04. Project Team</span>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">The Development Team</h2>
                        <p className="text-slate-500 text-sm">Department of Computer Science, COMSATS University Islamabad, Abbottabad Campus[cite: 4].</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xl flex items-center justify-center mx-auto">
                                AW
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Abdul Wasay</h3>
                                <p className="text-[11px] font-mono text-slate-500">CIIT/FA23-BCS-004/ATD</p>
                                <p className="text-xs font-semibold text-indigo-600 mt-1">Group Leader / Core Developer</p>
                            </div>
                            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                                GitHub Integration, RAG Pipeline, AI Assistant, VS Code Extension & Deployment[cite: 4].
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-violet-50 border border-violet-200 text-violet-600 font-bold text-xl flex items-center justify-center mx-auto">
                                AJ
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Aiman Ayyaz Jadoon</h3>
                                <p className="text-[11px] font-mono text-slate-500">CIIT/FA23-BCS-008/ATD</p>
                                <p className="text-xs font-semibold text-violet-600 mt-1">Core Developer</p>
                            </div>
                            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                                Authentication & Roles, Marketplace & Bidding, Admin Portal & Notifications[cite: 4].
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-3 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-bold text-xl flex items-center justify-center mx-auto">
                                AT
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">Alishba Tanoli</h3>
                                <p className="text-[11px] font-mono text-slate-500">CIIT/FA23-BCS-010/ATD</p>
                                <p className="text-xs font-semibold text-purple-600 mt-1">Core Developer</p>
                            </div>
                            <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                                Frontend Dashboards, Automated Portfolio, Code Analysis & README Generation[cite: 4].
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM CALL TO ACTION */}
                <div className="mx-4 sm:mx-12 bg-gradient-to-b from-indigo-600 to bg-[#131B2E] text-white rounded-3xl p-10 sm:p-12 text-center space-y-6 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to explore the platform modules?</h2>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto">
                        Inspect our core feature breakdown or test the live authorization workflows.
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

export default About;