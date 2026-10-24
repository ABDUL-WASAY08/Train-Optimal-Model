import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Mail,
  Globe,
  ExternalLink,
  FolderGit2,
  Star,
  GitBranch,
  Eye,
  Edit3,
  PlusCircle,
  Share2,
  BadgeCheck,
  Layers,
  AlertCircle,
  CheckCircle2,
  Zap,
  RotateCw,
  Briefcase,
  GraduationCap,
  Wrench,
  MapPin,
  Link2,
  Code2,
  Trash2,
  Search,
  Building2,
  Calendar,
  ArrowLeft,
  X,
  FileImage,
  Check,
  ChevronDown,
} from 'lucide-react';

import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';
import { toast } from 'sonner';

/* ---------- Animation CSS (self-contained, no tailwind config needed) ---------- */
/* NOTE: "backwards" fill-mode is intentional. It keeps the entrance animation from
   overriding hover transforms after it finishes. */

const AnimationStyles = () => (
  <style>{`
    @keyframes ac-rise {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ac-pop {
      0%   { opacity: 0; transform: scale(.92); }
      60%  { opacity: 1; transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    @keyframes ac-reveal {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes ac-wiggle {
      0%, 100% { transform: rotate(0) scale(1); }
      25%      { transform: rotate(-9deg) scale(1.08); }
      75%      { transform: rotate(9deg) scale(1.08); }
    }
    @keyframes ac-backdrop {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .ac-rise     { animation: ac-rise .6s cubic-bezier(.2,.7,.2,1) backwards; }
    .ac-pop      { animation: ac-pop .45s cubic-bezier(.2,.8,.3,1.2) backwards; }
    .ac-reveal   { animation: ac-reveal .3s ease-out backwards; }
    .ac-wiggle   { animation: ac-wiggle .6s ease-in-out; }
    .ac-backdrop { animation: ac-backdrop .2s ease-out backwards; }

    @media (prefers-reduced-motion: reduce) {
      .ac-rise, .ac-pop, .ac-reveal, .ac-wiggle, .ac-backdrop { animation: none !important; }
      .ac-root * { transition-duration: .01ms !important; }
    }
  `}</style>
);

/* ---------- Hooks ---------- */

const useMounted = (delay = 150) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return mounted;
};

/* ---------- Small Reusable Components ---------- */

const CountUp = ({ value = 0, decimals = 0, duration = 900, suffix = '', locale = false }) => {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const from = prev.current;
    const to = Number(value) || 0;
    const t0 = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  const text = locale ? Math.round(display).toLocaleString() : display.toFixed(decimals);
  return (
    <>
      {text}
      {suffix}
    </>
  );
};

const Card = ({ children, className = '', delay = 0, lift = true }) => (
  <section
    style={{ animationDelay: `${delay}ms` }}
    className={`ac-rise group/card bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 transition-all duration-300 ${
      lift ? 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100/60 hover:border-indigo-200' : ''
    } ${className}`}
  >
    {children}
  </section>
);

const SectionHeader = ({ icon: Icon, title, count, action }) => (
  <div className="flex items-center justify-between gap-3 mb-4">
    <div className="flex items-center gap-2.5">
      <span className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all duration-300 group-hover/card:bg-indigo-600 group-hover/card:text-white group-hover/card:-rotate-6 group-hover/card:scale-110">
        <Icon size={16} />
      </span>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {count !== undefined && (
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-0.5 transition-transform duration-300 group-hover/card:scale-110">
          {count}
        </span>
      )}
    </div>
    {action}
  </div>
);

const EmptyState = ({ message, actionLabel, onAction }) => (
  <div className="group/empty flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 transition-colors duration-300 hover:border-indigo-300 hover:bg-indigo-50/40">
    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
      <AlertCircle size={15} className="text-slate-400 shrink-0" />
      {message}
    </div>
    <button
      type="button"
      onClick={onAction}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer active:scale-95 transition-transform"
    >
      <PlusCircle size={14} className="transition-transform duration-300 group-hover/empty:rotate-90" /> {actionLabel}
    </button>
  </div>
);

const ProgressRow = ({ label, value, max, score, animated }) => (
  <div className="group/row space-y-1 rounded-lg -mx-2 px-2 py-1.5 transition-colors duration-200 hover:bg-indigo-50/60">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-slate-600">
        {label} <span className="text-slate-400 font-normal">({value}/{max})</span>
      </span>
      <span className="font-semibold text-indigo-600 tabular-nums">
        <CountUp value={score} suffix="%" />
      </span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-indigo-600 transition-[width] duration-1000 ease-out group-hover/row:bg-indigo-500"
        style={{ width: animated ? `${score}%` : '0%' }}
      />
    </div>
  </div>
);

/* ---------- Main Accounts Component ---------- */

function Accounts({ activeItem, onSelect }) {
  const { user, fetchProfile } = useAuthStore();
  const { certificates, getCertificates, updateAccountDetails } = useUtilityStore();

  const topRef = useRef(null);
  const mounted = useMounted();

  // Slide view state ('overview' | 'certificates')
  const [activeView, setActiveView] = useState('overview');

  const [certStackIndex, setCertStackIndex] = useState(0);
  const [stackHover, setStackHover] = useState(false);
  const [selectedRepoIndex, setSelectedRepoIndex] = useState(null);
  const [removingRepo, setRemovingRepo] = useState(null);

  // Interaction states
  const [copied, setCopied] = useState(false);
  const [avatarWiggle, setAvatarWiggle] = useState(false);
  const [poppedSkill, setPoppedSkill] = useState(null);
  const [openExp, setOpenExp] = useState(0);

  // Search & Modal for full Certificate view
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [imageZoomed, setImageZoomed] = useState(false);

  useEffect(() => {
    if (!user) fetchProfile();
  }, [user, fetchProfile]);

  useEffect(() => {
    if (user) getCertificates();
  }, [user, getCertificates]);

  // Close modal with Escape key
  useEffect(() => {
    if (!selectedImageModal) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedImageModal(null);
        setImageZoomed(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedImageModal]);

  const projectsList = Array.isArray(user?.Filteredrepositories) ? user.Filteredrepositories : [];
  const skillsList = Array.isArray(user?.skills) ? user.skills : [];
  const experienceList = Array.isArray(user?.workExperience) ? user.workExperience : [];
  const educationList = Array.isArray(user?.education) ? user.education : [];
  const certsList = Array.isArray(certificates) ? certificates : [];

  /* ----- Portfolio Strength calculation ----- */
  const projectsScore = Math.min(100, Math.round((projectsList.length / 7) * 100));
  const skillsScore = Math.min(100, Math.round((skillsList.length / 7) * 100));
  const experienceScore = Math.min(100, Math.round((experienceList.length / 3) * 100));
  const educationScore = Math.min(100, Math.round((educationList.length / 1) * 100));

  const totalPowerScore = Math.round(
    projectsScore * 0.35 + skillsScore * 0.25 + experienceScore * 0.25 + educationScore * 0.15
  );

  const missingItems = [];
  if (!user?.bio) missingItems.push('Bio');
  if (projectsList.length < 7) missingItems.push(`${7 - projectsList.length} more project(s)`);
  if (skillsList.length < 7) missingItems.push(`${7 - skillsList.length} more skill(s)`);
  if (experienceList.length < 3) missingItems.push('Work experience');
  if (educationList.length < 1) missingItems.push('Education');

  const isCompleted = totalPowerScore === 100 && !!user?.bio;

  const publicUrl = `https://fyp-prototype-ten.vercel.app/${
    user?.portfolioUrl || `portfolio/${user?.username || 'developer'}`
  }`;

  /* ----- Filtered Certificates ----- */
  const filteredCertificates = useMemo(() => {
    if (!certSearchQuery.trim()) return certsList;
    const query = certSearchQuery.toLowerCase();
    return certsList.filter((cert) => {
      const nameMatch = cert.certificateName?.toLowerCase().includes(query);
      const companyMatch = cert.companyName?.toLowerCase().includes(query);
      const roleMatch = cert.role?.toLowerCase().includes(query);
      return nameMatch || companyMatch || roleMatch;
    });
  }, [certsList, certSearchQuery]);

  /* ----- Handlers ----- */
  const handleOpenCertificates = () => {
    setActiveView('certificates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setActiveView('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Public portfolio link copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleNavigateSettings = (sectionName) => {
    toast.info(`Redirecting to Settings for ${sectionName}...`);
    if (onSelect) onSelect(sectionName);
  };

  const handleNextCertCard = (e) => {
    e.stopPropagation();
    if (certsList.length > 1) setCertStackIndex((prev) => (prev + 1) % certsList.length);
  };

  const handleSelectRepo = (index) => {
    setSelectedRepoIndex(selectedRepoIndex === index ? null : index);
  };

  const handleRemoveRepo = async (e, repoName) => {
    e.stopPropagation();
    setRemovingRepo(repoName); // plays the exit animation
    await new Promise((r) => setTimeout(r, 350));

    const updatedRepos = projectsList.filter((r) => r.name !== repoName);
    const res = await updateAccountDetails({ Filteredrepositories: updatedRepos });
    if (res?.success) {
      toast.success('Repository removed from portfolio!');
      setSelectedRepoIndex(null);
    } else {
      toast.error(res?.error || 'Failed to remove repository');
    }
    setRemovingRepo(null);
  };

  const handleAvatarClick = () => {
    setAvatarWiggle(true);
    setTimeout(() => setAvatarWiggle(false), 600);
  };

  const handleSkillClick = (index) => {
    setPoppedSkill(index);
    setTimeout(() => setPoppedSkill(null), 450);
  };

  const closeModal = () => {
    setSelectedImageModal(null);
    setImageZoomed(false);
  };

  const displayName = user?.name || user?.username || 'Developer Name';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div
      ref={topRef}
      className="ac-root min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans antialiased overflow-x-clip scroll-smooth"
    >
      <AnimationStyles />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-5 space-y-6">
        {/* ========== 1. PAGE TITLE ========== */}
        <header className="ac-rise flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Developer Portfolio</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your profile, projects, and credentials displayed on your public page.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavigateSettings('SETTINGS')}
              className="group/btn inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-slate-700 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Edit3 size={15} className="transition-transform duration-300 group-hover/btn:-rotate-12 group-hover/btn:scale-110" />{' '}
              Edit profile
            </button>
            <button
              type="button"
              onClick={() => window.open(publicUrl, '_blank')}
              className="group/btn relative overflow-hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300/50 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
            >
              {/* shine sweep */}
              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-[400%]" />
              <Eye size={15} className="relative transition-transform duration-300 group-hover/btn:scale-125" />
              <span className="relative">Preview public page</span>
            </button>
          </div>
        </header>

        {/* ========== 2. PROFILE SUMMARY CARD (Always Visible) ========== */}
        <Card delay={60} lift={false}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col sm:flex-row gap-5">
              <button
                type="button"
                onClick={handleAvatarClick}
                title="Click me"
                className={`h-20 w-20 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-medium overflow-hidden shadow-xs cursor-pointer transition-all duration-300 hover:scale-105 hover:ring-4 hover:ring-indigo-200 active:scale-95 ${
                  avatarWiggle ? 'ac-wiggle' : ''
                }`}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </button>

              <div className="space-y-3 min-w-0">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 truncate">{displayName}</h2>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    Software Engineer
                    <span className="text-slate-300">|</span>
                    <MapPin size={13} /> {user?.location || 'Pakistan'}
                  </p>
                </div>

                {user?.bio ? (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line max-w-2xl">{user.bio}</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavigateSettings('Bio')}
                    className="group/add inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer active:scale-95 transition-transform"
                  >
                    <PlusCircle size={15} className="transition-transform duration-300 group-hover/add:rotate-90" /> Add a short bio
                  </button>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                  {user?.email && (
                    <span className="inline-flex items-center gap-1.5 transition-transform duration-200 hover:-translate-y-0.5 hover:text-indigo-600">
                      <Mail size={14} className="text-slate-400" /> {user.email}
                    </span>
                  )}
                  {user?.githubUrl && (
                    <a
                      href={user.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:text-indigo-600"
                    >
                      <GitBranch size={14} className="text-slate-400" /> {user.githubUrl.replace('https://', '')}
                    </a>
                  )}
                  {user?.websiteUrl && (
                    <a
                      href={user.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 hover:text-indigo-600"
                    >
                      <Globe size={14} className="text-slate-400" /> {user.websiteUrl.replace('https://', '')}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats + Copy Link */}
            <div className="md:w-80 shrink-0 space-y-3">
              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                {[
                  { label: 'Rating', node: <CountUp value={4.9} decimals={1} /> },
                  { label: 'Projects', node: <CountUp value={projectsList.length} /> },
                  { label: 'Views', node: <CountUp value={1248} locale /> },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center py-3 cursor-default transition-all duration-200 hover:bg-white hover:scale-105"
                  >
                    <p className="text-lg font-semibold text-slate-900 tabular-nums">{stat.node}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopyUrl}
                title="Copy public link"
                className={`group/copy w-full flex items-center gap-2 p-2.5 rounded-xl border border-dashed transition-all duration-200 cursor-pointer text-left active:scale-[0.98] ${
                  copied
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400'
                }`}
              >
                <Link2 size={14} className="text-slate-400 shrink-0 transition-transform duration-300 group-hover/copy:-rotate-45" />
                <span className="flex-1 text-xs font-mono text-slate-500 truncate">{publicUrl}</span>
                {copied ? (
                  <span key="done" className="ac-pop inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 shrink-0">
                    <Check size={14} /> Copied
                  </span>
                ) : (
                  <Share2 size={14} className="text-indigo-600 shrink-0 transition-transform duration-300 group-hover/copy:scale-125" />
                )}
              </button>
            </div>
          </div>
        </Card>

        {/* ========== 3. MAIN CONTENT WITH SIDEBAR ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ----- LEFT MAIN CONTENT AREA ----- */}
          <div className="lg:col-span-8 relative">
            {activeView === 'overview' ? (
              /* VIEW 1: OVERVIEW DASHBOARD */
              <div className="space-y-6">
                {/* Projects */}
                <Card delay={120}>
                  <SectionHeader icon={FolderGit2} title="Selected projects" count={projectsList.length} />

                  {projectsList.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {projectsList.map((repo, index) => {
                        const isSelected = selectedRepoIndex === index;
                        const isRemoving = removingRepo === repo.name;

                        return (
                          <article
                            key={repo._id || index}
                            onClick={() => handleSelectRepo(index)}
                            style={{ animationDelay: `${180 + index * 70}ms` }}
                            className={`ac-rise group/repo flex flex-col justify-between gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                              isRemoving ? 'opacity-0 scale-90 -rotate-2 pointer-events-none' : ''
                            } ${
                              isSelected
                                ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-500/20 -translate-y-1'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/70 hover:-translate-y-1 active:scale-[0.98]'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className={`h-8 w-8 rounded-lg text-xs flex items-center justify-center shrink-0 font-medium transition-all duration-300 group-hover/repo:rotate-6 group-hover/repo:scale-110 ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-900 text-white group-hover/repo:bg-indigo-600'
                                    }`}
                                  >
                                    {repo.name ? repo.name.substring(0, 2).toUpperCase() : 'PR'}
                                  </span>
                                  <h3 className="text-sm font-semibold text-slate-900 truncate transition-colors group-hover/repo:text-indigo-700">
                                    {repo.name}
                                  </h3>
                                </div>

                                {isSelected && (
                                  <span className="ac-pop inline-flex items-center gap-1.5 text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600" />
                                    </span>
                                    Active
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                                {repo.description || 'No description provided for this repository.'}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 space-y-3">
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                {repo.language && (
                                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 transition-colors duration-200 group-hover/repo:bg-indigo-100 group-hover/repo:text-indigo-700">
                                    {repo.language}
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-slate-600">
                                  <Star
                                    size={12}
                                    className="text-amber-400 fill-amber-400 transition-transform duration-500 group-hover/repo:rotate-[72deg] group-hover/repo:scale-150"
                                  />{' '}
                                  {repo.stargazers_count ?? 0}
                                </span>
                              </div>

                              {isSelected ? (
                                <div className="ac-reveal flex items-center gap-2 pt-1">
                                  <a
                                    href={repo.html_url || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:scale-95 rounded-lg transition-all"
                                  >
                                    <Code2 size={13} /> View Code
                                  </a>
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveRepo(e, repo.name)}
                                    className="inline-flex items-center justify-center p-1.5 text-rose-600 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:rotate-12 active:scale-90 rounded-lg border border-rose-200 transition-all"
                                    title="Remove from portfolio"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-end pt-1">
                                  <span className="text-xs font-medium text-indigo-600 inline-flex items-center gap-1 transition-transform duration-300 group-hover/repo:-translate-x-1">
                                    GitHub{' '}
                                    <ExternalLink
                                      size={12}
                                      className="transition-transform duration-300 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5"
                                    />
                                  </span>
                                </div>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      message="No repositories added to your portfolio yet"
                      actionLabel="Add repos"
                      onAction={() => handleNavigateSettings('SETTINGS')}
                    />
                  )}
                </Card>

                {/* Experience */}
                <Card delay={180}>
                  <SectionHeader icon={Briefcase} title="Experience" count={experienceList.length} />

                  {experienceList.length > 0 ? (
                    <ol className="relative space-y-2 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                      {experienceList.map((exp, index) => {
                        const isOpen = openExp === index;
                        const hasDesc = !!exp.description;

                        return (
                          <li
                            key={exp._id || index}
                            style={{ animationDelay: `${240 + index * 80}ms` }}
                            className="ac-rise relative flex gap-4"
                          >
                            <span
                              className={`mt-3.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white z-10 transition-all duration-300 ${
                                isOpen ? 'bg-indigo-600 scale-125' : 'bg-slate-300'
                              }`}
                            />
                            <div
                              role={hasDesc ? 'button' : undefined}
                              tabIndex={hasDesc ? 0 : undefined}
                              onClick={() => hasDesc && setOpenExp(isOpen ? null : index)}
                              onKeyDown={(e) => {
                                if (hasDesc && (e.key === 'Enter' || e.key === ' ')) {
                                  e.preventDefault();
                                  setOpenExp(isOpen ? null : index);
                                }
                              }}
                              className={`flex-1 min-w-0 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                                hasDesc ? 'cursor-pointer hover:bg-indigo-50/60 active:scale-[0.99]' : ''
                              } ${isOpen ? 'bg-indigo-50/40' : ''}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-semibold text-slate-900">{exp.role}</h3>
                                  <p className="text-sm text-slate-500">
                                    {exp.company}
                                    {exp.period && <span className="text-slate-400"> &middot; {exp.period}</span>}
                                  </p>
                                </div>
                                {hasDesc && (
                                  <ChevronDown
                                    size={16}
                                    className={`mt-1 shrink-0 text-slate-400 transition-transform duration-300 ${
                                      isOpen ? 'rotate-180 text-indigo-600' : ''
                                    }`}
                                  />
                                )}
                              </div>

                              {hasDesc && (
                                <div
                                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                  }`}
                                >
                                  <div className="overflow-hidden">
                                    <p className="text-sm text-slate-600 leading-relaxed pt-2">{exp.description}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <EmptyState
                      message="No work experience added"
                      actionLabel="Add experience"
                      onAction={() => handleNavigateSettings('SETTINGS')}
                    />
                  )}
                </Card>

                {/* Education */}
                <Card delay={240}>
                  <SectionHeader icon={GraduationCap} title="Education" count={educationList.length} />

                  {educationList.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {educationList.map((edu, index) => (
                        <div
                          key={edu._id || index}
                          style={{ animationDelay: `${300 + index * 80}ms` }}
                          className="ac-rise group/edu p-4 rounded-xl border border-slate-200 bg-slate-50/60 cursor-default transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:border-indigo-300 hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <span className="h-8 w-8 shrink-0 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center transition-all duration-300 group-hover/edu:bg-indigo-600 group-hover/edu:border-indigo-600 group-hover/edu:text-white group-hover/edu:rotate-6">
                              <GraduationCap size={15} />
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-slate-900">{edu.degree}</h3>
                              <p className="text-sm text-slate-500 mt-0.5">
                                {edu.institution}
                                {edu.year && <span className="text-slate-400"> &middot; {edu.year}</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      message="No education records"
                      actionLabel="Add education"
                      onAction={() => handleNavigateSettings('SETTINGS')}
                    />
                  )}
                </Card>

                {/* Certificates Deck */}
                <Card delay={300}>
                  <SectionHeader
                    icon={BadgeCheck}
                    title="Certificates"
                    count={certsList.length}
                    action={
                      certsList.length > 0 && (
                        <button
                          type="button"
                          onClick={handleOpenCertificates}
                          className="group/all inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer active:scale-95 transition-transform"
                        >
                          <Layers size={14} className="transition-transform duration-300 group-hover/all:-translate-y-0.5 group-hover/all:scale-125" />{' '}
                          View all
                        </button>
                      )
                    }
                  />

                  {certsList.length > 0 ? (
                    <>
                      <div
                        className="relative h-40 w-full mb-6"
                        onMouseEnter={() => setStackHover(true)}
                        onMouseLeave={() => setStackHover(false)}
                      >
                        {certsList.map((cert, index) => {
                          const total = certsList.length;
                          const order = (index - certStackIndex + total) % total;
                          const isTop = order === 0;
                          const spread = stackHover ? 14 : 8;
                          const tilt = stackHover && !isTop ? (order % 2 ? 1 : -1) * order * 1.5 : 0;

                          return (
                            <div
                              key={cert._id || index}
                              onClick={handleNextCertCard}
                              style={{
                                transform: `translateY(${order * spread}px) scale(${1 - order * 0.03}) rotate(${tilt}deg)`,
                                zIndex: total - order,
                                opacity: order > 2 ? 0 : 1 - order * 0.25,
                                pointerEvents: order > 2 ? 'none' : 'auto',
                              }}
                              className={`absolute inset-x-0 top-0 p-4 rounded-xl bg-white transition-all duration-500 ease-[cubic-bezier(.2,.8,.3,1)] cursor-pointer border ${
                                isTop
                                  ? 'border-indigo-300 shadow-lg shadow-indigo-100'
                                  : 'border-slate-200 shadow-md'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-semibold text-slate-900 truncate">
                                  {cert.certificateName || 'Certificate'}
                                </h3>
                                {cert.certificateUrl && (
                                  <a
                                    href={cert.certificateUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-indigo-600 transition-transform duration-200 hover:scale-125 hover:rotate-12"
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                              {cert.companyName && <p className="text-sm text-slate-500 mt-0.5">{cert.companyName}</p>}

                              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                <span>
                                  {index + 1} of {total}
                                </span>
                                {total > 1 && isTop && (
                                  <span className="text-indigo-600 inline-flex items-center gap-1">
                                    Tap for next <RotateCw size={11} className={stackHover ? 'animate-spin' : ''} />
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Clickable dots */}
                      {certsList.length > 1 && (
                        <div className="flex justify-center gap-1.5 pt-2">
                          {certsList.map((cert, i) => (
                            <button
                              key={cert._id || i}
                              type="button"
                              aria-label={`Show certificate ${i + 1}`}
                              onClick={() => setCertStackIndex(i)}
                              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-indigo-400 ${
                                i === certStackIndex ? 'w-6 bg-indigo-600' : 'w-1.5 bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <EmptyState
                      message="No certificates added"
                      actionLabel="Add certificate"
                      onAction={() => handleNavigateSettings('SETTINGS')}
                    />
                  )}
                </Card>
              </div>
            ) : (
              /* VIEW 2: FULL CERTIFICATES PAGE */
              <div className="space-y-5">
                <Card lift={false}>
                  {/* View Header with Back Navigation */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={handleBackToOverview}
                      className="group/back inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:shadow-sm active:scale-95 rounded-xl transition-all cursor-pointer"
                    >
                      <ArrowLeft size={14} className="transition-transform duration-300 group-hover/back:-translate-x-1" /> Back to
                      Overview
                    </button>
                    <span className="text-xs font-medium text-slate-500">{certsList.length} verified credentials</span>
                  </div>

                  {/* Search bar inside Certificates View */}
                  <div className="pt-4 pb-2">
                    <div className="group/search relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors duration-200 group-focus-within/search:text-indigo-600" />
                      <input
                        type="text"
                        value={certSearchQuery}
                        onChange={(e) => setCertSearchQuery(e.target.value)}
                        placeholder="Search certificates by name, company..."
                        className="w-full pl-10 pr-10 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 focus:bg-white transition-all duration-200"
                      />
                      {certSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setCertSearchQuery('')}
                          className="ac-pop absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:rotate-90 transition-all duration-200 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Certificates Grid List */}
                  {filteredCertificates.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      {filteredCertificates.map((cert, index) => (
                        <div
                          key={cert._id}
                          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                          className="ac-rise bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:shadow-indigo-100/70 hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                        >
                          {/* Image preview */}
                          <div
                            onClick={() => setSelectedImageModal(cert.certificateUrl)}
                            className="relative h-36 bg-slate-100 overflow-hidden border-b border-slate-100 cursor-zoom-in"
                          >
                            <img
                              src={cert.certificateUrl}
                              alt={cert.certificateName}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="px-3 py-1 bg-white/95 text-slate-800 text-[11px] font-medium rounded-lg shadow-xs translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                Preview Image
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
                            <div>
                              <h3 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-indigo-700">
                                {cert.certificateName}
                              </h3>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 font-normal pt-1">
                                <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
                                <span className="truncate">{cert.companyName}</span>
                              </p>
                              {cert.issueDate && (
                                <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-0.5">
                                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                  Issued: {cert.issueDate}
                                </p>
                              )}
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <BadgeCheck size={10} /> Verified
                              </span>
                              <a
                                href={cert.certificateUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group/view inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:underline"
                              >
                                View{' '}
                                <ExternalLink
                                  size={10}
                                  className="transition-transform duration-300 group-hover/view:translate-x-0.5 group-hover/view:-translate-y-0.5"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ac-pop border border-dashed border-slate-300 rounded-xl py-8 px-4 text-center bg-slate-50/50 mt-3">
                      <FileImage className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                      <p className="text-xs text-slate-500">
                        {certSearchQuery ? `No matching certificates for "${certSearchQuery}"` : 'No certificates available.'}
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* ----- RIGHT SIDEBAR (Always Visible Across Views) ----- */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-5">
            {/* Portfolio Strength Card */}
            <Card delay={160}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center transition-all duration-300 group-hover/card:bg-amber-400 group-hover/card:text-white group-hover/card:scale-110 group-hover/card:rotate-12">
                    <Zap size={16} />
                  </span>
                  <h2 className="text-base font-semibold text-slate-900">Portfolio strength</h2>
                </div>
                <span className="text-lg font-semibold text-indigo-600 tabular-nums">
                  <CountUp value={totalPowerScore} suffix="%" duration={1200} />
                </span>
              </div>

              {isCompleted ? (
                <div className="ac-pop flex items-center gap-2 p-3 mb-4 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium">
                  <CheckCircle2 size={16} /> Profile complete
                </div>
              ) : (
                <div className="p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200 text-sm transition-colors duration-200 hover:bg-amber-50/60 hover:border-amber-200">
                  <p className="flex items-center gap-1.5 font-medium text-slate-900">
                    <AlertCircle size={15} className="text-slate-500" /> To finish your profile
                  </p>
                  <p className="text-slate-500 mt-1">{missingItems.join(', ')}</p>
                </div>
              )}

              <div className="space-y-2">
                <ProgressRow label="Projects" value={projectsList.length} max={7} score={projectsScore} animated={mounted} />
                <ProgressRow label="Skills" value={skillsList.length} max={7} score={skillsScore} animated={mounted} />
                <ProgressRow label="Experience" value={experienceList.length} max={3} score={experienceScore} animated={mounted} />
                <ProgressRow label="Education" value={educationList.length} max={1} score={educationScore} animated={mounted} />
              </div>
            </Card>

            {/* Skills */}
            <Card delay={220}>
              <SectionHeader icon={Wrench} title="Skills" count={skillsList.length} />
              {skillsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => handleSkillClick(index)}
                      style={{ animationDelay: `${260 + index * 40}ms` }}
                      className={`ac-rise rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-sm text-slate-700 cursor-pointer transition-all duration-200 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-200 active:scale-90 ${
                        poppedSkill === index ? 'ac-pop' : ''
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyState
                  message="No skills added yet"
                  actionLabel="Add skills"
                  onAction={() => handleNavigateSettings('Skills')}
                />
              )}
            </Card>

            {/* Client rating */}
            <Card delay={280}>
              <SectionHeader icon={Star} title="Client rating" />
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-semibold text-slate-900 tabular-nums">
                  <CountUp value={4.9} decimals={1} />
                </span>
                <span className="text-sm text-slate-400">/ 5.0</span>
              </div>
              <div className="space-y-1 text-sm text-slate-500">
                {[
                  { stars: 5, pct: 82 },
                  { stars: 4, pct: 14 },
                  { stars: 3, pct: 4 },
                ].map((row, i) => (
                  <div
                    key={row.stars}
                    className="group/rate flex items-center gap-3 rounded-lg -mx-2 px-2 py-1.5 cursor-default transition-colors duration-200 hover:bg-indigo-50/60"
                  >
                    <span className="w-14 shrink-0 transition-colors group-hover/rate:text-indigo-700">{row.stars} stars</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-[width] duration-1000 ease-out group-hover/rate:bg-indigo-500"
                        style={{ width: mounted ? `${row.pct}%` : '0%', transitionDelay: `${i * 120}ms` }}
                      />
                    </div>
                    <span className="w-9 text-right tabular-nums">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Modal image viewer for certificate full view */}
      {selectedImageModal && (
        <div
          className="ac-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="ac-pop bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] shadow-xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <BadgeCheck size={16} className="text-indigo-600" /> Certificate Preview
                <span className="font-normal text-slate-400 hidden sm:inline">&middot; click image to zoom, Esc to close</span>
              </span>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 hover:rotate-90 active:scale-90 transition-all duration-200 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-2 overflow-hidden flex items-center justify-center bg-slate-100/50">
              <img
                src={selectedImageModal}
                alt="Certificate Full Preview"
                onClick={() => setImageZoomed((z) => !z)}
                className={`max-h-[75vh] w-auto object-contain rounded-lg transition-transform duration-500 ease-out ${
                  imageZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;