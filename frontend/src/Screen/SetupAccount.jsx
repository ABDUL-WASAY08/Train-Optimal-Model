import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../zustand/useAuthStore';
import { CatIcon } from 'lucide-react';

function SetupAccount() {
  const { fetchProfile, user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState({ school: '', degree: '' });
  const [experience, setExperience] = useState({ company: '', role: '' });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="w-screen h-screen min-w-[100vw] min-h-[100vh] bg-[#1e293b] flex items-center justify-center text-white overflow-hidden">
      <div className="w-full max-w-xl p-8 bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-700">
        
        <div className="flex justify-between mb-6 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span className={step === 1 ? 'text-indigo-400' : ''}>1. Profile Info</span>
          <span className={step === 2 ? 'text-indigo-400' : ''}>2. Repositories</span>
          <span className={step === 3 ? 'text-indigo-400' : ''}>3. Details</span>
        </div>
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-700 pb-3">Verify Your Profile</h2>
            
            <div className="flex items-center space-x-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <img 
                src={user?.avatarUrl || <CatIcon/>} 
                alt="Avatar" 
                className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{user?.name || "Loading name..."}</h3>
                <p className="text-sm text-slate-400">{user?.email || "Loading email..."}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400 block mb-1">Bio</span>
              <p className="text-sm text-slate-300 whitespace-pre-line">
                {user?.bio || "No bio available."}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-700 pb-3">Your Repositories</h2>
            
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {user?.repositories && user.repositories.length > 0 ? (
                user.repositories.map((repo, index) => (
                  <div key={index} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-sm flex justify-between items-center">
                    <span className="font-medium text-indigo-300">{typeof repo === 'string' ? repo : repo.name || `Repo #${index + 1}`}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">No repositories found or array is empty.</p>
              )}
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

        {/* PAGE 3: Skills, Education & Experience Forms */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold border-b border-slate-700 pb-3">Additional Details</h2>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. React, Node, Tailwind"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Education</label>
                <input 
                  type="text" 
                  placeholder="University / Degree"
                  value={education.degree}
                  onChange={(e) => setEducation({...education, degree: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Work Experience</label>
                <input 
                  type="text" 
                  placeholder="Company / Role"
                  value={experience.role}
                  onChange={(e) => setExperience({...experience, role: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
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
                onClick={() => {
                  console.log("Stopped at step 3 as requested!");
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-600/30"
              >
                Finish (Stop here)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SetupAccount;