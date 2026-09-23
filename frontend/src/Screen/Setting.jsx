import React, { useState, useEffect } from 'react';
import {
  Mail,
  User,
  Code,
  GraduationCap,
  Plus,
  Trash2,
  Award,
  BookOpen,
  Calendar,
  Globe,
  ExternalLink,
  FolderGit2,
  Star,
  GitBranch,
  Briefcase,
  AlertTriangle,
  Cross
} from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';
import { toast } from 'sonner';

function Setting() {
  const { user, fetchProfile, setUser } = useAuthStore();
  const { updateAccountDetails, loading } = useUtilityStore();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });
  const [experienceList, setExperienceList] = useState([]);
  const [expForm, setExpForm] = useState({ company: '', role: '', period: '', description: '' });
  const [accountInfo, openaccountInfo] = useState(false)
  const [initialized, setInitialized] = useState(false);
  // for adding repo 
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // fetching the profile 
  useEffect(() => {
    if (!user) {
      fetchProfile();
    } else if (!initialized) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      if (user.skills && Array.isArray(user.skills)) {
        setSkills(user.skills);
      }
      if (user.education && Array.isArray(user.education)) {
        setEducationList(user.education);
      }
      if (user.workExperience && Array.isArray(user.workExperience)) {
        setExperienceList(user.workExperience);
      }
      if (user.dob) {
        setDob(new Date(user.dob).toISOString().split('T')[0]);
      }
      setInitialized(true);
    }
  }, [user, fetchProfile, initialized]);
  // for search querry
  const filteredRepos = user?.repositories?.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  const handleSaveDob = async (e) => {
    e.preventDefault();
    const res = await updateAccountDetails({ dob });
    if (res?.success) {
      toast.success('Date of birth updated!');
      setUser(res.user);
    } else {
      toast.error(res?.error || 'Failed to update Date of Birth');
    }
  };

  const handleSaveUsername = async () => {
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error('Username cannot be empty');
      return;
    }
    const res = await updateAccountDetails({ username: trimmed });
    if (res?.success) {
      toast.success('Username updated!');
      setUser(res.user);
    } else {
      toast.error(res?.error || 'Failed to update username');
    }
  };

  const handleSaveBio = async () => {
    const res = await updateAccountDetails({ bio: bio.trim() });
    if (res?.success) {
      toast.success('Bio updated!');
      setUser(res.user);
    } else {
      toast.error(res?.error || 'Failed to update bio');
    }
  };

  const handleAddRepo = async (repo) => {
    const alreadyAdded = user?.Filteredrepositories?.some(r => r.name === repo.name);
    if (alreadyAdded) {
      toast.error('Repository already added');
      setSearchQuery('');
      setIsDropdownOpen(false);
      return;
    }
    const updatedRepos = [...(user?.Filteredrepositories || []), repo];
    const res = await updateAccountDetails({ Filteredrepositories: updatedRepos });
    if (res?.success) {
      setUser(res.user);
      toast.success('Repository added!');
      setSearchQuery('');
      setIsDropdownOpen(false);
    } else {
      toast.error(res?.error || 'Failed to add repository');
    }
  };

  const handleRemoveRepo = async (repoName) => {
    const updatedRepos = (user?.Filteredrepositories || []).filter(r => r.name !== repoName);
    const res = await updateAccountDetails({ Filteredrepositories: updatedRepos });
    if (res?.success) {
      setUser(res.user);
      toast.success('Repository removed!');
    } else {
      toast.error(res?.error || 'Failed to remove repository');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      const updatedSkills = [...skills, trimmedSkill];
      const res = await updateAccountDetails({ skills: updatedSkills });
      if (res.success) {
        setSkills(res.user?.skills || updatedSkills);
        setNewSkill('');
        setUser(res.user);
        toast.success('Skill added!');
      } else {
        toast.error(res.error);
      }
    }
  };
  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    const res = await updateAccountDetails({ skills: updatedSkills });
    if (res.success) {
      setSkills(res.user?.skills || updatedSkills);
      toast.success('Skill removed!');
      setUser(res.user);
    } else {
      toast.error(res.error);
    }
  };
  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (eduForm.degree && eduForm.institution && eduForm.year) {
      const updatedList = [...educationList, { ...eduForm, _id: Date.now().toString() }];
      const res = await updateAccountDetails({ education: updatedList });
      if (res.success) {
        setEducationList(res.user?.education || updatedList);
        setEduForm({ degree: '', institution: '', year: '' });
        toast.success('Education record saved!');
        setUser(res.user);
      } else {
        toast.error(res.error);
      }
    }
  };

  const handleDeleteEducation = async (id) => {
    const updatedList = educationList.filter((item) => (item._id || item.id) !== id);
    const res = await updateAccountDetails({ education: updatedList });
    if (res.success) {
      setEducationList(res.user?.education || updatedList);
      toast.success('Education record deleted!');
      setUser(res.user);
    } else {
      toast.error(res.error);
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    if (expForm.company && expForm.role && expForm.period && expForm.description) {
      const updatedList = [...experienceList, { ...expForm, _id: Date.now().toString() }];
      const res = await updateAccountDetails({ workExperience: updatedList });
      if (res.success) {
        setExperienceList(res.user?.workExperience || updatedList);
        setExpForm({ company: '', role: '', period: '', description: '' });
        toast.success('Work experience saved!');
        setUser(res.user);
      } else {
        toast.error(res.error);
      }
    }
  };

  const handleDeleteExperience = async (id) => {
    const updatedList = experienceList.filter((item) => (item._id || item.id) !== id);
    const res = await updateAccountDetails({ workExperience: updatedList });
    if (res.success) {
      setExperienceList(res.user?.workExperience || updatedList);
      toast.success('Work experience record deleted!');
      setUser(res.user);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen  text-[#c9d1d9] p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#0d1117] border border-[#2a3441] flex items-center justify-center text-[#c9d1d9] font-bold text-2xl shadow-inner overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-9 h-9" />
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#c9d1d9] flex items-center gap-2">
                  {user?.name || user?.username || 'Developer'}
                </h1>
                <div className="flex items-center gap-2 text-xs text-[#8b949e] mt-1">
                  <Mail className="w-3.5 h-3.5 text-[#8b949e]" />
                  <span>{user?.email || 'No email associated'}</span>
                </div>
                {user?.username && (
                  <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#0d1117] border border-[#2a3441] text-[#8b949e] text-[10px] font-mono rounded-md">
                    @{user.username}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
            {user?.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <GitBranch className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {user?.twitterUrl && (
              <a href={user.twitterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <span>Twitter</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {user?.websiteUrl && (
              <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors">
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-[#2a3441]">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Bio</h3>
            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              {user?.bio || 'No bio available for this account yet.'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800/80 pb-4 mb-6">
          <div>
            <h2 className='text-base font-semibold text-gray-100 tracking-wide'>
              Account details
            </h2>
            <p className='text-xs text-gray-400 mt-0.5'>
              Here you can edit your details for your portfolio
            </p>
          </div>

          <button
            type="button"
            className='px-4 py-2 text-xs font-medium text-gray-200 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer shadow-sm self-start sm:self-auto'
            onClick={() => openaccountInfo(!accountInfo)}
          >
            {accountInfo ? "CLOSE" : "EDIT"}
          </button>
        </div>
        {accountInfo && <div>
          <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 shadow-xl mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#8b949e]" />
              <h2 className="text-lg font-bold text-[#c9d1d9]">Personal Details</h2>
            </div>

            <div className="space-y-4 mb-4">
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                    placeholder="Your username"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveUsername}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Username'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e] min-h-[60px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveBio}
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save Bio'}
                </button>
              </div>

              <form onSubmit={handleSaveDob} className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1 w-full space-y-2">
                  <label className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {loading ? 'Saving...' : 'Save DOB'}
                </button>
              </form>
            </div>
          </div>

          {/* GitHub & Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">

            <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Code className="w-5 h-5 text-[#8b949e]" />
                  <h2 className="text-lg font-bold text-[#c9d1d9]">GitHub Language Share</h2>
                </div>

                {user?.topLanguages && user.topLanguages.length > 0 ? (
                  <div className="space-y-4">
                    {user.topLanguages.map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-[#c9d1d9]">{item.language}</span>
                          <span className="text-[#8b949e] font-mono">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#2a3441]">
                          <div
                            className="bg-[#8b949e] h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8b949e] italic">
                    No GitHub repository language data available.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#8b949e]" />
                  <h2 className="text-lg font-bold text-[#c9d1d9]">Skills & Competencies</h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {skills && skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] text-xs font-medium rounded-lg"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-400 transition-colors cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-[#8b949e] italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Python, Docker)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#8b949e]" />
              <h2 className="text-lg font-bold text-[#c9d1d9]">Repositories & Projects</h2>
            </div>
            <div className="relative">
              <div className='flex justify-between items-center gap-4'>
                <span className="text-sm font-bold text-[#c9d1d9]">Add repositories</span>
                <div className="relative flex-1 max-w-md">
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true); 
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className='w-full border rounded border-white/50 bg-[#0d1117] text-white px-4 py-1.5 text-xs focus:outline-none focus:border-blue-500'
                    placeholder='Search Your Repositories To Add...'
                  />

                  {/* Dropdown Suggestions List */}
                  {isDropdownOpen && searchQuery.trim() !== "" && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#0d1117] border border-[#2a3441] rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                      {filteredRepos.length > 0 ? (
                        filteredRepos.map((repo,index) => (
                          <div
                           key={index}
                            onClick={() => handleAddRepo(repo)}
                            className="px-4 py-2.5 text-xs text-[#c9d1d9] hover:bg-[#21262d] hover:text-white cursor-pointer border-b border-[#2a3441]/50 last:border-none flex items-center justify-between"
                          >
                            <span className="font-medium">{repo.name}</span>
                            <span className="text-[10px] text-[#8b949e] font-mono">{repo.language || 'Code'}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-xs text-[#8b949e] italic">
                          No matching repositories found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user?.Filteredrepositories && user.Filteredrepositories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.Filteredrepositories.map((repo, idx) => (
                  <div key={idx}>
                    <div className="bg-[#0d1117] border border-[#2a3441] p-4 rounded-xl flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <a href={repo.html_url || '#'} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#c9d1d9] hover:underline flex items-center gap-1.5">
                            {repo.name}
                            <ExternalLink className="w-3 h-3 text-[#8b949e]" />
                          </a>

                          <div className="flex items-center gap-3">
                            {/* delete repo  */}
                            <button type="button" onClick={() => handleRemoveRepo(repo.name)} className='text-gray-400 hover:text-red-400 transition-colors cursor-pointer'>
                              <Trash2 className="w-4 h-4" />
                            </button>

                            {repo.stargazers_count !== undefined && (
                              <div className="flex items-center gap-1 text-xs text-[#8b949e]">
                                <Star className="w-3.5 h-3.5 text-[#8b949e]" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#8b949e] mt-2 line-clamp-2">
                          {repo.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#8b949e] pt-2 border-t border-[#2a3441]/40">
                        {repo.language && <span className="font-mono">{repo.language}</span>}
                        {repo.has_readme && <span>README</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8b949e] italic">
                No synced repositories available.
              </p>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-[#161b22] border border-[#2a3441] mt-5 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#8b949e]" />
              <h2 className="text-lg font-bold text-[#c9d1d9]">Education Background</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationList.map((edu) => (
                <div
                  key={edu._id || edu.id}
                  className="bg-[#0d1117] border border-[#2a3441] p-4 rounded-xl flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#8b949e] shrink-0" />
                      <h4 className="text-sm font-bold text-[#c9d1d9]">{edu.degree}</h4>
                    </div>
                    <p className="text-xs text-[#8b949e]">{edu.institution}</p>
                    <p className="text-[10px] text-[#8b949e] font-mono">{edu.year}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(edu._id || edu.id)}
                    className="text-[#8b949e] hover:text-red-400 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddEducation} className="pt-4 border-t border-[#2a3441] space-y-4">
              <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                Add New Education Record
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Degree (e.g. BSCS)"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                  required
                />
                <input
                  type="text"
                  placeholder="Institution / University"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                  required
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2020 - 2024)"
                  value={eduForm.year}
                  onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                  className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Save Education Record
              </button>
            </form>
          </div>
          <div className="bg-[#161b22] border mt-5 border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#8b949e]" />
              <h2 className="text-lg font-bold text-[#c9d1d9]">Work Experience</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experienceList.map((exp) => (
                <div
                  key={exp._id || exp.id}
                  className="bg-[#0d1117] border border-[#2a3441] p-4 rounded-xl flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#c9d1d9]">{exp.role}</h4>
                    <p className="text-xs text-[#8b949e] font-medium">{exp.company}</p>
                    <p className="text-[10px] text-[#8b949e] font-mono">{exp.period}</p>
                    <p className="text-xs text-[#8b949e] mt-2 leading-relaxed">{exp.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteExperience(exp._id || exp.id)}
                    className="text-[#8b949e] hover:text-red-400 transition-colors cursor-pointer p-1 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddExperience} className="pt-4 border-t border-[#2a3441] space-y-4">
              <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                Add Work Experience
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                  required
                />
                <input
                  type="text"
                  placeholder="Role / Position"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                  required
                />
                <input
                  type="text"
                  placeholder="Period (e.g. 2022 - Present)"
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e]"
                  required
                />
              </div>

              <textarea
                placeholder="Description of responsibilities and achievements..."
                value={expForm.description}
                onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                className="w-full bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#8b949e] min-h-[80px]"
                required
              />

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Save Experience Record
              </button>
            </form>
          </div>

        </div>}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">
            Danger Zone
          </h2>

          <div className="rounded-xl border border-red-200 ">

            <div className="flex items-center justify-between gap-4 px-5 py-5">

              <div className="flex items-center gap-3">
                <AlertTriangle
                  size={18}
                  className="text-red-500 shrink-0"
                />

                <div>
                  <p className="text-sm font-medium ">
                    Delete Account
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Permanently delete your TOM account and associated data.
                  </p>
                </div>
              </div>

              <button
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer"
              >
                Delete Account
              </button>

            </div>

          </div>
        </section>


      </div>
    </div>
  );
}

export default Setting;