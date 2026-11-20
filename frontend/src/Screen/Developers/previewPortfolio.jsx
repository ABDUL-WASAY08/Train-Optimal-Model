import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, ExternalLink, FileText, Loader2, Mail, Pencil, Plus, Save, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";
import { useAuthStore } from "../../zustand/useAuthStore";
import "./publicPortfolio.css";

const portfolioStyles = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap");

html { scroll-behavior: smooth; scrollbar-width: thin; scrollbar-color: #7c6af74d transparent; }
html, body, #root { min-height: 100%; }
body { margin: 0; background-color: #080810; color: #e8e6f0; font-family: Inter, sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #7c6af74d; border-radius: 2px; }
.pw-noise { position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .4; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); }
.pw-root { position: relative; min-height: 100vh; isolation: isolate; }
.pw-orb { position: fixed; z-index: 0; pointer-events: none; border-radius: 50%; filter: blur(120px); animation: pw-orb-float 20s ease-in-out infinite; }
@keyframes pw-orb-float { 0%, 100% { transform: translate(0) scale(1); } 33% { transform: translate(30px, -40px) scale(1.05); } 66% { transform: translate(-20px, 30px) scale(.97); } }
.pw-cursor-glow { position: fixed; z-index: 1; pointer-events: none; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle, #7c6af70f 0%, transparent 70%); transform: translate(-50%, -50%); transition: transform .1s linear; }
.pw-content { position: relative; z-index: 10; }
.pw-fade { opacity: 0; transform: translateY(40px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
.pw-fade.visible { opacity: 1; transform: translateY(0); }
.pw-stagger > * { opacity: 0; transform: translateY(30px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
.pw-stagger.visible > :first-child { opacity: 1; transform: none; transition-delay: 50ms; }
.pw-stagger.visible > :nth-child(2) { opacity: 1; transform: none; transition-delay: .12s; }
.pw-stagger.visible > :nth-child(3) { opacity: 1; transform: none; transition-delay: .19s; }
.pw-stagger.visible > :nth-child(4) { opacity: 1; transform: none; transition-delay: .26s; }
.pw-stagger.visible > :nth-child(5) { opacity: 1; transform: none; transition-delay: .33s; }
.pw-stagger.visible > :nth-child(6) { opacity: 1; transform: none; transition-delay: .4s; }
.pw-stagger.visible > :nth-child(7) { opacity: 1; transform: none; transition-delay: .47s; }
.pw-stagger.visible > :nth-child(8) { opacity: 1; transform: none; transition-delay: .54s; }
.pw-gradient { color: transparent; background: linear-gradient(135deg, #7c6af7 0%, #a78bfa 50%, #c4b5fd 100%); -webkit-background-clip: text; background-clip: text; }
.pw-card { position: relative; background: #0f0f1a; border: 1px solid #7c6af71f; transition: border-color .3s, box-shadow .3s; }
.pw-card:hover { border-color: #7c6af766; box-shadow: 0 0 40px #7c6af714, 0 20px 60px #0006; }
.pw-skill-tag { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border: 1px solid #7c6af733; border-radius: 100px; background: #7c6af714; color: #a78bfa; font-family: "JetBrains Mono", monospace; font-size: .75rem; transition: background .2s, border-color .2s, color .2s; }
.pw-skill-tag:hover { background: #7c6af72e; border-color: #a78bfa80; color: #c4b5fd; }
.pw-cursor { display: inline-block; width: 2px; height: 1em; margin-left: 2px; vertical-align: middle; background: #7c6af7; animation: pw-blink 1s step-end infinite; }
@keyframes pw-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.pw-nav-link { position: relative; color: #a09ec0; font-size: .875rem; letter-spacing: .05em; transition: color .2s; }
.pw-nav-link::after { content: ""; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: #7c6af7; transition: width .3s cubic-bezier(.16,1,.3,1); }
.pw-nav-link:hover { color: #e8e6f0; }
.pw-nav-link:hover::after { width: 100%; }
.pw-label { font-family: "JetBrains Mono", monospace; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: #7c6af7; }
.pw-timeline-line { position: absolute; top: 0; bottom: 0; left: 0; width: 1px; background: linear-gradient(transparent, #7c6af766, transparent); }
.pw-project-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, #080810f2 0%, #08081066 40%, transparent 100%); }
.pw-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 100px; padding: 12px 28px; font-size: .875rem; font-weight: 500; letter-spacing: .02em; cursor: pointer; transition: background .2s, transform .2s, box-shadow .2s, border-color .2s; }
.pw-btn-primary { color: #fff; background: #7c6af7; border: 1px solid #7c6af7; }
.pw-btn-primary:hover { background: #6c58e8; transform: translateY(-1px); box-shadow: 0 8px 30px #7c6af759; }
.pw-btn-outline { color: #e8e6f0; background: transparent; border: 1px solid #e8e6f033; }
.pw-btn-outline:hover { background: #e8e6f00a; border-color: #e8e6f080; transform: translateY(-1px); }
.pw-badge { opacity: 0; animation: pw-badge-in .8s ease 1.5s forwards; }
@keyframes pw-badge-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.pw-float-badge { animation: pw-float-badge 3s ease-in-out infinite; }
@keyframes pw-float-badge { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.pw-mobile-menu { position: fixed; inset: 0; z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; background: #080810f7; transform: translateX(100%); transition: transform .4s cubic-bezier(.16,1,.3,1); }
.pw-mobile-menu.open { transform: translateX(0); }
.pw-input { width: 100%; padding: 12px 16px; border: 1px solid #7c6af733; border-radius: 12px; outline: none; background: #7c6af70d; color: #e8e6f0; font-size: .875rem; transition: box-shadow .2s, border-color .2s; }
.pw-input::placeholder { color: #6b6890; }
.pw-input:focus { border-color: #7c6af766; box-shadow: 0 0 0 2px #7c6af740; }
.pw-edit-input { width: 100%; padding: 7px 9px; border: 1px solid transparent; border-radius: 8px; outline: none; background: transparent; color: #e8e6f0; font: inherit; transition: border-color .2s, background .2s, box-shadow .2s; }
.pw-edit-input:hover { border-color: #7c6af733; background: #7c6af70d; }
.pw-edit-input:focus { border-color: #7c6af766; background: #7c6af714; box-shadow: 0 0 0 2px #7c6af72e; }
textarea.pw-edit-input { resize: vertical; min-height: 62px; line-height: 1.6; }
.pw-edit-label { display: block; margin-bottom: 4px; font-family: "JetBrains Mono", monospace; font-size: .58rem; letter-spacing: .14em; text-transform: uppercase; color: #7c6af7; }
.pw-edit-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.pw-editor-toolbar { position: fixed; right: 20px; bottom: 20px; z-index: 60; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; padding: 12px 14px; border: 1px solid #7c6af744; border-radius: 14px; background: #0f0f1af2; backdrop-filter: blur(16px); box-shadow: 0 12px 44px #000a, 0 0 30px #7c6af71a; }
.pw-editor-status { display: flex; align-items: center; gap: 7px; font-family: "JetBrains Mono", monospace; font-size: .7rem; color: #a78bfa; }
.pw-editor-note { font-size: .65rem; color: #6b6890; }
.pw-chip-button { display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 5px 10px; border: 1px solid #7c6af744; border-radius: 100px; background: #7c6af714; color: #c4b5fd; font-size: .7rem; cursor: pointer; transition: background .2s, border-color .2s, transform .2s; }
.pw-chip-button:hover { background: #7c6af72e; border-color: #7c6af780; transform: translateY(-1px); }
.pw-danger { color: #f472b6; border-color: #f472b633; background: #f472b610; }
.pw-danger:hover { background: #f472b625; border-color: #f472b666; }
.pw-repo-search { position: relative; margin-bottom: 32px; }
.pw-repo-search input { padding-left: 42px; padding-right: 42px; }
.pw-repo-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #7c6af7; pointer-events: none; }
.pw-repo-clear { position: absolute; right: 10px; top: 50%; display: flex; padding: 4px; transform: translateY(-50%); border: 0; background: transparent; color: #6b6890; cursor: pointer; }
.pw-repo-clear:hover { color: #e8e6f0; }
.pw-repo-dropdown { position: absolute; z-index: 30; top: calc(100% + 6px); left: 0; right: 0; max-height: 320px; overflow-y: auto; padding: 6px; border: 1px solid #7c6af744; border-radius: 12px; background: #0f0f1af7; box-shadow: 0 20px 50px #000a; }
.pw-repo-option { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; }
.pw-repo-option:hover { background: #7c6af714; }
.pw-repo-option-text { flex: 1; min-width: 0; }
.pw-repo-option-title { font-size: .8rem; color: #e8e6f0; }
.pw-repo-option-meta { margin-top: 2px; font-size: .65rem; color: #6b6890; }
.pw-hero-name { font-family: "Fraunces", serif !important; font-weight: inherit; line-height: inherit; letter-spacing: inherit; padding: 0 4px !important; border-color: transparent !important; background: transparent !important; }
.pw-hero-bio { min-height: 92px; line-height: 1.7; }
.pw-cert-form { display: grid; gap: 10px; margin-top: 14px; padding: 14px; border: 1px solid #7c6af733; border-radius: 12px; background: #7c6af70a; }
.pw-cert-thumb { width: 44px; height: 44px; flex-shrink: 0; border: 1px solid #7c6af733; border-radius: 8px; object-fit: cover; background: #080810; }
.pw-readonly-note { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; border: 1px solid #7c6af72e; border-radius: 100px; background: #7c6af710; font-family: "JetBrains Mono", monospace; font-size: .65rem; color: #a78bfa; }
.pw-file-input { max-width: 100%; font-size: .68rem; color: #6b6890; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .pw-fade, .pw-stagger > *, .pw-badge { opacity: 1 !important; transform: none !important; transition: none !important; animation: none !important; }
  .pw-orb, .pw-cursor { animation: none !important; }
}
`;

const firstValue = (source, keys) => {
  if (!source || typeof source !== "object") return "";
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
};

const cleanText = (value) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  if (value && typeof value === "object") return Object.values(value);
  return [];
};

const normalizeUrl = (value) => {
  const raw = cleanText(firstValue(value, ["url", "href", "link"])) || cleanText(value);
  if (!raw) return "";
  if (/^(https?:|mailto:|tel:|\/)/i.test(raw)) return raw;
  if (/^\/\//.test(raw)) return `https:${raw}`;
  if (/^(www\.|[a-z0-9.-]+\.[a-z]{2,}([/:?#]|$))/i.test(raw)) return `https://${raw}`;
  return "";
};

const getSkillName = (skill) =>
  cleanText(firstValue(skill, ["name", "skillName", "title", "skill", "label", "technology"])) ||
  cleanText(skill);

const getLanguageName = (language) =>
  cleanText(firstValue(language, ["name", "language", "title", "label"])) || cleanText(language);

const getLanguagePercent = (language) => {
  const raw = cleanText(firstValue(language, ["percentage", "percent", "share", "value"])).replace("%", "");
  const number = Number(raw);
  return raw && Number.isFinite(number) ? Math.max(0, Math.min(100, number)) : null;
};

const getPeriod = (item) => {
  const direct = cleanText(firstValue(item, ["period", "duration", "year", "graduationYear", "issueDate"]));
  if (direct) return direct;
  const start = cleanText(firstValue(item, ["startDate", "from"]));
  const end = cleanText(firstValue(item, ["endDate", "to"]));
  return [start, end].filter(Boolean).join(" - ");
};

const normalizeProject = (project, index) => {
  if (typeof project === "string") {
    return {
      id: index,
      _id: "",
      originalId: "",
      title: project,
      subtitle: "",
      description: "",
      tech: [],
      image: "",
      imageUrl: "",
      imagePublicId: "",
      url: "",
      liveUrl: "",
      raw: {},
    };
  }

  const source = project || {};
  const language = cleanText(firstValue(source, ["language", "primaryLanguage"]));
  const tech = asArray(firstValue(source, ["tech", "technologies", "topics", "tags", "keywords"]))
    .map(cleanText)
    .filter(Boolean);
  if (language && !tech.some((item) => item.toLowerCase() === language.toLowerCase())) {
    tech.unshift(language);
  }

  const url = normalizeUrl(firstValue(source, ["html_url", "url", "link", "repoUrl", "repositoryUrl", "github"]));
  const image = normalizeUrl(firstValue(source, ["imageUrl", "image", "screenshot", "thumbnail", "coverImage"]));

  return {
    id: cleanText(firstValue(source, ["_id", "id"])) || url || index,
    _id: cleanText(source._id),
    originalId: source.id === undefined || source.id === null ? "" : source.id,
    title: cleanText(firstValue(source, ["name", "title", "projectName"])) || "Untitled project",
    subtitle: cleanText(firstValue(source, ["subtitle", "category", "type"])) || language || "Featured Project",
    description: cleanText(firstValue(source, ["description", "desc", "summary"])),
    tech,
    image,
    imageUrl: image,
    imagePublicId: cleanText(firstValue(source, ["imagePublicId", "publicId"])),
    url,
    liveUrl: normalizeUrl(firstValue(source, ["liveUrl", "demoUrl", "homepage", "websiteUrl", "deploymentUrl"])),
    raw: source,
  };
};

const normalizeExperience = (experience, index) => {
  const source = experience || {};
  const description = cleanText(firstValue(source, ["description", "summary"]));
  const highlights = asArray(firstValue(source, ["highlights", "achievements", "responsibilities", "skills"]))
    .map(cleanText)
    .filter(Boolean);

  return {
    id: cleanText(firstValue(source, ["_id", "id"])) || index,
    _id: cleanText(source._id),
    originalId: source.id === undefined || source.id === null ? "" : source.id,
    company: cleanText(firstValue(source, ["company", "companyName", "organization"])) || "Experience",
    role: cleanText(firstValue(source, ["role", "position", "title", "jobTitle"])),
    period: getPeriod(source),
    type: cleanText(firstValue(source, ["type", "employmentType", "category"])),
    description,
    highlights: highlights.length ? highlights : description ? [description.split(/[.;]/)[0].trim()] : [],
  };
};

const normalizeEducation = (education, index) => {
  const source = education || {};

  return {
    id: cleanText(firstValue(source, ["_id", "id"])) || index,
    _id: cleanText(source._id),
    originalId: source.id === undefined || source.id === null ? "" : source.id,
    degree: cleanText(firstValue(source, ["degree", "title", "qualification", "fieldOfStudy"])),
    institution: cleanText(firstValue(source, ["institution", "school", "college", "university", "organization"])),
    period: getPeriod(source),
    gpa: cleanText(firstValue(source, ["gpa", "grade", "score"])),
    description: cleanText(firstValue(source, ["description", "summary"])),
    courses: asArray(firstValue(source, ["courses", "subjects", "modules"])).map(cleanText).filter(Boolean),
  };
};

const normalizeCertificate = (certificate, index) => {
  const source = certificate || {};
  const issuer = cleanText(firstValue(source, ["companyName", "issuer", "organization", "company"]));

  return {
    id: cleanText(firstValue(source, ["_id", "id"])) || index,
    _id: cleanText(source._id),
    originalId: source.id === undefined || source.id === null ? "" : source.id,
    title: cleanText(firstValue(source, ["certificateName", "title", "name"])) || "Certificate",
    issuer,
    platform: cleanText(firstValue(source, ["platform", "provider", "source"])) || issuer,
    role: cleanText(firstValue(source, ["role", "position", "jobTitle"])),
    description: cleanText(firstValue(source, ["description", "summary"])),
    year: getPeriod(source),
    issueDate: cleanText(firstValue(source, ["issueDate", "year", "date", "graduationYear"])),
    icon: cleanText(firstValue(source, ["icon", "emoji", "symbol"])) || "◆",
    credential: normalizeUrl(firstValue(source, ["credentialUrl", "url", "link"])),
    certificateUrl: normalizeUrl(firstValue(source, ["certificateUrl", "imageUrl", "image", "certificateImage"])),
    imagePublicId: cleanText(firstValue(source, ["imagePublicId", "publicId"])),
  };
};

const withItemIds = (item) => ({
  ...(item._id ? { _id: item._id } : {}),
  ...(item.originalId !== "" && item.originalId !== undefined ? { id: item.originalId } : {}),
});

const projectToRepo = (project) => {
  const tech = Array.isArray(project.tech) ? project.tech : [];
  const image = project.image || project.imageUrl || "";
  return {
    ...(project.raw || {}),
    ...withItemIds(project),
    name: project.title,
    title: project.title,
    description: project.description,
    html_url: project.url,
    url: project.url,
    liveUrl: project.liveUrl,
    language: tech[0] || "",
    topics: tech.slice(1),
    tech,
    subtitle: project.subtitle,
    imageUrl: image,
    image: image,
    imagePublicId: project.imagePublicId || "",
  };
};

const educationToSource = (item) => ({
  ...withItemIds(item),
  degree: item.degree,
  institution: item.institution,
  period: item.period,
  gpa: item.gpa,
  description: item.description,
  courses: Array.isArray(item.courses) ? item.courses : [],
});

const experienceToSource = (item) => ({
  ...withItemIds(item),
  company: item.company,
  role: item.role,
  period: item.period,
  type: item.type,
  description: item.description,
  highlights: Array.isArray(item.highlights) ? item.highlights : [],
});

const buildPayload = (draft) => ({
  name: draft.name,
  username: draft.username,
  bio: draft.bio,
  email: draft.email,
  githubUrl: draft.githubUrl,
  linkedinUrl: draft.linkedinUrl,
  twitterUrl: draft.twitterUrl,
  websiteUrl: draft.websiteUrl,
  Filteredrepositories: (draft.projects || []).map(projectToRepo),
  education: (draft.education || []).map(educationToSource),
  workExperience: (draft.workExperience || []).map(experienceToSource),
});

const buildDraft = (source, fallbackUsername) => {
  const data = source || {};
  return {
    name: cleanText(firstValue(data, ["name", "fullName", "displayName"])) || cleanText(data.username) || "Developer",
    username: cleanText(firstValue(data, ["username", "login", "handle"])) || cleanText(fallbackUsername) || "developer",
    bio: cleanText(firstValue(data, ["bio", "about", "description"])),
    email: cleanText(firstValue(data, ["email", "emailAddress", "contactEmail"])),
    githubUrl: normalizeUrl(firstValue(data, ["githubUrl", "github", "githubLink", "githubProfile"])),
    linkedinUrl: normalizeUrl(firstValue(data, ["linkedinUrl", "linkedin", "linkedIn", "linkedinProfile"])),
    twitterUrl: normalizeUrl(firstValue(data, ["twitterUrl", "twitter", "xUrl", "xProfile"])),
    websiteUrl: normalizeUrl(firstValue(data, ["websiteUrl", "website", "portfolioUrl", "personalWebsite"])),
    cvUrl: normalizeUrl(firstValue(data, ["cvUrl", "resumeUrl", "cv", "resume"])),
    cvName: cleanText(firstValue(data, ["cvName", "resumeName"])),
    projects: asArray(firstValue(data, ["Filteredrepositories", "filteredRepositories", "repositories", "repos", "projects"])).map(normalizeProject),
    education: asArray(data.education).map(normalizeEducation),
    workExperience: asArray(firstValue(data, ["workExperience", "experience", "experiences"])).map(normalizeExperience),
    certificates: asArray(firstValue(data, ["certificates", "certifications"])).map(normalizeCertificate),
  };
};

const applyUserToDraft = (previous, user) => {
  const next = { ...previous };
  if (!user || typeof user !== "object") return next;
  ["name", "bio", "email", "githubUrl", "linkedinUrl", "twitterUrl", "websiteUrl"].forEach((key) => {
    if (user[key] !== undefined) next[key] = cleanText(user[key]);
  });
  if (user.username !== undefined) next.username = cleanText(user.username) || previous.username;
  if (user.cvUrl !== undefined) next.cvUrl = normalizeUrl(user.cvUrl);
  if (user.cvName !== undefined) next.cvName = cleanText(user.cvName);
  if (user.Filteredrepositories !== undefined) next.projects = asArray(user.Filteredrepositories).map(normalizeProject);
  if (user.education !== undefined) next.education = asArray(user.education).map(normalizeEducation);
  if (user.workExperience !== undefined) next.workExperience = asArray(user.workExperience).map(normalizeExperience);
  next.certificates = user.certificates !== undefined ? asArray(user.certificates).map(normalizeCertificate) : previous.certificates;
  return next;
};

const unwrapPortfolio = (payload) => {
  let source = payload;
  if (source?.data && typeof source.data === "object") source = source.data;
  if (source?.portfolio && typeof source.portfolio === "object") source = source.portfolio;
  if (source?.user && typeof source.user === "object" && !source.name && !source.username) {
    source = { ...source.user, ...source };
  }
  return source && typeof source === "object" ? source : null;
};

const normalizeRepoResult = (repo) => {
  const source = repo || {};
  return {
    id: source.id ?? source._id ?? "",
    name: cleanText(source.name || cleanText(source.full_name).split("/")[1]),
    description: cleanText(source.description),
    language: cleanText(source.language),
    html_url: cleanText(source.html_url || source.url),
    topics: asArray(source.topics),
  };
};

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return Date.now().toString();
};

const ACCENTS = ["#7c6af7", "#a78bfa", "#34d399", "#f59e0b", "#60a5fa", "#f472b6"];

const CATEGORY_PATTERNS = {
  Frontend: /react|next|vue|angular|tailwind|css|html|javascript|typescript|ui|redux|svelte/i,
  Backend: /node|express|python|django|flask|java|spring|graphql|rest|api|php|ruby|golang|fastify/i,
  Database: /mongo|postgres|mysql|sql|redis|firebase|supabase|sqlite|database|prisma/i,
  "DevOps & Tools": /git|docker|linux|aws|vercel|ci\/cd|jenkins|kubernetes|nginx|cloud|github/i,
};

const buildSkillCategories = (names) => {
  const categories = Object.fromEntries(Object.keys(CATEGORY_PATTERNS).map((key) => [key, []]));
  const remaining = [];

  names.forEach((name) => {
    const match = Object.entries(CATEGORY_PATTERNS).find(([, pattern]) => pattern.test(name));
    if (match) categories[match[0]].push(name);
    else remaining.push(name);
  });

  const keys = Object.keys(categories);
  remaining.forEach((name, index) => categories[keys[index % keys.length]].push(name));

  return Object.entries(categories).map(([name, items]) => ({ name, items: [...new Set(items)] }));
};

const useTypewriter = (words, typingSpeed = 90, deletingSpeed = 45, pause = 2000) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return undefined;
    const word = words[index % words.length];
    const delay = deleting ? deletingSpeed : text === word ? pause : typingSpeed;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((current) => current + 1);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [words, index, text, deleting, typingSpeed, deletingSpeed, pause]);

  return text;
};

function TypedCode({ lines }) {
  const [counts, setCounts] = useState(() => lines.map(() => 0));

  useEffect(() => {
    let cancelled = false;
    const timers = [];

    lines.forEach((line, lineIndex) => {
      Array.from(line.text).forEach((_, charIndex) => {
        timers.push(
          setTimeout(() => {
            if (cancelled) return;
            setCounts((current) => {
              const next = [...current];
              next[lineIndex] = charIndex + 1;
              return next;
            });
          }, lineIndex * 300 + charIndex * 18)
        );
      });
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lines]);

  return (
    <div
      className="pw-card rounded-2xl p-5 font-mono text-xs leading-relaxed"
      style={{ fontFamily: '"JetBrains Mono", monospace', filter: "blur(0.3px)", opacity: 0.8 }}
    >
      {lines.map((line, index) => (
        <div key={`${index}-${line.text}`} className="min-h-[1.25rem]">
          {line.text ? (
            <>
              <span style={{ color: line.color }}>{line.text.slice(0, counts[index] || 0)}</span>
              {(counts[index] || 0) < line.text.length && <span className="pw-cursor" />}
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CountUp({ value, suffix = "", active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / 1800, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, active]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5" />
    <path d="M12 15V3" />
  </svg>
);

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.34-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

function PreviewPortfolio() {
  const { username } = useParams();
  const { user: authUser, setUser, loading: authLoading } = useAuthStore();
  const authUserRef = useRef(authUser);

  const activeUsername = cleanText(username) || cleanText(authUser?.username);
  const [portfolio, setPortfolio] = useState(null);
  const [draft, setDraftState] = useState(null);
  const [skillData, setSkillData] = useState({ skills: [], topLanguages: [] });
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [textInputs, setTextInputs] = useState({});
  const [menuState, setMenuState] = useState({ username, open: false });
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 40);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeExperience, setActiveExperience] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [messageSent, setMessageSent] = useState(false);
  const [repoQuery, setRepoQuery] = useState("");
  const [repoOpen, setRepoOpen] = useState(false);
  const [repoResults, setRepoResults] = useState([]);
  const [repoSearching, setRepoSearching] = useState(false);
  const [certFormOpen, setCertFormOpen] = useState(false);
  const [certForm, setCertForm] = useState({ title: "", issuer: "", role: "", description: "", issueDate: "", image: null });

  const draftRef = useRef(null);
  const revisionRef = useRef(0);
  const savingRef = useRef(false);
  const saveTimerRef = useRef(null);
  const fileInputRefs = useRef({});
  const cvInputRef = useRef(null);
  const certInputRef = useRef(null);

  const menuOpen = menuState.username === username && menuState.open;

  const commit = useCallback((updater) => {
    const current = draftRef.current;
    const next = typeof updater === "function" ? updater(current) : updater;
    draftRef.current = next;
    setDraftState(next);
    return next;
  }, []);

  const persistDraft = useCallback(async (targetDraft, options = {}) => {
    if (!targetDraft) return false;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    const revisionAtStart = revisionRef.current;
    savingRef.current = true;
    setSaveStatus("saving");
    try {
      const response = await api.put("/account/update", buildPayload(targetDraft));
      const user = response.data?.user || response.data;
      if (user && typeof user === "object") {
        setPortfolio((previous) => ({ ...(previous || {}), ...user }));
        if (revisionRef.current === revisionAtStart) {
          const merged = applyUserToDraft(draftRef.current, user);
          draftRef.current = merged;
          setDraftState(merged);
        }
        setUser(user);
      }
      setSaveStatus("saved");
      if (options.toast) toast.success(options.toast);
      return true;
    } catch (saveError) {
      setSaveStatus("error");
      toast.error(saveError?.response?.data?.message || options.errorMessage || "Save failed");
      return false;
    } finally {
      savingRef.current = false;
    }
  }, [setUser]);

  const scheduleSave = useCallback(() => {
    revisionRef.current += 1;
    setSaveStatus(savingRef.current ? "saving" : "pending");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      void persistDraft(draftRef.current);
    }, 800);
  }, [persistDraft]);

  const editDraft = useCallback((updater) => {
    commit(updater);
    scheduleSave();
  }, [commit, scheduleSave]);

  const editField = useCallback((field, value) => {
    editDraft((current) => ({ ...current, [field]: value }));
  }, [editDraft]);

  const editListItem = useCallback((collection, id, field, value) => {
    editDraft((current) => ({
      ...current,
      [collection]: (current[collection] || []).map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  }, [editDraft]);

  const editListText = useCallback((collection, id, field, value, target) => {
    const values = value.split(",").map((item) => item.trim()).filter(Boolean);
    setTextInputs((previous) => ({ ...previous, [`${collection}:${id}:${target}`]: value }));
    editListItem(collection, id, field, values);
  }, [editListItem]);

  const inputValue = useCallback((collection, item, field, target) => {
    const key = `${collection}:${item.id}:${target}`;
    const values = Array.isArray(item[field]) ? item[field] : [];
    return textInputs[key] !== undefined ? textInputs[key] : values.join(", ");
  }, [textInputs]);

  useEffect(() => {
    authUserRef.current = authUser;
  }, [authUser]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (authLoading || !activeUsername) return undefined;
    const controller = new AbortController();

    api
      .get(`/user/portfolio/${encodeURIComponent(activeUsername)}`, {
        signal: controller.signal,
        withCredentials: true,
      })
      .then((response) => {
        if (cancelled) return;
        const data = unwrapPortfolio(response.data);
        if (!data) throw new Error("Portfolio not found");
        const merged = { ...(authUserRef.current || {}), ...data };
        if (!cleanText(merged.username)) merged.username = activeUsername;
        const initialDraft = buildDraft(merged, activeUsername);
        const names = asArray(firstValue(data, ["skills", "technologies", "techStack"])).map(getSkillName).filter(Boolean);
        const languages = asArray(firstValue(data, ["topLanguages", "languages"]))
          .map((language) => ({
            id: cleanText(firstValue(language, ["_id", "id"])),
            name: getLanguageName(language),
            percent: getLanguagePercent(language),
          }))
          .filter((language) => language.name);
        setSkillData({ skills: names, topLanguages: languages });
        setPortfolio(merged);
        draftRef.current = initialDraft;
        setDraftState(initialDraft);
        revisionRef.current = 0;
        setSaveStatus("idle");
        setError("");
      })
      .catch((requestError) => {
        if (cancelled || requestError?.code === "ERR_CANCELED") return;
        setPortfolio(null);
        setDraftState(null);
        draftRef.current = null;
        setError(requestError?.response?.data?.message || "This portfolio is unavailable or doesn't exist.");
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [activeUsername, authLoading]);

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  useEffect(() => {
    if (!draft) return undefined;
    const elements = Array.from(document.querySelectorAll(".pw-fade, .pw-stagger"));
    if (!elements.length) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => element.classList.add("visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [draft]);

  useEffect(() => {
    if (!draft || !window.location.hash) return undefined;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [draft]);

  const view = useMemo(() => {
    const source = draft || {};
    return {
      name: source.name || "Developer",
      portfolioUsername: source.username || activeUsername || "developer",
      bio: source.bio || "",
      email: source.email || "",
      githubUrl: source.githubUrl || "",
      linkedinUrl: source.linkedinUrl || "",
      twitterUrl: source.twitterUrl || "",
      websiteUrl: source.websiteUrl || "",
      cvUrl: source.cvUrl || "",
      cvName: source.cvName || "",
      avatarUrl: normalizeUrl(firstValue(portfolio, ["avatarUrl", "avatar", "profilePicture", "photoURL", "profileImage"])),
      projects: source.projects || [],
      education: source.education || [],
      workExperience: source.workExperience || [],
      certificates: source.certificates || [],
    };
  }, [draft, activeUsername, portfolio]);

  const skillNames = skillData.skills;
  const topLanguages = skillData.topLanguages;
  const allSkillNames = useMemo(
    () => [...new Set([...topLanguages.map((language) => language.name), ...skillNames])],
    [skillNames, topLanguages]
  );

  const roles = useMemo(() => {
    const fromExperience = view.workExperience.map((item) => item.role).filter(Boolean);
    const fromSkills = skillNames.slice(0, 4).map((skill) => `${skill} Developer`);
    const combined = [...new Set([...fromExperience, ...fromSkills])];
    return combined.length ? combined : ["Full-Stack Developer", "Problem Solver", "Creator"];
  }, [view.workExperience, skillNames]);

  const typedRole = useTypewriter(roles);

  const skillCategories = useMemo(() => buildSkillCategories(allSkillNames), [allSkillNames]);

  const proficiency = useMemo(() => {
    if (topLanguages.length) {
      return topLanguages.slice(0, 7).map((language, index) => ({
        name: language.name,
        level: language.percent ?? Math.max(60, 92 - index * 5),
      }));
    }
    return skillNames.slice(0, 7).map((skill, index) => ({ name: skill, level: Math.max(60, 92 - index * 5) }));
  }, [topLanguages, skillNames]);

  const logo = useMemo(() => {
    const parts = view.name.split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : view.portfolioUsername.slice(0, 2);
    return (initials || "dv").toLowerCase();
  }, [view.name, view.portfolioUsername]);

  const codeLines = useMemo(() => {
    const skillList = skillNames.slice(0, 3).map((skill) => `"${skill}"`).join(", ") || '"React", "Node.js", "Python"';
    const role = view.workExperience[0]?.role || skillNames[0] || "Developer";
    const passion = view.bio ? view.bio.split(/[.;]/)[0].slice(0, 42) : "Building elegant solutions";

    return [
      { text: `import { skills } from "@${view.portfolioUsername}/toolkit";`, color: "#c4b5fd" },
      { text: "", color: "" },
      { text: "const developer = {", color: "#e8e6f0" },
      { text: `  name: "${view.name}",`, color: "#a78bfa" },
      { text: `  role: "${role}",`, color: "#34d399" },
      { text: `  skills: [${skillList}],`, color: "#60a5fa" },
      { text: `  passion: "${passion}",`, color: "#f59e0b" },
      { text: "};", color: "#e8e6f0" },
      { text: "", color: "" },
      { text: "export default function createApp() {", color: "#c4b5fd" },
      { text: "  return <Developer {...developer} />;", color: "#a78bfa" },
      { text: "}", color: "#e8e6f0" },
    ];
  }, [view.name, view.portfolioUsername, skillNames, view.workExperience, view.bio]);

  const heroBadges = useMemo(() => {
    const names = [...topLanguages.map((item) => item.name), ...skillNames];
    return [...new Set(names)].slice(0, 3);
  }, [topLanguages, skillNames]);

  const stats = useMemo(
    () => [
      { value: view.projects.length, suffix: "+", label: "Projects Shipped" },
      { value: view.workExperience.length, suffix: "", label: "Experience" },
      { value: view.certificates.length, suffix: "", label: "Certifications" },
      { value: Math.max(skillNames.length, topLanguages.length), suffix: "+", label: "Tech Stacks" },
    ],
    [view.projects, view.workExperience, view.certificates, skillNames, topLanguages]
  );

  const localCandidates = useMemo(() => {
    const rawProjects = (draft?.projects || []).map((project) => projectToRepo(project));
    const items = [...asArray(portfolio?.repositories), ...asArray(portfolio?.Filteredrepositories), ...rawProjects];
    const seen = new Set();
    return items
      .filter((item) => item && typeof item === "object")
      .map(normalizeRepoResult)
      .filter((item) => {
        const key = String(item.id || item.name || "").toLowerCase();
        if (!key || !item.name || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [portfolio, draft]);

  useEffect(() => {
    if (!repoOpen) return undefined;
    const query = repoQuery.trim();
    const lower = query.toLowerCase();
    const matches = (repo) => !lower || [repo.name, repo.description, repo.language].some((value) => cleanText(value).toLowerCase().includes(lower));
    const local = localCandidates.filter(matches).slice(0, 8);
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!query) {
        setRepoResults(local);
        setRepoSearching(false);
        return;
      }
      setRepoSearching(true);
      let remote;
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:${encodeURIComponent(activeUsername || "")}&per_page=8`,
          { headers: { Accept: "application/vnd.github+json" } }
        );
        if (!response.ok) throw new Error("GitHub search failed");
        const payload = await response.json();
        remote = asArray(payload.items).map(normalizeRepoResult);
      } catch {
        try {
          const response = await fetch(
            `https://api.github.com/users/${encodeURIComponent(activeUsername || "")}/repos?per_page=100`,
            { headers: { Accept: "application/vnd.github+json" } }
          );
          if (!response.ok) throw new Error("GitHub fallback failed");
          const payload = await response.json();
          remote = asArray(payload).map(normalizeRepoResult).filter(matches).slice(0, 8);
        } catch {
          remote = [];
        }
      }
      if (cancelled) return;
      const combined = [...local];
      remote.forEach((repo) => {
        const duplicate = combined.some((item) => String(item.id) === String(repo.id) || item.name.toLowerCase() === repo.name.toLowerCase());
        if (!duplicate) combined.push(repo);
      });
      setRepoResults(combined.slice(0, 12));
      setRepoSearching(false);
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [repoOpen, repoQuery, activeUsername, localCandidates]);

  const addRepository = async (repo) => {
    const projects = draftRef.current?.projects || [];
    const duplicate = projects.some((project) => {
      const repoId = repo.id;
      return (
        (repoId && (String(project.id) === String(repoId) || String(project._id) === String(repoId) || String(project.originalId) === String(repoId))) ||
        project.title.toLowerCase() === cleanText(repo.name).toLowerCase()
      );
    });
    if (duplicate) {
      toast.error("That project is already in your portfolio");
      return;
    }
    const normalized = normalizeProject(
      { ...repo, name: repo.name, html_url: repo.html_url, topics: repo.topics || [] },
      projects.length
    );
    const next = commit((current) => ({ ...current, projects: [...(current.projects || []), normalized] }));
    setRepoQuery("");
    setRepoOpen(false);
    setRepoResults([]);
    await persistDraft(next, { toast: "Project added", errorMessage: "Failed to add project" });
  };

  const removeProject = async (id) => {
    const project = (draftRef.current?.projects || []).find((item) => item.id === id);
    const next = commit((current) => ({ ...current, projects: (current.projects || []).filter((item) => item.id !== id) }));
    if (editingProjectId === id) setEditingProjectId(null);
    await persistDraft(next, { toast: "Project removed", errorMessage: "Failed to remove project" });
    if (project?.imagePublicId) {
      await api.delete("/user/image", { data: { publicId: project.imagePublicId } }).catch(() => null);
    }
  };

  const uploadProjectImage = async (id, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const project = (draftRef.current?.projects || []).find((item) => item.id === id);
    const oldPublicId = project?.imagePublicId;
    const body = new FormData();
    body.append("image", file);
    try {
      const response = await api.post("/user/project-image", body, { headers: { "Content-Type": "multipart/form-data" } });
      const data = response.data?.data || {};
      const url = cleanText(data.url);
      const publicId = cleanText(data.publicId);
      const next = commit((current) => ({
        ...current,
        projects: (current.projects || []).map((item) =>
          item.id === id ? { ...item, image: url, imageUrl: url, imagePublicId: publicId } : item
        ),
      }));
      await persistDraft(next, { toast: "Project image uploaded", errorMessage: "Failed to save project image" });
      if (oldPublicId && oldPublicId !== publicId) {
        await api.delete("/user/image", { data: { publicId: oldPublicId } }).catch(() => null);
      }
    } catch (uploadError) {
      toast.error(uploadError?.response?.data?.message || "Failed to upload image");
    }
  };

  const addExperience = async () => {
    const id = createId();
    const item = { id, _id: id, originalId: "", company: "New company", role: "New role", period: "", type: "", description: "", highlights: [] };
    const next = commit((current) => ({ ...current, workExperience: [...(current.workExperience || []), item] }));
    setActiveExperience((next.workExperience || []).length - 1);
    await persistDraft(next, { toast: "Experience added", errorMessage: "Failed to add experience" });
  };

  const removeExperience = async (id) => {
    const next = commit((current) => ({ ...current, workExperience: (current.workExperience || []).filter((item) => item.id !== id) }));
    setActiveExperience(0);
    await persistDraft(next, { toast: "Experience removed", errorMessage: "Failed to remove experience" });
  };

  const addEducation = async () => {
    const id = createId();
    const item = { id, _id: id, originalId: "", degree: "New degree", institution: "New institution", period: "", gpa: "", description: "", courses: [] };
    const next = commit((current) => ({ ...current, education: [...(current.education || []), item] }));
    await persistDraft(next, { toast: "Education added", errorMessage: "Failed to add education" });
  };

  const removeEducation = async (id) => {
    const next = commit((current) => ({ ...current, education: (current.education || []).filter((item) => item.id !== id) }));
    await persistDraft(next, { toast: "Education removed", errorMessage: "Failed to remove education" });
  };

  const persistCertificate = async (certificate) => {
    const id = certificate._id || certificate.id;
    if (!id) return;
    try {
      const response = await api.put(`/user/certificate/${encodeURIComponent(id)}`, {
        certificateName: certificate.title,
        companyName: certificate.issuer,
        role: certificate.role,
        description: certificate.description,
        issueDate: certificate.issueDate || certificate.year,
      });
      const updated = response.data?.data;
      if (updated && typeof updated === "object") {
        commit((current) => ({
          ...current,
          certificates: (current.certificates || []).map((item) => (item.id === certificate.id ? normalizeCertificate(updated, certificate.id) : item)),
        }));
      }
    } catch (certificateError) {
      toast.error(certificateError?.response?.data?.message || "Failed to update certificate");
    }
  };

  const removeCertificate = async (id) => {
    const certificate = (draftRef.current?.certificates || []).find((item) => item.id === id);
    const certificateId = certificate?._id || certificate?.id || id;
    commit((current) => ({ ...current, certificates: (current.certificates || []).filter((item) => item.id !== id) }));
    try {
      await api.delete(`/user/${encodeURIComponent(certificateId)}`);
      toast.success("Certificate removed");
    } catch (certificateError) {
      toast.error(certificateError?.response?.data?.message || "Failed to remove certificate");
      commit((current) => ({ ...current, certificates: [...(current.certificates || []), certificate].filter(Boolean) }));
    }
  };

  const addCertificate = async (event) => {
    event.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) {
      toast.error("Title and issuer are required");
      return;
    }
    if (!certForm.image) {
      toast.error("Please choose a certificate image");
      return;
    }
    if (certForm.image.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const body = new FormData();
    body.append("certificateName", certForm.title);
    body.append("companyName", certForm.issuer);
    body.append("role", certForm.role);
    body.append("description", certForm.description);
    body.append("issueDate", certForm.issueDate);
    if (certForm.image) body.append("image", certForm.image);
    try {
      const response = await api.post("/user/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
      const created = response.data?.data;
      const normalized = normalizeCertificate(created || certForm, (draftRef.current?.certificates || []).length);
      commit((current) => ({ ...current, certificates: [...(current.certificates || []), normalized] }));
      setCertForm({ title: "", issuer: "", role: "", description: "", issueDate: "", image: null });
      setCertFormOpen(false);
      if (certInputRef.current) certInputRef.current.value = "";
      toast.success("Certificate added");
    } catch (certificateError) {
      toast.error(certificateError?.response?.data?.message || "Failed to add certificate");
    }
  };

  const uploadCv = async (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("CV must be under 10MB");
      return;
    }
    const body = new FormData();
    body.append("cv", file);
    try {
      const response = await api.post("/user/cv", body, { headers: { "Content-Type": "multipart/form-data" } });
      const user = response.data?.user || response.data;
      commit((current) => ({
        ...current,
        cvUrl: normalizeUrl(firstValue(user, ["cvUrl", "resumeUrl", "cv"])),
        cvName: cleanText(firstValue(user, ["cvName", "resumeName"])) || file.name,
      }));
      setPortfolio((previous) => ({ ...(previous || {}), ...user }));
      setUser(user);
      toast.success("CV uploaded");
    } catch (cvError) {
      toast.error(cvError?.response?.data?.message || "Failed to upload CV");
    }
  };

  const removeCv = async () => {
    try {
      const response = await api.delete("/user/cv");
      const user = response.data?.user || response.data;
      commit((current) => ({ ...current, cvUrl: "", cvName: "" }));
      setPortfolio((previous) => ({ ...(previous || {}), ...user }));
      setUser(user);
      if (cvInputRef.current) cvInputRef.current.value = "";
      toast.success("CV removed");
    } catch (cvError) {
      toast.error(cvError?.response?.data?.message || "Failed to remove CV");
    }
  };

  const navItems = ["About", "Skills", "Projects", "Experience", "Education", "Contact"];

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuState({ username, open: false });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (view.email) {
      const subject = encodeURIComponent(`Portfolio inquiry for ${view.name}`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.location.href = `mailto:${view.email}?subject=${subject}&body=${body}`;
    }
    setMessageSent(true);
  };

  const showLoading = authLoading || (Boolean(activeUsername) && !draft && !error);

  if (showLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#080810] text-[#e8e6f0]">
        <style>{portfolioStyles}</style>
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#7c6af733] border-t-[#7c6af7]" />
        <p className="pw-label">Loading portfolio editor</p>
      </main>
    );
  }

  if (!activeUsername) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#080810] px-6 text-center text-[#e8e6f0]">
        <style>{portfolioStyles}</style>
        <div className="pw-card max-w-sm rounded-2xl p-10">
          <p className="pw-label mb-3">Live editor</p>
          <h1 className="text-2xl font-light">Sign in to edit</h1>
          <p className="mt-3 text-sm text-[#6b6890]">Sign in with your developer account or open the editor with a username to start editing.</p>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#080810] px-6 text-center text-[#e8e6f0]">
        <style>{portfolioStyles}</style>
        <div className="pw-card max-w-sm rounded-2xl p-10">
          <p className="pw-label mb-3">Portfolio unavailable</p>
          <h1 className="text-2xl font-light">Not found</h1>
          <p className="mt-3 text-sm text-[#6b6890]">{error || "This portfolio doesn't exist."}</p>
        </div>
      </main>
    );
  }

  const nameParts = view.name.split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || view.name;
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  const primaryExperience = activeExperience < view.workExperience.length ? view.workExperience[activeExperience] : null;
  const primaryEducation = view.education[0];
  const aboutParagraphTwo = allSkillNames.length
    ? `My work spans ${allSkillNames.slice(0, 4).join(", ")}, and I focus on building products that are reliable, maintainable, and genuinely useful.`
    : "I focus on building products that are reliable, maintainable, and genuinely useful.";

  const statusLabel =
    saveStatus === "error"
      ? "Save failed"
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "pending"
          ? "Unsaved changes"
          : saveStatus === "idle"
            ? "Ready"
            : "Saving…";

  return (
    <main
      className="pw-root bg-[#080810] text-[#e8e6f0]"
      onMouseMove={(event) => setMouse({ x: event.clientX, y: event.clientY })}
    >
      <style>{portfolioStyles}</style>

      <div className="pw-noise" />
      <div className="pw-orb" style={{ width: 600, height: 600, top: "-10%", left: "-15%", background: "rgba(124,106,247,0.12)" }} />
      <div className="pw-orb" style={{ width: 500, height: 500, top: "40%", right: "-10%", background: "rgba(167,139,250,0.08)", animationDelay: "7s" }} />
      <div className="pw-orb" style={{ width: 400, height: 400, bottom: "10%", left: "20%", background: "rgba(52,211,153,0.06)", animationDelay: "14s" }} />
      <div className="pw-cursor-glow hidden lg:block" style={{ left: mouse.x, top: mouse.y }} />

      <nav
        className="fixed left-0 right-0 top-0 z-40 transition-all duration-500"
        style={{
          background: menuOpen || scrolled ? "rgba(8,8,16,0.85)" : "transparent",
          backdropFilter: menuOpen || scrolled ? "blur(20px)" : "blur(0)",
          borderBottom: `1px solid ${menuOpen || scrolled ? "rgba(124,106,247,0.1)" : "transparent"}`,
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="font-mono text-sm tracking-wider text-purple-400 transition-colors hover:text-purple-300"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {logo}
            <span className="pw-gradient">.</span>dev
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <li key={item}>
                <button type="button" className="pw-nav-link" onClick={() => scrollTo(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <a
            href={view.email ? `mailto:${view.email}` : "#contact"}
            className="pw-btn pw-btn-primary hidden text-xs md:inline-flex"
            style={{ padding: "8px 20px" }}
          >
            Hire Me
          </a>

          <button
            type="button"
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Menu"
            onClick={() => setMenuState({ username, open: !menuOpen })}
          >
            <span className={`block h-px w-6 bg-slate-300 transition-all duration-300 ${menuOpen ? "translate-y-2.5 rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-slate-300 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-slate-300 transition-all duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <div className={`pw-mobile-menu ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <button
            key={item}
            type="button"
            className="text-2xl font-light text-slate-200 transition-colors hover:text-purple-400"
            style={{ fontFamily: '"Fraunces", serif' }}
            onClick={() => scrollTo(item)}
          >
            {item}
          </button>
        ))}
        <a href={view.email ? `mailto:${view.email}` : "#contact"} className="pw-btn pw-btn-primary mt-4" onClick={() => setMenuState({ username, open: false })}>
          Hire Me
        </a>
      </div>

      <div className="pw-content">
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: "linear-gradient(rgba(124,106,247,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(124,106,247,0.15) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage: "radial-gradient(ellipse at 40% 50%, black 30%, transparent 75%)",
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, rgba(124,106,247,0.45) 0%, transparent 65%)" }}
          />

          <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
            <div>
              <p className="pw-label pw-fade mb-8 visible" style={{ transitionDelay: "100ms" }}>
                Hello, world — I&apos;m
              </p>

              <div className="pw-fade visible mb-6 flex items-start gap-1" style={{ transitionDelay: "200ms" }}>
                <input
                  type="text"
                  className="pw-input pw-hero-name text-5xl sm:text-6xl md:text-7xl"
                  value={firstName}
                  onChange={(event) => {
                    const rest = lastName ? ` ${lastName}` : "";
                    editField("name", `${event.target.value}${rest}`);
                  }}
                  aria-label="Your first name"
                />
                {lastName && <span className="pw-gradient italic text-5xl sm:text-6xl md:text-7xl">{lastName}</span>}
              </div>

              <div
                className="pw-fade visible mb-8 h-9 text-xl sm:text-2xl"
                style={{ color: "#a09ec0", fontFamily: '"JetBrains Mono", monospace', fontSize: "1rem", transitionDelay: "350ms" }}
              >
                <span className="text-purple-400">&gt;</span> {typedRole}
                <span className="pw-cursor" />
              </div>

              <textarea
                className="pw-input pw-hero-bio pw-fade visible mb-12 max-w-xl resize-none text-base sm:text-lg"
                style={{ color: "#6b6890", transitionDelay: "500ms" }}
                value={view.bio}
                placeholder="I build elegant, performant web experiences..."
                onChange={(event) => editField("bio", event.target.value)}
                aria-label="Your bio"
              />

              <div className="pw-fade visible flex flex-wrap gap-4" style={{ transitionDelay: "650ms" }}>
                <button type="button" className="pw-btn pw-btn-primary" onClick={() => scrollTo("projects")}>
                  View Projects
                  <ArrowRightIcon />
                </button>
                <a
                  className="pw-btn pw-btn-outline"
                  href={view.cvUrl || (view.email ? `mailto:${view.email}` : "#contact")}
                  target={view.cvUrl ? "_blank" : undefined}
                  rel={view.cvUrl ? "noreferrer" : undefined}
                  download={view.cvUrl ? true : undefined}
                >
                  <DownloadIcon />
                  Download CV
                </a>
              </div>
            </div>

            <div className="pw-fade visible flex justify-center md:justify-end" style={{ transitionDelay: "400ms" }}>
              <div className="relative w-full max-w-md">
                <TypedCode key={codeLines.map((line) => line.text).join("|")} lines={codeLines} />

                {heroBadges.length > 0 && (
                  <div className="pw-badge absolute -right-4 -top-4 flex flex-col gap-2">
                    {heroBadges.map((badge, index) => (
                      <span
                        key={badge}
                        className="pw-float-badge rounded-full px-3 py-1 text-xs"
                        style={{
                          background: "rgba(124,106,247,0.1)",
                          border: "1px solid rgba(124,106,247,0.25)",
                          color: "#a78bfa",
                          fontFamily: '"JetBrains Mono", monospace',
                          animationDelay: `${index * 0.5}s`,
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className="pw-fade visible absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
            style={{ transitionDelay: "900ms" }}
          >
            <span className="pw-label text-xs">scroll</span>
            <div className="h-12 w-px" style={{ background: "linear-gradient(to bottom, rgba(124,106,247,0.6), transparent)" }} />
          </div>
        </section>

        <section id="about" className="scroll-mt-20 px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="pw-label pw-fade mb-4">01 - About</div>
            <div className="mt-12 grid gap-16 md:grid-cols-2 items-center">
              <div className="pw-fade">
                <h2
                  className="mb-8 text-4xl font-light leading-tight sm:text-5xl"
                  style={{ fontFamily: '"Fraunces", serif' }}
                >
                  Crafting digital <br />
                  <span className="pw-gradient italic">experiences</span>
                  <br /> with purpose
                </h2>

                <p className="mb-6 text-base leading-relaxed" style={{ color: "#6b6890" }}>
                  {view.bio || "I'm a developer who enjoys building things that are both beautifully designed and technically sound."}
                </p>
                <p className="mb-8 text-base leading-relaxed" style={{ color: "#6b6890" }}>
                  {aboutParagraphTwo}
                </p>

                <div className="flex gap-4">
                  {view.githubUrl && (
                    <a href={view.githubUrl} target="_blank" rel="noopener noreferrer" className="pw-btn pw-btn-outline px-5 py-2.5 text-xs">
                      <GithubIcon /> GitHub
                    </a>
                  )}
                  {view.linkedinUrl && (
                    <a href={view.linkedinUrl} target="_blank" rel="noopener noreferrer" className="pw-btn pw-btn-outline px-5 py-2.5 text-xs">
                      <LinkedinIcon /> LinkedIn
                    </a>
                  )}
                </div>
              </div>

              <div className="pw-fade" style={{ transitionDelay: "200ms" }}>
                <div className="pw-stagger grid grid-cols-2 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="pw-card rounded-xl p-7">
                      <p className="pw-gradient mb-1 text-4xl font-light" style={{ fontFamily: '"Fraunces", serif' }}>
                        <CountUp value={stat.value} suffix={stat.suffix} active />
                      </p>
                      <p className="text-sm" style={{ color: "#6b6890" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="scroll-mt-20 px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="pw-label pw-fade mb-4">02 - Skills</div>
            <div className="mt-4 mb-16 flex flex-wrap items-center justify-between gap-4">
              <h2 className="pw-fade text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
                Tools of the <span className="pw-gradient italic">trade</span>
              </h2>
              <span className="pw-readonly-note">Skills are managed automatically</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="pw-label mb-6">Technology Stack</p>
                <div className="pw-stagger grid gap-4 sm:grid-cols-2">
                  {skillCategories.map((category) => (
                    <div key={category.name} className="pw-card rounded-2xl p-6">
                      <p className="pw-label mb-4">{category.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.items.length ? (
                          category.items.map((item) => <span key={item} className="pw-skill-tag">{item}</span>)
                        ) : (
                          <span className="text-xs" style={{ color: "#6b6890" }}>—</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="pw-label mb-6">Proficiency</p>
                <div className="pw-fade pw-card space-y-6 rounded-2xl p-8" style={{ transitionDelay: "100ms" }}>
                  {proficiency.length ? (
                    proficiency.map((item, index) => (
                      <div key={item.name}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm" style={{ color: "#c4b5fd" }}>{item.name}</span>
                          <span className="text-xs" style={{ color: "#6b6890", fontFamily: '"JetBrains Mono", monospace' }}>{item.level}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(124,106,247,0.12)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${item.level}%`,
                              background: "linear-gradient(90deg, #7c6af7, #a78bfa)",
                              boxShadow: "0 0 12px rgba(124,106,247,0.5)",
                              transitionDelay: `${index * 80}ms`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: "#6b6890" }}>Skill data coming soon.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-20 bg-[#0a0a12] px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="pw-label pw-fade mb-4">03 - Projects</div>
            <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="pw-fade mt-4 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
                  Selected <span className="pw-gradient italic">work</span>
                </h2>
                <p className="pw-fade mt-3 text-sm" style={{ color: "#6b6890" }}>
                  Search GitHub or local repositories and add them to your portfolio.
                </p>
              </div>
              <div className="pw-fade w-full max-w-md">
                <div className="pw-repo-search">
                  <Search className="pw-repo-search-icon" size={16} />
                  <input
                    type="text"
                    className="pw-input"
                    placeholder={`Search repositories for ${view.portfolioUsername}...`}
                    value={repoQuery}
                    onFocus={() => setRepoOpen(true)}
                    onChange={(event) => {
                      setRepoQuery(event.target.value);
                      setRepoOpen(true);
                    }}
                  />
                  {(repoQuery || repoOpen) && (
                    <button
                      type="button"
                      className="pw-repo-clear"
                      aria-label="Close repository search"
                      onClick={() => {
                        setRepoQuery("");
                        setRepoOpen(false);
                        setRepoResults([]);
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                  {repoOpen && (
                    <div className="pw-repo-dropdown">
                      {repoSearching && (
                        <div className="pw-repo-option" style={{ color: "#6b6890", fontSize: ".72rem" }}>
                          <Loader2 className="animate-spin" size={14} /> Searching GitHub…
                        </div>
                      )}
                      {!repoSearching && !repoResults.length && (
                        <div className="pw-repo-option text-xs" style={{ color: "#6b6890" }}>No repositories found.</div>
                      )}
                      {repoResults.map((repo) => (
                        <div key={`${repo.id || "repo"}-${repo.name}`} className="pw-repo-option">
                          <div className="pw-repo-option-text">
                            <div className="pw-repo-option-title">{repo.name}</div>
                            <div className="pw-repo-option-meta">
                              {[repo.language, cleanText(repo.description).slice(0, 70)].filter(Boolean).join(" · ") || "No description"}
                            </div>
                          </div>
                          <button type="button" className="pw-chip-button" onClick={() => void addRepository(repo)}>
                            <Plus size={12} /> Add
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pw-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {view.projects.map((project, index) => {
                const accent = ACCENTS[index % ACCENTS.length];
                const editing = editingProjectId === project.id;
                return (
                  <article key={project.id} className="pw-card group overflow-hidden rounded-2xl">
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ background: `radial-gradient(circle at 30% 30%, ${accent}33, transparent 60%), #0f0f1a` }}
                        />
                      )}
                      <div className="pw-project-overlay" />
                      {project.tech[0] && (
                        <span
                          className="absolute right-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[.65rem]"
                          style={{ background: `${accent}15`, borderColor: `${accent}40`, color: accent }}
                        >
                          {project.tech[0]}
                        </span>
                      )}
                      <div className="absolute bottom-3 left-3 pw-edit-actions">
                        <button
                          type="button"
                          className="pw-chip-button"
                          onClick={() => setEditingProjectId(editing ? null : project.id)}
                        >
                          {editing ? <Check size={12} /> : <Pencil size={12} />}
                          {editing ? "Done" : "Edit"}
                        </button>
                        <button
                          type="button"
                          className="pw-chip-button"
                          onClick={() => fileInputRefs.current[project.id]?.click()}
                        >
                          <Upload size={12} /> Photo
                        </button>
                        <button
                          type="button"
                          className="pw-chip-button pw-danger"
                          onClick={() => void removeProject(project.id)}
                        >
                          <Trash2 size={12} />
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(element) => { fileInputRefs.current[project.id] = element; }}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) void uploadProjectImage(project.id, file);
                            event.target.value = "";
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      {editing ? (
                        <div className="space-y-3">
                          <div>
                            <span className="pw-edit-label">Title</span>
                            <input
                              type="text"
                              className="pw-edit-input text-lg"
                              value={project.title}
                              onChange={(event) => editListItem("projects", project.id, "title", event.target.value)}
                            />
                          </div>
                          <div>
                            <span className="pw-edit-label">Category</span>
                            <input
                              type="text"
                              className="pw-edit-input"
                              value={project.subtitle}
                              onChange={(event) => editListItem("projects", project.id, "subtitle", event.target.value)}
                            />
                          </div>
                          <div>
                            <span className="pw-edit-label">Description</span>
                            <textarea
                              className="pw-edit-input text-sm"
                              value={project.description}
                              onChange={(event) => editListItem("projects", project.id, "description", event.target.value)}
                            />
                          </div>
                          <div>
                            <span className="pw-edit-label">Tech (comma separated)</span>
                            <input
                              type="text"
                              className="pw-edit-input text-xs"
                              value={inputValue("projects", project, "tech", "tech")}
                              onChange={(event) => editListText("projects", project.id, "tech", event.target.value, "tech")}
                            />
                          </div>
                          <div>
                            <span className="pw-edit-label">Code URL</span>
                            <input
                              type="text"
                              className="pw-edit-input text-xs"
                              value={project.url}
                              onChange={(event) => editListItem("projects", project.id, "url", event.target.value)}
                            />
                          </div>
                          <div>
                            <span className="pw-edit-label">Live URL</span>
                            <input
                              type="text"
                              className="pw-edit-input text-xs"
                              value={project.liveUrl}
                              onChange={(event) => editListItem("projects", project.id, "liveUrl", event.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="pw-label mb-1" style={{ color: accent }}>{project.subtitle}</p>
                          <h3 className="mb-3 text-lg font-medium" style={{ fontFamily: '"Fraunces", serif' }}>{project.title}</h3>
                          <p className="mb-5 text-sm leading-relaxed" style={{ color: "#6b6890" }}>
                            {project.description || "A project built with care, focus, and modern development practices."}
                          </p>

                          {project.tech.length > 1 && (
                            <div className="mb-5 flex flex-wrap gap-1.5">
                              {project.tech.slice(1, 5).map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-full border px-2.5 py-1 font-mono text-[.65rem]"
                                  style={{ background: "rgba(124,106,247,0.06)", borderColor: "rgba(124,106,247,0.15)", color: "#a09ec0" }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-3">
                            {project.url && (
                              <a href={project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors hover:text-purple-400" style={{ color: "#a09ec0" }}>
                                <GithubIcon size={13} /> Code
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-colors hover:text-purple-400" style={{ color: "#a09ec0" }}>
                                <ExternalLink size={13} /> Live
                              </a>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {!view.projects.length && (
              <p className="pw-fade text-center text-sm" style={{ color: "#6b6890" }}>No projects available yet. Search above to add one.</p>
            )}
          </div>
        </section>

        <section id="experience" className="scroll-mt-20 px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="pw-label pw-fade mb-4">04 - Experience</div>
                <h2 className="pw-fade mt-4 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
                  Where I&apos;ve <span className="pw-gradient italic">grown</span>
                </h2>
              </div>
              <button type="button" className="pw-chip-button" onClick={() => void addExperience()}>
                <Plus size={13} /> Add experience
              </button>
            </div>

            <div className="relative space-y-5 pl-8">
              <div className="pw-timeline-line" />
              {view.workExperience.map((experience, index) => {
                const accent = ACCENTS[index % ACCENTS.length];
                const open = activeExperience === index;
                return (
                  <div key={experience.id} className="relative">
                    <span
                      className="absolute -left-8 top-7 h-3 w-3 -translate-x-1/2 rounded-full border-2"
                      style={{ background: accent, borderColor: "#080810" }}
                    />
                    <div
                      className="pw-card overflow-hidden rounded-2xl transition-all duration-300"
                      style={{ borderColor: open ? `${accent}40` : undefined }}
                    >
                      <div className="flex items-start justify-between gap-4 p-7">
                        <div className="min-w-0 flex-1 space-y-2" onClick={(event) => event.stopPropagation()}>
                          <div className="flex flex-wrap gap-3">
                            <input
                              type="text"
                              className="pw-edit-input w-32 text-xs"
                              style={{ color: accent }}
                              value={experience.type}
                              placeholder="Type"
                              onChange={(event) => editListItem("workExperience", experience.id, "type", event.target.value)}
                            />
                            <input
                              type="text"
                              className="pw-edit-input w-40 text-xs"
                              value={experience.period}
                              placeholder="Period"
                              onChange={(event) => editListItem("workExperience", experience.id, "period", event.target.value)}
                            />
                          </div>
                          <input
                            type="text"
                            className="pw-edit-input text-lg"
                            style={{ fontFamily: '"Fraunces", serif' }}
                            value={experience.company}
                            placeholder="Company"
                            onChange={(event) => editListItem("workExperience", experience.id, "company", event.target.value)}
                          />
                          <input
                            type="text"
                            className="pw-edit-input text-sm"
                            style={{ color: accent }}
                            value={experience.role}
                            placeholder="Role"
                            onChange={(event) => editListItem("workExperience", experience.id, "role", event.target.value)}
                          />
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <button
                            type="button"
                            className="pw-chip-button pw-danger"
                            onClick={() => void removeExperience(experience.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                          <button
                            type="button"
                            className="text-xl transition-transform duration-300"
                            style={{ color: "#6b6890", transform: open ? "rotate(180deg)" : undefined }}
                            onClick={() => setActiveExperience(open ? -1 : index)}
                            aria-label="Toggle experience details"
                          >
                            ↓
                          </button>
                        </div>
                      </div>

                      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? "420px" : "0px" }}>
                        <div className="border-t px-7 pb-7 pt-2" style={{ borderColor: "rgba(124,106,247,0.1)" }} onClick={(event) => event.stopPropagation()}>
                          {primaryExperience?.id === experience.id && (
                            <>
                              <div>
                                <span className="pw-edit-label">Description</span>
                                <textarea
                                  className="pw-edit-input text-sm"
                                  value={experience.description}
                                  placeholder="What you did"
                                  onChange={(event) => editListItem("workExperience", experience.id, "description", event.target.value)}
                                />
                              </div>
                              <div className="mt-4">
                                <span className="pw-edit-label">Highlights (comma separated)</span>
                                <input
                                  type="text"
                                  className="pw-edit-input text-xs"
                                  value={inputValue("workExperience", experience, "highlights", "highlights")}
                                  onChange={(event) => editListText("workExperience", experience.id, "highlights", event.target.value, "highlights")}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!view.workExperience.length && (
              <p className="pw-fade mt-6 text-sm" style={{ color: "#6b6890" }}>Experience details coming soon.</p>
            )}
          </div>
        </section>

        <section id="education" className="scroll-mt-20 bg-[#0a0a12] px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="pw-label pw-fade mb-4">05 - Education</div>
                <h2 className="pw-fade mt-4 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
                  Academic <span className="pw-gradient italic">foundation</span>
                </h2>
              </div>
              <button type="button" className="pw-chip-button" onClick={() => void addEducation()}>
                <Plus size={13} /> Add education
              </button>
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div className="pw-fade space-y-6">
                {view.education.map((education) => (
                  <div key={education.id} className="pw-card rounded-2xl p-8" style={{ borderColor: `${ACCENTS[0]}30` }}>
                    <div className="mb-6 flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-xl"
                        style={{ background: `${ACCENTS[0]}15`, borderColor: `${ACCENTS[0]}30` }}
                      >
                        🎓
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <input
                          type="text"
                          className="pw-edit-input text-xs"
                          style={{ color: ACCENTS[0] }}
                          value={education.period}
                          placeholder="Period"
                          onChange={(event) => editListItem("education", education.id, "period", event.target.value)}
                        />
                        <input
                          type="text"
                          className="pw-edit-input text-lg"
                          style={{ fontFamily: '"Fraunces", serif' }}
                          value={education.degree}
                          placeholder="Degree"
                          onChange={(event) => editListItem("education", education.id, "degree", event.target.value)}
                        />
                        <input
                          type="text"
                          className="pw-edit-input text-sm"
                          style={{ color: "#a09ec0" }}
                          value={education.institution}
                          placeholder="Institution"
                          onChange={(event) => editListItem("education", education.id, "institution", event.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="pw-chip-button pw-danger"
                        onClick={() => void removeEducation(education.id)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        className="pw-edit-input w-28 font-mono text-xs"
                        style={{ color: ACCENTS[0] }}
                        value={education.gpa}
                        placeholder="GPA"
                        onChange={(event) => editListItem("education", education.id, "gpa", event.target.value)}
                      />
                      <span className="pw-label" style={{ color: "#6b6890" }}>GPA</span>
                    </div>

                    <div className="mb-5">
                      <span className="pw-edit-label">Description</span>
                      <textarea
                        className="pw-edit-input text-sm"
                        value={education.description}
                        placeholder="Description"
                        onChange={(event) => editListItem("education", education.id, "description", event.target.value)}
                      />
                    </div>

                    <div>
                      <span className="pw-edit-label">Courses (comma separated)</span>
                      <input
                        type="text"
                        className="pw-edit-input text-xs"
                        value={inputValue("education", education, "courses", "courses")}
                        onChange={(event) => editListText("education", education.id, "courses", event.target.value, "courses")}
                      />
                    </div>
                  </div>
                ))}
                {!primaryEducation && <p className="text-sm" style={{ color: "#6b6890" }}>Education details coming soon.</p>}
              </div>

              <div className="pw-fade" style={{ transitionDelay: "150ms" }}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="pw-label">Certifications</div>
                  <button type="button" className="pw-chip-button" onClick={() => setCertFormOpen((open) => !open)}>
                    {certFormOpen ? <X size={12} /> : <Plus size={12} />}
                    {certFormOpen ? "Close" : "Add certificate"}
                  </button>
                </div>
                <div className="space-y-3">
                  {view.certificates.map((certificate, index) => {
                    const accent = ACCENTS[index % ACCENTS.length];
                    return (
                      <div key={certificate.id} className="pw-card rounded-xl p-5 transition-all duration-300 group hover:scale-[1.01]">
                        <div className="flex items-start gap-4">
                          {certificate.certificateUrl ? (
                            <img
                              src={certificate.certificateUrl}
                              alt={certificate.title}
                              className="pw-cert-thumb"
                              onError={(event) => { event.currentTarget.style.visibility = "hidden"; }}
                            />
                          ) : (
                            <div
                              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-lg transition-transform duration-300 group-hover:scale-110"
                              style={{ background: `${accent}15`, borderColor: `${accent}30` }}
                            >
                              {certificate.icon}
                            </div>
                          )}
                          <div className="min-w-0 flex-1 space-y-2">
                            <input
                              type="text"
                              className="pw-edit-input text-sm font-medium"
                              value={certificate.title}
                              onBlur={() => void persistCertificate(certificate)}
                              onChange={(event) => commit((current) => ({
                                ...current,
                                certificates: (current.certificates || []).map((item) => (item.id === certificate.id ? { ...item, title: event.target.value } : item)),
                              }))}
                            />
                            <div className="flex flex-wrap gap-2">
                              <input
                                type="text"
                                className="pw-edit-input w-36 text-xs"
                                style={{ color: "#6b6890" }}
                                value={certificate.issuer}
                                placeholder="Issuer"
                                onBlur={() => void persistCertificate(certificate)}
                                onChange={(event) => commit((current) => ({
                                  ...current,
                                  certificates: (current.certificates || []).map((item) => (item.id === certificate.id ? { ...item, issuer: event.target.value, platform: event.target.value } : item)),
                                }))}
                              />
                              <input
                                type="text"
                                className="pw-edit-input w-28 text-xs"
                                style={{ color: accent, background: `${accent}12` }}
                                value={certificate.issueDate || certificate.year}
                                placeholder="Issue date"
                                onBlur={() => void persistCertificate(certificate)}
                                onChange={(event) => commit((current) => ({
                                  ...current,
                                  certificates: (current.certificates || []).map((item) => (item.id === certificate.id ? { ...item, issueDate: event.target.value, year: event.target.value } : item)),
                                }))}
                              />
                            </div>
                            <input
                              type="text"
                              className="pw-edit-input text-xs"
                              style={{ color: "#a78bfa" }}
                              value={certificate.role}
                              placeholder="Role"
                              onBlur={() => void persistCertificate(certificate)}
                              onChange={(event) => commit((current) => ({
                                ...current,
                                certificates: (current.certificates || []).map((item) => (item.id === certificate.id ? { ...item, role: event.target.value } : item)),
                              }))}
                            />
                            <input
                              type="text"
                              className="pw-edit-input text-xs"
                              style={{ color: "#6b6890" }}
                              value={certificate.description}
                              placeholder="Description"
                              onBlur={() => void persistCertificate(certificate)}
                              onChange={(event) => commit((current) => ({
                                ...current,
                                certificates: (current.certificates || []).map((item) => (item.id === certificate.id ? { ...item, description: event.target.value } : item)),
                              }))}
                            />
                          </div>
                          <button
                            type="button"
                            className="pw-chip-button pw-danger"
                            onClick={() => void removeCertificate(certificate.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {!view.certificates.length && (
                    <p className="text-sm" style={{ color: "#6b6890" }}>No certifications available yet.</p>
                  )}
                </div>

                {certFormOpen && (
                  <form className="pw-cert-form" onSubmit={addCertificate}>
                    <div>
                      <span className="pw-edit-label">Title *</span>
                      <input required type="text" className="pw-input" value={certForm.title} onChange={(event) => setCertForm({ ...certForm, title: event.target.value })} />
                    </div>
                    <div>
                      <span className="pw-edit-label">Issuer *</span>
                      <input required type="text" className="pw-input" value={certForm.issuer} onChange={(event) => setCertForm({ ...certForm, issuer: event.target.value })} />
                    </div>
                    <div>
                      <span className="pw-edit-label">Role</span>
                      <input type="text" className="pw-input" value={certForm.role} onChange={(event) => setCertForm({ ...certForm, role: event.target.value })} />
                    </div>
                    <div>
                      <span className="pw-edit-label">Description</span>
                      <textarea className="pw-input resize-none" rows={2} value={certForm.description} onChange={(event) => setCertForm({ ...certForm, description: event.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="pw-edit-label">Issue date</span>
                        <input type="text" className="pw-input" value={certForm.issueDate} onChange={(event) => setCertForm({ ...certForm, issueDate: event.target.value })} />
                      </div>
                      <div>
                        <span className="pw-edit-label">Image</span>
                        <input
                          ref={certInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          className="pw-file-input"
                          required
                          onChange={(event) => setCertForm({ ...certForm, image: event.target.files?.[0] || null })}
                        />
                      </div>
                    </div>
                    <button type="submit" className="pw-btn pw-btn-primary w-full justify-center" style={{ padding: "10px 20px" }}>
                      <Check size={14} /> Save certificate
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 px-6 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="pw-label pw-fade mb-4">06 - Contact</div>
            <h2 className="pw-fade mt-4 mb-6 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
              Let&apos;s build something <br />
              <span className="pw-gradient italic">remarkable</span> together
            </h2>
            <p className="pw-fade mx-auto mb-10 max-w-md text-base" style={{ color: "#6b6890" }}>
              I&apos;m open to freelance projects, full-time roles, and interesting collaborations. Drop me a line.
            </p>

            <div className="pw-fade pw-card mx-auto mb-10 grid max-w-2xl gap-4 rounded-2xl p-6 text-left sm:grid-cols-2 sm:p-8">
              <div className="sm:col-span-2">
                <span className="pw-edit-label">Full name</span>
                <input type="text" className="pw-edit-input text-sm" value={view.name} onChange={(event) => editField("name", event.target.value)} />
              </div>
              <div>
                <span className="pw-edit-label">Email</span>
                <input type="text" className="pw-edit-input text-sm" value={view.email} onChange={(event) => editField("email", event.target.value)} />
              </div>
              <div>
                <span className="pw-edit-label">GitHub URL</span>
                <input type="text" className="pw-edit-input text-sm" value={view.githubUrl} onChange={(event) => editField("githubUrl", event.target.value)} />
              </div>
              <div>
                <span className="pw-edit-label">LinkedIn URL</span>
                <input type="text" className="pw-edit-input text-sm" value={view.linkedinUrl} onChange={(event) => editField("linkedinUrl", event.target.value)} />
              </div>
              <div>
                <span className="pw-edit-label">Twitter URL</span>
                <input type="text" className="pw-edit-input text-sm" value={view.twitterUrl} onChange={(event) => editField("twitterUrl", event.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <span className="pw-edit-label">Website URL</span>
                <input type="text" className="pw-edit-input text-sm" value={view.websiteUrl} onChange={(event) => editField("websiteUrl", event.target.value)} />
              </div>
            </div>

            <div className="pw-fade pw-card mx-auto mb-10 flex max-w-2xl flex-wrap items-center justify-between gap-4 rounded-2xl p-6 text-left">
              <div className="flex min-w-0 items-center gap-3">
                <FileText size={18} />
                <div className="min-w-0">
                  <div className="pw-label mb-1">CV / Resume</div>
                  {view.cvUrl ? (
                    <a href={view.cvUrl} target="_blank" rel="noreferrer" className="truncate text-sm text-[#a78bfa] hover:underline">
                      {view.cvName || "View current CV"}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: "#6b6890" }}>No CV uploaded</span>
                  )}
                </div>
              </div>
              <div className="pw-edit-actions">
                <button type="button" className="pw-chip-button" onClick={() => cvInputRef.current?.click()}>
                  <Upload size={12} /> {view.cvUrl ? "Replace" : "Upload"}
                </button>
                {view.cvUrl && (
                  <button type="button" className="pw-chip-button pw-danger" onClick={() => void removeCv()}>
                    <Trash2 size={12} /> Remove
                  </button>
                )}
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void uploadCv(file);
                    event.target.value = "";
                  }}
                />
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="pw-fade pw-card mx-auto max-w-2xl rounded-2xl p-8 text-left sm:p-10" style={{ transitionDelay: "200ms" }}>
              <input type="hidden" name="_subject" value={`New message from portfolio`} />
              <div className="mb-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="pw-label mb-2 block">Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Your name"
                    className="pw-input"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </div>
                <div>
                  <label className="pw-label mb-2 block">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    className="pw-input"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="pw-label mb-2 block">Message</label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="pw-input resize-none"
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                />
              </div>
              <button type="submit" className="pw-btn pw-btn-primary w-full justify-center">
                {messageSent ? "Message Sent ✓" : "Send Message"}
              </button>
              {view.email && (
                <p className="mt-3 text-center text-xs" style={{ color: "#6b6890" }}>
                  Or email me directly at {view.email}
                </p>
              )}
            </form>

            <div className="pw-fade mt-16 flex justify-center gap-6" style={{ transitionDelay: "400ms" }}>
              {view.githubUrl && (
                <a href={view.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110" style={{ background: "rgba(124,106,247,0.08)", borderColor: "rgba(124,106,247,0.2)", color: "#a09ec0" }}>
                  <GithubIcon size={18} />
                </a>
              )}
              {view.linkedinUrl && (
                <a href={view.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110" style={{ background: "rgba(124,106,247,0.08)", borderColor: "rgba(124,106,247,0.2)", color: "#a09ec0" }}>
                  <LinkedinIcon size={18} />
                </a>
              )}
              {view.twitterUrl && (
                <a href={view.twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110" style={{ background: "rgba(124,106,247,0.08)", borderColor: "rgba(124,106,247,0.2)", color: "#a09ec0" }}>
                  <X size={18} />
                </a>
              )}
              {view.websiteUrl && (
                <a href={view.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website" className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110" style={{ background: "rgba(124,106,247,0.08)", borderColor: "rgba(124,106,247,0.2)", color: "#a09ec0" }}>
                  <ExternalLink size={18} />
                </a>
              )}
              {view.email && (
                <a href={`mailto:${view.email}`} aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-110" style={{ background: "rgba(124,106,247,0.08)", borderColor: "rgba(124,106,247,0.2)", color: "#a09ec0" }}>
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        </section>

        <footer className="border-t px-6 py-8 text-center" style={{ borderColor: "rgba(124,106,247,0.1)" }}>
          <p className="font-mono text-xs" style={{ color: "#4a476a" }}>
            © {new Date().getFullYear()} {view.name} — Built with React &amp; ♥
          </p>
        </footer>
      </div>

      <div className="pw-editor-toolbar">
        <div className="pw-editor-status">
          {saveStatus === "error" ? (
            <X size={13} />
          ) : saveStatus === "saving" ? (
            <Loader2 className="animate-spin" size={13} />
          ) : saveStatus === "pending" ? (
            <Save size={13} />
          ) : (
            <Check size={13} />
          )}
          <span>{statusLabel}</span>
        </div>
        <button
          type="button"
          className="pw-chip-button"
          onClick={() => void persistDraft(draftRef.current, { toast: "Portfolio saved" })}
        >
          <Save size={12} /> Save now
        </button>
        <span className="pw-editor-note">Live edit mode · Skills are read-only</span>
      </div>
    </main>
  );
}

export default PreviewPortfolio;


