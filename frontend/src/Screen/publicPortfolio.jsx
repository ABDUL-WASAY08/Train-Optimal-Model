import React, { useEffect, useState } from "react";
import {
    ArrowUpRight,
    ArrowRight,
    Asterisk,
    Award,
    Briefcase,
    Code,
    FolderGit2,
    GitFork,
    GraduationCap,
    Mail,
    Star,
    Terminal,
    User,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
const BG = "#0a0a0a";
const PANEL = "#0f0f0f";
const LINE = "#1f1f1f";
const LINE_SOFT = "#161616";
const TEXT = "#f5f5f4";
const MUTED = "#8a8a85";
const FAINT = "#555550";
const ACCENT = "#d6ff4b"; // single restrained pop — used only 3-4 times
const GREEN = "#4ade80"; // availability dot only

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
            <div
                className="min-h-screen flex flex-col items-center justify-center gap-6"
                style={{ background: BG, color: TEXT }}
            >
                <span className="font-mono text-xs tracking-[0.35em] uppercase" style={{ color: MUTED }}>
                    Loading
                </span>
                <div className="w-40 h-px relative overflow-hidden" style={{ background: LINE }}>
                    <div
                        className="absolute inset-y-0 left-0 w-1/3 animate-[load_1.1s_ease-in-out_infinite]"
                        style={{ background: TEXT }}
                    />
                </div>
                <style>{`@keyframes load { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }`}</style>
            </div>
        );
    }


    if (error) {
        return (
            <div
                className="min-h-screen flex items-center justify-center px-6"
                style={{ background: BG, color: TEXT }}
            >
                <div className="text-center max-w-sm w-full">
                    <Terminal className="w-6 h-6 mx-auto mb-6" style={{ color: FAINT }} />
                    <p className="font-mono text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: MUTED }}>
                        Error — 404
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight">Portfolio not found</h1>
                    <p className="text-sm mt-4 leading-relaxed" style={{ color: MUTED }}>
                        {error}
                    </p>
                    <div className="mt-10 h-px w-16 mx-auto" style={{ background: LINE }} />
                </div>
            </div>
        );
    }

    const repos = user?.repositories || [];
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const skillsCount = (user?.skills || []).length;
    const langCount = (user?.topLanguages || []).length;

    const stats = [
        { value: repos.length, label: "Projects" },
        { value: totalStars, label: "Stars" },
        { value: totalForks, label: "Forks" },
        { value: Math.max(skillsCount, langCount), label: "Technologies" },
    ];

    const firstName = (user?.name || user?.username || "Developer").split(" ")[0];

    return (
        <div
            className="min-h-screen antialiased selection:bg-white selection:text-black"
            style={{ background: BG, color: TEXT }}
        >
       
            <header
                className="sticky top-0 z-20 backdrop-blur-md"
                style={{ background: "rgba(10,10,10,0.82)", borderBottom: `1px solid ${LINE_SOFT}` }}
            >
                <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
                    <a href="#top" className="flex items-baseline gap-1 text-sm font-semibold tracking-tight">
                        {firstName}
                        <Asterisk className="w-3.5 h-3.5 -translate-y-0.5" style={{ color: ACCENT }} strokeWidth={2.5} />
                    </a>

                    <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: MUTED }}>
                        {user?.skills?.length > 0 && <a href="#skills" className="hover:text-white transition-colors">Skills</a>}
                        {repos.length > 0 && <a href="#work" className="hover:text-white transition-colors">Work</a>}
                        {user?.education?.length > 0 && <a href="#education" className="hover:text-white transition-colors">Education</a>}
                        {user?.workExperience?.length > 0 && <a href="#experience" className="hover:text-white transition-colors">Experience</a>}
                    </nav>

                    {user?.email && (
                        <a
                            href={`mailto:${user.email}`}
                            className="group flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors"
                            style={{ color: TEXT }}
                        >
                            Contact
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: ACCENT }} />
                        </a>
                    )}
                </div>
            </header>

            <main id="top" className="max-w-6xl mx-auto px-6 sm:px-10">

               
                <section className="pt-20 sm:pt-28 pb-16 sm:pb-24">
                    {/* meta row */}
                    <div
                        className="flex flex-wrap items-center justify-between gap-3 pb-8 mb-12 font-mono text-[11px] tracking-[0.2em] uppercase"
                        style={{ borderBottom: `1px solid ${LINE}`, color: MUTED }}
                    >
                        <span className="flex items-center gap-2.5">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: GREEN }} />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: GREEN }} />
                            </span>
                            Available for work
                        </span>
                        <span>@{user?.username}</span>
                        <span className="hidden sm:inline">© {new Date().getFullYear()}</span>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end">
                        <div>
                            <h1 className="text-[13vw] sm:text-7xl lg:text-8xl font-semibold leading-[0.95] tracking-[-0.04em]">
                                {user?.name || user?.username || "Developer"}
                            </h1>

                            {user?.bio ? (
                                <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>
                                    {user.bio}
                                </p>
                            ) : (
                                <p className="mt-8 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>
                                    Software developer building thoughtful, reliable products.
                                </p>
                            )}

                            
                            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10">
                                {user?.githubUrl && (
                                    <TextLink href={user.githubUrl}>GitHub</TextLink>
                                )}
                                {user?.websiteUrl && (
                                    <TextLink href={user.websiteUrl}>Website</TextLink>
                                )}
                                {user?.email && (
                                    <TextLink href={`mailto:${user.email}`}>Email</TextLink>
                                )}
                            </div>
                        </div>

                        {/* avatar — strict square, hairline frame, no decoration */}
                        <div className="hidden lg:block">
                            <div
                                className="w-52 h-64 flex items-center justify-center overflow-hidden"
                                style={{ border: `1px solid ${LINE}` }}
                            >
                                {user?.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name || "Avatar"}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                ) : user?.name ? (
                                    <span className="text-6xl font-semibold tracking-tight" style={{ color: FAINT }}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <User className="w-10 h-10" style={{ color: FAINT }} />
                                )}
                            </div>
                            <p className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-right" style={{ color: FAINT }}>
                                Fig. 01 — {firstName}
                            </p>
                        </div>
                    </div>

                    {/* stats — plain typographic row, no cards */}
                    <div
                        className="grid grid-cols-2 md:grid-cols-4 mt-16 sm:mt-24"
                        style={{ borderTop: `1px solid ${LINE}` }}
                    >
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className="py-8 pr-6"
                                style={{ borderRight: i < stats.length - 1 ? `1px solid ${LINE_SOFT}` : "none" }}
                            >
                                <span className="block text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">
                                    {String(s.value).padStart(2, "0")}
                                </span>
                                <span className="block mt-2 font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ======================= SKILLS ===================== */}
                {skillsCount > 0 && (
                    <section id="skills" className="py-16 sm:py-20" style={{ borderTop: `1px solid ${LINE}` }}>
                        <SectionLabel index="01" title="Skills" />
                        <ul className="mt-10">
                            {user.skills.map((skill, i) => (
                                <li
                                    key={i}
                                    className="group flex items-baseline justify-between gap-4 py-5 transition-colors"
                                    style={{ borderBottom: `1px solid ${LINE_SOFT}` }}
                                >
                                    <span className="text-xl sm:text-2xl font-medium tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                                        {skill}
                                    </span>
                                    <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: FAINT }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* =================== TOP LANGUAGES ================== */}
                {langCount > 0 && (
                    <section className="py-16 sm:py-20" style={{ borderTop: `1px solid ${LINE}` }}>
                        <SectionLabel index="02" title="Languages" />
                        <div className="mt-10 max-w-3xl space-y-7">
                            {user.topLanguages.map((item, i) => (
                                <div key={i} className="flex items-center gap-5">
                                    <span className="w-28 shrink-0 text-sm font-medium">{item.language}</span>
                                    <div className="flex-1 h-px relative" style={{ background: LINE }}>
                                        <div
                                            className="absolute inset-y-0 left-0 -my-px h-[3px]"
                                            style={{ width: `${item.percentage}%`, background: TEXT }}
                                        />
                                    </div>
                                    <span className="w-12 text-right font-mono text-[11px] tabular-nums" style={{ color: MUTED }}>
                                        {item.percentage}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ===================== PROJECTS ===================== */}
                {repos.length > 0 && (
                    <section id="work" className="py-16 sm:py-20" style={{ borderTop: `1px solid ${LINE}` }}>
                        <SectionLabel
                            index={skillsCount > 0 ? (langCount > 0 ? "03" : "02") : "01"}
                            title="Selected Work"
                            right={
                                <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: FAINT }}>
                                    {repos.length} repositories
                                </span>
                            }
                        />
                        <div className="mt-10" style={{ borderTop: `1px solid ${LINE}` }}>
                            {repos.map((repo, i) => (
                                <a
                                    key={i}
                                    href={repo.html_url || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[3rem_1fr_1.2fr_auto] items-center gap-x-6 gap-y-1 py-6 transition-colors"
                                    style={{ borderBottom: `1px solid ${LINE_SOFT}` }}
                                >
                                    <span className="font-mono text-[11px] tabular-nums" style={{ color: FAINT }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <span className="text-lg sm:text-xl font-medium tracking-tight flex items-center gap-2">
                                        {repo.name}
                                        <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" style={{ color: ACCENT }} />
                                    </span>
                                    <span className="hidden sm:block text-sm truncate" style={{ color: MUTED }}>
                                        {repo.description || "—"}
                                    </span>
                                    <span className="flex items-center gap-4 font-mono text-[11px] tabular-nums justify-self-end" style={{ color: MUTED }}>
                                        {repo.language && <span className="hidden sm:inline">{repo.language}</span>}
                                        {(repo.stargazers_count || 0) > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3 h-3" /> {repo.stargazers_count}
                                            </span>
                                        )}
                                        {(repo.forks_count || 0) > 0 && (
                                            <span className="flex items-center gap-1">
                                                <GitFork className="w-3 h-3" /> {repo.forks_count}
                                            </span>
                                        )}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* ==================== EDUCATION ===================== */}
                {user?.education?.length > 0 && (
                    <section id="education" className="py-16 sm:py-20" style={{ borderTop: `1px solid ${LINE}` }}>
                        <SectionLabel index="04" title="Education" />
                        <div className="mt-10 grid sm:grid-cols-2 gap-px" style={{ background: LINE_SOFT }}>
                            {user.education.map((edu, i) => (
                                <div key={i} className="p-8" style={{ background: BG }}>
                                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: ACCENT }}>
                                        {edu.year}
                                    </p>
                                    <h3 className="mt-4 text-lg font-medium tracking-tight leading-snug">{edu.degree}</h3>
                                    <p className="mt-2 text-sm" style={{ color: MUTED }}>{edu.institution}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ================== WORK EXPERIENCE ================= */}
                {user?.workExperience?.length > 0 && (
                    <section id="experience" className="py-16 sm:py-20" style={{ borderTop: `1px solid ${LINE}` }}>
                        <SectionLabel index="05" title="Experience" />
                        <div className="mt-10 max-w-3xl">
                            {user.workExperience.map((exp, i) => (
                                <div
                                    key={i}
                                    className="grid sm:grid-cols-[10rem_1fr] gap-2 sm:gap-8 py-7"
                                    style={{ borderBottom: `1px solid ${LINE_SOFT}` }}
                                >
                                    <span className="font-mono text-[11px] tracking-[0.15em] uppercase pt-1" style={{ color: MUTED }}>
                                        {exp.period}
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-medium tracking-tight">{exp.role}</h3>
                                        <p className="text-sm mt-1" style={{ color: ACCENT }}>{exp.company}</p>
                                        {exp.description && (
                                            <p className="text-sm leading-relaxed mt-3" style={{ color: MUTED }}>
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ====================== FOOTER ====================== */}
                <footer className="pt-20 pb-10" style={{ borderTop: `1px solid ${LINE}` }}>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div>
                            <p className="font-mono text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: MUTED }}>
                                Got a project?
                            </p>
                            <a
                                href={user?.email ? `mailto:${user.email}` : "#"}
                                className="group inline-flex items-center gap-3 text-3xl sm:text-5xl font-semibold tracking-tight"
                            >
                                Let's work together
                                <ArrowRight className="w-7 h-7 sm:w-9 sm:h-9 transition-transform group-hover:translate-x-2" style={{ color: ACCENT }} />
                            </a>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-8 lg:items-end font-mono text-[11px] tracking-[0.15em] uppercase" style={{ color: MUTED }}>
                            {user?.email && (
                                <a href={`mailto:${user.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                                    <Mail className="w-3.5 h-3.5" /> {user.email}
                                </a>
                            )}
                            {user?.githubUrl && (
                                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub ↗</a>
                            )}
                            <span style={{ color: FAINT }}>© {new Date().getFullYear()} — TOM Platform</span>
                        </div>
                    </div>

                    {/* oversized watermark name */}
                    <div className="mt-16 overflow-hidden select-none pointer-events-none" aria-hidden>
                        <p
                            className="text-[18vw] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap text-center"
                            style={{ color: PANEL, WebkitTextStroke: `1px ${LINE}` }}
                        >
                            {firstName.toUpperCase()}
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function TextLink({ href, children }) {
    const external = href.startsWith("http");
    return (
        <a
            href={href}
            target={external ? "_blank" : undefined}
            rel="noreferrer"
            className="group flex items-center gap-1.5 text-sm font-medium pb-1 transition-colors"
            style={{ borderBottom: `1px solid ${LINE}` }}
        >
            <span className="group-hover:text-white transition-colors" style={{ color: MUTED }}>
                {children}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5" style={{ color: MUTED }} />
        </a>
    );
}

function SectionLabel({ index, title, right }) {
    return (
        <div className="flex items-baseline justify-between gap-6">
            <div className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: ACCENT }}>
                    {index}
                </span>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h2>
            </div>
            {right}
        </div>
    );
}

export default PublicPortfolio;