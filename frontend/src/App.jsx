import './App.css'
import AuthScreen from './Screen/AuthScreen'
import MainScreen from './Screen/MainScreen'
import PageNotFound from './Screen/pageNotFound'
import SplashScreen from './Screen/SplashScreen'
import Accounts from './Screen/Accounts'
import AccountSkelton from './Screen/AccountSkelton'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom"
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

const PUBLIC_ROUTE_PREFIXES = [
  '/',
  '/authorization',
  '/user/portfolio',
];

function isPublicRoute(pathname) {
  const path = pathname.toLowerCase();
  return PUBLIC_ROUTE_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchProfile, loading, user } = useAuthStore();

  const onPublicRoute = isPublicRoute(location.pathname);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (onPublicRoute) return;
    if (loading || !user) return;

    const role = user.role;
    const roleRoutes = {
      client: '/client-dashboard',
      admin: '/admin-dashboard',
      developer: '/dashboard',
    };

    const target = roleRoutes[role];
    if (target && location.pathname !== target) {
      navigate(target, { replace: true });
    }
  }, [loading, user, navigate, onPublicRoute, location.pathname]);

  if (loading && !onPublicRoute) {
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