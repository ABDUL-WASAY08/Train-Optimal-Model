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
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore'; // Path to your Zustand store

function Accounts() {
  // 1. Get user data from Zustand store
  const { user, fetchProfile } = useAuthStore();

  // Local state for interactive sections
  const [copied, setCopied] = useState(false);
  
  // Skills state
  const [skills, setSkills] = useState(['React', 'Node.js', 'Tailwind CSS', 'MongoDB']);
  const [newSkill, setNewSkill] = useState('');

  // Education state & form inputs
  const [educationList, setEducationList] = useState([
    { id: 1, degree: 'B.S. Computer Science', institution: 'COMSATS University', year: '2021 - 2025' }
  ]);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '' });

  // Fetch profile on component mount if not loaded
  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  // Handle Share Profile Link Copy
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER SECTION: User Profile Details & Share Button */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            
            <div className="flex items-center gap-5">
              {/* Profile Avatar */}
              <div className="w-20 h-20 rounded-full bg-[#0d1117] border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-2xl shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-9 h-9" />}
              </div>

              {/* Profile Name, Email & Username */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#c9d1d9] flex items-center gap-2">
                  {user?.name || user?.username || 'Developer Name'}
                </h1>
                <div className="flex items-center gap-2 text-xs text-[#8b949e] mt-1">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
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
              className="px-4 py-2 bg-[#0d1117] hover:bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>
          </div>

          {/* User Bio */}
          <div className="mt-6 pt-6 border-t border-[#2a3441]">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">Bio</h3>
            <p className="text-sm text-[#c9d1d9] leading-relaxed">
              {user?.bio || 'No bio available for this account yet.'}
            </p>
          </div>
        </div>

        {/* GRID SECTION: Visual Languages Intensity & Skills Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Language Intensity (Visual Progress Bars) */}
          <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code className="w-5 h-5 text-cyan-400" />
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
                      <div className="w-full bg-[#0d1117] h-2.5 rounded-full overflow-hidden border border-[#2a3441]">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all duration-500"
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
                <Award className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg font-bold text-[#c9d1d9]">Skills & Competencies</h2>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#0d1117] border border-cyan-500/30 text-cyan-400 text-xs font-medium rounded-lg"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 transition-colors cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Skill Form */}
            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Python, Docker)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
          </div>
        </div>

        {/* EDUCATION SECTION: Form & List */}
        <div className="bg-[#161b22] border border-[#2a3441] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
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
                    <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                    <h4 className="text-sm font-bold text-[#c9d1d9]">{edu.degree}</h4>
                  </div>
                  <p className="text-xs text-[#8b949e]">{edu.institution}</p>
                  <p className="text-[10px] text-cyan-400 font-mono">{edu.year}</p>
                </div>
                <button
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
                className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Institution / University"
                value={eduForm.institution}
                onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-cyan-500"
                required
              />
              <input
                type="text"
                placeholder="Year (e.g. 2020 - 2024)"
                value={eduForm.year}
                onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })}
                className="bg-[#0d1117] border border-[#2a3441] rounded-xl px-3 py-2 text-xs text-[#c9d1d9] focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Save Education Record
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Accounts;