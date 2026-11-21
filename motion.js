/* Motion layer: section-change chessboard wipe, cursor-aware buttons,
   card spotlight, scroll reveals and active nav link.                    */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;
  const MOVES = { top: "Nf3", now: "Nd4", about: "Ne6", projects: "Nc7", dream: "Na8", journey: "Nb6", certifications: "Nd5", beyond: "Nf6", contact: "Ng8" };
  const NAMES = { top: "Hello", now: "Now", about: "About", projects: "Projects", dream: "Dream projects", journey: "Journey", certifications: "Certifications", beyond: "Beyond code", contact: "Contact" };

  /* ---------- 1. Section-change wipe (chess squares cover, then reveal) ---------- */
  const COLS = 8, ROWS = 6;
  const wipe = document.createElement("div");
  wipe.className = "wipe";
  wipe.setAttribute("aria-hidden", "true");
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const s = document.createElement("i");
    s.className = (r + c) % 2 ? "l" : "d";
    s.style.setProperty("--d", (c + r) * 28 + "ms");
    wipe.appendChild(s);
  }
  const wipeLabel = document.createElement("div");
  wipeLabel.className = "wipe-label";
  wipe.appendChild(wipeLabel);
  document.body.appendChild(wipe);

  let wiping = false;
  function goTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const land = () => {
      const navH = document.querySelector(".nav").offsetHeight;
      const y = id === "top" ? 0 : target.getBoundingClientRect().top + scrollY - navH - 8;
      root.style.scrollBehavior = "auto";
      scrollTo(0, y);
      root.style.scrollBehavior = "";
      history.pushState(null, "", "#" + id);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    if (reduce) return land();
    if (wiping) return;
    wiping = true;
    wipeLabel.innerHTML = `<span class="mono">${MOVES[id] || "♞"}</span>${NAMES[id] || ""}`;
    wipe.classList.remove("out");
    wipe.classList.add("in");
    setTimeout(() => {
      land();
      wipe.classList.add("out");
      setTimeout(() => { wipe.classList.remove("in", "out"); wiping = false; }, 650);
    }, 520);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains("skip")) return;
    const id = a.getAttribute("href").slice(1);
    if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    goTo(id);
  });

  /* ---------- 2. Active nav link ---------- */
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const ids = ["top", "now", "about", "projects", "dream", "journey", "certifications", "beyond", "contact"];
  function markNav() {
    let cur = "top";
    ids.forEach(id => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < innerHeight * .45) cur = id; });
    if (innerHeight + scrollY >= root.scrollHeight - 4) cur = "contact";
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
    const act = navLinks.find(a => a.classList.contains("active"));
    if (act && act !== markNav.last) { markNav.last = act; const bar = act.parentElement; bar.scrollTo({ left: act.offsetLeft - bar.clientWidth / 2 + act.offsetWidth / 2, behavior: "smooth" }); }
  }
  addEventListener("scroll", markNav, { passive: true });
  markNav();

  /* ---------- 3. Scroll reveal ---------- */
  root.classList.add("motion");
  const revealSel = [
    ".section .sq", ".section h2", ".section .sub", ".filters", ".prose p", ".about-grid .card",
    ".timeline li", ".beyond-grid .card", ".cert-grid .card", ".now-main", ".now-list li", ".dream", ".stat", ".me-list li", ".facts-title", ".contact .lead", ".contact-list", ".contact .cta-row",
  ].join(",");
  const groups = new Map();
  document.querySelectorAll(revealSel).forEach(el => {
    el.classList.add("reveal");
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    groups.set(parent, i + 1);
    el.style.setProperty("--i", Math.min(i, 6));
  });
  function observeProjects() {
    document.querySelectorAll(".project").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--i", i % 3);
      io.observe(el);
    });
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  observeProjects();

  // Hero entrance
  document.querySelectorAll(".hero-text > *, .hero-board").forEach((el, i) => {
    el.classList.add("rise");
    el.style.setProperty("--i", i);
  });
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("loaded")));

  // Re-animate project cards when a filter chip is clicked
  document.querySelectorAll(".chip[data-filter]").forEach(chip => chip.addEventListener("click", () => {
    let n = 0;
    document.querySelectorAll(".project:not([hidden])").forEach(card => {
      card.classList.remove("pop");
      void card.offsetWidth;
      card.style.setProperty("--i", n++ % 6);
      card.classList.add("pop", "in");
    });
  }));

  if (!finePointer || reduce) return;

  /* ---------- 4. Cursor glow + buttons that react as the cursor approaches ---------- */
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  const RANGE = 110;
  let mx = -999, my = -999, last = 0;
  addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    const now = performance.now();
    if (now - last > 16) { last = now; update(); }   // ~60 updates/s max
  }, { passive: true });
  document.addEventListener("pointerleave", () => { mx = my = -999; update(); });
  addEventListener("scroll", () => { if (mx > -999) update(); }, { passive: true });

  function update() {
    glow.style.transform = `translate(${mx}px, ${my}px)`;
    document.querySelectorAll(".btn, .chip, .theme-btn").forEach(b => {
      const r = b.getBoundingClientRect();
      if (r.bottom < -RANGE || r.top > innerHeight + RANGE) return;
      const dx = Math.max(r.left - mx, 0, mx - r.right);
      const dy = Math.max(r.top - my, 0, my - r.bottom);
      const dist = Math.hypot(dx, dy);
      const near = Math.max(0, 1 - dist / RANGE);
      b.style.setProperty("--near", near.toFixed(3));
      // magnetic pull toward the cursor when close
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const pull = near * near;
      b.style.setProperty("--tx", ((mx - cx) * .12 * pull).toFixed(2) + "px");
      b.style.setProperty("--ty", ((my - cy) * .18 * pull).toFixed(2) + "px");
    });
  }

  /* ---------- 5. Card spotlight following the cursor ---------- */
  document.addEventListener("pointermove", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });
})();
