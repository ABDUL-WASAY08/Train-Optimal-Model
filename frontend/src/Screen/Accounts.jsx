import React, { useEffect} from 'react';
import {
  Share2,
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
  Sparkles,
  ArrowUpRight,
  MapPin,
} from 'lucide-react';

import { useAuthStore } from '../zustand/useAuthStore';

function Accounts() {
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);
  useEffect(() => {
    const elements = document.querySelectorAll('.portfolio-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('portfolio-visible');
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [user]);
  return (
    <div
      className="min-h-screen  text-[#c9d1d9] relative overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-12">

        <section className="portfolio-reveal">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">

            <div className="flex items-center gap-5">


              <div className="relative">


                <div className="absolute -inset-[5px] rounded-full border border-[#30363d] animate-[profileRing_4s_ease-in-out_infinite]" />

                <div className="absolute -inset-[9px] rounded-full border border-[#238636]/20 animate-[profileRing2_6s_linear_infinite]" />

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#30363d] overflow-hidden flex items-center justify-center bg-[#0d1117] shadow-[0_0_35px_rgba(35,134,54,0.08)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_45px_rgba(35,134,54,0.18)]">

                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.name ? (
                    <span className="text-2xl font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-8 h-8 text-[#6e7681]" />
                  )}

                </div>

                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-[#238636] border-2 border-[#0d1117] shadow-[0_0_10px_rgba(35,134,54,0.7)] animate-[statusPulse_2s_ease-in-out_infinite]" />

              </div>

              <div>

                <div className="flex items-center gap-2 mb-1">

                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#6e7681]">
                    Developer
                  </p>

                  <Sparkles className="w-3 h-3 text-[#8b949e] animate-[sparkle_2.5s_ease-in-out_infinite]" />

                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {user?.name || user?.username || 'Developer Name'}
                </h1>

                {user?.username && (
                  <p className="text-xs text-[#6e7681] mt-1">
                    @{user.username}
                  </p>
                )}

              </div>

            </div>


          </div>


          {user?.bio && (
            <p className="mt-8 max-w-2xl text-sm leading-6 text-[#8b949e]">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5">

            {user?.email && (
              <span className="group flex items-center gap-1.5 text-xs text-[#6e7681] hover:text-[#c9d1d9] transition-colors">
                <Mail className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                {user.email}
              </span>
            )}

            {user?.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 text-xs text-[#6e7681] hover:text-white transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                GitHub
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {user?.twitterUrl && (
              <a
                href={user.twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 text-xs text-[#6e7681] hover:text-white transition-colors"
              >
                Twitter
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {user?.websiteUrl && (
              <a
                href={user.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-1.5 text-xs text-[#6e7681] hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                Website
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

          </div>

        </section>

        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-[#30363d] to-transparent" />

        {user?.dob && (
          <section className="portfolio-reveal pt-12">

            <SectionTitle
              icon={<Calendar className="w-4 h-4" />}
              title="Personal Details"
            />

            <div className="mt-5 group inline-flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">

              <span className="text-xs text-[#6e7681]">
                Date of Birth
              </span>

              <span className="text-xs text-[#c9d1d9]">
                {new Date(user.dob).toLocaleDateString()}
              </span>

            </div>

          </section>
        )}

        {user?.skills?.length > 0 && (
          <section className="portfolio-reveal pt-14">

            <SectionTitle
              icon={<Award className="w-4 h-4" />}
              title="Skills & Technologies"
            />

            <div className="flex flex-wrap gap-2 mt-5">

              {user.skills.map((skill, index) => (

                <span
                  key={index}
                  className="group relative overflow-hidden px-3 py-1.5 border border-[#30363d] rounded-md text-xs text-[#a8b0ba] cursor-default transition-all duration-300 hover:text-white hover:border-[#8b949e] hover:-translate-y-1 hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
                >


                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

                  <span className="relative">
                    {skill}
                  </span>

                </span>

              ))}

            </div>

          </section>
        )}

        {user?.topLanguages?.length > 0 && (
          <section className="portfolio-reveal pt-14">

            <SectionTitle
              icon={<Code className="w-4 h-4" />}
              title="GitHub Languages"
            />

            <div className="mt-6 max-w-xl space-y-5">

              {user.topLanguages.map((item, index) => (

                <div
                  key={index}
                  className="group"
                >

                  <div className="flex justify-between mb-2">

                    <span className="text-xs text-[#c9d1d9] group-hover:text-white transition-colors">
                      {item.language}
                    </span>

                    <span className="text-[11px] text-[#6e7681]">
                      {item.percentage}%
                    </span>

                  </div>

                  <div className="relative h-1 bg-[#21262d] rounded-full overflow-hidden">

                    <div
                      className="language-bar h-full bg-gradient-to-r from-[#6e7681] to-[#c9d1d9] rounded-full"
                      style={{
                        '--bar-width': `${item.percentage}%`,
                        animationDelay: `${index * 150}ms`,
                      }}
                    />

                    {/* Moving highlight */}

                    <div className="absolute top-0 left-0 h-full w-12 bg-white/20 blur-sm animate-[barShine_3s_ease-in-out_infinite]" />

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}
        {user?.repositories?.length > 0 && (
          <section className="portfolio-reveal pt-14">

            <SectionTitle
              icon={<FolderGit2 className="w-4 h-4" />}
              title="Projects & Repositories"
            />

            <div className="mt-6 divide-y divide-[#21262d] border-y border-[#21262d]">

              {user.repositories.map((repo, index) => (

                <a
                  key={index}
                  href={repo.html_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="project-item group relative block py-6 transition-all duration-500 hover:pl-3"
                >


                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-10 bg-[#8b949e]/10 blur-xl group-hover:w-32 transition-all duration-500" />


                  <div className="relative flex justify-between gap-5">

                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <span className="text-[10px] text-[#484f58] font-mono group-hover:text-[#8b949e] transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <h3 className="text-sm font-medium text-white group-hover:text-[#e6edf3] transition-colors">
                          {repo.name}
                        </h3>

                      </div>

                      <p className="text-xs text-[#6e7681] leading-5 mt-2 ml-7 max-w-2xl group-hover:text-[#8b949e] transition-colors">
                        {repo.description || 'No description provided.'}
                      </p>

                      <div className="flex items-center gap-4 mt-3 ml-7">

                        {repo.language && (
                          <span className="text-[11px] text-[#8b949e]">
                            {repo.language}
                          </span>
                        )}

                        {repo.stargazers_count !== undefined && (
                          <span className="flex items-center gap-1 text-[11px] text-[#6e7681]">
                            <Star className="w-3 h-3 group-hover:scale-110 transition-transform" />
                            {repo.stargazers_count}
                          </span>
                        )}

                        {repo.has_readme && (
                          <span className="text-[11px] text-[#6e7681]">
                            README
                          </span>
                        )}

                      </div>

                    </div>


                    <div className="shrink-0 pt-1">

                      <ExternalLink
                        className="w-4 h-4 text-[#484f58] group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />

                    </div>

                  </div>

                </a>

              ))}

            </div>

          </section>
        )}



        {user?.education?.length > 0 && (
          <section className="portfolio-reveal pt-14">

            <SectionTitle
              icon={<GraduationCap className="w-4 h-4" />}
              title="Education"
            />

            <div className="relative mt-7 ml-1">

            
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-[#6e7681] via-[#30363d] to-transparent" />

              <div className="space-y-8">

                {user.education.map((edu, index) => (

                  <div
                    key={edu._id || edu.id || index}
                    className="group relative flex gap-5 pl-6"
                  >

                    <div className="absolute left-0 top-1.5 w-[7px] h-[7px] rounded-full bg-[#6e7681] ring-4 ring-[#0d1117] group-hover:bg-white group-hover:scale-125 transition-all duration-300" />

                    <div>

                      <h3 className="text-sm font-medium text-white group-hover:text-[#e6edf3] transition-colors">
                        {edu.degree}
                      </h3>

                      <p className="text-xs text-[#8b949e] mt-1">
                        {edu.institution}
                      </p>

                      <p className="text-[11px] text-[#6e7681] mt-1">
                        {edu.year}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </section>
        )}


        {user?.workExperience?.length > 0 && (
          <section className="portfolio-reveal pt-14">

            <SectionTitle
              icon={<Briefcase className="w-4 h-4" />}
              title="Work Experience"
            />

            <div className="mt-7 space-y-8">

              {user.workExperience.map((exp, index) => (

                <div
                  key={exp._id || exp.id || index}
                  className="group relative pl-5 border-l border-[#30363d] hover:border-[#8b949e] transition-colors duration-500"
                >

                  <div className="absolute -left-[4px] top-1.5 w-[7px] h-[7px] rounded-full bg-[#484f58] ring-4 ring-[#0d1117] group-hover:bg-white transition-all duration-300" />

                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                    <div>

                      <h3 className="text-sm font-medium text-white group-hover:text-[#e6edf3] transition-colors">
                        {exp.role}
                      </h3>

                      <p className="text-xs text-[#8b949e] mt-1">
                        {exp.company}
                      </p>

                    </div>

                    <span className="text-[11px] text-[#6e7681]">
                      {exp.period}
                    </span>

                  </div>

                  {exp.description && (
                    <p className="text-xs text-[#6e7681] leading-6 mt-3 max-w-3xl group-hover:text-[#8b949e] transition-colors">
                      {exp.description}
                    </p>
                  )}

                </div>

              ))}

            </div>

          </section>
        )}

        <footer className="portfolio-reveal mt-20 pt-7 border-t border-[#21262d]">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-[10px] text-[#484f58] tracking-[0.18em]">
              TOM
            </p>

            <div className="flex items-center gap-2 text-[10px] text-[#484f58]">
              <MapPin className="w-3 h-3" />
              <span>Contact me</span>
            </div>

          </div>

        </footer>

      </div>


      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>
        {`

          /* PAGE REVEAL */

          .portfolio-reveal {
            opacity: 0;
            transform: translateY(22px);
            transition:
              opacity 0.8s ease,
              transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .portfolio-visible {
            opacity: 1;
            transform: translateY(0);
          }


          /* BACKGROUND GRID */

          @keyframes gridMove {

            0% {
              transform: translateY(0);
            }

            100% {
              transform: translateY(45px);
            }

          }


          /* PROFILE RINGS */

          @keyframes profileRing {

            0%,
            100% {
              transform: scale(1);
              opacity: 0.5;
            }

            50% {
              transform: scale(1.04);
              opacity: 0.9;
            }

          }


          @keyframes profileRing2 {

            0% {
              transform: rotate(0deg) scale(1);
            }

            100% {
              transform: rotate(360deg) scale(1);
            }

          }


          /* ONLINE STATUS */

          @keyframes statusPulse {

            0%,
            100% {
              box-shadow: 0 0 5px rgba(35,134,54,0.4);
            }

            50% {
              box-shadow: 0 0 14px rgba(35,134,54,0.8);
            }

          }


          /* SPARKLE */

          @keyframes sparkle {

            0%,
            100% {
              opacity: 0.3;
              transform: rotate(0deg) scale(0.9);
            }

            50% {
              opacity: 1;
              transform: rotate(15deg) scale(1.15);
            }

          }


          /* BACKGROUND GLOW */

          @keyframes slowPulse {

            0%,
            100% {
              transform: translateX(-50%) scale(1);
              opacity: 0.04;
            }

            50% {
              transform: translateX(-50%) scale(1.15);
              opacity: 0.08;
            }

          }


          @keyframes floatGlow {

            0%,
            100% {
              transform: translateY(0) translateX(0);
            }

            50% {
              transform: translateY(-35px) translateX(-20px);
            }

          }


          /* LANGUAGE BARS */

          .language-bar {
            width: 0;
            animation: languageFill 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }

          @keyframes languageFill {

            from {
              width: 0;
            }

            to {
              width: var(--bar-width);
            }

          }


          /* BAR SHINE */

          @keyframes barShine {

            0% {
              transform: translateX(-60px);
              opacity: 0;
            }

            30% {
              opacity: 1;
            }

            70% {
              opacity: 1;
            }

            100% {
              transform: translateX(600px);
              opacity: 0;
            }

          }


          /* REDUCE MOTION */

          @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }

          }

        `}
      </style>

    </div>
  );
}


/* =====================================================
   SECTION TITLE
===================================================== */

function SectionTitle({ icon, title }) {
  return (
    <div className="group flex items-center gap-2.5">

      <div className="text-[#6e7681] transition-all duration-300 group-hover:text-[#c9d1d9] group-hover:scale-110">
        {icon}
      </div>

      <h2 className="text-sm font-medium text-[#d5dbe1] tracking-tight">
        {title}
      </h2>

      <div className="h-px w-10 bg-[#30363d] group-hover:w-16 transition-all duration-500" />

    </div>
  );
}

export default Accounts;