import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../Components/SideBar';
import Accounts from './Accounts';
import Setting from './Setting';
import { useAuthStore } from '../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

function MainScreen() {
  const [activeItem, setActiveItem] = useState('Portfolio');
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const renderContent = () => {
    switch (activeItem) {
      case 'Accounts':
        return <Accounts />;
      case 'Dashboard':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Dashboard</h1>
            <p style={{ color: theme.subtext }}>Welcome to your main dashboard view.</p>
          </div>
        );
      case 'Repository':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Repositories</h1>
            <p style={{ color: theme.subtext }}>Your synced code repositories.</p>
          </div>
        );
      case 'Analyze':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Analysis</h1>
            <p style={{ color: theme.subtext }}>ML and code performance insights.</p>
          </div>
        );
      case 'Train':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Train Model</h1>
            <p style={{ color: theme.subtext }}>Configure and start model training.</p>
          </div>
        );
      case 'Marketplace':
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Marketplace</h1>
            <p style={{ color: theme.subtext }}>Browse developer tools and models.</p>
          </div>
        );
      case 'Portfolio':
        return <Accounts />;
      case 'Settings':
        return <Setting />;
      default:
        return <Accounts />;
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res?.success) {
        toast.success("Logout successful");
        navigate('/Authorization');
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("An error occurred during sign out");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: theme.bg }}>
      <Sidebar activeItem={activeItem} onSelect={(label) => setActiveItem(label)} />
      <main className="flex-1 overflow-y-auto min-w-0">
        <p
          className="transition-colors duration-200 flex justify-end px-6 pt-5 cursor-pointer"
          style={{ color: theme.subtext }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.accent}
          onMouseLeave={(e) => e.currentTarget.style.color = theme.subtext}
          onClick={handleLogout}
        >
          SIGN OUT
        </p>
        {renderContent()}
      </main>
    </div>
  );
}

export default MainScreen;
