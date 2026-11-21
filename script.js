/* =========================================================
   EDIT YOUR LINKS HERE. Leave a value as "" to hide that button.
   ========================================================= */
const LINKS = {
  github: "https://github.com/Luvish6",
  leetcode: "https://leetcode.com/u/Luvish6/",
  chess: "https://www.chess.com/member/Luvish69",
  linkedin: "https://www.linkedin.com/in/luvish-ramchandani-6312a2162",
  instagram: "https://www.instagram.com/luvish_ramchandani/",
  team: "https://www.instagram.com/team_adrenaline_f1inschools/",
  email: "luvishramchandani@gmail.com",
  phone: "+91 9511425112",
};

/* =========================================================
   PROJECTS. To add a live demo or repo, fill in `demo` / `repo`.
   If `repo` is empty, the card links to your GitHub profile.
   status: "built" or "progress"
   category: "fullstack" | "systems" | "ai" | "data"
   ========================================================= */
const PROJECTS = [
  {
    title: "CareFlow",
    category: "fullstack", catLabel: "Full stack", status: "built",
    desc: "AI-assisted healthcare claims management platform with rule-based validation and automated claim workflows across 7 core modules.",
    highlight: "AI document extraction with human review, audit logging, automated tests, Docker and CI/CD.",
    tags: ["React", "TypeScript", "FastAPI", "PostgreSQL", "SQLAlchemy", "Docker"],
    repo: "", demo: "",
  },
  {
    title: "FlashReserve",
    category: "systems", catLabel: "Backend & systems", status: "built",
    desc: "High-concurrency inventory reservation engine built for flash sales, with no data races and no double-selling.",
    highlight: "5,000+ checkout req/s · 65% lower API latency with atomic Redis Lua scripts and async Kafka fulfillment.",
    tags: ["Go", "Redis", "Lua", "Kafka", "PostgreSQL", "Docker", "JMeter"],
    repo: "", demo: "",
  },
  {
    title: "Intelligent Research Assistant",
    category: "ai", catLabel: "AI / ML", status: "built",
    desc: "Retrieval-Augmented Generation (RAG) assistant that answers questions grounded in your own documents through a REST API.",
    highlight: "Next up: a Next.js front-end with streaming answers, sign-in and document upload.",
    tags: ["Python", "Flask", "LangChain", "FAISS", "OpenAI"],
    repo: "https://github.com/Luvish6/intelligent-research-assistant-rag", demo: "",
  },
  {
    title: "PhysiCompile",
    category: "ai", catLabel: "AI / ML", status: "built",
    desc: "Core infrastructure library for scientific ML: an async microservice that enforces hard physical constraints on deep-learning models.",
    highlight: "SymPy + AST parsing with custom PyTorch SVD projection layers, shipped as a hardened multi-stage Docker image.",
    tags: ["PyTorch", "FastAPI", "SymPy", "Docker", "CI/CD"],
    repo: "https://github.com/Luvish6/physicompile", demo: "",
  },
  {
    title: "Forest Fire Risk Detection",
    category: "ai", catLabel: "AI / ML", status: "built",
    desc: "Spatio-temporal pipeline over MODIS/VIIRS satellite data to predict fire hotspots and map risk zones with geospatial heatmaps.",
    highlight: "94% precision · 92% F1-score with Random Forest, beating the other models tested.",
    tags: ["Python", "Pandas", "Scikit-learn", "XGBoost", "Geospatial"],
    repo: "https://github.com/Luvish6/forest-fire-detection-modis-viirs", demo: "",
  },
  {
    title: "Clickstream & User Behaviour Analytics",
    category: "data", catLabel: "Data", status: "built",
    desc: "Scalable ETL pipeline over multi-gigabyte clickstream logs for feature extraction, churn prediction and user segmentation.",
    highlight: "",
    tags: ["PySpark", "SQL", "Scikit-learn", "Pandas"],
    repo: "", demo: "",
  },
  {
    title: "Resource Optimization Engine",
    category: "data", catLabel: "Data", status: "built",
    desc: "Decision-support tool that formulates linear-programming models to automate constraint-based resource and task allocation.",
    highlight: "",
    tags: ["Python", "PuLP", "SciPy", "NumPy"],
    repo: "", demo: "",
  },
  {
    title: "Mining Disturbance Monitoring",
    category: "ai", catLabel: "AI / ML", status: "progress",
    desc: "Final-year major project: multi-sensor satellite monitoring of mining disturbance and river degradation in Meghalaya.",
    highlight: "Sentinel-1 SAR + Sentinel-2 optical in Google Earth Engine, Random Forest evaluation, Streamlit + React review tools.",
    tags: ["Python", "Earth Engine", "Sentinel", "Random Forest", "React"],
    repo: "https://github.com/Luvish6/mining-disturbance-monitoring", demo: "",
  },
  {
    title: "Future Self",
    category: "fullstack", catLabel: "Full stack", status: "built",
    desc: "Private, offline-first personal growth app: goals, habits, journaling, vision board and guided night audio.",
    highlight: "Installable PWA with optional Supabase sync protected by row-level security. Live on GitHub Pages.",
    tags: ["React 19", "TypeScript", "Vite", "Tailwind", "Supabase", "PWA", "Vitest"],
    repo: "https://github.com/Luvish6/future-self", demo: "https://luvish6.github.io/future-self/",
  },
  {
    title: "Smart Product Pricing",
    category: "ai", catLabel: "AI / ML", status: "built",
    desc: "Team entry for ML Challenge 2025: predicting e-commerce product prices from product descriptions.",
    highlight: "Hybrid ensemble of BERT embeddings, deep MLP, XGBoost residuals and a CatBoost meta-blender.",
    tags: ["BERT", "XGBoost", "CatBoost", "TF-IDF"],
    repo: "https://github.com/Luvish6/smart-product-pricing-mlc2025", demo: "",
  },
  {
    title: "Smart Attendance System",
    category: "fullstack", catLabel: "Full stack", status: "progress",
    desc: "Camera-based attendance that registers faces, recognises them live and marks attendance automatically.",
    highlight: "One mark per person per day, unknown-face detection, and a Flask dashboard.",
    tags: ["Python", "OpenCV", "face_recognition", "Flask", "SQLite"],
    repo: "https://github.com/Luvish6/smart-attendance-system", demo: "",
  },
  {
    title: "Fertilizer Prediction",
    category: "data", catLabel: "Data", status: "built",
    desc: "Decision-support tool that recommends the best fertilizer from soil composition, crop type and climate.",
    highlight: "Compared several classifiers and combined them in a Voting ensemble, served through Streamlit.",
    tags: ["Python", "Scikit-learn", "Ensembles", "Streamlit"],
    repo: "https://github.com/Luvish6/Fertilizer-Prediction", demo: "",
  },
  {
    title: "Quantum-Inspired Data Transformation",
    category: "ai", catLabel: "AI / ML", status: "built",
    desc: "Experiment combining agentic AI and quantum circuits to encode classical data and test algebraic properties.",
    highlight: "Binary-to-quantum encoding in Qiskit, simulation in Cirq, and histogram-based validation.",
    tags: ["Qiskit", "Cirq", "Python", "Matplotlib"],
    repo: "https://github.com/Luvish6/quantum-agentic-ai-project", demo: "",
  },
  {
    title: "Real-time Collaborative Workspace",
    category: "fullstack", catLabel: "Full stack", status: "progress",
    desc: "A multiplayer kanban board and whiteboard where edits sync instantly between users, with conflict-free merging.",
    highlight: "WebSockets + CRDTs (Yjs), Redis pub/sub for scaling across servers, deployed with a live demo.",
    tags: ["Next.js", "TypeScript", "Node.js", "WebSockets", "Yjs", "PostgreSQL", "Redis"],
    repo: "", demo: "",
  },
  {
    title: "Redis-compatible Key-Value Store",
    category: "systems", catLabel: "Backend & systems", status: "progress",
    desc: "An in-memory database written from scratch that speaks the Redis protocol, so real Redis clients can talk to it.",
    highlight: "RESP protocol parser, event-loop networking, expiry and disk persistence, benchmarked against Redis.",
    tags: ["C++", "Networking", "epoll", "Systems"],
    repo: "", demo: "",
  },
  {
    title: "Retail Demand Forecasting",
    category: "data", catLabel: "Data", status: "progress",
    desc: "End-to-end forecasting of product demand with proper time-series validation and an interactive dashboard.",
    highlight: "LightGBM vs Prophet vs baseline, experiments tracked in MLflow, served through Streamlit.",
    tags: ["Python", "LightGBM", "Prophet", "MLflow", "Streamlit"],
    repo: "", demo: "",
  },
  {
    title: "A/B Testing Analysis Toolkit",
    category: "data", catLabel: "Data", status: "progress",
    desc: "Toolkit for designing and analysing product experiments, from sample-size planning to the final readout.",
    highlight: "Power analysis, CUPED variance reduction, and frequentist vs Bayesian comparisons.",
    tags: ["Python", "Statistics", "SciPy", "Pandas"],
    repo: "", demo: "",
  },
];

/* =========================================================
   CERTIFICATIONS. Add `url` to show a "View credential" link,
   and `year` once you know it.
   ========================================================= */
const CERTS = [
  { title: "SAP Data Analyst", issuer: "SAP", mark: "SAP", tag: "Data", url: "", year: "" },
  { title: "Exploring SAP Business Technology Platform", issuer: "SAP", mark: "SAP", tag: "Cloud", url: "", year: "" },
  { title: "Optimizing Performance in SAP Analytics Cloud Story Design", issuer: "SAP", mark: "SAP", tag: "Analytics", url: "", year: "" },
  { title: "Machine Learning", issuer: "IIT Kharagpur · NPTEL", mark: "IIT", tag: "ML", url: "", year: "" },
  { title: "Database Management Systems (DBMS)", issuer: "Scaler", mark: "SC", tag: "Databases", url: "", year: "" },
  { title: "Deep Learning Onramp", issuer: "MathWorks", mark: "MW", tag: "Deep learning", url: "", year: "" },
];

/* Visitor stats (GoatCounter, free & privacy-friendly).
   Sign up at goatcounter.com, pick a code (e.g. "luvish"), and put it here. */
const ANALYTICS = { goatcounter: "luvish" };

/* Numbers strip. Update leetcode when your count grows. */
const STATS = { gpa: "9.43", leetcode: "95", finals: "2×" };

/* Longer stories shown when a project card's "Read the story" is clicked. */
const STORIES = {
  "CareFlow": ["Healthcare claims are slow because documents are messy and rules are many. CareFlow models the whole claim lifecycle across 7 modules.", "AI extracts fields from uploaded documents, but a human always confirms them, and every change is audit-logged.", "Rule-based validation catches bad claims before they move on; automated tests and CI/CD keep releases safe."],
  "FlashReserve": ["Flash sales break naive checkouts: thousands of buyers race for the same few items, and you get double-selling.", "Stock checks and reservations run as single atomic Redis Lua scripts, so two buyers can never take the same unit.", "Order fulfilment is pushed to Kafka and handled asynchronously. Load-tested with JMeter at 5,000+ checkouts/s, with 65% lower API latency."],
  "Mining Disturbance Monitoring": ["My final-year major project, focused on the East and West Jaintia Hills of Meghalaya (about 3,800 km²), where mining affects land and rivers.", "Sentinel-1 radar (VV/VH) and masked Sentinel-2 optical indices (NDVI, NDTI) are pre-processed season by season in Google Earth Engine, with SRTM terrain data.", "A Random Forest evaluation pipeline uses 5 km spatial blocks and ablation runs. A Streamlit dashboard and a React portal support manual review.", "It's deliberately careful: it records only what the evidence shows and doesn't claim to be an automatic mining detector."],
  "Future Self": ["A personal growth app that's free, private and works offline: goals, future-self reflection, habits, routines, journaling, a vision board and guided night audio.", "Local-first: data lives in the browser (IndexedDB), with no account needed. Optional Supabase sync uses Postgres row-level security.", "No AI service. Personalisation runs on deterministic, tested templates. Built with React 19, TypeScript, Vite and Tailwind, and auto-deployed to GitHub Pages."],
  "Smart Product Pricing": ["Built with my team for ML Challenge 2025: predict a product's price from its catalogue text.", "A hybrid ensemble: BERT text embeddings, a deep MLP, XGBoost on the residuals, and a Ridge + TF-IDF baseline, blended by CatBoost.", "Isotonic and elastic calibration post-process the final predictions."],
  "Smart Attendance System": ["Register a face once, and the camera marks attendance whenever it recognises you, only once per day.", "OpenCV handles the camera, face_recognition does the matching, SQLite stores records, and a Flask dashboard shows it all.", "Still a work in progress."],
  "Fertilizer Prediction": ["Wrong fertilizer choices hurt soil health and yield. This tool recommends the right one from soil nutrients, crop type and environment.", "Covers preprocessing, exploratory analysis and a comparison of classifiers, combined in a Voting ensemble.", "Served as a simple Streamlit app for instant recommendations."],
};

/* ---------- rendering (no need to edit below) ---------- */
function renderCerts() {
  const grid = document.getElementById("certGrid");
  if (!grid) return;
  grid.innerHTML = CERTS.map(c => `
    <article class="card cert">
      <div class="cert-mark mono" aria-hidden="true">${esc(c.mark)}</div>
      <div class="cert-body">
        <span class="cat">${esc(c.tag)}${c.year ? " · " + esc(c.year) : ""}</span>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.issuer)}</p>
        ${c.url ? `<a class="text-link" href="${esc(c.url)}" target="_blank" rel="noopener">View credential ↗</a>` : ""}
      </div>
    </article>`).join("");
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  grid.innerHTML = PROJECTS.map(p => {
    const repo = p.repo || LINKS.github;
    const links = [];
    if (p.demo) links.push(`<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ↗</a>`);
    if (repo) links.push(`<a href="${esc(repo)}" target="_blank" rel="noopener">${p.repo ? "Code" : "On GitHub"} ↗</a>`);
    return `
      <article class="card project" data-cat="${p.category}">
        <div class="project-top">
          <span class="cat">${esc(p.catLabel)}</span>
          <span class="badge ${p.status === "built" ? "built" : "progress"}">${p.status === "built" ? "Built" : "In progress"}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        ${p.highlight ? `<p class="highlight">${esc(p.highlight)}</p>` : ""}
        <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        ${STORIES[p.title] ? `<button class="more-btn" type="button" data-story="${esc(p.title)}">Read the story →</button>` : ""}
        ${links.length ? `<div class="project-links">${links.join("")}</div>` : ""}
      </article>`;
  }).join("");
}

function setupFilters() {
  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
      const f = chip.dataset.filter;
      document.querySelectorAll(".project").forEach(card => {
        card.hidden = !(f === "all" || card.dataset.cat === f);
      });
    });
  });
}

function applyLinks() {
  document.querySelectorAll("[data-link]").forEach(a => {
    const key = a.dataset.link;
    let url = LINKS[key];
    if (key === "email" && url) url = "mailto:" + url;
    if (key === "phone" && url) url = "tel:" + url.replace(/\s/g, "");
    if (url) a.href = url; else a.remove();
  });
  document.querySelectorAll("[data-text]").forEach(el => {
    const val = LINKS[el.dataset.text];
    if (val) el.textContent = val; else el.remove();
  });
}

function setupTheme() {
  const btn = document.getElementById("themeBtn");
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const current = root.getAttribute("data-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    window.dispatchEvent(new Event("themechange"));
  });
}

/* Knight tracker: each section is a knight move g1 -> f3 -> d4 -> e6 -> c7 -> a8 -> b6 -> d5 -> f6 -> g8 */
function setupTracker() {
  const tracker = document.getElementById("tracker");
  const board = document.getElementById("trackerBoard");
  const knight = document.getElementById("trackerKnight");
  const label = document.getElementById("trackerLabel");
  if (!tracker) return;
  for (let i = 0; i < 64; i++) {
    const r = 7 - Math.floor(i / 8), f = i % 8;
    const sq = document.createElement("i");
    sq.className = (f + r) % 2 === 0 ? "d" : "l";
    sq.dataset.sq = "abcdefgh"[f] + (r + 1);
    board.appendChild(sq);
  }
  const path = [
    ["top", "f3", "Nf3 · Hello"],
    ["now", "d4", "Nd4 · Now"],
    ["about", "e6", "Ne6 · About"],
    ["projects", "c7", "Nc7 · Projects"],
    ["dream", "a8", "Na8 · Dream projects"],
    ["journey", "b6", "Nb6 · Journey"],
    ["certifications", "d5", "Nd5 · Certifications"],
    ["beyond", "f6", "Nf6 · Beyond code"],
    ["contact", "g8", "Ng8 · Contact"],
  ];
  const move = i => {
    const [, sq, text] = path[i];
    const f = "abcdefgh".indexOf(sq[0]), r = +sq[1] - 1;
    knight.style.transform = `translate(${f * 100}%, ${(7 - r) * 100}%)`;
    label.textContent = text;
    board.querySelectorAll(".trail").forEach(el => el.classList.remove("trail"));
    path.slice(0, i).forEach(([, s]) => board.querySelector(`[data-sq="${s}"]`).classList.add("trail"));
    tracker.classList.toggle("show", i > 0);
  };
  const sections = path.map(([id]) => document.getElementById(id));
  const pick = () => {
    const mid = innerHeight * 0.45;
    let idx = 0;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < mid) idx = i; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) idx = sections.length - 1;
    move(idx);
  };
  addEventListener("scroll", pick, { passive: true });
  addEventListener("resize", pick);
  pick();
}

function setupResumeMenu() {
  const btn = document.getElementById("resumeBtn");
  const menu = document.getElementById("resumeMenu");
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", e => {
    e.stopPropagation();
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

renderProjects();
renderCerts();
setupFilters();
applyLinks();
setupTheme();
setupResumeMenu();
setupTracker();
renderStats();
setupStories();
setupJump();
setupCopy();
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- numbers strip ---------- */
function renderStats() {
  const el = document.getElementById("stats");
  if (!el) return;
  const items = [
    [STATS.gpa, "GPA at SRM"],
    [PROJECTS.length + "", "projects on this site"],
    STATS.leetcode && [STATS.leetcode + "+", "LeetCode problems solved"],
    [STATS.finals, "F1 in Schools national finalist"],
  ].filter(Boolean);
  el.innerHTML = items.map(([n, l]) => `<div class="stat"><strong data-count="${esc(n)}">${esc(n)}</strong><span>${esc(l)}</span></div>`).join("");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(es => {
    if (!es[0].isIntersecting) return;
    io.disconnect();
    el.querySelectorAll("strong").forEach(s => {
      const txt = s.dataset.count, num = parseFloat(txt);
      if (isNaN(num)) return;
      const dec = (txt.match(/\.(\d+)/) || ["", ""])[1].length, suffix = txt.replace(/^[\d.]+/, "");
      const t0 = performance.now();
      const tick = () => {
        const k = Math.min(1, (performance.now() - t0) / 1100);
        s.textContent = (num * (1 - Math.pow(1 - k, 3))).toFixed(dec) + suffix;
        if (k < 1) setTimeout(tick, 16); else s.textContent = txt;
      };
      tick();
    });
  }, { threshold: 0.4 });
  io.observe(el);
}

/* ---------- project story modal ---------- */
function setupStories() {
  const modal = document.getElementById("storyModal"), body = document.getElementById("storyBody");
  if (!modal) return;
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-story]");
    if (!b) return;
    const p = PROJECTS.find(x => x.title === b.dataset.story);
    const links = [p.demo && `<a class="btn primary" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ↗</a>`,
      `<a class="btn" href="${esc(p.repo || LINKS.github)}" target="_blank" rel="noopener">Code on GitHub ↗</a>`].filter(Boolean).join("");
    body.innerHTML = `<span class="cat">${esc(p.catLabel)}</span><h2 id="storyTitle">${esc(p.title)}</h2>
      <ul class="story">${STORIES[p.title].map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <div class="cta-row">${links}</div>`;
    modal.showModal();
  });
  modal.addEventListener("click", e => { if (e.target === modal || e.target.closest("[data-close]")) modal.close(); });
}

/* ---------- Ctrl/⌘ + K quick jump ---------- */
function setupJump() {
  const modal = document.getElementById("jumpModal"), input = document.getElementById("jumpInput"), list = document.getElementById("jumpList");
  if (!modal) return;
  const go = id => () => {
    const a = document.createElement("a");
    a.href = "#" + id;
    document.body.appendChild(a); a.click(); a.remove();   // reuses the chessboard transition
  };
  const sections = [["top", "Home"], ["now", "Now"], ["about", "About"], ["projects", "Projects"], ["dream", "Dream projects"], ["journey", "Journey"], ["certifications", "Certifications"], ["beyond", "Beyond code"], ["contact", "Contact"]];
  const items = [
    ...sections.map(([id, label]) => ({ label, hint: "Section", go: go(id) })),
    ...PROJECTS.map(p => ({ label: p.title, hint: "Project", go: STORIES[p.title] ? () => document.querySelector(`[data-story="${CSS.escape(p.title)}"]`).click() : go("projects") })),
    { label: "Copy email address", hint: "Action", go: () => document.getElementById("copyEmail").click() },
    { label: "Luvish recommends (shows)", hint: "Page", go: () => (location.href = "recommends.html") },
    { label: "Toggle light / dark mode", hint: "Action", go: () => document.getElementById("themeBtn").click() },
    { label: "Open GitHub", hint: "Link", go: () => open(LINKS.github, "_blank", "noopener") },
    { label: "Open LinkedIn", hint: "Link", go: () => open(LINKS.linkedin, "_blank", "noopener") },
  ];
  let shown = [], sel = 0;
  const draw = () => {
    const q = input.value.trim().toLowerCase();
    shown = items.filter(i => i.label.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.map((i, n) => `<li role="option" aria-selected="${n === sel}" data-n="${n}"><span>${esc(i.label)}</span><em>${i.hint}</em></li>`).join("") || `<li class="empty">No matches</li>`;
    const cur = list.querySelector('[aria-selected="true"]');
    if (cur) cur.scrollIntoView({ block: "nearest" });
  };
  const run = n => { const it = shown[n]; if (!it) return; modal.close(); setTimeout(it.go, 60); };
  const openJump = () => { input.value = ""; sel = 0; draw(); modal.showModal(); input.focus(); };
  document.getElementById("jumpBtn").addEventListener("click", openJump);
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); modal.open ? modal.close() : openJump(); }
  });
  input.addEventListener("input", () => { sel = 0; draw(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, shown.length - 1); draw(); e.preventDefault(); }
    if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
    if (e.key === "Enter") run(sel);
  });
  list.addEventListener("click", e => { const li = e.target.closest("[data-n]"); if (li) run(+li.dataset.n); });
  modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });
}

/* ---------- copy email ---------- */
function setupCopy() {
  const b = document.getElementById("copyEmail");
  if (!b) return;
  b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(LINKS.email); b.textContent = "Copied ✓"; }
    catch (e) { b.textContent = "Select & copy"; }
    setTimeout(() => (b.textContent = "Copy"), 1800);
  });
}

/* ---------- visitor stats ---------- */
function setupAnalytics() {
  const code = ANALYTICS.goatcounter;
  if (!code || /^(localhost|127\.)/.test(location.hostname)) return;   // don't count local previews
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  document.head.appendChild(s);
  // also count which project stories and outbound links people open
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-story], a[target=_blank]");
    if (!t || !window.goatcounter || !window.goatcounter.count) return;
    const path = t.dataset.story ? "story: " + t.dataset.story : "link: " + t.href;
    window.goatcounter.count({ path, title: path, event: true });
  });
}

/* ---------- Easter eggs: type a word anywhere on the page ---------- */
function setupEasterEggs() {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  let timer;
  const say = msg => {
    toast.innerHTML = msg;
    toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove("show"), 3200);
  };
  const EGGS = {
    "e4": () => { window.dispatchEvent(new Event("knightjump")); say("♞ <b>1. e4!</b> Best by test. The knight approves (look at the board up top)."); },
    "london": () => say("♟ <b>The London System</b>: d4, Bf4, e3. My favourite opening. Solid, flexible, hard to crack."),
    "checkmate": () => { document.querySelector('a[href="#beyond"]')?.click(); say("♚ Looking for a checkmate? Try the <b>mate-in-one puzzle</b> in Beyond code."); },
    "bazinga": () => say("📺 <b>Bazinga!</b> Fellow Big Bang Theory fan spotted."),
    "box box": () => say("🏁 <b>Box, box!</b> Pit stop confirmed. Fellow F1 fan?"),
  };
  let buf = "";
  document.addEventListener("keydown", e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest("input, textarea, [contenteditable]")) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-12);
    for (const word in EGGS) if (buf.endsWith(word)) { buf = ""; EGGS[word](); break; }
  });
}

setupAnalytics();
setupEasterEggs();
