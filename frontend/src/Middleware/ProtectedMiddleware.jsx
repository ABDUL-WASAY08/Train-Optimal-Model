import React, { useEffect } from 'react'
import { useAuthStore } from '../zustand/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import AccountSkelton from '../Screen/AccountSkelton';

function ProtectedMiddleware() {
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Unauthorized! Please login first.');
    }
  }, [user, loading]);

  
    if (loading) {
    return <AccountSkelton />;
  };
  
  return user ? <Outlet /> : <Navigate to="/Authorization" replace />;
}

export default ProtectedMiddleware;