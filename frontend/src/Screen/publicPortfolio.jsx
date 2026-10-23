import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  Code,
  FolderGit2,
  GitFork,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

function PublicPortfolio() {
    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await api.get(`/user/portfolio/${username}`);
                setUser(response.data.data);
            } catch (error) {
                setError(error.response?.data?.message || "Portfolio not found");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [username]);


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <span className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                <span className="text-xs font-mono tracking-[0.3em] uppercase text-slate-400">
                    Loading
                </span>
            </div>
        );
    }


    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 bg-slate-50">
                <div className="card p-10 text-center max-w-sm w-full">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <FolderGit2 size={22} />
                    </div>
                    <p className="mt-4 font-mono text-[11px] tracking-[0.3em] uppercase text-slate-400">
                        Error — 404
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">Portfolio not found</h1>
                    <p className="mt-3 text-sm leading-relaxed text-slate-500">{error}</p>
                    <Link to="/" className="btn-primary mt-6">
                        <ArrowLeft size={15} /> Back to home
                    </Link>
                </div>
            </div>
        );
    }

    const repos = user?.Filteredrepositories || [];
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const skillsCount = (user?.skills || []).length;
    const langCount = (user?.topLanguages || []).length;
    const certificates = user?.certificates || [];
    const firstName = (user?.name || user?.username || "Developer").split(" ")[0];

    const stats = [
        { value: repos.length, label: "Projects" },
        { value: totalStars, label: "Stars" },
        { value: totalForks, label: "Forks" },
        { value: Math.max(skillsCount, langCount), label: "Technologies" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">

            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <span className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">T</span>
                        <span className="font-bold text-slate-900 tracking-tight">TOM</span>
                        <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-200 pl-2.5">Portfolio</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                        {skillsCount > 0 && <a href="#skills" className="hover:text-indigo-700 transition-colors">Skills</a>}
                        {repos.length > 0 && <a href="#work" className="hover:text-indigo-700 transition-colors">Work</a>}
                        {certificates.length > 0 && <a href="#certificates" className="hover:text-indigo-700 transition-colors">Certificates</a>}
                        {user?.education?.length > 0 && <a href="#education" className="hover:text-indigo-700 transition-colors">Education</a>}
                        {user?.workExperience?.length > 0 && <a href="#experience" className="hover:text-indigo-700 transition-colors">Experience</a>}
                    </nav>

                    {user?.email && (
                        <a href={`mailto:${user.email}`} className="btn-primary btn-sm">
                            Contact <ArrowUpRight size={14} />
                        </a>
                    )}
                </div>
            </header>

            {/* Hero */}
            <section className="bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-14">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name || "Avatar"} className="h-full w-full object-cover" />
                            ) : user?.name ? (
                                <span className="text-3xl font-bold text-slate-300">{user.name.charAt(0).toUpperCase()}</span>
                            ) : (
                                <User className="w-9 h-9 text-slate-400" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-bold tracking-tight">{user?.name || user?.username || "Developer"}</h1>
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    Available for work
                                </span>
                            </div>
                            {user?.username && (
                                <p className="text-slate-400 mt-1">@{user.username}</p>
                            )}
                            {user?.bio && (
                                <p className="text-slate-300 mt-3 max-w-2xl leading-relaxed">{user.bio}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-5 mt-4 text-sm text-slate-300">
                                {user?.email && (
                                    <span className="flex items-center gap-1.5"><Mail size={14} /> {user.email}</span>
                                )}
                                {user?.githubUrl && (
                                    <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                        <Sparkles size={14} /> GitHub
                                    </a>
                                )}
                                {user?.websiteUrl && (
                                    <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                                        Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-3xl">
                        {stats.map((s, i) => (
                            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
                                <p className="text-2xl font-bold tabular-nums">{String(s.value).padStart(2, "0")}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <main className="max-w-6xl mx-auto px-6 sm:px-10 py-12 grid lg:grid-cols-3 gap-8">
                {/* Left column */}
                <div className="space-y-6">
                    {skillsCount > 0 && (
                        <div id="skills" className="card p-6">
                            <h2 className="section-title">Skills</h2>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {user.skills.map((skill, i) => (
                                    <span key={i} className="text-xs font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 rounded-full px-3 py-1">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {langCount > 0 && (
                        <div className="card p-6">
                            <h2 className="section-title flex items-center gap-2"><Code size={16} className="text-indigo-600" /> Languages</h2>
                            <div className="mt-4 space-y-4">
                                {user.topLanguages.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-medium text-slate-700">{item.language}</span>
                                            <span className="text-slate-400 font-mono">{item.percentage}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${item.percentage}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {user?.education?.length > 0 && (
                        <div id="education" className="card p-6">
                            <h2 className="section-title flex items-center gap-2"><GraduationCap size={16} className="text-indigo-600" /> Education</h2>
                            <div className="mt-4 space-y-3">
                                {user.education.map((edu, i) => (
                                    <div key={edu._id || edu.id || i} className="rounded-lg border border-slate-200 p-3">
                                        <p className="text-sm font-semibold text-slate-900">{edu.degree}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{edu.institution}{edu.year ? ` · ${edu.year}` : ""}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-8">
                    {repos.length > 0 && (
                        <section id="work">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Selected Projects</h2>
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20">
                                    {repos.length} repositories
                                </span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                {repos.map((repo, i) => (
                                    <a
                                        key={i}
                                        href={repo.html_url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="card p-5 hover:shadow-pop transition-shadow"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                                    {(repo.name || "R").slice(0, 2).toUpperCase()}
                                                </span>
                                                <p className="font-semibold text-slate-900 truncate">{repo.name}</p>
                                            </div>
                                            <ArrowUpRight size={15} className="shrink-0 text-slate-400" />
                                        </div>
                                        <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                                            {repo.description || "No description provided."}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {repo.language && (
                                                <span className="text-[11px] font-medium bg-slate-100 text-slate-600 rounded px-2 py-0.5">{repo.language}</span>
                                            )}
                                            {(repo.stargazers_count || 0) > 0 && (
                                                <span className="text-[11px] font-medium bg-slate-100 text-slate-600 rounded px-2 py-0.5 flex items-center gap-1">
                                                    <Star size={11} /> {repo.stargazers_count}
                                                </span>
                                            )}
                                            {(repo.forks_count || 0) > 0 && (
                                                <span className="text-[11px] font-medium bg-slate-100 text-slate-600 rounded px-2 py-0.5 flex items-center gap-1">
                                                    <GitFork size={11} /> {repo.forks_count}
                                                </span>
                                            )}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {certificates.length > 0 && (
                        <section id="certificates">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Certificates</h2>
                                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    {certificates.length} verified
                                </span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-5">
                                {certificates.map((cert) => (
                                    <article key={cert._id} className="card overflow-hidden flex flex-col">
                                        <a
                                            href={cert.certificateUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block h-52 overflow-hidden bg-slate-50 border-b border-slate-100"
                                        >
                                            <img
                                                src={cert.certificateUrl}
                                                alt={cert.certificateName}
                                                loading="lazy"
                                                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.04]"
                                            />
                                        </a>
                                        <div className="p-6 flex flex-col gap-3 flex-1">
                                            <div className="flex items-start gap-2.5">
                                                <BadgeCheck className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600" />
                                                <h3 className="text-base font-semibold tracking-tight leading-snug text-slate-900">
                                                    {cert.certificateName}
                                                </h3>
                                            </div>
                                            <p className="flex items-center gap-2 text-sm text-slate-500">
                                                <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                {cert.companyName}
                                            </p>
                                            {cert.role && <p className="text-sm text-slate-500">{cert.role}</p>}
                                            {cert.issueDate && (
                                                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-slate-400">
                                                    <Calendar className="w-3 h-3" /> {cert.issueDate}
                                                </p>
                                            )}
                                            {cert.description && (
                                                <p className="text-sm leading-relaxed text-slate-500">{cert.description}</p>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}

                    {user?.workExperience?.length > 0 && (
                        <section id="experience">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Experience</h2>
                            <div className="card p-6 space-y-5">
                                {user.workExperience.map((exp, i) => (
                                    <div key={exp._id || exp.id || i} className="flex gap-4">
                                        <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                                        <div className="border-l border-slate-200 pl-4">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{exp.role}</p>
                                                    <p className="text-xs text-slate-500">{exp.company}</p>
                                                </div>
                                                {exp.period && <span className="text-[11px] text-slate-400">{exp.period}</span>}
                                            </div>
                                            {exp.description && (
                                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="card p-6 flex flex-wrap items-center justify-between gap-4 bg-indigo-600 border-indigo-600 text-white">
                        <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Briefcase size={18} /> Want {firstName} on your project?
                            </h2>
                            <p className="text-sm text-indigo-100 mt-1">Reach out by email to start a conversation.</p>
                        </div>
                        <div className="flex gap-3">
                            {user?.email && (
                                <a href={`mailto:${user.email}`} className="btn bg-white text-indigo-700 hover:bg-indigo-50">
                                    <Mail size={15} /> Contact
                                </a>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <footer className="border-t border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <p className="flex items-center gap-2">
                        <MapPin size={14} /> © {new Date().getFullYear()} TOM — Train Optimal Model. Public portfolio.
                    </p>
                    <Link to="/" className="inline-flex items-center gap-1.5 hover:text-indigo-700">
                        <ArrowLeft size={14} /> Back to home
                    </Link>
                </div>
            </footer>
        </div>
    );
}

export default PublicPortfolio;
