import { useState } from 'react';
import {
  BookOpenCheck,
  Clock3,
  Code2,
  ExternalLink,
  Eye,
  GitBranch,
  GitFork,
  LoaderCircle,
  LockKeyhole,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../zustand/useAuthStore';

const formatDate = (date) => {
  if (!date) return 'Update date unavailable';
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Update date unavailable'
    : `Updated ${parsedDate.toLocaleDateString()}`;
};

function Repositories() {
  const { user, loading, error, fetchProfile } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [repositoryFilter, setRepositoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const repositories = Array.isArray(user?.repositories) ? user.repositories : [];
  const selectedNames = new Set(
    (Array.isArray(user?.Filteredrepositories) ? user.Filteredrepositories : [])
      .map((repo) => repo.name)
      .filter(Boolean)
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredRepositories = repositories
    .filter((repo) => {
      const matchesQuery = !query || [
        repo.name,
        repo.description,
        repo.language,
      ].some((value) => value?.toLowerCase().includes(query));
      const isSelected = selectedNames.has(repo.name);
      return matchesQuery && (repositoryFilter === 'all' || isSelected);
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    });

  const totalStars = repositories.reduce(
    (total, repo) => total + (Number(repo.stargazers_count) || 0),
    0
  );
  const languages = new Set(repositories.map((repo) => repo.language).filter(Boolean));

  if (loading && !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-slate-500">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        Loading repositories...
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 font-sans text-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            GitHub workspace
          </p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">Repositories</h1>
          <p className="mt-1 text-xs text-slate-500">
            Browse your synced repositories, review their stats, and choose one to train.
          </p>
        </div>
        {user?.githubUrl && (
          <a
            href={user.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:text-indigo-600 sm:self-auto"
          >
            <GitBranch size={14} />
            GitHub profile
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {error && !user && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-center">
          <p className="text-sm font-semibold text-rose-700">Could not load your repositories.</p>
          <p className="mt-1 text-xs text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => fetchProfile(true)}
            className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-rose-700 ring-1 ring-rose-200 transition-colors hover:bg-rose-100"
          >
            Try again
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={<GitBranch size={16} />} label="Synced repositories" value={repositories.length} />
        <StatCard icon={<Star size={16} />} label="Total stars" value={totalStars} />
        <StatCard icon={<Code2 size={16} />} label="Languages" value={languages.size} />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Your GitHub repositories</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {filteredRepositories.length} of {repositories.length} repositories
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative min-w-0 sm:min-w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search repositories..."
                aria-label="Search repositories"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
              />
            </label>
            <select
              value={repositoryFilter}
              onChange={(event) => setRepositoryFilter(event.target.value)}
              aria-label="Filter repositories"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="all">All repositories</option>
              <option value="selected">Portfolio selected</option>
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort repositories"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="updated">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {loading && user && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            Refreshing repository data...
          </p>
        )}

        {repositories.length > 0 && filteredRepositories.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {filteredRepositories.map((repo, index) => {
              const isSelected = selectedNames.has(repo.name);
              const repoKey = repo.id || repo.html_url || repo.name || index;

              return (
                <article
                  key={repoKey}
                  className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-colors hover:border-indigo-200 hover:bg-white"
                >
                  <div className="min-w-0 space-y-3">
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600">
                          <GitBranch size={17} />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-slate-900" title={repo.name}>
                            {repo.name || 'Untitled repository'}
                          </h3>
                          <p className="mt-1 line-clamp-2 break-words text-xs leading-relaxed text-slate-500">
                            {repo.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="shrink-0 rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">
                          Portfolio
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatPill icon={<Star size={12} />} label="Stars" value={repo.stargazers_count} />
                      <StatPill icon={<GitFork size={12} />} label="Forks" value={repo.forks_count} />
                      <StatPill icon={<Eye size={12} />} label="Watchers" value={repo.watchers_count} />
                      <StatPill icon={<Code2 size={12} />} label="Issues" value={repo.open_issues_count} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200/70 pt-3 text-[10px] text-slate-500">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                        <Code2 size={12} />
                        {repo.language || 'Language not specified'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {repo.private
                          ? <><LockKeyhole size={11} /> Private</>
                          : <><GitBranch size={11} /> Public</>}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <BookOpenCheck size={11} />
                        {repo.has_readme ? 'README available' : 'No README'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 size={11} />
                        {formatDate(repo.updated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 pt-3">
                    {repo.html_url ? (
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                      >
                        <GitBranch size={14} />
                        View on GitHub
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">GitHub link unavailable</span>
                    )}
                    <button
                      type="button"
                      disabled
                      title="Repository training is not available yet"
                      className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-indigo-300 px-3 py-2 text-xs font-semibold text-white opacity-80"
                    >
                      <Sparkles size={13} />
                      Train repository
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide">
                        Soon
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-12 text-center">
            <GitBranch className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              {repositories.length === 0
                ? 'No synced repositories found'
                : repositoryFilter === 'selected'
                  ? 'No portfolio-selected repositories'
                  : 'No repositories match your search'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {repositories.length === 0
                ? 'Connect your GitHub account to sync your repositories.'
                : 'Try another search or change the repository filter.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 text-lg font-bold leading-none text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatPill({ icon, label, value }) {
  if (value === undefined || value === null) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-medium text-slate-600">
      <span className="text-slate-400">{icon}</span>
      {value} {label}
    </span>
  );
}

export default Repositories;
