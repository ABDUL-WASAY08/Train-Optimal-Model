import React, { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Mail,
  FolderGit2,
  Star,
  Check,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';
import { toast } from 'sonner';

function AccountSetup() {
  const { user, fetchProfile } = useAuthStore();
  const { updateAccountDetails, loading } = useUtilityStore();

  const [step, setStep] = useState(1);
  const [dob, setDob] = useState('');
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [educationList, setEducationList] = useState([]);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });
  const [experienceList, setExperienceList] = useState([]);
  const [expForm, setExpForm] = useState({ company: '', role: '', period: '', description: '' });

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const updateLocalUser = (updatedUser) => {
    if (updatedUser) {
      useAuthStore.setState({ user: updatedUser });
    }
  };
  const handleNextStep1 = async () => {
    if (!dob) {
      toast.error('Please select your date of birth');
      return;
    }
    const res = await updateAccountDetails({ dob });
    if (res?.success) {
      updateLocalUser(res.user);
      toast.success('Date of birth saved!');
      setStep(2);
    } else {
      toast.error(res?.error || 'Failed to save date of birth');
    }
  };
  const toggleRepo = (repo) => {
    setSelectedRepos((prev) => {
      const exists = prev.find((r) => r.name === repo.name);
      if (exists) {
        return prev.filter((r) => r.name !== repo.name);
      }
      return [...prev, repo];
    });
  };

  const handleNextStep2 = async () => {
    if (selectedRepos.length === 0) {
      toast.error('Please select at least one repository');
      return;
    }
    const res = await updateAccountDetails({ selectedRepositories: selectedRepos });
    if (res?.success) {
      updateLocalUser(res.user);
      toast.success('Repositories saved!');
      setStep(3);
    } else {
      toast.error(res?.error || 'Failed to save repositories');
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (eduForm.degree && eduForm.institution && eduForm.year) {
      setEducationList((prev) => [...prev, { ...eduForm, _id: Date.now().toString() }]);
      setEduForm({ degree: '', institution: '', year: '' });
    }
  };

  const handleDeleteEducation = (id) => {
    setEducationList((prev) => prev.filter((item) => item._id !== id));
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (expForm.company && expForm.role && expForm.period && expForm.description) {
      setExperienceList((prev) => [...prev, { ...expForm, _id: Date.now().toString() }]);
      setExpForm({ company: '', role: '', period: '', description: '' });
    }
  };

  const handleDeleteExperience = (id) => {
    setExperienceList((prev) => prev.filter((item) => item._id !== id));
  };

  const handleFinish = async () => {
    const res = await updateAccountDetails({
      skills,
      education: educationList,
      workExperience: experienceList,
      isSetupCompleted: true,
    });
    if (res?.success) {
      updateLocalUser(res.user);
      toast.success('Account setup completed!');
    } else {
      toast.error(res?.error || 'Failed to save account details');
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-[var(--pulse-cyan)] text-[#0d1117]'
                  : step > s
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-[#0d1117] text-[#8b949e] border border-[#2a3441]'
              }`}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:block ${
                step === s ? 'text-[var(--pulse-cyan)]' : 'text-[#8b949e]'
              }`}
            >
              {s === 1 ? 'Personal' : s === 2 ? 'Repositories' : 'Profile'}
            </span>
          </div>
          {s < 3 && (
            <div
              className={`w-12 h-0.5 rounded-full transition-all ${
                step > s ? 'bg-green-500/40' : 'bg-[#2a3441]'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );


  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#c9d1d9]">Personal Information</h2>
        <p className="text-xs text-[#8b949e] mt-1">Let's start with your basic details</p>
      </div>

      <div className="bg-[#0d1117] border border-[#2a3441] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#2a3441] flex items-center justify-center overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#8b949e]" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-[#c9d1d9]">{user?.name || user?.username || 'Developer'}</p>
            {user?.username && <p className="text-[10px] text-[#8b949e] font-mono">@{user.username}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#8b949e]">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email || 'No email associated'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Date of Birth
        </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#2a3441] rounded-xl px-4 py-3 text-sm text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)] transition-colors"
          required
        />
      </div>

      <button
        onClick={handleNextStep1}
        disabled={loading || !dob}
        className="w-full px-5 py-3 bg-[var(--pulse-cyan)] text-[#0d1117] hover:opacity-90 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Next <ArrowRight className="w-4 h-4" /></>}
      </button>
    </div>
  );

 
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#c9d1d9]">Select Repositories</h2>
        <p className="text-xs text-[#8b949e] mt-1">Choose which repos to feature on your profile</p>
      </div>

      {user?.repositories && user.repositories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {user.repositories.map((repo, idx) => {
            const isSelected = selectedRepos.some((r) => r.name === repo.name);
            return (
              <button
                key={idx}
                onClick={() => toggleRepo(repo)}
                className={`text-left bg-[#0d1117] border rounded-xl p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--pulse-cyan)] bg-[var(--pulse-cyan)]/5'
                    : 'border-[#2a3441] hover:border-[#8b949e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#c9d1d9] truncate">{repo.name}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--pulse-cyan)] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#0d1117]" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#8b949e] mt-1 line-clamp-2">
                  {repo.description || 'No description'}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-[#8b949e]">
                  {repo.language && <span className="font-mono">{repo.language}</span>}
                  {repo.stargazers_count !== undefined && (
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3" /> {repo.stargazers_count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-[#8b949e] italic text-center py-8">No repositories found from GitHub.</p>
      )}

      <p className="text-[10px] text-[#8b949e] text-center">
        {selectedRepos.length} repository{selectedRepos.length !== 1 ? 's' : ''} selected
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="px-5 py-3 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleNextStep2}
          disabled={loading || selectedRepos.length === 0}
          className="flex-1 px-5 py-3 bg-[var(--pulse-cyan)] text-[#0d1117] hover:opacity-90 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Next <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-[#c9d1d9]">Complete Your Profile</h2>
        <p className="text-xs text-[#8b949e] mt-1">Add skills, education, and work experience</p>
      </div>

      {/* Skills */}
      <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#8b949e]" />
          <h3 className="text-sm font-bold text-[#c9d1d9]">Skills</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
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

        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            placeholder="Add skill (e.g. Python, Docker)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-1 bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      {/* Education */}
      <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#8b949e]" />
          <h3 className="text-sm font-bold text-[#c9d1d9]">Education</h3>
        </div>

        {educationList.length > 0 && (
          <div className="space-y-2">
            {educationList.map((edu) => (
              <div
                key={edu._id}
                className="bg-[#0d1117] border border-[#2a3441] p-3 rounded-xl flex justify-between items-start"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#8b949e] shrink-0" />
                    <h4 className="text-xs font-bold text-[#c9d1d9]">{edu.degree}</h4>
                  </div>
                  <p className="text-[11px] text-[#8b949e]">{edu.institution}</p>
                  <p className="text-[10px] text-[#8b949e] font-mono">{edu.year}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="text-[#8b949e] hover:text-red-400 transition-colors cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddEducation} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Degree (e.g. BSCS)"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
              required
            />
            <input
              type="text"
              placeholder="Institution"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
              className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
              required
            />
            <input
              type="text"
              placeholder="Year (e.g. 2020 - 2024)"
              value={eduForm.year}
              onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
              className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Education
          </button>
        </form>
      </div>

      <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#8b949e]" />
          <h3 className="text-sm font-bold text-[#c9d1d9]">Work Experience</h3>
        </div>

        {experienceList.length > 0 && (
          <div className="space-y-2">
            {experienceList.map((exp) => (
              <div
                key={exp._id}
                className="bg-[#0d1117] border border-[#2a3441] p-3 rounded-xl flex justify-between items-start"
              >
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-[#c9d1d9]">{exp.role}</h4>
                  <p className="text-[11px] text-[#8b949e] font-medium">{exp.company}</p>
                  <p className="text-[10px] text-[#8b949e] font-mono">{exp.period}</p>
                  <p className="text-[11px] text-[#8b949e] mt-1 leading-relaxed">{exp.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteExperience(exp._id)}
                  className="text-[#8b949e] hover:text-red-400 transition-colors cursor-pointer p-1 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleAddExperience} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Company"
              value={expForm.company}
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={expForm.role}
              onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
              className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
              required
            />
            <input
              type="text"
              placeholder="Period (e.g. 2022 - Present)"
              value={expForm.period}
              onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
              className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)]"
              required
            />
          </div>
          <textarea
            placeholder="Description of responsibilities..."
            value={expForm.description}
            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            className="w-full bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-[var(--pulse-cyan)] min-h-[60px]"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </button>
        </form>
      </div>


      <div className="flex gap-3">
        <button
          onClick={() => setStep(2)}
          className="px-5 py-3 bg-[#0d1117] border border-[#2a3441] text-[#c9d1d9] hover:bg-[#21262d] rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleFinish}
          disabled={loading}
          className="flex-1 px-5 py-3 bg-green-500 text-[#0d1117] hover:opacity-90 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Finish Setup <Check className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <StepIndicator />
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}

export default AccountSetup;
