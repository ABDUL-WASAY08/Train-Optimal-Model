import React, { useState } from 'react';
import { CatIcon, Plus, Trash2, Star, CheckCircle, Code, Sparkles, X } from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/* Design tokens (only colors already used in the original component)  */
/* ------------------------------------------------------------------ */

// Same width + height on every step. Only the inner content scrolls.
const CARD_SIZE = 'w-full min-w-0 h-[660px] sm:h-[640px] box-border';

const labelCls = 'block text-xs font-semibold text-slate-700 mb-1.5';
const hintCls = 'text-xs text-slate-500 leading-relaxed';
const sectionTitle = 'text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight';
const sectionTag = 'text-[11px] font-bold text-slate-400 tracking-wide';

const inputBase =
    'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all';
const inputSmall =
    'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all';
const addBtn =
    'px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5';
const chipRow =
    'flex items-center justify-between bg-indigo-50/50 border border-indigo-100 rounded-lg px-3 py-2 text-xs';

const STEPS = ['Profile', 'Repositories', 'Details'];

function SetupProfileModal() {
    const { fetchProfile, user } = useAuthStore();
    const { updateAccountDetails, loading: utilityLoading } = useUtilityStore();

    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [selectedRepos, setSelectedRepos] = useState([]);
    const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });
    const [educationList, setEducationList] = useState([]);
    const [expForm, setExpForm] = useState({ company: '', role: '', period: '', description: '' });
    const [experienceList, setExperienceList] = useState([]);
    const [repoSearchQuery, setRepoSearchQuery] = useState('');
    const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);

    const filteredRepos =
        user?.repositories?.filter((repo) =>
            repo.name.toLowerCase().includes(repoSearchQuery.toLowerCase())
        ) || [];

    const handleAddSelectedRepo = (repo) => {
        if (selectedRepos.some((r) => r.name === repo.name)) return;
        setSelectedRepos([...selectedRepos, repo]);
        setRepoSearchQuery('');
        setIsRepoDropdownOpen(false);
    };

    const handleRemoveSelectedRepo = (repoName) => {
        setSelectedRepos(selectedRepos.filter((r) => r.name !== repoName));
    };

    const handleAddEducation = () => {
        if (eduForm.degree && eduForm.institution) {
            setEducationList([...educationList, { ...eduForm, _id: Date.now().toString() }]);
            setEduForm({ degree: '', institution: '', year: '' });
        }
    };

    const handleAddExperience = () => {
        if (expForm.company && expForm.role) {
            setExperienceList([...experienceList, { ...expForm, _id: Date.now().toString() }]);
            setExpForm({ company: '', role: '', period: '', description: '' });
        }
    };

    const handleFinishSetup = async () => {
        const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
        const hasEducationInput = Object.values(eduForm).some((value) => value.trim());
        const hasExperienceInput = Object.values(expForm).some((value) => value.trim());

        if (hasEducationInput && (!eduForm.degree.trim() || !eduForm.institution.trim())) {
            toast.error('Add both a degree and institution to save this education record.');
            return;
        }

        if (hasExperienceInput && (!expForm.company.trim() || !expForm.role.trim())) {
            toast.error('Add both a role and company to save this experience record.');
            return;
        }

        const education = [
            ...educationList,
            ...(hasEducationInput
                ? [{ ...eduForm, degree: eduForm.degree.trim(), institution: eduForm.institution.trim(), year: eduForm.year.trim(), _id: Date.now().toString() }]
                : []),
        ];
        const workExperience = [
            ...experienceList,
            ...(hasExperienceInput
                ? [{ ...expForm, company: expForm.company.trim(), role: expForm.role.trim(), period: expForm.period.trim(), description: expForm.description.trim(), _id: (Date.now() + 1).toString() }]
                : []),
        ];
        const payload = { SetRepo: true };

        if (username.trim()) payload.username = username.trim();
        if (bio.trim()) payload.bio = bio.trim();
        if (skillsArray.length > 0) payload.skills = skillsArray;
        if (selectedRepos.length > 0) payload.Filteredrepositories = selectedRepos;
        if (education.length > 0) payload.education = education;
        if (workExperience.length > 0) payload.workExperience = workExperience;

        const result = await updateAccountDetails(payload);
        if (result.success) {
            await fetchProfile(true);
        } else {
            toast.error(result.error || 'Failed to save your profile details.');
        }
    };

    const parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);

    // Each pane is exactly 100% of the track width, so the card never resizes.
    const paneClass =
        'w-full min-w-0 basis-full shrink-0 grow-0 h-full overflow-y-auto overflow-x-hidden py-5 pr-1 [scrollbar-gutter:stable]';
    const paneStyle = (n) => ({
        visibility: step === n ? 'visible' : 'hidden',
        transition: 'visibility 0s linear ' + (step === n ? '0s' : '350ms'),
    });

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 font-sans antialiased">
            <div className="min-h-full flex flex-col justify-center py-6 sm:py-10">
                <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                    {/* ---------- Page header ---------- */}
                    <div className="text-center space-y-2.5 max-w-xl mx-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide">
                            <Sparkles size={13} /> TOM profile setup
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                            Set up your account &amp; portfolio
                        </h1>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                            Fill in your details and watch your portfolio card update as you type.
                        </p>
                    </div>

                    {/* ---------- Form + preview ---------- */}
                    <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-start w-full max-w-2xl lg:max-w-none mx-auto">
                        {/* ===== LEFT: FORM CARD ===== */}
                        <div
                            className={`${CARD_SIZE} bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col`}
                        >
                            {/* Stepper */}
                            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 shrink-0">
                                {STEPS.map((label, i) => {
                                    const n = i + 1;
                                    const active = step === n;
                                    const done = step > n;
                                    return (
                                        <React.Fragment key={label}>
                                            <button
                                                type="button"
                                                onClick={() => setStep(n)}
                                                className="flex items-center gap-2 cursor-pointer shrink-0"
                                            >
                                                <span
                                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                                                        active
                                                            ? 'bg-indigo-600 text-white'
                                                            : done
                                                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                            : 'bg-slate-100 text-slate-400'
                                                    }`}
                                                >
                                                    {done ? <CheckCircle className="w-4 h-4" /> : n}
                                                </span>
                                                <span
                                                    className={`${
                                                        active ? 'inline' : 'hidden sm:inline'
                                                    } text-xs font-bold ${
                                                        active ? 'text-indigo-600' : 'text-slate-400'
                                                    }`}
                                                >
                                                    {label}
                                                </span>
                                            </button>
                                            {i < STEPS.length - 1 && (
                                                <span
                                                    className={`flex-1 h-0.5 rounded-full transition-colors ${
                                                        step > n ? 'bg-indigo-600' : 'bg-slate-200'
                                                    }`}
                                                />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Body */}
                            <div className="flex-1 min-h-0 w-full overflow-hidden relative">
                                <div
                                    className="flex h-full w-full will-change-transform"
                                    style={{
                                        transform: `translate3d(-${(step - 1) * 100}%, 0, 0)`,
                                        transition: 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)',
                                    }}
                                >
                                    {/* STEP 1 */}
                                    <div className={paneClass} aria-hidden={step !== 1} style={paneStyle(1)}>
                                        <div className="w-full space-y-5">
                                            <div className="space-y-1">
                                                <h2 className={sectionTitle}>Verify your profile</h2>
                                                <p className={hintCls}>
                                                    This is the account we imported. Add a username and a short bio.
                                                </p>
                                            </div>

                                            <div className="w-full flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                                                {user?.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt="Avatar"
                                                        className="w-16 h-16 object-cover rounded-full border-2 border-indigo-600 shadow-xs shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-indigo-600 shrink-0">
                                                        <CatIcon className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-slate-900 truncate">
                                                        {user?.name || 'Loading name...'}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 truncate">
                                                        {user?.email || 'Loading email...'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full space-y-4">
                                                <div className="w-full">
                                                    <label className={labelCls}>Username</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Set your username"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        className={inputBase}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <label className={labelCls}>Bio</label>
                                                    <textarea
                                                        placeholder="Tell us about yourself..."
                                                        value={bio}
                                                        onChange={(e) => setBio(e.target.value)}
                                                        className={`${inputBase} h-28 resize-none leading-relaxed`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STEP 2 */}
                                    <div className={paneClass} aria-hidden={step !== 2} style={paneStyle(2)}>
                                        <div className="w-full space-y-5">
                                            <div className="space-y-1">
                                                <h2 className={sectionTitle}>Select repositories</h2>
                                                <p className={hintCls}>
                                                    Choose the projects you want to feature on your portfolio.
                                                </p>
                                            </div>

                                            <div className="w-full relative">
                                                <input
                                                    type="text"
                                                    value={repoSearchQuery}
                                                    onChange={(e) => {
                                                        setRepoSearchQuery(e.target.value);
                                                        setIsRepoDropdownOpen(true);
                                                    }}
                                                    onFocus={() => setIsRepoDropdownOpen(true)}
                                                    className={inputBase}
                                                    placeholder="Search your repositories to add..."
                                                />
                                                {isRepoDropdownOpen && repoSearchQuery.trim() !== '' && (
                                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-md z-50 max-h-40 overflow-y-auto">
                                                        {filteredRepos.length > 0 ? (
                                                            filteredRepos.map((repo, index) => (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => handleAddSelectedRepo(repo)}
                                                                    className="px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex items-center justify-between"
                                                                >
                                                                    <span className="font-semibold text-slate-800 truncate">
                                                                        {repo.name}
                                                                    </span>
                                                                    <span className="text-xs text-slate-400 font-mono shrink-0 ml-2">
                                                                        {repo.language || 'Code'}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-sm text-slate-500 italic">
                                                                No matching repositories found.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {selectedRepos.length > 0 && (
                                                <div className="w-full space-y-2">
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        Selected ({selectedRepos.length})
                                                    </span>
                                                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-28 overflow-y-auto pr-1">
                                                        {selectedRepos.map((repo, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="bg-indigo-50/50 px-3 py-2 rounded-xl border border-indigo-100 text-xs flex justify-between items-center"
                                                            >
                                                                <span className="font-bold text-indigo-900 truncate">
                                                                    {repo.name}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveSelectedRepo(repo.name)}
                                                                    className="text-slate-400 hover:text-rose-500 cursor-pointer shrink-0 ml-2"
                                                                    aria-label={`Remove ${repo.name}`}
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="w-full space-y-2">
                                                <span className="text-xs font-semibold text-slate-700">
                                                    All synced repositories
                                                </span>
                                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                                                    {user?.repositories && user.repositories.length > 0 ? (
                                                        user.repositories.map((repo, index) => {
                                                            const active = selectedRepos.some((r) => r.name === repo.name);
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    onClick={() => handleAddSelectedRepo(repo)}
                                                                    className={`px-3 py-2.5 rounded-xl border text-xs flex justify-between items-center cursor-pointer transition-all ${
                                                                        active
                                                                            ? 'border-indigo-500 bg-indigo-50/70 font-bold text-indigo-900'
                                                                            : 'border-slate-200 bg-white hover:border-slate-300 font-medium text-slate-700'
                                                                    }`}
                                                                >
                                                                    <span className="truncate">
                                                                        {typeof repo === 'string' ? repo : repo.name}
                                                                    </span>
                                                                    {active && (
                                                                        <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 ml-1" />
                                                                    )}
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="col-span-full text-sm text-slate-500 text-center py-4">
                                                            No repositories available.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* STEP 3 */}
                                    <div className={paneClass} aria-hidden={step !== 3} style={paneStyle(3)}>
                                        <div className="w-full space-y-5">
                                            <div className="space-y-1">
                                                <h2 className={sectionTitle}>Additional details</h2>
                                                <p className={hintCls}>
                                                    Skills, education and work history are all optional.
                                                </p>
                                            </div>

                                            <div className="w-full">
                                                <label className={labelCls}>Skills (comma separated)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. React, Node, Tailwind, Docker"
                                                    value={skills}
                                                    onChange={(e) => setSkills(e.target.value)}
                                                    className={inputBase}
                                                />
                                            </div>

                                            {/* Education */}
                                            <div className="w-full border-t border-slate-100 pt-4">
                                                <h3 className="text-sm font-bold text-slate-900 mb-2.5">Education</h3>
                                                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5">
                                                    <input type="text" placeholder="Degree" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} className={inputSmall} />
                                                    <input type="text" placeholder="Institution" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} className={inputSmall} />
                                                    <input type="text" placeholder="Year" value={eduForm.year} onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })} className={inputSmall} />
                                                </div>
                                                <button type="button" onClick={handleAddEducation} className={addBtn}>
                                                    <Plus className="w-3.5 h-3.5" /> Add education
                                                </button>

                                                {educationList.length > 0 && (
                                                    <div className="mt-3 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                                        {educationList.map((edu) => (
                                                            <div key={edu._id} className={chipRow}>
                                                                <span className="truncate text-indigo-900 font-semibold">
                                                                    {edu.degree} · {edu.institution}
                                                                    {edu.year ? ` (${edu.year})` : ''}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEducationList(educationList.filter((e) => e._id !== edu._id))}
                                                                    className="text-slate-400 hover:text-rose-500 cursor-pointer shrink-0 ml-2"
                                                                    aria-label="Remove education"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Work Experience */}
                                            <div className="w-full border-t border-slate-100 pt-4">
                                                <h3 className="text-sm font-bold text-slate-900 mb-2.5">Work experience</h3>
                                                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2.5">
                                                    <input type="text" placeholder="Role" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} className={inputSmall} />
                                                    <input type="text" placeholder="Company" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} className={inputSmall} />
                                                    <input type="text" placeholder="Period" value={expForm.period} onChange={(e) => setExpForm({ ...expForm, period: e.target.value })} className={inputSmall} />
                                                </div>
                                                <button type="button" onClick={handleAddExperience} className={addBtn}>
                                                    <Plus className="w-3.5 h-3.5" /> Add experience
                                                </button>

                                                {experienceList.length > 0 && (
                                                    <div className="mt-3 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                                        {experienceList.map((exp) => (
                                                            <div key={exp._id} className={chipRow}>
                                                                <span className="truncate text-indigo-900 font-semibold">
                                                                    {exp.role} · {exp.company}
                                                                    {exp.period ? ` (${exp.period})` : ''}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setExperienceList(experienceList.filter((e) => e._id !== exp._id))}
                                                                    className="text-slate-400 hover:text-rose-500 cursor-pointer shrink-0 ml-2"
                                                                    aria-label="Remove experience"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100 shrink-0 bg-white w-full">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step - 1)}
                                        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                                    >
                                        Back
                                    </button>
                                ) : (
                                    <div />
                                )}

                                <span className="text-xs font-semibold text-slate-400 hidden sm:block">
                                    Step {step} of {STEPS.length}
                                </span>

                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={() => setStep(step + 1)}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        Next step
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleFinishSetup}
                                        disabled={utilityLoading}
                                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer"
                                    >
                                        {utilityLoading ? 'Saving...' : 'Finish setup'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div
                            className={`${CARD_SIZE}   flex flex-col overflow-hidden`}
                        >
                            {/* Preview bar */}
                            <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-100 shrink-0">
                                <span className="text-sm font-extrabold text-indigo-600">
                                    Live portfolio preview
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-400">Updating live</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]">
                                {/* Banner + avatar */}
                                <div className="h-20 sm:h-24" />
                                <div className="px-5 sm:px-7 -mt-10 sm:-mt-12 flex items-end gap-4">
                                    {user?.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt="Avatar"
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-xs shrink-0 bg-white"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-indigo-50 border-4 border-white flex items-center justify-center text-indigo-600 shrink-0">
                                            <CatIcon className="w-9 h-9 sm:w-11 sm:h-11" />
                                        </div>
                                    )}
                                    <div className="min-w-0 pb-1">
                                        <h3 className="font-black text-slate-900 text-xl sm:text-2xl tracking-tight truncate">
                                            {username.trim() || user?.name || 'Your username'}
                                        </h3>
                                        <p className="text-sm text-indigo-600 font-mono font-semibold truncate">
                                            @{username ? username.toLowerCase().replace(/\s+/g, '') : 'handle'}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-5 sm:px-7 py-6 space-y-6">
                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <p className={sectionTag}>About</p>
                                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl min-h-[64px] border border-slate-100 break-words">
                                            {bio.trim() || (
                                                <span className="italic text-slate-400">
                                                    Your professional bio will appear here as you type...
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Skills */}
                                    <div className="space-y-2">
                                        <p className={sectionTag}>Core skills</p>
                                        <div className="flex flex-wrap gap-2 min-h-[36px]">
                                            {parsedSkills.length > 0 ? (
                                                parsedSkills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">
                                                    No skills added yet...
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Repositories */}
                                    <div className="space-y-2">
                                        <p className={sectionTag}>
                                            Featured repositories ({selectedRepos.length})
                                        </p>
                                        <div className="space-y-2">
                                            {selectedRepos.length > 0 ? (
                                                selectedRepos.map((repo, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between bg-white border border-slate-200/70 px-4 py-3 rounded-xl text-sm shadow-2xs"
                                                    >
                                                        <span className="font-bold text-slate-800 truncate flex items-center gap-2 min-w-0">
                                                            <Code size={15} className="text-indigo-600 shrink-0" />
                                                            <span className="truncate">{repo.name}</span>
                                                        </span>
                                                        {repo.stargazers_count !== undefined && (
                                                            <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 ml-2 font-semibold">
                                                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                                                {repo.stargazers_count}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400 italic">
                                                    Select repositories in step 2 to preview them here.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Education */}
                                    <div className="space-y-2">
                                        <p className={sectionTag}>Education</p>
                                        {educationList.length > 0 ? (
                                            <div className="space-y-2">
                                                {educationList.map((edu) => (
                                                    <div key={edu._id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                                        <p className="text-sm font-bold text-slate-800">{edu.degree}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {edu.institution}{edu.year ? ` · ${edu.year}` : ''}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">Add education to show it here.</p>
                                        )}
                                    </div>

                                    {/* Work experience */}
                                    <div className="space-y-2">
                                        <p className={sectionTag}>Work experience</p>
                                        {experienceList.length > 0 ? (
                                            <div className="space-y-2">
                                                {experienceList.map((exp) => (
                                                    <div key={exp._id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                                        <p className="text-sm font-bold text-slate-800">{exp.role} · {exp.company}</p>
                                                        {exp.period && <p className="text-xs text-slate-500">{exp.period}</p>}
                                                        {exp.description && <p className="mt-1 text-xs leading-relaxed text-slate-500">{exp.description}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">Add work experience to show it here.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SetupProfileModal;