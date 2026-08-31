import { useState } from "react";
import { useAuthStore } from "../zustand/useAuthStore";
import { useTheme } from "../context/ThemeContext";
import { toast } from "sonner";
import {
  Mail, GitBranch, ExternalLink, Sun, Moon,
  Bell, Cpu, MessageSquare, Eye, Search, Lock,
  Globe, Clock, AlertTriangle, ChevronRight, X,
} from "lucide-react";

function SettingsSection({ title, children, theme }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: theme.subtext }}>{title}</h2>
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }}>
        {children}
      </div>
    </section>
  );
}

function SettingRow({ icon: Icon, label, description, children, last, theme }) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-5 py-4"
      style={!last ? { borderBottom: `1px solid ${theme.border}` } : {}}
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && <Icon size={16} style={{ color: theme.subtext }} className="shrink-0" />}
        <div className="min-w-0">
          <p className="text-sm font-medium" style={{ color: theme.text }}>{label}</p>
          {description && <p className="text-xs mt-0.5" style={{ color: theme.subtext }}>{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, theme }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: checked ? theme.accent : theme.border }}
    >
      <span
        className="pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-sm transition-transform duration-200"
        style={{
          backgroundColor: checked ? theme.bg : theme.subtext,
          transform: checked ? "translateX(18px)" : "translateX(2px)",
          marginTop: "2px",
        }}
      />
    </button>
  );
}

function ConfirmModal({ title, description, confirmLabel, onConfirm, onCancel, theme }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onCancel}>
      <div className="w-full max-w-md rounded-xl p-6 shadow-2xl" style={{ backgroundColor: theme.card, border: `1px solid ${theme.border}` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.error}15` }}>
              <AlertTriangle size={18} style={{ color: theme.error }} />
            </div>
            <h3 className="text-base font-bold" style={{ color: theme.text }}>{title}</h3>
          </div>
          <button onClick={onCancel} className="p-1 rounded-md transition-colors cursor-pointer" style={{ color: theme.subtext }}>
            <X size={16} />
          </button>
        </div>
        <p className="text-sm mb-6 pl-11" style={{ color: theme.subtext }}>{description}</p>
        <div className="flex justify-end gap-3 pl-11">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer" style={{ backgroundColor: theme.bg, color: theme.inputText, border: `1px solid ${theme.border}` }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer" style={{ backgroundColor: theme.error, color: "#ffffff" }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Settings() {
  const { user } = useAuthStore();
  const { isDark, setIsDark, theme } = useTheme();

  const [notifications, setNotifications] = useState({
    commitStreak: true, dailySummary: true, repoUpdates: true, aiUpdates: true, messages: true,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true, recruiterDiscovery: true, privateRepoAnalysis: false, profileSharing: true,
  });
  const [preferences] = useState({
    language: "English",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi",
  });
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleNotification = (key) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  const togglePrivacy = (key) => setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleDisconnect = () => { setShowDisconnectModal(false); toast.success("GitHub account disconnected"); };
  const handleDeleteAccount = () => { setShowDeleteModal(false); toast.success("Account deletion requested"); };

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ backgroundColor: theme.bg, color: theme.text }}>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: theme.subtext }}>Manage your TOM account, preferences, GitHub connection and privacy.</p>
        </div>

        <SettingsSection title="Account" theme={theme}>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shrink-0" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold" style={{ color: theme.accent }}>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold truncate" style={{ color: theme.text }}>{user?.name || "User"}</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: theme.subtext }}>@{user?.username || "username"}</p>
              </div>
            </div>

            <div className="space-y-0">
              <div className="flex items-center justify-between py-3 px-1" style={{ borderBottom: `1px solid ${theme.border}` }}>
                <div className="flex items-center gap-2.5">
                  <Mail size={14} style={{ color: theme.subtext }} />
                  <span className="text-xs" style={{ color: theme.subtext }}>Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: theme.inputText }}>{user?.email || "No email"}</span>
                  {user?.email && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${theme.success}15`, color: theme.success }}>Verified</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between py-3 px-1">
                <div className="flex items-center gap-2.5">
                  <GitBranch size={14} style={{ color: theme.subtext }} />
                  <span className="text-xs" style={{ color: theme.subtext }}>GitHub</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium font-mono" style={{ color: theme.inputText }}>@{user?.username}</span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: theme.accent }} />
                    Connected
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${theme.border}` }}>
              {user?.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors" style={{ color: theme.inputText, backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                  <ExternalLink size={12} /> View GitHub Profile
                </a>
              )}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance" theme={theme}>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text }}>Theme</p>
                <p className="text-xs mt-0.5" style={{ color: theme.subtext }}>Customize how TOM looks across your devices.</p>
              </div>
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                style={{
                  backgroundColor: theme.bg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {isDark ? <Moon size={14} /> : <Sun size={14} />}
                <span>{isDark ? "Dark" : "Light"}</span>
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications" theme={theme}>
          <div>
            <SettingRow icon={GitBranch} label="Commit Streak Alerts" description="Get notified when your GitHub streak is at risk." checked={notifications.commitStreak} onChange={() => toggleNotification("commitStreak")} theme={theme}>
              <Toggle checked={notifications.commitStreak} onChange={() => toggleNotification("commitStreak")} theme={theme} />
            </SettingRow>
            <SettingRow icon={Bell} label="Daily Activity Summary" description="Receive a summary of your GitHub activity." checked={notifications.dailySummary} onChange={() => toggleNotification("dailySummary")} theme={theme}>
              <Toggle checked={notifications.dailySummary} onChange={() => toggleNotification("dailySummary")} theme={theme} />
            </SettingRow>
            <SettingRow icon={GitBranch} label="Repository Updates" description="Notify me when connected repositories change." checked={notifications.repoUpdates} onChange={() => toggleNotification("repoUpdates")} theme={theme}>
              <Toggle checked={notifications.repoUpdates} onChange={() => toggleNotification("repoUpdates")} theme={theme} />
            </SettingRow>
            <SettingRow icon={Cpu} label="AI / Model Updates" description="Get notified when analysis or model processing is complete." checked={notifications.aiUpdates} onChange={() => toggleNotification("aiUpdates")} theme={theme}>
              <Toggle checked={notifications.aiUpdates} onChange={() => toggleNotification("aiUpdates")} theme={theme} />
            </SettingRow>
            <SettingRow icon={MessageSquare} label="New Messages" description="Notify me when you receive a new message." checked={notifications.messages} onChange={() => toggleNotification("messages")} last theme={theme}>
              <Toggle checked={notifications.messages} onChange={() => toggleNotification("messages")} theme={theme} />
            </SettingRow>
          </div>
        </SettingsSection>

        <SettingsSection title="GitHub Integration" theme={theme}>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch size={18} style={{ color: theme.text }} />
              <div>
                <p className="text-sm font-bold" style={{ color: theme.text }}>GitHub</p>
                <p className="text-xs font-mono" style={{ color: theme.subtext }}>@{user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: theme.bg }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.success }} />
              <span className="text-xs font-medium" style={{ color: theme.success }}>Connected</span>
              <span className="text-xs" style={{ color: theme.subtext }}>&mdash; Connected through GitHub OAuth</span>
            </div>
            <div className="py-3 mb-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <p className="text-xs font-semibold mb-1" style={{ color: theme.subtext }}>Repository Access</p>
              <p className="text-sm" style={{ color: theme.inputText }}>All public repositories</p>
            </div>
            <div className="py-3 mb-4">
              <p className="text-xs font-semibold mb-1" style={{ color: theme.subtext }}>Connected Repositories</p>
              <p className="text-sm" style={{ color: theme.inputText }}>{user?.repositories?.length || 0} repositories synced</p>
            </div>
            <div className="flex items-center gap-3">
              {user?.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors" style={{ color: theme.inputText, backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                  <ExternalLink size={12} /> Open GitHub
                </a>
              )}
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer" style={{ color: theme.inputText, backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                <Lock size={12} /> Manage Repository Access
              </button>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Privacy & Discovery" theme={theme}>
          <div>
            <SettingRow icon={Eye} label="Public Profile" description="Allow your profile to be visible to others." theme={theme}>
              <Toggle checked={privacy.publicProfile} onChange={() => togglePrivacy("publicProfile")} theme={theme} />
            </SettingRow>
            <SettingRow icon={Search} label="Recruiter Discovery" description="Allow recruiters to discover your profile." theme={theme}>
              <Toggle checked={privacy.recruiterDiscovery} onChange={() => togglePrivacy("recruiterDiscovery")} theme={theme} />
            </SettingRow>
            <SettingRow icon={Lock} label="Private Repository Analysis" description="Allow TOM to analyze private repositories." theme={theme}>
              <Toggle checked={privacy.privateRepoAnalysis} onChange={() => togglePrivacy("privateRepoAnalysis")} theme={theme} />
            </SettingRow>
            <SettingRow icon={Globe} label="Profile Sharing" description="Allow recruiters to view your GitHub-based profile/scorecard." last theme={theme}>
              <Toggle checked={privacy.profileSharing} onChange={() => togglePrivacy("profileSharing")} theme={theme} />
            </SettingRow>
          </div>
        </SettingsSection>

        <SettingsSection title="Preferences" theme={theme}>
          <div>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <div className="flex items-center gap-3">
                <Globe size={16} style={{ color: theme.subtext }} />
                <p className="text-sm font-medium" style={{ color: theme.text }}>Language</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: theme.inputText }}>{preferences.language}</span>
                <ChevronRight size={14} style={{ color: theme.subtext }} />
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Clock size={16} style={{ color: theme.subtext }} />
                <p className="text-sm font-medium" style={{ color: theme.text }}>Time Zone</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: theme.inputText }}>{preferences.timezone}</span>
                <ChevronRight size={14} style={{ color: theme.subtext }} />
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Danger Zone" theme={theme}>
          <div>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${theme.border}` }}>
              <div className="flex items-center gap-3">
                <GitBranch size={16} style={{ color: theme.subtext }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>Disconnect GitHub</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.subtext }}>Disconnect your GitHub account from TOM.</p>
                </div>
              </div>
              <button onClick={() => setShowDisconnectModal(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer" style={{ color: theme.error, backgroundColor: `${theme.error}15`, border: `1px solid ${theme.error}30` }}>
                Disconnect
              </button>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={16} style={{ color: theme.error }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.text }}>Delete Account</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.subtext }}>Permanently delete your TOM account and associated data.</p>
                </div>
              </div>
              <button onClick={() => setShowDeleteModal(true)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer" style={{ color: "#ffffff", backgroundColor: theme.error }}>
                Delete Account
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>

      {showDisconnectModal && (
        <ConfirmModal title="Disconnect GitHub?" description="This will disconnect your GitHub account from TOM. You will lose access to repository data and GitHub-based features until you reconnect." confirmLabel="Disconnect" onConfirm={handleDisconnect} onCancel={() => setShowDisconnectModal(false)} theme={theme} />
      )}
      {showDeleteModal && (
        <ConfirmModal title="Delete your TOM account?" description="This action is permanent and cannot be undone. All your data, including profile, settings, and repository connections will be permanently deleted." confirmLabel="Delete Account" onConfirm={handleDeleteAccount} onCancel={() => setShowDeleteModal(false)} theme={theme} />
      )}
    </div>
  );
}

export default Settings;
