import React from 'react'
import { Cat } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function AccountSkelton() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center overflow-hidden relative" style={{ backgroundColor: theme.bg }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: theme.glowCyan }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo with breathing animation */}
        <div className="relative">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse"
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.border}`,
              boxShadow: `0 0 30px ${theme.glowCyan}`,
            }}
          >
            <Cat className="w-10 h-10" style={{ color: theme.accent }} />
          </div>
          {/* Orbiting dot */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
            <div
              className="w-2 h-2 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"
              style={{
                backgroundColor: theme.accent,
                boxShadow: `0 0 8px ${theme.accent}`,
              }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-bold tracking-wide" style={{ color: theme.text }}>TOM</h2>
          <div className="flex items-center gap-1.5">
            <span className="text-xs" style={{ color: theme.subtext }}>Loading your workspace</span>
            <span className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: theme.accent, animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: theme.accent, animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: theme.accent, animationDelay: '300ms' }} />
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="w-48 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${theme.accent}, ${theme.accentViolet})`,
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

export default AccountSkelton;
