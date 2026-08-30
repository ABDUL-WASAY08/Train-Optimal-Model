import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Mail, 
  User, 
  Code, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Check, 
  Award,
  BookOpen,
  Calendar,
  Globe,
  ExternalLink,
  FolderGit2,
  Star,
  GitBranch,
  Briefcase
} from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { toast } from 'sonner';

function Accounts() {
  const { user, fetchProfile, updateDob } = useAuthStore();

  const [copied, setCopied] = useState(false);
  const [dob, setDob] = useState('');
  const [savingDob, setSavingDob] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [educationList, setEducationList] = useState([
    { id: 1, degree: 'B.S. Computer Science', institution: 'COMSATS University', year: '2021 - 2025' }
  ]);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });
  const [experienceList, setExperienceList] = useState([
    { 
      id: 1, 
      company: 'Tech Solutions Inc.', 
      role: 'Frontend Developer Intern', 
      period: 'Jan 2024 - Present', 
      description: 'Worked on React UI components and state management integration.' 
    }
  ]);
  const [expForm, setExpForm] = useState({ company: '', role: '', period: '', description: '' });
  useEffect(() => {
    if (!user) {
      fetchProfile();
    } else {
      if (user.skills && Array.isArray(user.skills)) {
        setSkills(user.skills);
      }
      if (user.dob) {
        setDob(new Date(user.dob).toISOString().split('T')[0]);
      }
    }
  }, [user, fetchProfile]);

  // Handle Share Profile Link Copy
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // DOB Save Handler
  const handleSaveDob = async (e) => {
    e.preventDefault();
    setSavingDob(true);
    const res = await updateDob(dob);
    setSavingDob(false);
    if (res?.success) {
      toast.success('Date of birth successfully updated!');
    } else {
      toast.error(res?.error || 'Failed to update Date of Birth');
    }
  };

  // Add new skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Add new Education record
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (eduForm.degree && eduForm.institution && eduForm.year) {
      setEducationList([...educationList, { ...eduForm, id: Date.now() }]);
      setEduForm({ degree: '', institution: '', year: '' });
    }
  };

  // Delete Education record
  const handleDeleteEducation = (id) => {
    setEducationList(educationList.filter((item) => item.id !== id));
  };

  // Add new Experience record
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (expForm.company && expForm.role && expForm.period && expForm.description) {
      setExperienceList([...experienceList, { ...expForm, id: Date.now() }]);
      setExpForm({ company: '', role: '', period: '', description: '' });
    }
  };

  // Delete Experience record
  const handleDeleteExperience = (id) => {
    setExperienceList(experienceList.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER SECTION: User Profile Details & Social Links */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            
            <div className="flex items-center gap-5">
              {/* Profile Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#0d1117] border border-[#2a3441] flex items-center justify-center text-[#c9d1d9] font-bold text-2xl shadow-inner overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-9 h-9" />
                )}
              </div>

              {/* Profile Name, Email & Username */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#c9d1d9] flex items-center gap-2">
                  {user?.name || user?.username || 'Developer Name'}
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

            {/* Share Profile Button */}
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-[#0d1117] hover:bg-[#21262d] text-[#c9d1d9] border border-[#2a3441] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#c9d1d9]" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>
          </div>

          {/* Social Links Row */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
            {user?.githubUrl && (
              <a 
                href={user.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {user?.twitterUrl && (
              <a 
                href={user.twitterUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
              >
                <span>Twitter</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {user?.websiteUrl && (
              <a 
                href={user.websiteUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* User Bio */}
          <div className="mt-6 pt-6 border-t border-[#2a3441]">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Bio</h3>
            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              {user?.bio || 'No bio available for this account yet.'}
            </p>
          </div>
        </div>

        {/* PERSONAL INFORMATION: Date of Birth Section */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#8b949e]" />
            <h2 className="text-lg font-bold text-[#c9d1d9]">Personal Details</h2>
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
              disabled={savingDob}
              className="px-5 py-2.5 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {savingDob ? 'Saving...' : 'Save DOB'}
            </button>
          </form>
        </div>

        {/* GRID SECTION: Visual Languages Intensity & Skills Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Language Intensity (Visual Progress Bars) */}
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
                  No GitHub repository language data available. Log in via GitHub to sync.
                </p>
              )}
            </div>
          </div>

          {/* 2. Skills Management Form */}
          <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[#8b949e]" />
                <h2 className="text-lg font-bold text-[#c9d1d9]">Skills & Competencies</h2>
              </div>

              {/* Dynamic Skills Tags */}
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

            {/* Add Skill Form */}
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

        {/* MINIMAL REPOSITORIES SECTION */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-[#8b949e]" />
            <h2 className="text-lg font-bold text-[#c9d1d9]">Repositories & Projects</h2>
          </div>

          {user?.repositories && user.repositories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.repositories.map((repo, idx) => (
                <div key={idx} className="bg-[#0d1117] border border-[#2a3441] p-4 rounded-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <a href={repo.html_url || '#'} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#c9d1d9] hover:underline flex items-center gap-1.5">
                        {repo.name}
                        <ExternalLink className="w-3 h-3 text-[#8b949e]" />
                      </a>
                      {repo.stargazers_count !== undefined && (
                        <div className="flex items-center gap-1 text-xs text-[#8b949e]">
                          <Star className="w-3.5 h-3.5 text-[#8b949e]" />
                          <span>{repo.stargazers_count}</span>
                        </div>
                      )}
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
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8b949e] italic">
              No synced repositories available. Connect GitHub to fetch projects and README data.
            </p>
          )}
        </div>

        {/* EDUCATION SECTION: Form & List */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#8b949e]" />
            <h2 className="text-lg font-bold text-[#c9d1d9]">Education Background</h2>
          </div>

          {/* Education Display List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationList.map((edu) => (
              <div
                key={edu.id}
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
                  onClick={() => handleDeleteEducation(edu.id)}
                  className="text-[#8b949e] hover:text-red-400 transition-colors cursor-pointer p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Education Form */}
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

        {/* EXPERIENCE SECTION: Form & List */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#8b949e]" />
            <h2 className="text-lg font-bold text-[#c9d1d9]">Work Experience</h2>
          </div>

          {/* Experience Display List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experienceList.map((exp) => (
              <div
                key={exp.id}
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
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="text-[#8b949e] hover:text-red-400 transition-colors cursor-pointer p-1 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Experience Form */}
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

      </div>
    </div>
  );
}

export default Accounts;