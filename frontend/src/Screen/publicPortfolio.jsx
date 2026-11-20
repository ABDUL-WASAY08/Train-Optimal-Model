import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, Mail } from "lucide-react";
import api from "../api/axios";
import "./PublicPortfolio.css";

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
      title: project,
      subtitle: "",
      description: "",
      tech: [],
      image: "",
      url: "",
      liveUrl: "",
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

  return {
    id: cleanText(firstValue(source, ["_id", "id"])) || url || index,
    title: cleanText(firstValue(source, ["name", "title", "projectName"])) || "Untitled project",
    subtitle: cleanText(firstValue(source, ["subtitle", "category", "type"])) || language || "Featured Project",
    description: cleanText(firstValue(source, ["description", "desc", "summary"])),
    tech,
    image: normalizeUrl(firstValue(source, ["imageUrl", "image", "screenshot", "thumbnail", "coverImage"])),
    url,
    liveUrl: normalizeUrl(firstValue(source, ["liveUrl", "demoUrl", "homepage", "websiteUrl", "deploymentUrl"])),
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
  const credential = normalizeUrl(firstValue(source, ["certificateUrl", "credentialUrl", "url", "link"]));

  return {
    id: cleanText(firstValue(source, ["_id", "id"])) || index,
    title: cleanText(firstValue(source, ["certificateName", "title", "name"])) || "Certificate",
    issuer: cleanText(firstValue(source, ["companyName", "issuer", "organization", "company"])),
    platform: cleanText(firstValue(source, ["platform", "provider", "source"])) || cleanText(source.companyName),
    year: getPeriod(source),
    icon: cleanText(firstValue(source, ["icon", "emoji", "symbol"])) || "◆",
    credential,
  };
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
    <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

function PublicPortfolio() {
  const { username } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(Boolean(username));
  const [error, setError] = useState("");
  const [menuState, setMenuState] = useState({ username, open: false });
  const [scrolled, setScrolled] = useState(() => typeof window !== "undefined" && window.scrollY > 40);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [activeExperience, setActiveExperience] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [messageSent, setMessageSent] = useState(false);

  const menuOpen = menuState.username === username && menuState.open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    if (!username) return undefined;

    api
      .get(`/user/portfolio/${encodeURIComponent(username)}`, {
        signal: controller.signal,
        withCredentials: false,
      })
      .then((response) => {
        if (cancelled) return;
        const data = unwrapPortfolio(response.data);
        if (!data) throw new Error("Portfolio not found");
        setPortfolio(data);
      })
      .catch((requestError) => {
        if (cancelled || requestError?.code === "ERR_CANCELED") return;
        setPortfolio(null);
        setError(requestError?.response?.data?.message || "This portfolio is unavailable or doesn't exist.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  useEffect(() => {
    if (!portfolio) return undefined;
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
  }, [portfolio]);

  useEffect(() => {
    if (!portfolio || !window.location.hash) return undefined;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [portfolio]);

  const view = useMemo(() => {
    const source = portfolio || {};
    const routeName = cleanText(username);
    const portfolioName = cleanText(firstValue(source, ["username", "login", "handle", "user"])) || routeName;
    const fullName = cleanText(firstValue(source, ["name", "fullName", "displayName"])) || portfolioName || "Developer";
    const bioText = cleanText(firstValue(source, ["bio", "about", "description"]));
    const rawSkills = asArray(firstValue(source, ["skills", "technologies", "techStack"])).map(getSkillName).filter(Boolean);
    const languages = asArray(firstValue(source, ["topLanguages", "languages"]))
      .map((language, index) => ({
        id: cleanText(firstValue(language, ["_id", "id"])) || index,
        name: getLanguageName(language),
        percent: getLanguagePercent(language),
      }))
      .filter((language) => language.name);
    const allSkillNames = [...new Set([...languages.map((language) => language.name), ...rawSkills])];

    return {
      name: fullName,
      portfolioUsername: portfolioName || "developer",
      bio: bioText,
      email: cleanText(firstValue(source, ["email", "emailAddress", "contactEmail"])),
      githubUrl: normalizeUrl(firstValue(source, ["githubUrl", "github", "githubLink", "githubProfile"])),
      linkedinUrl: normalizeUrl(firstValue(source, ["linkedinUrl", "linkedin", "linkedIn", "linkedinProfile"])),
      websiteUrl: normalizeUrl(firstValue(source, ["websiteUrl", "website", "portfolioUrl", "personalWebsite"])),
      resumeUrl: normalizeUrl(firstValue(source, ["resumeUrl", "cvUrl", "resume", "cv"])),
      avatarUrl: normalizeUrl(firstValue(source, ["avatarUrl", "avatar", "profilePicture", "photoURL", "profileImage"])),
      skills: rawSkills,
      topLanguages: languages,
      allSkillNames,
      projects: asArray(firstValue(source, ["Filteredrepositories", "filteredRepositories", "repositories", "repos", "projects"])).map(normalizeProject),
      certificates: asArray(firstValue(source, ["certificates", "certifications"])).map(normalizeCertificate),
      education: asArray(source.education).map(normalizeEducation),
      workExperience: asArray(firstValue(source, ["workExperience", "experience", "experiences"])).map(normalizeExperience),
    };
  }, [portfolio, username]);

  const roles = useMemo(() => {
    const fromExperience = view.workExperience.map((item) => item.role).filter(Boolean);
    const fromSkills = view.skills.slice(0, 4).map((skill) => `${skill} Developer`);
    const combined = [...new Set([...fromExperience, ...fromSkills])];
    return combined.length ? combined : ["Full-Stack Developer", "Problem Solver", "Creator"];
  }, [view.workExperience, view.skills]);

  const typedRole = useTypewriter(roles);

  const skillCategories = useMemo(() => buildSkillCategories(view.allSkillNames), [view.allSkillNames]);

  const proficiency = useMemo(() => {
    if (view.topLanguages.length) {
      return view.topLanguages.slice(0, 7).map((language, index) => ({
        name: language.name,
        level: language.percent ?? Math.max(60, 92 - index * 5),
      }));
    }
    return view.skills.slice(0, 7).map((skill, index) => ({ name: skill, level: Math.max(60, 92 - index * 5) }));
  }, [view.topLanguages, view.skills]);

  const logo = useMemo(() => {
    const parts = view.name.split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : view.portfolioUsername.slice(0, 2);
    return (initials || "dv").toLowerCase();
  }, [view.name, view.portfolioUsername]);

  const codeLines = useMemo(() => {
    const skillList = view.skills.slice(0, 3).map((skill) => `"${skill}"`).join(", ") || '"React", "Node.js", "Python"';
    const role = view.workExperience[0]?.role || view.skills[0] || "Developer";
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
  }, [view.name, view.portfolioUsername, view.skills, view.workExperience, view.bio]);

  const heroBadges = useMemo(() => {
    const names = [...view.topLanguages.map((item) => item.name), ...view.skills];
    return [...new Set(names)].slice(0, 3);
  }, [view.topLanguages, view.skills]);

  const stats = useMemo(
    () => [
      { value: view.projects.length, suffix: "+", label: "Projects Shipped" },
      { value: view.workExperience.length, suffix: "", label: "Experience" },
      { value: view.certificates.length, suffix: "", label: "Certifications" },
      { value: Math.max(view.skills.length, view.topLanguages.length), suffix: "+", label: "Tech Stacks" },
    ],
    [view.projects, view.workExperience, view.certificates, view.skills, view.topLanguages]
  );

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

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-5 bg-[#080810] text-[#e8e6f0]">
        <style>{portfolioStyles}</style>
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#7c6af733] border-t-[#7c6af7]" />
        <p className="pw-label">Loading portfolio</p>
      </main>
    );
  }

  if (!portfolio) {
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
  const aboutParagraphTwo = view.allSkillNames.length
    ? `My work spans ${view.allSkillNames.slice(0, 4).join(", ")}, and I focus on building products that are reliable, maintainable, and genuinely useful.`
    : "I focus on building products that are reliable, maintainable, and genuinely useful.";

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

              <h1
                className="pw-fade visible mb-6 text-6xl font-light leading-none tracking-tight sm:text-7xl md:text-8xl"
                style={{ fontFamily: '"Fraunces", serif', transitionDelay: "200ms" }}
              >
                {firstName} {lastName && <span className="pw-gradient italic">{lastName}</span>}
              </h1>

              <div
                className="pw-fade visible mb-8 h-9 text-xl sm:text-2xl"
                style={{ color: "#a09ec0", fontFamily: '"JetBrains Mono", monospace', fontSize: "1rem", transitionDelay: "350ms" }}
              >
                <span className="text-purple-400">&gt;</span> {typedRole}
                <span className="pw-cursor" />
              </div>

              <p
                className="pw-fade visible mb-12 max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ color: "#6b6890", transitionDelay: "500ms" }}
              >
                {view.bio || "I build elegant, performant web experiences — from crisp interfaces to robust server-side architectures. Passionate about clean code and creative solutions."}
              </p>

              <div className="pw-fade visible flex flex-wrap gap-4" style={{ transitionDelay: "650ms" }}>
                <button type="button" className="pw-btn pw-btn-primary" onClick={() => scrollTo("projects")}>
                  View Projects
                  <ArrowRightIcon />
                </button>
                <a
                  className="pw-btn pw-btn-outline"
                  href={view.resumeUrl || (view.email ? `mailto:${view.email}` : "#contact")}
                  target={view.resumeUrl ? "_blank" : undefined}
                  rel={view.resumeUrl ? "noreferrer" : undefined}
                  download={view.resumeUrl ? true : undefined}
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
            <h2 className="pw-fade mt-4 mb-16 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
              Tools of the <span className="pw-gradient italic">trade</span>
            </h2>

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
            <h2 className="pw-fade mt-4 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
              Selected <span className="pw-gradient italic">work</span>
            </h2>
            <p className="pw-fade mb-16 mt-3 text-sm" style={{ color: "#6b6890" }}>
              A collection of projects spanning development, data, and modern platforms.
            </p>

            <div className="pw-stagger grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {view.projects.map((project, index) => {
                const accent = ACCENTS[index % ACCENTS.length];
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
                    </div>

                    <div className="p-6">
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
                    </div>
                  </article>
                );
              })}
            </div>

            {!view.projects.length && (
              <p className="pw-fade text-center text-sm" style={{ color: "#6b6890" }}>No projects available yet.</p>
            )}
          </div>
        </section>

        <section id="experience" className="scroll-mt-20 px-6 py-32">
          <div className="mx-auto max-w-6xl">
            <div className="pw-label pw-fade mb-4">04 - Experience</div>
            <h2 className="pw-fade mb-16 mt-4 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
              Where I&apos;ve <span className="pw-gradient italic">grown</span>
            </h2>

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
                      className="pw-card cursor-pointer overflow-hidden rounded-2xl transition-all duration-300"
                      style={{ borderColor: open ? `${accent}40` : undefined }}
                      onClick={() => setActiveExperience(open ? -1 : index)}
                    >
                      <div className="flex items-start justify-between gap-4 p-7">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-3">
                            {experience.type && (
                              <span className="rounded-full border px-2.5 py-0.5 font-mono text-[.65rem]" style={{ background: `${accent}15`, borderColor: `${accent}40`, color: accent }}>
                                {experience.type}
                              </span>
                            )}
                            {experience.period && <span className="pw-label">{experience.period}</span>}
                          </div>
                          <h3 className="mb-0.5 text-lg font-medium" style={{ fontFamily: '"Fraunces", serif' }}>{experience.company}</h3>
                          <div className="text-sm" style={{ color: accent }}>{experience.role}</div>
                        </div>
                        <span className="mt-1 flex-shrink-0 text-xl transition-transform duration-300" style={{ color: "#6b6890", transform: open ? "rotate(180deg)" : undefined }}>
                          ↓
                        </span>
                      </div>

                      <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: open ? "400px" : "0px" }}>
                        <div className="border-t px-7 pb-7" style={{ borderColor: "rgba(124,106,247,0.1)" }}>
                          {primaryExperience?.id === experience.id && (
                            <>
                              {experience.description && (
                                <p className="mb-5 mt-5 text-sm leading-relaxed" style={{ color: "#6b6890" }}>{experience.description}</p>
                              )}
                              {experience.highlights.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {experience.highlights.map((highlight) => (
                                    <span key={highlight} className="pw-skill-tag">{highlight}</span>
                                  ))}
                                </div>
                              )}
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
            <div className="pw-label pw-fade mb-4">05 - Education</div>
            <h2 className="pw-fade mb-16 mt-4 text-4xl font-light leading-tight sm:text-5xl" style={{ fontFamily: '"Fraunces", serif' }}>
              Academic <span className="pw-gradient italic">foundation</span>
            </h2>

            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div className="pw-fade">
                {primaryEducation ? (
                  <div className="pw-card rounded-2xl p-8" style={{ borderColor: `${ACCENTS[0]}30` }}>
                    <div className="mb-6 flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border text-xl"
                        style={{ background: `${ACCENTS[0]}15`, borderColor: `${ACCENTS[0]}30` }}
                      >
                        🎓
                      </div>
                      <div className="min-w-0">
                        <div className="pw-label mb-1" style={{ color: ACCENTS[0] }}>{primaryEducation.period}</div>
                        <h3 className="text-lg font-medium leading-snug" style={{ fontFamily: '"Fraunces", serif' }}>{primaryEducation.degree}</h3>
                        <p className="mt-0.5 text-sm" style={{ color: "#a09ec0" }}>{primaryEducation.institution}</p>
                      </div>
                    </div>

                    {primaryEducation.gpa && (
                      <div className="mb-5 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs" style={{ background: `${ACCENTS[0]}12`, borderColor: `${ACCENTS[0]}30`, color: ACCENTS[0] }}>
                        GPA: {primaryEducation.gpa}
                      </div>
                    )}

                    {primaryEducation.description && (
                      <p className="mb-5 text-sm leading-relaxed" style={{ color: "#6b6890" }}>{primaryEducation.description}</p>
                    )}

                    {primaryEducation.courses.length > 0 && (
                      <>
                        <div className="pw-label mb-3">Key Courses</div>
                        <div className="flex flex-wrap gap-2">
                          {primaryEducation.courses.map((course) => <span key={course} className="pw-skill-tag">{course}</span>)}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: "#6b6890" }}>Education details coming soon.</p>
                )}
              </div>

              <div className="pw-fade" style={{ transitionDelay: "150ms" }}>
                <div className="pw-label mb-5">Certifications</div>
                <div className="space-y-3">
                  {view.certificates.map((certificate, index) => {
                    const accent = ACCENTS[index % ACCENTS.length];
                    return (
                      <div key={certificate.id} className="pw-card flex items-center gap-4 rounded-xl p-5 transition-all duration-300 group hover:scale-[1.01]">
                        <div
                          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-lg transition-transform duration-300 group-hover:scale-110"
                          style={{ background: `${accent}15`, borderColor: `${accent}30` }}
                        >
                          {certificate.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium" style={{ color: "#e8e6f0" }}>{certificate.title}</div>
                          <div className="mt-0.5 text-xs" style={{ color: "#6b6890" }}>
                            {[certificate.issuer, certificate.year].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                        {certificate.platform && (
                          <span className="flex-shrink-0 rounded-full border px-2.5 py-1 font-mono text-[.6rem]" style={{ background: `${accent}12`, borderColor: `${accent}30`, color: accent }}>
                            {certificate.platform}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {!view.certificates.length && (
                    <p className="text-sm" style={{ color: "#6b6890" }}>No certifications available yet.</p>
                  )}
                </div>
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
            <p className="pw-fade mx-auto mb-16 max-w-md text-base" style={{ color: "#6b6890" }}>
              I&apos;m open to freelance projects, full-time roles, and interesting collaborations. Drop me a line.
            </p>

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
    </main>
  );
}

export default PublicPortfolio;
