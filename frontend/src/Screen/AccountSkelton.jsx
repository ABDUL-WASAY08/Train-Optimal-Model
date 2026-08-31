import React from 'react'
import { Cat } from 'lucide-react'

function AccountSkelton() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col justify-center items-center overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3ecfff]/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo with breathing animation */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#161b22] border border-[#2a3441] flex items-center justify-center shadow-[0_0_30px_rgba(62,207,255,0.15)] animate-pulse">
            <Cat className="w-10 h-10 text-[#3ecfff]" />
          </div>
          {/* Orbiting dot */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
            <div className="w-2 h-2 bg-[#3ecfff] rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-[0_0_8px_#3ecfff]" />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold text-[#c9d1d9] tracking-wide">TOM</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#8b949e]">Loading your workspace</span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 bg-[#3ecfff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-[#3ecfff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-[#3ecfff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-[#161b22] rounded-full overflow-hidden border border-[#2a3441]">
          <div
            className="h-full bg-gradient-to-r from-[#3ecfff] to-[#8b5cf6] rounded-full"
            style={{
              animation: 'loadProgress 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadProgress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default AccountSkelton
