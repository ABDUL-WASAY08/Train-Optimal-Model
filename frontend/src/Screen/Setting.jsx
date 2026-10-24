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
  BadgeCheck,
  Upload,
  Loader2,
  FileImage,
  Building2,
} from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function Setting() {
  const navigate = useNavigate();
  const { user, fetchProfile, setUser, deleteAccount } = useAuthStore();
  const { updateAccountDetails, loading } = useUtilityStore();
  const {
    certificates,
    certificatesLoading,
    uploadCertificates,
    getCertificates,
    deleteCertificates,
  } = useUtilityStore();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });
  const [experienceList, setExperienceList] = useState([]);
  const [expForm, setExpForm] = useState({ company: '', role: '', period: '', description: '' });
  const [accountInfo, openaccountInfo] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Search repo states
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Certificates states
  const [openCertificates, setOpenCertificates] = useState(false);
  const [certificateForm, setCertificateForm] = useState({
    image: null,
    certificateName: '',
    companyName: '',
    role: '',
    issueDate: '',
    description: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Delete account states
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchProfile();
    } else if (!initialized) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      if (user.skills && Array.isArray(user.skills)) setSkills(user.skills);
      if (user.education && Array.isArray(user.education)) setEducationList(user.education);
      if (user.workExperience && Array.isArray(user.workExperience)) setExperienceList(user.workExperience);
      if (user.dob) setDob(new Date(user.dob).toISOString().split('T')[0]);
      setInitialized(true);
    }
  }, [user, fetchProfile, initialized]);

  const filteredRepos = user?.repositories?.filter((repo) =>
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
    const alreadyAdded = user?.Filteredrepositories?.some((r) => r.name === repo.name);
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
    const updatedRepos = (user?.Filteredrepositories || []).filter((r) => r.name !== repoName);
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

  const loadCertificates = async () => {
    const res = await getCertificates();
    if (!res.success) {
      toast.error(res.error || 'Failed to load certificates');
    }
  };

  const handleToggleCertificates = () => {
    const next = !openCertificates;
    setOpenCertificates(next);
    if (next && certificates.length === 0) {
      loadCertificates();
    }
  };

  const handleCertificateFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setCertificateForm((prev) => ({ ...prev, image: file }));
  };

  const resetCertificateForm = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setCertificateForm({
      image: null,
      certificateName: '',
      companyName: '',
      role: '',
      issueDate: '',
      description: '',
    });
  };

  const handleUploadCertificate = async (e) => {
    e.preventDefault();
    if (!certificateForm.image) {
      toast.error('Please select a certificate image');
      return;
    }
    if (!certificateForm.certificateName.trim() || !certificateForm.companyName.trim()) {
      toast.error('Certificate name and company name are required');
      return;
    }

    const res = await uploadCertificates({
      image: certificateForm.image,
      certificateName: certificateForm.certificateName.trim(),
      companyName: certificateForm.companyName.trim(),
      role: certificateForm.role.trim(),
      issueDate: certificateForm.issueDate,
      description: certificateForm.description.trim(),
    });

    if (res.success) {
      toast.success('Certificate uploaded!');
      resetCertificateForm();
    } else {
      toast.error(res.error || 'Failed to upload certificate');
    }
  };

  const handleDeleteCertificate = async (id) => {
    setDeletingId(id);
    const res = await deleteCertificates(id);
    setDeletingId(null);

    if (res.success) {
      toast.success('Certificate deleted!');
    } else {
      toast.error(res.error || 'Failed to delete certificate');
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    const res = await deleteAccount();

    if (res?.success) {
      toast.success(res.message || 'Account deleted successfully');
      navigate('/Authorization', { replace: true });
    } else {
      setDeletingAccount(false);
      setConfirmDeleteAccount(false);
      toast.error(res?.error || 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      <div className="w-full pt-[15px] px-[5px] space-y-5">
        
        {/* Top Profile Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-normal text-xl overflow-hidden shrink-0 shadow-xs">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-7 h-7 text-slate-400" />
                )}
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  {user?.name || user?.username || 'Developer'}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{user?.email || 'No email associated'}</span>
                </div>
                {user?.username && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono rounded-md">
                    @{user.username}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
            {user?.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors">
                <GitBranch className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {user?.twitterUrl && (
              <a href={user.twitterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors">
                <span>Twitter</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {user?.websiteUrl && (
              <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors">
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="text-[11px] font-normal uppercase tracking-wider text-slate-400 mb-1">Bio</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {user?.bio || 'No bio available for this account yet.'}
            </p>
          </div>
        </div>

        {/* Account Details Toggle Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Account details & configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Manage your personal preferences, skills, repositories, education and work history
            </p>
          </div>

          <button
            type="button"
            className="px-3.5 py-2 bg-white text-slate-600 text-xs font-medium rounded-xl border border-slate-200 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
            onClick={() => openaccountInfo(!accountInfo)}
          >
            {accountInfo ? "Close Editor" : "Edit Details"}
          </button>
        </div>

        {accountInfo && (
          <div className="space-y-5 animate-in fade-in duration-200">
            
            {/* Personal Details Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h2 className="text-xs font-semibold text-slate-900 uppercase">Personal Details</h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      placeholder="Your username"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveUsername}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-normal text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    {loading ? 'Saving...' : 'Save Username'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 min-h-[60px]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveBio}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-normal text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    {loading ? 'Saving...' : 'Save Bio'}
                  </button>
                </div>

                <form onSubmit={handleSaveDob} className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-normal text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    {loading ? 'Saving...' : 'Save DOB'}
                  </button>
                </form>
              </div>
            </div>

            {/* GitHub & Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                    <Code className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-xs font-semibold text-slate-900 uppercase">GitHub Language Share</h2>
                  </div>

                  {user?.topLanguages && user.topLanguages.length > 0 ? (
                    <div className="space-y-3">
                      {user.topLanguages.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-normal text-slate-700">{item.language}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic font-normal">
                      No GitHub repository language data available.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
                    <Award className="w-4 h-4 text-indigo-600" />
                    <h2 className="text-xs font-semibold text-slate-900 uppercase">Skills & Competencies</h2>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {skills && skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-normal rounded-lg"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-rose-500 transition-colors cursor-pointer text-sm leading-none"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic font-normal">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Python, Docker)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </form>
              </div>
            </div>

            {/* Repositories & Projects */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FolderGit2 className="w-4 h-4 text-indigo-600" />
                <h2 className="text-xs font-semibold text-slate-900 uppercase">Repositories & Projects</h2>
              </div>

              <div className="relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Add synced repositories</span>
                  <div className="relative flex-1 w-full max-w-md">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      placeholder="Search Your Repositories To Add..."
                    />

                    {isDropdownOpen && searchQuery.trim() !== '' && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto">
                        {filteredRepos.length > 0 ? (
                          filteredRepos.map((repo, index) => (
                            <div
                              key={index}
                              onClick={() => handleAddRepo(repo)}
                              className="px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-none flex items-center justify-between"
                            >
                              <span className="font-normal text-slate-800">{repo.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{repo.language || 'Code'}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-3 py-2.5 text-xs text-slate-400 italic">
                            No matching repositories found.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {user?.Filteredrepositories && user.Filteredrepositories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {user.Filteredrepositories.map((repo, idx) => (
                    <div key={idx} className="bg-slate-50/70 border border-slate-200/80 p-3.5 rounded-xl flex flex-col justify-between space-y-2.5">
                      <div>
                        <div className="flex items-center justify-between">
                          <a href={repo.html_url || '#'} target="_blank" rel="noreferrer" className="text-xs font-semibold text-slate-900 hover:text-indigo-600 flex items-center gap-1">
                            {repo.name}
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>

                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => handleRemoveRepo(repo.name)} className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {repo.stargazers_count !== undefined && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span>{repo.stargazers_count}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 font-normal">
                          {repo.description || 'No description provided.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 font-mono">
                        {repo.language && <span>{repo.language}</span>}
                        {repo.has_readme && <span>README</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic font-normal">
                  No synced repositories available.
                </p>
              )}
            </div>

            {/* Education & Experience Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Education Background */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase">Education Background</h2>
                </div>

                <div className="space-y-2.5">
                  {educationList.map((edu) => (
                    <div
                      key={edu._id || edu.id}
                      className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl flex justify-between items-start"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <h4 className="text-xs font-semibold text-slate-900">{edu.degree}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-normal">{edu.institution}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{edu.year}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(edu._id || edu.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddEducation} className="pt-3 border-t border-slate-100 space-y-3">
                  <h3 className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    Add Education Record
                  </h3>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Degree (e.g. BSCS)"
                      value={eduForm.degree}
                      onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Institution / University"
                      value={eduForm.institution}
                      onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. 2020 - 2024)"
                      value={eduForm.year}
                      onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Education Record
                  </button>
                </form>
              </div>

              {/* Work Experience */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs font-semibold text-slate-900 uppercase">Work Experience</h2>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {experienceList.map((exp) => (
                    <div
                      key={exp._id || exp.id}
                      className="bg-slate-50/70 border border-slate-200/80 p-3 rounded-xl flex justify-between items-start"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-slate-900">{exp.role}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{exp.company}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{exp.period}</p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed font-normal">{exp.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(exp._id || exp.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddExperience} className="pt-3 border-t border-slate-100 space-y-3">
                  <h3 className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                    Add Work Experience
                  </h3>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Role / Position"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Period (e.g. 2022 - Present)"
                      value={expForm.period}
                      onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                    <textarea
                      placeholder="Description of responsibilities and achievements..."
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 min-h-[60px]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Experience Record
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* Certificates Section Header Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Certificates & Credentials
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Upload and manage professional certificates shown on your portfolio
            </p>
          </div>

          <button
            type="button"
            className="px-3.5 py-2 bg-white text-slate-600 text-xs font-medium rounded-xl border border-slate-200 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 hover:text-white hover:border-transparent transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
            onClick={handleToggleCertificates}
          >
            {openCertificates ? "Close Certificates" : "Manage Certificates"}
          </button>
        </div>

        {openCertificates && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5 animate-in fade-in duration-200">

            <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-indigo-600" />
                <h2 className="text-xs font-semibold text-slate-900 uppercase">Your Certificates</h2>
              </div>
              <button
                type="button"
                onClick={loadCertificates}
                disabled={certificatesLoading}
                className="text-[11px] text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer disabled:opacity-50 font-normal"
              >
                {certificatesLoading ? 'Refreshing...' : 'Refresh list'}
              </button>
            </div>

            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {certificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="bg-slate-50/70 border border-slate-200/80 rounded-xl overflow-hidden flex flex-col group"
                  >
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-32 bg-white border-b border-slate-200 overflow-hidden"
                    >
                      <img
                        src={cert.certificateUrl}
                        alt={cert.certificateName}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                      />
                    </a>

                    <div className="p-3.5 flex flex-col justify-between gap-2.5 flex-1">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                          {cert.certificateName}
                        </h4>

                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-normal">
                          <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                          {cert.companyName}
                        </p>

                        {cert.issueDate && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Issued {cert.issueDate}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-normal"
                        >
                          View Full <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDeleteCertificate(cert._id)}
                          disabled={deletingId === cert._id}
                          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1 disabled:opacity-50"
                          title="Delete certificate"
                        >
                          {deletingId === cert._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl py-8 px-4 text-center bg-slate-50/50">
                <FileImage className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                <p className="text-xs text-slate-400 italic font-normal">
                  {certificatesLoading ? 'Loading certificates...' : 'No certificates uploaded yet.'}
                </p>
              </div>
            )}

            <form
              onSubmit={handleUploadCertificate}
              className="pt-4 border-t border-slate-100 space-y-4"
            >
              <h3 className="text-[11px] font-normal text-slate-500 uppercase tracking-wider">
                Upload New Certificate
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                    Certificate Image
                  </label>

                  <label
                    htmlFor="certificate-image"
                    className="flex flex-col items-center justify-center gap-1.5 h-36 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 cursor-pointer hover:border-indigo-400 transition-colors overflow-hidden"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[11px] text-slate-400 text-center px-4 font-normal">
                          Click to select image (JPEG, PNG, WEBP — max 5MB)
                        </span>
                      </>
                    )}
                  </label>

                  <input
                    id="certificate-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleCertificateFile}
                    className="hidden"
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                      Certificate Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AWS Certified Solutions Architect"
                      value={certificateForm.certificateName}
                      onChange={(e) => setCertificateForm({ ...certificateForm, certificateName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                        Issuing Company
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Amazon"
                        value={certificateForm.companyName}
                        onChange={(e) => setCertificateForm({ ...certificateForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                        Issue Date
                      </label>
                      <input
                        type="date"
                        value={certificateForm.issueDate}
                        onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-normal uppercase tracking-wider">
                      Description <span className="normal-case tracking-normal text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      placeholder="What does this certificate prove?"
                      value={certificateForm.description}
                      onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 min-h-[50px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={certificatesLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  {certificatesLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" /> Upload Certificate
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetCertificateForm}
                  className="px-3.5 py-2 bg-white text-slate-600 text-xs font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Danger Zone Section */}
        <section className="pt-2">
          <h2 className="text-[11px] font-normal uppercase tracking-wider text-rose-600 mb-2">
            Danger Zone
          </h2>

          <div className="rounded-2xl border border-rose-200 bg-white overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} className="text-rose-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Delete Account
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                    Permanently delete your TOM account and associated data.
                  </p>
                </div>
              </div>

              {confirmDeleteAccount ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAccount(false)}
                    disabled={deletingAccount}
                    className="px-3 py-1.5 bg-white text-slate-600 text-xs font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    {deletingAccount ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
                      </>
                    ) : (
                      'Yes, Delete Account'
                    )}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteAccount(true)}
                  disabled={deletingAccount}
                  className="px-3.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-medium rounded-xl border border-rose-200 transition-all cursor-pointer shadow-2xs"
                >
                  Delete Account
                </button>
              )}
            </div>

            {confirmDeleteAccount && (
              <div className="px-5 pb-4 -mt-1 bg-rose-50/40 pt-2 border-t border-rose-100">
                <p className="text-[11px] text-rose-600 font-normal">
                  This permanently removes your profile, repositories, education, experience and certificates. This action cannot be undone.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Setting;