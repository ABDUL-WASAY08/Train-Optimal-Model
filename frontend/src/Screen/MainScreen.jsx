import React from 'react'
import Sidebar from '../Components/SideBar'

function MainScreen() {
  return (
    <div className='flex h-screen w-full bg-main overflow-hidden'>
        <Sidebar />
    </div>
  )
}

export default MainScreen