import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts';
import Setting from './Setting';
import SharePortfolio from './SharePortfolio';
import Navbar from '../Components/Navbar';
import { useAuthStore } from '../zustand/useAuthStore';
import Dashboard from './dashboard';
import SetupProfileModal from './SetupProfileModal';

function MainScreen() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Portfolio');
  const { fetchProfile, user, loading: authLoading } = useAuthStore();

  const renderContent = () => {
    if (authLoading || !user) {
      return (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          Loading profile...
        </div>
      );
    }
    if (user.SetRepo === false || user.SetRepo == null) {
      return <SetupProfileModal />;
    }
    switch (activeItem) {
      case 'Accounts':
        return <Accounts />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Repository':
        return (
          <div className="mx-auto max-w-5xl">
            <h1 className="page-title">Repositories</h1>
            <p className="page-sub">Your synced code repositories.</p>
            <div className="card mt-6 p-10 text-center text-sm text-slate-500">
              Repository sync is coming soon.
            </div>
          </div>
        );
      case 'Analyze':
        return (
          <div className="mx-auto max-w-5xl">
            <h1 className="page-title">Analysis</h1>
            <p className="page-sub">ML and code performance insights.</p>
            <div className="card mt-6 p-10 text-center text-sm text-slate-500">
              Code analysis is coming soon.
            </div>
          </div>
        );
      case 'Train':
        return (
          <div className="mx-auto max-w-5xl">
            <h1 className="page-title">Train Model</h1>
            <p className="page-sub">Configure and start model training.</p>
            <div className="card mt-6 p-10 text-center text-sm text-slate-500">
              Model training is coming soon.
            </div>
          </div>
        );
      case 'Marketplace':
        return (
          <div className="mx-auto max-w-5xl">
            <h1 className="page-title">Marketplace</h1>
            <p className="page-sub">Browse developer tools and models.</p>
            <div className="card mt-6 p-10 text-center text-sm text-slate-500">
              The marketplace is coming soon.
            </div>
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