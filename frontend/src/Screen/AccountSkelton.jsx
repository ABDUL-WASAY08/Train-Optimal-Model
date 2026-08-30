import React from 'react'

function AccountSkelton() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 md:p-8 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-[#161b22] border border-[#30363d] shadow-2xl rounded-2xl p-6 md:p-8 space-y-8">

        {/* Profile / Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 border-b border-[#30363d] pb-6">
          {/* Avatar Skeleton */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse border-2 border-[#30363d]" />

          {/* User Bio Lines */}
          <div className="flex-1 w-full space-y-3 pt-2 text-center sm:text-left">
            <div className="h-7 w-48 bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-lg mx-auto sm:mx-0" />
            <div className="h-4 w-72 bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-md mx-auto sm:mx-0" />
            <div className="h-3 w-32 bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-md mx-auto sm:mx-0 mt-2" />
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Field 1 */}
          <div className="space-y-2.5">
            <div className="h-4 w-28 bg-[#1c2128] rounded" />
            <div className="h-11 w-full bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-xl border border-[#30363d]" />
          </div>

          {/* Field 2 */}
          <div className="space-y-2.5">
            <div className="h-4 w-28 bg-[#1c2128] rounded" />
            <div className="h-11 w-full bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-xl border border-[#30363d]" />
          </div>

          {/* Field 3 (Full Width) */}
          <div className="space-y-2.5 md:col-span-2">
            <div className="h-4 w-20 bg-[#1c2128] rounded" />
            <div className="h-28 w-full bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-xl border border-[#30363d]" />
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="flex justify-end pt-2">
          <div className="h-11 w-36 bg-gradient-to-r from-[#1c2128] via-[#2d333b] to-[#1c2128] animate-pulse rounded-xl" />
        </div>

      </div>
    </div>
  )
}

export default AccountSkelton