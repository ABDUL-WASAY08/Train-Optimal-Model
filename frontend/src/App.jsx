import './App.css'
import AuthScreen from './Screen/Basic/AuthScreen'
import MainScreen from './Screen/Developers/MainScreen'
import PageNotFound from './Screen/Basic/pageNotFound'
import SplashScreen from './Screen/Basic/SplashScreen'
import Accounts from './Screen/Developers/Accounts'
import AccountSkelton from './Screen/Basic/AccountSkelton'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import './index.css'
import { Toaster } from "sonner"
import ProtectedMiddleware from './Middleware/ProtectedMiddleware'
import { useAuthStore } from './zustand/useAuthStore'
import { useEffect } from 'react'
import PublicPortfolio from './Screen/Developers/publicPortfolio'
import Features from './Screen/Basic/features'
import About from './Screen/Basic/About'
import Architecture from './Screen/Basic/Architecture'
import PreviewPortfolio from './Screen/Developers/previewPortfolio'
import ClientDashboard from './Screen/Clients/clientDashboard'
import AdminDashboard from './Screen/Admin/adminDashboard'
const PUBLIC_ROUTE_PREFIXES = [
  '/',
  '/authorization',
  '/user/portfolio',
  '/user/previewportfolio',
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
        <Toaster theme="light" position="top-center" richColors
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
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
        <Route path='/Features' element={<Features />} />
        <Route path='/About' element={<About />} />
        <Route path='/Architecture' element={<Architecture />} />
        <Route path="/user/portfolio/:username" element={<PublicPortfolio />} />
        <Route element={<ProtectedMiddleware />}>
          <Route path="/user/previewportfolio" element={<PreviewPortfolio />} />
          <Route path="/account" element={<Accounts />} />
          <Route path="/dashboard" element={<MainScreen />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>


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