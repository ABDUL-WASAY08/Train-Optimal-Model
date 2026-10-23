import React, { useEffect } from 'react';
import {
  Mail,
  User,
  Code,
  GraduationCap,
  Award,
  Calendar,
  Globe,
  ExternalLink,
  FolderGit2,
  Star,
  GitBranch,
  Briefcase,
  ArrowUpRight,
  MapPin,
  BadgeCheck,
  Building2,
} from 'lucide-react';

import { useAuthStore } from '../zustand/useAuthStore';
import { useUtilityStore } from '../zustand/useUtilityStore';

function Accounts() {
  const { user, fetchProfile } = useAuthStore();
  const { certificates, certificatesLoading, getCertificates } = useUtilityStore();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (user) {
      getCertificates();
    }
  }, [user, getCertificates]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 lg:px-10">

        {/* Header */}
        <section className="card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-50 sm:h-24 sm:w-24">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : user?.name ? (
                  <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="m-auto h-8 w-8 text-slate-400" />
                )}
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Developer</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {user?.name || user?.username || 'Developer Name'}
                </h1>
                {user?.username && (
                  <p className="mt-1 text-xs text-slate-500">@{user.username}</p>
                )}
              </div>
            </div>
          </div>

          {user?.bio && (
            <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-600">{user.bio}</p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            {user?.email && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </span>
            )}

            {user?.githubUrl && (
              <a href={user.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                <GitBranch className="w-3.5 h-3.5" /> GitHub <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            {user?.twitterUrl && (
              <a href={user.twitterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Twitter <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            {user?.websiteUrl && (
              <a href={user.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                <Globe className="w-3.5 h-3.5" /> Website <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </section>

        {user?.dob && (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<Calendar className="w-4 h-4" />} title="Personal Details" />
            <div className="mt-5 inline-flex items-center gap-3">
              <span className="text-xs text-slate-500">Date of Birth</span>
              <span className="text-xs font-medium text-slate-700">
                {new Date(user.dob).toLocaleDateString()}
              </span>
            </div>
          </section>
        )}

        {user?.skills?.length > 0 && (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<Award className="w-4 h-4" />} title="Skills & Technologies" />
            <div className="mt-5 flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {user?.topLanguages?.length > 0 && (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<Code className="w-4 h-4" />} title="GitHub Languages" />
            <div className="mt-6 max-w-xl space-y-5">
              {user.topLanguages.map((item, index) => (
                <div key={index}>
                  <div className="mb-2 flex justify-between">
                    <span className="text-xs text-slate-700">{item.language}</span>
                    <span className="text-[11px] text-slate-400">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {user?.Filteredrepositories?.length > 0 && (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<FolderGit2 className="w-4 h-4" />} title="Projects & Repositories" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {user.Filteredrepositories.map((repo, index) => (
                <a
                  key={index}
                  href={repo.html_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-900">{repo.name}</h3>
                    <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                    {repo.description || 'No description provided.'}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    {repo.language && <span className="text-[11px] text-slate-500">{repo.language}</span>}
                    {repo.stargazers_count !== undefined && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Star className="w-3 h-3" /> {repo.stargazers_count}
                      </span>
                    )}
                    {repo.has_readme && <span className="text-[11px] text-slate-400">README</span>}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {certificates.length > 0 ? (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<BadgeCheck className="w-4 h-4" />} title="Certificates" />
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {certificates.map((cert) => (
                <div
                  key={cert._id}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-pop"
                >
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-40 overflow-hidden border-b border-slate-100 bg-slate-50"
                  >
                    <img
                      src={cert.certificateUrl}
                      alt={cert.certificateName}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.04]"
                    />
                  </a>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">{cert.certificateName}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Building2 className="w-3 h-3 shrink-0 text-slate-400" /> {cert.companyName}
                    </p>
                    {cert.role && <p className="text-[11px] text-slate-500">{cert.role}</p>}
                    {cert.issueDate && (
                      <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                        <Calendar className="w-2.5 h-2.5" /> {cert.issueDate}
                      </p>
                    )}
                    {cert.description && (
                      <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-500">{cert.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : certificatesLoading ? (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<BadgeCheck className="w-4 h-4" />} title="Certificates" />
            <p className="mt-6 text-xs italic text-slate-400">Loading certificates...</p>
          </section>
        ) : null}

        {user?.education?.length > 0 ? (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<GraduationCap className="w-4 h-4" />} title="Education" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {user.education.map((edu, index) => (
                <div key={edu._id || edu.id || index} className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="mt-1 text-xs text-slate-500">{edu.institution}</p>
                  {edu.year && <p className="mt-1 font-mono text-[11px] text-slate-400">{edu.year}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<GraduationCap className="w-4 h-4" />} title="Education" />
            <p className="mt-6 text-sm text-slate-500">
              You can add your education by clicking Edit Portfolio in the navbar or by going to Settings.
            </p>
          </section>
        )}

        {user?.workExperience?.length > 0 ? (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<Briefcase className="w-4 h-4" />} title="Work Experience" />
            <div className="mt-6 space-y-5">
              {user.workExperience.map((exp, index) => (
                <div key={exp._id || exp.id || index} className="flex gap-4">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />
                  <div className="border-l border-slate-200 pl-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{exp.role}</h3>
                        <p className="mt-0.5 text-xs text-slate-500">{exp.company}</p>
                      </div>
                      {exp.period && <span className="text-[11px] text-slate-400">{exp.period}</span>}
                    </div>
                    {exp.description && (
                      <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-500">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="card mt-6 p-6 sm:p-8">
            <SectionTitle icon={<Briefcase className="w-4 h-4" />} title="Work Experience" />
            <p className="mt-6 text-sm text-slate-500">
              You can add your work experience by clicking Edit Portfolio in the navbar or by going to Settings.
            </p>
          </section>
        )}

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[10px] tracking-[0.18em] text-slate-400">TOM</p>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>Contact me</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-indigo-600">{icon}</span>
      <h2 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}

export default Accounts;
