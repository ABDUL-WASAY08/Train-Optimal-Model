import Sidebar from '../Components/Sidebar';
import Accounts from './Accounts';
import Setting from './Setting';
import SharePortfolio from './SharePortfolio';
import Navbar from '../Components/Navbar';
import { useAuthStore } from '../zustand/useAuthStore';
import Dashboard from './Dashboard';
import SetupProfileModal from './SetupProfileModal';
import Repositories from './Repositories';
import { useState } from 'react';

function MainScreen() {
  const [activeItem, setActiveItem] = useState('PORTFOLIO');
  const { user, loading: authLoading } = useAuthStore();

  const renderContent = () => {
    if (authLoading || !user) {
      return (
        <div className="flex h-full w-full items-center justify-center text-slate-400 font-medium text-sm">
          Loading profile...
        </div>
      );
    }

    if (user.SetRepo === false || user.SetRepo == null) {
      return <SetupProfileModal />;
    }

    // Standardizing case handling for active menu items
    const selectedKey = activeItem.toUpperCase();

    switch (selectedKey) {
      case 'DASHBOARD':
        return <Dashboard />;

      case 'REPOSITORY':
        return <Repositories />;

      case 'AI ASSISTANT':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">AI Assistant</h1>
              <p className="text-xs text-slate-500">Repository-grounded conversational assistant (RAG).</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              AI Chat interface is coming soon.
            </div>
          </div>
        );

      case 'CODE ANALYSIS':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Code Analysis</h1>
              <p className="text-xs text-slate-500">Quality, security and maintainability scoring.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              Code analysis engine is coming soon.
            </div>
          </div>
        );

      case 'CODE IMPROVEMENT':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Code Improvement</h1>
              <p className="text-xs text-slate-500">AI-suggested refactoring and optimization.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              Code improvement suggestions are coming soon.
            </div>
          </div>
        );

      case 'README GENERATOR':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">README Generator</h1>
              <p className="text-xs text-slate-500">Auto-generate structured READMEs from repository AST.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              README generator module is coming soon.
            </div>
          </div>
        );

      case 'DOCUMENTATION':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Documentation</h1>
              <p className="text-xs text-slate-500">Comprehensive project and API documentation generator.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              Documentation suite is coming soon.
            </div>
          </div>
        );

      case 'MARKETPLACE':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Client Marketplace</h1>
              <p className="text-xs text-slate-500">Browse client job listings, projects, and proposals.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              Marketplace job board is coming soon.
            </div>
          </div>
        );

      case 'MY BIDS':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">My Bids</h1>
              <p className="text-xs text-slate-500">Track and manage your submitted proposals.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              Bidding management panel is coming soon.
            </div>
          </div>
        );

      case 'PROJECTS':
        return (
          <div className="mx-auto max-w-5xl space-y-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Active Projects</h1>
              <p className="text-xs text-slate-500">Milestones, escrow, and active client contracts.</p>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center text-xs font-semibold text-slate-500 shadow-2xs">
              Projects tracking dashboard is coming soon.
            </div>
          </div>
        );

      case 'PORTFOLIO':
      case 'ACCOUNTS':
        return <Accounts activeItem={activeItem}
          onSelect={(selectedLabel) => setActiveItem(selectedLabel)} />;

      case 'SETTINGS':
        return <Setting />;

      case 'SHAREPORTFOLIO':
        return <SharePortfolio />;

      default:
        return <Accounts />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {user?.SetRepo === true && (
        <>
          <Sidebar
            activeItem={activeItem}
            onSelect={(selectedLabel) => setActiveItem(selectedLabel)}
          />
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            <Navbar onSelectTab={(tab) => setActiveItem(tab)} />
            <main className="flex-1 overflow-y-auto min-w-0 p-4 sm:p-6 lg:p-8">
              {renderContent()}
            </main>
          </div>
        </>
      )}

      {user?.SetRepo !== true && (
        <main className="flex-1 h-full overflow-y-auto flex items-center justify-center p-4">
          {renderContent()}
        </main>
      )}
    </div>
  );
}

export default MainScreen;