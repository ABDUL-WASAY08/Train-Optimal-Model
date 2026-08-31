import './App.css'
import AuthScreen from './Screen/AuthScreen'
import MainScreen from './Screen/MainScreen'
import PageNotFound from './Screen/pageNotFound'
import SplashScreen from './Screen/SplashScreen'
import Accounts from './Screen/Accounts'
import AccountSkelton from './Screen/AccountSkelton'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './index.css'
import { Toaster } from "sonner"
import ProtectedMiddleware from './Middleware/ProtectedMiddleware'
import { useAuthStore } from './zustand/useAuthStore'
import { useEffect } from 'react'

function App() {
  const { fetchProfile, loading } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Global App Loading View (Skeletal Screen)
  if (loading) {
    return (
      <>
        <Toaster theme="dark" position="top-right" richColors />
        <AccountSkelton />
      </>
    );
  }

  return (
    <>
      <Toaster theme="dark" position="top-right" richColors />
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<SplashScreen />} />
          <Route path='/Authorization' element={<AuthScreen />} />
          <Route element={<ProtectedMiddleware />}>
            <Route path="/dashboard" element={<MainScreen />} />
            <Route path="/account" element={<Accounts />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;