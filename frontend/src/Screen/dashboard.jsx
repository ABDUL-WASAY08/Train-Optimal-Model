import { useMemo } from 'react';
import { Loader2, Check } from 'lucide-react';
import SharePortfolio from './SharePortfolio';
import { useAuthStore } from '../zustand/useAuthStore';

const DUMMY_COMMITS_THIS_MONTH = 148;

const DUMMY_MODEL_REPOS = [
  { id: 'mr-1', name: 'fyp-thesis-analysis', language: 'Python', accuracy: '94.2%' },
  { id: 'mr-2', name: 'tom-demand-forecaster', language: 'Python', accuracy: '89.7%' },
  { id: 'mr-3', name: 'resume-screening-ml', language: 'Jupyter Notebook', accuracy: '91.5%' },
  { id: 'mr-4', name: 'repo-health-scanner', language: 'TypeScript', accuracy: '87.1%' },
];

const RING_COLORS = ['#6366f1', '#10b981', '#a855f7', '#f59e0b', '#94a3b8'];

function Dashboard() {
  const { user, loading } = useAuthStore();

  const repoCount = user?.repositories?.length ?? 0;

  const totalStars = useMemo(
    () =>
      (user?.repositories || []).reduce((sum, repo) => sum + (repo?.stargazers_count || 0), 0),
    [user?.repositories]
  );

  const languages = useMemo(() => {
    const list = user?.topLanguages?.slice(0, 5) || [];
    const total = list.reduce((sum, item) => sum + (item.percentage || 0), 0);
    const segments = list.map((item, idx) => ({
      name: item.language,
      share: total > 0 ? (item.percentage / total) * 100 : 0,
      color: RING_COLORS[idx % RING_COLORS.length],
    }));

    let cursor = 0;
    const stops = segments.map((seg) => {
      const from = cursor;
      cursor += seg.share;
      return `${seg.color} ${from.toFixed(1)}% ${cursor.toFixed(1)}%`;
    });

    return { segments, ring: segments.length ? `conic-gradient(${stops.join(', ')})` : 'transparent' };
  }, [user?.topLanguages]);

  const checklist = useMemo(() => {
    if (!user) return [];
    return [
      { label: 'Bio', done: Boolean(user.bio && user.bio !== 'No bio available') },
      { label: 'Skills', done: (user.skills?.length || 0) > 0 },
      { label: 'Education', done: (user.education?.length || 0) > 0 },
      { label: 'Selected repos', done: (user.Filteredrepositories?.length || 0) > 0 },
      { label: 'Website', done: Boolean(user.websiteUrl) },
    ];
  }, [user]);

  const completed = checklist.filter((item) => item.done).length;
  const progress = checklist.length ? Math.round((completed / checklist.length) * 100) : 0;

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading dashboard
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-slate-50 px-6 py-12 font-sans text-slate-800 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Dashboard</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          {user?.name || user?.username}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {user?.email}
          {user?.username && <span className="ml-2">@{user.username}</span>}
        </p>
        <section className="mt-14 flex flex-wrap items-end gap-x-16 gap-y-10 border-y border-slate-200 py-10">
          <div>
            <p className="text-xs text-slate-500">Stars</p>
            <p className="mt-2 text-6xl font-bold leading-none tracking-tight tabular-nums text-slate-900">
              {totalStars}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <div>
              <p className="text-xs text-slate-500">Repositories</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{repoCount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Commits this month</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-500">
                {DUMMY_COMMITS_THIS_MONTH}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Models</p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-slate-500">
                {DUMMY_MODEL_REPOS.length}
              </p>
            </div>
          </div>
        </section>

        <p className="mt-6 flex items-center gap-2.5 text-sm text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          <span className="text-slate-700">12-day commit streak</span>
          &middot; last commit today, 9:42 PM
          <span className="text-xs text-slate-400">placeholder</span>
        </p>
        <section className="mt-14 grid gap-10 rounded-xl border border-slate-200 bg-white p-7 shadow-card sm:grid-cols-[auto_1fr] sm:gap-12">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Language mix</h2>

            {languages.segments.length > 0 ? (
              <>
                <div
                  className="mt-6 flex h-28 w-28 items-center justify-center rounded-full"
                  style={{ background: languages.ring }}
                >
                  <div className="flex h-[4.75rem] w-[4.75rem] flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-lg font-bold tabular-nums text-slate-900">
                      {user?.topLanguages?.length || 0}
                    </span>
                    <span className="text-[10px] text-slate-500">languages</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2">
                  {languages.segments.map((seg, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-slate-600">{seg.name}</span>
                      <span className="ml-auto tabular-nums text-slate-400">
                        {Math.round(seg.share)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-6 text-xs text-slate-500">No language data yet.</p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-8 sm:border-l sm:border-t-0 sm:pl-12 sm:pt-0">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Profile strength</h2>
              <span className="text-sm tabular-nums text-slate-500">{progress}%</span>
            </div>

            <div className="mt-4 h-1 rounded-full bg-slate-100">
              <div
                className="h-1 rounded-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            <ul className="mt-6 space-y-2.5">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-sm">
                  <Check
                    className={`h-3.5 w-3.5 ${item.done ? 'text-emerald-500' : 'text-slate-300'}`}
                  />
                  <span className={item.done ? 'text-slate-600' : 'text-slate-400'}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Repositories with trained models</h2>
            <span className="text-xs text-slate-400">placeholder</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {DUMMY_MODEL_REPOS.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-slate-300"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-700">{repo.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{repo.language}</p>
                </div>
                <span className="font-mono text-sm tabular-nums text-slate-900">{repo.accuracy}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="mb-5 text-sm font-semibold text-slate-900">Share portfolio</h2>
          <div className="max-w-md">
            <SharePortfolio />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
