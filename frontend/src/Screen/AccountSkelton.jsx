import { useTheme } from '../context/ThemeContext';

function AccountSkelton() {
  const { theme } = useTheme();

  const card = { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, borderStyle: "solid", borderRadius: "16px", padding: "24px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" };

  const skeletonGradient = `linear-gradient(90deg, ${theme.skeletonBase} 0%, ${theme.skeletonMid} 50%, ${theme.skeletonBase} 100%)`;

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-center" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <div className="w-full max-w-4xl space-y-8" style={card}>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6" style={{ borderBottom: `1px solid ${theme.border}` }}>
          <div
            className="w-24 h-24 rounded-full animate-pulse"
            style={{ background: skeletonGradient, border: `2px solid ${theme.border}` }}
          />

          <div className="flex-1 w-full space-y-3 pt-2 text-center sm:text-left">
            <div className="h-7 w-48 animate-pulse rounded-lg mx-auto sm:mx-0" style={{ background: skeletonGradient }} />
            <div className="h-4 w-72 animate-pulse rounded-md mx-auto sm:mx-0" style={{ background: skeletonGradient }} />
            <div className="h-3 w-32 animate-pulse rounded-md mx-auto sm:mx-0 mt-2" style={{ background: skeletonGradient }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2.5">
            <div className="h-4 w-28 rounded" style={{ backgroundColor: theme.skeletonBase }} />
            <div className="h-11 w-full animate-pulse rounded-xl" style={{ background: skeletonGradient, border: `1px solid ${theme.border}` }} />
          </div>
          <div className="space-y-2.5">
            <div className="h-4 w-28 rounded" style={{ backgroundColor: theme.skeletonBase }} />
            <div className="h-11 w-full animate-pulse rounded-xl" style={{ background: skeletonGradient, border: `1px solid ${theme.border}` }} />
          </div>
          <div className="space-y-2.5 md:col-span-2">
            <div className="h-4 w-20 rounded" style={{ backgroundColor: theme.skeletonBase }} />
            <div className="h-28 w-full animate-pulse rounded-xl" style={{ background: skeletonGradient, border: `1px solid ${theme.border}` }} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <div className="h-11 w-36 animate-pulse rounded-xl" style={{ background: skeletonGradient }} />
        </div>

      </div>
    </div>
  );
}

export default AccountSkelton;
