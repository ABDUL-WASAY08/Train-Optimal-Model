import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CatIcon } from 'lucide-react';
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
  const [skills, setSkills] = useState('');
  const [education, setEducation] = useState({ school: '', degree: '' });
  const [experience, setExperience] = useState({ company: '', role: '' });

  const handleFinishSetup = async () => {
    const payload = {
      skills: skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      education: {
        school: education.school,
        degree: education.degree,
      },
      workExperience: {
        company: experience.company,
        role: experience.role,
      },
      SetRepo: true,
    };

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
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <CatIcon className="w-8 h-8 text-slate-400" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{user?.name || 'Loading name...'}</h3>
                    <p className="text-sm text-slate-400">{user?.email || 'Loading email...'}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <span className="text-xs text-slate-400 block mb-1">Bio</span>
                  <p className="text-sm text-slate-300 whitespace-pre-line">
                    {user?.bio || 'No bio available.'}
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
                      onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Work Experience</label>
                    <input
                      type="text"
                      placeholder="Company / Role"
                      value={experience.role}
                      onChange={(e) => setExperience({ ...experience, role: e.target.value })}
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

    // 2. Agar SetRepo true hai, toh normal Dashboard/Sidebar navigation chalegi
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