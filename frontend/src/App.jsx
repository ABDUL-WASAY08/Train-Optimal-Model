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
import PublicPortfolio from './Screen/publicPortfolio'

function App() {
  const { fetchProfile, loading } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
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
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<SplashScreen />} />
          <Route path='/Authorization' element={<AuthScreen />} />
          <Route path="/dashboard" element={<MainScreen />} />
          <Route element={<ProtectedMiddleware />}>
            <Route path="/account" element={<Accounts />} />
          </Route>
          <Route path="/user/portfolio/:username" element={<PublicPortfolio />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;