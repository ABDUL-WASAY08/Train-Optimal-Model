import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, LayoutDashboard, LogOut, Mail, Sparkles, User2 } from "lucide-react";
import { useAuthStore } from "../../zustand/useAuthStore";

function ClientDashboard() {
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
            <LayoutDashboard size={20} />
          </span>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">TOM Workspace</p>
            <h1 className="text-lg font-extrabold">Client Dashboard</h1>
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
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <User2 size={30} />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1">
                <Sparkles size={11} />
                Signed in with Google
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">{user?.name || "Client"}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Mail size={13} />
                {user?.email || "No email"}
              </p>
            </div>
          </div>
          <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase">
            {user?.role || "client"}
          </span>
        </section>

        <section className="grid md:grid-cols-3 gap-5">
          {[
            { title: "Post a project", text: "Describe the work you need and share it with vetted developers." },
            { title: "Review scorecards", text: "Inspect code quality reports before making a hire." },
            { title: "Hire developers", text: "Shortlist talent using verified repository and skill data." },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

        <section className="bg-indigo-600 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold">Ready to get started?</h3>
            <p className="text-xs text-indigo-100 mt-1">Your client workspace is live.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-700 text-xs font-bold cursor-pointer">
            Create a project
            <ArrowRight size={14} />
          </button>
        </section>
      </main>
    </div>
  );
}

export default ClientDashboard;
