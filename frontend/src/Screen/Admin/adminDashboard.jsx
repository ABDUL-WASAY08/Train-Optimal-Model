import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuthStore } from "../../zustand/useAuthStore";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const result = await logout();
    if (!result?.success) {
      toast.error(result?.error || "Sign out failed. Please try again.");
      return;
    }
    navigate("/Authorization", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">TOM Platform</p>
            <h1 className="text-lg font-extrabold">Admin Dashboard</h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
              <ShieldCheck size={11} />
              Signed in with Google
            </div>
            <h2 className="mt-2 text-2xl font-extrabold">{user?.name || "Administrator"}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Mail size={13} />
              {user?.email || "No email"}
            </p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase">
            {user?.role || "admin"}
          </span>
        </section>

        <section className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Users, label: "Users", value: "—" },
            { icon: LayoutDashboard, label: "Projects", value: "—" },
            { icon: FileText, label: "Reports", value: "—" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <stat.icon size={18} className="text-indigo-600" />
              <p className="mt-4 text-2xl font-extrabold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
            <h3 className="text-sm font-extrabold">User management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review developer and client accounts and control workspace access.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
            <h3 className="text-sm font-extrabold">Platform oversight</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Monitor projects, complaints, and system health from one place.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
