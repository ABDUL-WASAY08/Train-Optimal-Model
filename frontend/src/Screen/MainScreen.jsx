import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CatIcon, Plus, Trash2, Star, ExternalLink } from 'lucide-react';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts';
import Setting from './Setting';
import SharePortfolio from './SharePortfolio';
import Navbar from '../Components/Navbar';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';

function MainScreen() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Portfolio');
  const { fetchProfile, user, setUser, loading: authLoading } = useAuthStore();
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

  const filteredRepos = user?.repositories?.filter(repo =>
    repo.name.toLowerCase().includes(repoSearchQuery.toLowerCase())
  ) || [];

  const handleAddSelectedRepo = (repo) => {
    if (selectedRepos.some(r => r.name === repo.name)) {
      return;
    }
    setSelectedRepos([...selectedRepos, repo]);
    setRepoSearchQuery('');
    setIsRepoDropdownOpen(false);
  };

  const handleRemoveSelectedRepo = (repoName) => {
    setSelectedRepos(selectedRepos.filter(r => r.name !== repoName));
  };

  const handleAddEducation = () => {
    if (eduForm.degree && eduForm.institution) {
      setEducationList([...educationList, { ...eduForm, _id: Date.now().toString() }]);
      setEduForm({ degree: '', institution: '', year: '' });
    }
  };

  const handleRemoveEducation = (id) => {
    setEducationList(educationList.filter(item => item._id !== id));
  };

  const handleAddExperience = () => {
    if (expForm.company && expForm.role) {
      setExperienceList([...experienceList, { ...expForm, _id: Date.now().toString() }]);
      setExpForm({ company: '', role: '', period: '', description: '' });
    }
  };

  const handleRemoveExperience = (id) => {
    setExperienceList(experienceList.filter(item => item._id !== id));
  };

  const handleFinishSetup = async () => {
    const skillsArray = skills
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      SetRepo: true,
    };

    if (username.trim()) payload.username = username.trim();
    if (bio.trim()) payload.bio = bio.trim();
    if (skillsArray.length > 0) payload.skills = skillsArray;
    if (selectedRepos.length > 0) payload.Filteredrepositories = selectedRepos;
    if (educationList.length > 0) payload.education = educationList;
    if (experienceList.length > 0) payload.workExperience = experienceList;

    const result = await updateAccountDetails(payload);

    if (result.success) {
      await fetchProfile(true);
    }
  };

  const renderContent = () => {
    if (authLoading || !user) {
      return (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          Loading profile...
        </div>
      );
    }
    if (user.SetRepo === false || user.SetRepo == null) {
      return (
        <div className="w-full h-full flex items-center justify-center text-white p-4">
          <div className="w-full max-w-xl p-8 bg-black/20 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex justify-between mb-6 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span className={step === 1 ? 'text-indigo-400' : ''}>1. Profile Info</span>
              <span className={step === 2 ? 'text-indigo-400' : ''}>2. Repositories</span>
              <span className={step === 3 ? 'text-indigo-400' : ''}>3. Details</span>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-slate-700 pb-3">Verify Your Profile</h2>

                {/* Avatar & Info Center Aligned */}
                <div className="flex flex-col items-center text-center bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 space-y-3">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-30 h-30 object-cover rounded-full border-2 border-indigo-500 shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center border-2 border-indigo-500">
                      <CatIcon className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name || 'Loading name...'}</h3>
                    <p className="text-sm text-slate-400">{user?.email || 'Loading email...'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Username</label>
                    <input
                      type="text"
                      placeholder="Set your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Bio</label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-slate-700 pb-3">Select Repositories</h2>

                <div className="relative">
                  <input
                    type="text"
                    value={repoSearchQuery}
                    onChange={(e) => {
                      setRepoSearchQuery(e.target.value);
                      setIsRepoDropdownOpen(true);
                    }}
                    onFocus={() => setIsRepoDropdownOpen(true)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Search your repositories to add..."
                  />
                  {isRepoDropdownOpen && repoSearchQuery.trim() !== '' && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto">
                      {filteredRepos.length > 0 ? (
                        filteredRepos.map((repo, index) => (
                          <div
                            key={index}
                            onClick={() => handleAddSelectedRepo(repo)}
                            className="px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer border-b border-slate-700/50 last:border-none flex items-center justify-between"
                          >
                            <span className="font-medium">{repo.name}</span>
                            <span className="text-xs text-slate-500 font-mono">{repo.language || 'Code'}</span>
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
                  <div className="space-y-2">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Selected Repositories</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                      {selectedRepos.map((repo, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-sm flex justify-between items-center"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-medium text-indigo-300 truncate">{repo.name}</span>
                            {repo.stargazers_count !== undefined && (
                              <span className="flex items-center gap-0.5 text-xs text-slate-500">
                                <Star className="w-3 h-3" />{repo.stargazers_count}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedRepo(repo.name)}
                            className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer shrink-0 ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">All Repositories</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 min-h-40 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {user?.repositories && user.repositories.length > 0 ? (
                      user.repositories.map((repo, index) => (
                        <div
                          key={index}
                          onClick={() => handleAddSelectedRepo(repo)}
                          className={`bg-slate-800/50 p-3 rounded-lg border text-sm flex justify-between items-center truncate cursor-pointer transition-all ${
                            selectedRepos.some(r => r.name === repo.name)
                              ? 'border-indigo-500/50 bg-indigo-500/10'
                              : 'border-slate-700/50 hover:border-slate-600'
                          }`}
                        >
                          <span className={`font-medium truncate ${
                            selectedRepos.some(r => r.name === repo.name) ? 'text-indigo-300' : 'text-slate-300'
                          }`}>
                            {typeof repo === 'string' ? repo : repo.name || `Repo #${index + 1}`}
                          </span>
                          {selectedRepos.some(r => r.name === repo.name) && (
                            <span className="text-xs text-indigo-400 shrink-0 ml-1">Added</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-sm text-slate-400 text-center py-6">No repositories found.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-slate-700 pb-3">Additional Details</h2>
                <div className="space-y-4 min-h-85 max-h-80 overflow-y-auto pr-1">
                  <div className='border-b border-white/30 pb-5'>
                    <h2 className="text-lg font-bold mb-2 pb-3">Skills Section</h2>
                    <label className="text-xs text-slate-400 block mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node, Tailwind (must be comma separated)"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className='border-b border-white/30 pb-5'>
                    <h2 className="text-lg font-bold mb-2 pb-3">Education</h2>
                    {educationList.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {educationList.map((edu) => (
                          <div key={edu._id} className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div className="text-sm">
                              <span className="text-indigo-300 font-medium">{edu.degree}</span>
                              <span className="text-slate-500 mx-1">-</span>
                              <span className="text-slate-400">{edu.institution}</span>
                              {edu.year && <span className="text-slate-500 ml-1">({edu.year})</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveEducation(edu._id)}
                              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Degree (e.g. BSCS)"
                        value={eduForm.degree}
                        onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="University / Institution"
                        value={eduForm.institution}
                        onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Year (e.g. 2020 - 2024)"
                        value={eduForm.year}
                        onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Education
                    </button>
                  </div>

                  <div className='pb-5'>
                    <h2 className="text-lg font-bold mb-2 pb-3">Work Experience</h2>
                    {experienceList.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {experienceList.map((exp) => (
                          <div key={exp._id} className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
                            <div className="text-sm">
                              <span className="text-indigo-300 font-medium">{exp.role}</span>
                              <span className="text-slate-500 mx-1">-</span>
                              <span className="text-slate-400">{exp.company}</span>
                              {exp.period && <span className="text-slate-500 ml-1">({exp.period})</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(exp._id)}
                              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Role / Position"
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Period (e.g. 2022 - Present)"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <textarea
                      placeholder="Description of responsibilities and achievements..."
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[60px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="mt-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Experience
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinishSetup}
                    disabled={utilityLoading}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                  >
                    {utilityLoading ? 'Saving...' : 'Finish'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    switch (activeItem) {
      case 'Accounts':
        return <Accounts />;
      case 'Dashboard':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
            <p className="text-[#8b949e]">Welcome to your main dashboard view.</p>
          </div>
        );
      case 'Repository':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Repositories</h1>
            <p className="text-[#8b949e]">Your synced code repositories.</p>
          </div>
        );
      case 'Analyze':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Analysis</h1>
            <p className="text-[#8b949e]">ML and code performance insights.</p>
          </div>
        );
      case 'Train':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Train Model</h1>
            <p className="text-[#8b949e]">Configure and start model training.</p>
          </div>
        );
      case 'Marketplace':
        return (
          <div className="p-8 text-[#c9d1d9]">
            <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
            <p className="text-[#8b949e]">Browse developer tools and models.</p>
          </div>
        );
      case 'Portfolio':
        return <Accounts />;
      case 'Settings':
        return <Setting />;
      case 'SharePortfolio':
        return <SharePortfolio />;
      default:
        return <Accounts />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(#8b949e_1px,transparent_1px),linear-gradient(90deg,#8b949e_1px,transparent_1px)] bg-[size:45px_45px] animate-[gridMove_18s_linear_infinite]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] rounded-full bg-[#238636] opacity-[0.06] blur-[120px] animate-[slowPulse_7s_ease-in-out_infinite]" />
      </div>

      {/* Navbar aur Sidebar sirf tab dikhayein jab setup complete ho chuka ho, warna setup screen akeli aayegi */}
      {user?.SetRepo === true && (
        <>
          <Navbar onSelectTab={(tab) => setActiveItem(tab)} />
          <Sidebar
            activeItem={activeItem}
            onSelect={(selectedLabel) => setActiveItem(selectedLabel)}
          />
        </>
      )}

      <main className={`flex-1 overflow-y-auto min-w-0 relative z-10 ${user?.SetRepo === true ? 'mt-20 pt-5' : 'h-full flex items-center justify-center'}`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default MainScreen;