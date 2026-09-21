import './App.css'
import AuthScreen from './Screen/AuthScreen'
import MainScreen from './Screen/MainScreen'
import PageNotFound from './Screen/pageNotFound'
import SplashScreen from './Screen/SplashScreen'
import Accounts from './Screen/Accounts'
import AccountSkelton from './Screen/AccountSkelton'
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom"
import './index.css'
import { Toaster } from "sonner"
import ProtectedMiddleware from './Middleware/ProtectedMiddleware'
import { useAuthStore } from './zustand/useAuthStore'
import { useEffect } from 'react'
import PublicPortfolio from './Screen/publicPortfolio'

const ClientDashboardPlaceholder = () => (
  <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
    <h1 className="text-2xl font-bold">Client Dashboard Coming Soon</h1>
  </div>
);

const AdminDashboardPlaceholder = () => (
  <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
    <h1 className="text-2xl font-bold">Admin Dashboard Coming Soon</h1>
  </div>
);

function AppRoutes() {
  const navigate = useNavigate();
  const { fetchProfile, loading, user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!loading && user) {
      const role = user.role;

      if (role === 'client') {
        navigate('/client-dashboard', { replace: true });
        return;
      }

      if (role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
        return;
      }
      if (role === 'developer') {
       
          navigate('/dashboard', { replace: true });
          return;
       
      }


    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div>
        <Toaster theme="dark" position="top-center" richColors
          toastOptions={{
            style: {
              background: '#00040c',
              color: '#ffffff',
              border: '1px solid #bec7df',
            },
          }} />
        <AccountSkelton />
      </div>
    );
  }

  return (
    <div>
      <Toaster theme="dark" position="top-center" richColors
        toastOptions={{
          style: {
            background: '#00040c',
            color: '#ffffff',
            border: '1px solid #bec7df',
          },
        }} />
      <Routes>
        <Route path='/' element={<SplashScreen />} />
        <Route path='/Authorization' element={<AuthScreen />} />

        <Route element={<ProtectedMiddleware />}>
          <Route path="/account" element={<Accounts />} />
          <Route path="/dashboard" element={<MainScreen />} />
          <Route path="/client-dashboard" element={<ClientDashboardPlaceholder />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPlaceholder />} />
        </Route>
        <Route path="/user/portfolio/:username" element={<PublicPortfolio />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;