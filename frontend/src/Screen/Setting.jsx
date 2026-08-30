import React from 'react'
import { useAuthStore } from '../zustand/useAuthStore';

function Setting() {

    const { user } = useAuthStore();
  return (
    <div>{user?.name}</div>
  )
}

export default Setting