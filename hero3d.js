// 3D chessboard for the hero section. The gold knight is "you":
// it plays 2. Nf3 on load and jumps when the board is clicked.
import * as THREE from "three";

const host = document.getElementById("heroBoard");
const hint = document.getElementById("boardHint");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function isDark() {
  const t = document.documentElement.getAttribute("data-theme");
  if (t) return t === "dark";
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

const PALETTE = {
  light: { sqLight: 0xf1e7d3, sqDark: 0xb98d5c, frame: 0x6b4a2b, white: 0xfbf6ec, black: 0x2b2722, knight: 0xd0921c },
  dark:  { sqLight: 0x4a4c55, sqDark: 0x23252b, frame: 0x14151a, white: 0xe9e4d8, black: 0x17171a, knight: 0xf2b134 },
};

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (e) {
  throw new Error("WebGL unavailable"); // fallback board stays visible
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.prepend(renderer.domElement);
host.classList.add("ready");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 10.5, 12.5);
camera.lookAt(0, -0.6, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(5, 10, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
sun.shadow.bias = -0.0005;
scene.add(sun);

const world = new THREE.Group();
scene.add(world);

/* ---------- materials ---------- */
const mats = {
  sqLight: new THREE.MeshStandardMaterial({ roughness: 0.55 }),
  sqDark: new THREE.MeshStandardMaterial({ roughness: 0.55 }),
  frame: new THREE.MeshStandardMaterial({ roughness: 0.6 }),
  white: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05 }),
  black: new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.1 }),
  knight: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.65 }),
};
function applyPalette() {
  const p = isDark() ? PALETTE.dark : PALETTE.light;
  for (const k of Object.keys(mats)) mats[k].color.setHex(p[k]);
}
applyPalette();

/* ---------- board ---------- */
const sqX = f => f - 3.5;          // file 0..7 -> x
const sqZ = r => 3.5 - r;          // rank 0..7 -> z (rank 1 nearest the camera)
const squares = [];
const sqGeo = new THREE.BoxGeometry(1, 0.14, 1);
for (let f = 0; f < 8; f++) {
  for (let r = 0; r < 8; r++) {
    const m = new THREE.Mesh(sqGeo, (f + r) % 2 === 0 ? mats.sqDark : mats.sqLight);
    m.position.set(sqX(f), 0, sqZ(r));
    m.receiveShadow = true;
    m.userData = { f, r };
    world.add(m);
    squares.push(m);
  }
}
const frame = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.3, 8.8), mats.frame);
frame.position.y = -0.12;
frame.receiveShadow = true;
world.add(frame);

/* ---------- pieces ---------- */
const V = (x, y) => new THREE.Vector2(x, y);
const PROFILES = {
  p: [V(0,0),V(.32,0),V(.32,.06),V(.26,.1),V(.16,.14),V(.11,.32),V(.18,.36),V(.1,.39),V(.15,.45),V(.16,.52),V(.12,.6),V(.05,.63),V(0,.64)],
  r: [V(0,0),V(.34,0),V(.34,.07),V(.27,.12),V(.21,.18),V(.19,.5),V(.26,.55),V(.26,.74),V(.19,.74),V(.19,.68),V(0,.68)],
  b: [V(0,0),V(.33,0),V(.33,.06),V(.25,.12),V(.15,.2),V(.11,.55),V(.2,.6),V(.1,.63),V(.15,.7),V(.17,.8),V(.12,.9),V(.04,.96),V(.06,.99),V(0,1.03)],
  q: [V(0,0),V(.35,0),V(.35,.07),V(.27,.13),V(.16,.22),V(.12,.7),V(.23,.75),V(.13,.79),V(.21,.96),V(.15,1),V(.08,1.04),V(.07,1.09),V(0,1.11)],
  k: [V(0,0),V(.35,0),V(.35,.07),V(.27,.13),V(.16,.22),V(.13,.76),V(.23,.81),V(.13,.85),V(.2,1.02),V(0,1.05)],
};
const geoCache = {};
function latheGeo(type) {
  return geoCache[type] ||= new THREE.LatheGeometry(PROFILES[type], 32);
}
function knightGeo() {
  if (geoCache.n) return geoCache.n;
  const s = new THREE.Shape();
  const pts = [[-.3,0],[.3,0],[.22,.2],[.1,.38],[.32,.5],[.42,.62],[.38,.72],[.2,.75],[.1,.83],[.02,.96],[-.06,.86],[-.2,.8],[-.32,.62],[-.36,.4],[-.32,.2]];
  s.moveTo(...pts[0]);
  pts.slice(1).forEach(p => s.lineTo(...p));
  const g = new THREE.ExtrudeGeometry(s, { depth: .3, bevelEnabled: true, bevelThickness: .05, bevelSize: .04, bevelSegments: 3 });
  g.translate(0, .18, -.15);
  return (geoCache.n = g);
}

function makePiece(type, color, material) {
  const group = new THREE.Group();
  const mat = material || (color === "w" ? mats.white : mats.black);
  if (type === "n") {
    const base = new THREE.Mesh(new THREE.LatheGeometry([V(0,0),V(.34,0),V(.34,.07),V(.27,.13),V(.22,.2),V(0,.2)], 32), mat);
    const head = new THREE.Mesh(knightGeo(), mat);
    // three-quarter turn toward the opponent so the horse-head profile stays visible
    head.rotation.y = color === "w" ? Math.PI * 0.3 : -Math.PI * 0.7;
    group.add(base, head);
  } else {
    group.add(new THREE.Mesh(latheGeo(type), mat));
    if (type === "k") {
      const v = new THREE.Mesh(new THREE.BoxGeometry(.07, .26, .07), mat);
      v.position.y = 1.17;
      const h = new THREE.Mesh(new THREE.BoxGeometry(.2, .07, .07), mat);
      h.position.y = 1.19;
      group.add(v, h);
    }
  }
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  group.scale.setScalar(.9);
  return group;
}

const files = "abcdefgh";
const toFR = sq => [files.indexOf(sq[0]), +sq[1] - 1];
const occupied = new Set();
function place(type, color, sq, material) {
  const [f, r] = toFR(sq);
  const p = makePiece(type, color, material);
  p.position.set(sqX(f), .07, sqZ(r));
  world.add(p);
  occupied.add(f + "," + r);
  return p;
}

// Position after 1. e4 e5 (white's g1 knight is "Luvish")
const back = ["r","n","b","q","k","b","n","r"];
back.forEach((t, i) => { if (i !== 6) place(t, "w", files[i] + "1"); place(t, "b", files[i] + "8"); });
for (let i = 0; i < 8; i++) {
  place("p", "w", files[i] + (i === 4 ? "4" : "2"));
  place("p", "b", files[i] + (i === 4 ? "5" : "7"));
}
const knight = place("n", "w", "g1", mats.knight);
let kf = 6, kr = 0;

/* ---------- knight hops ---------- */
let hop = null;
function jumpTo(f, r) {
  occupied.delete(kf + "," + kr);
  occupied.add(f + "," + r);
  const from = knight.position.clone();
  const to = new THREE.Vector3(sqX(f), .07, sqZ(r));
  kf = f; kr = r;
  if (reduceMotion) { knight.position.copy(to); render(); return; }
  hop = { from, to, t0: performance.now(), dur: 750 };
  wake();
}
const JUMPS = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
function legalJumps() {
  return JUMPS.map(([df, dr]) => [kf + df, kr + dr])
    .filter(([f, r]) => f >= 0 && f < 8 && r >= 0 && r < 8 && !occupied.has(f + "," + r));
}

/* ---------- interaction ---------- */
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;

renderer.domElement.addEventListener("pointermove", e => {
  const b = renderer.domElement.getBoundingClientRect();
  targetTiltY = ((e.clientX - b.left) / b.width - .5) * .5;
  targetTiltX = ((e.clientY - b.top) / b.height - .5) * .2;
  wake();
});
renderer.domElement.addEventListener("pointerleave", () => { targetTiltX = targetTiltY = 0; wake(); });
renderer.domElement.addEventListener("click", e => {
  if (hop) return;
  const b = renderer.domElement.getBoundingClientRect();
  ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(squares)[0];
  const options = legalJumps();
  if (!options.length) return;
  let target = null;
  if (hit) target = options.find(([f, r]) => f === hit.object.userData.f && r === hit.object.userData.r);
  target ||= options[Math.floor(Math.random() * options.length)];
  jumpTo(...target);
  if (hint) hint.textContent = "N" + files[target[0]] + (target[1] + 1) + "! Tap again to keep moving";
});

/* ---------- render loop (sleeps when idle or off-screen) ---------- */
let visible = true, running = false, t0 = performance.now();
function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // pull the camera back on narrow screens so the whole board fits
  const dist = w / h < 1 ? 16.5 : 14;
  camera.position.set(0, dist * .84, dist);
  camera.lookAt(0, -0.2, 0.4);
  camera.updateProjectionMatrix();
  render();
}
function render() { renderer.render(scene, camera); }
function frameLoop(now) {
  if (!visible) { running = false; return; }
  tiltX += (targetTiltX - tiltX) * .08;
  tiltY += (targetTiltY - tiltY) * .08;
  const idle = reduceMotion ? 0 : Math.sin((now - t0) / 4000) * .18;
  world.rotation.y = -.35 + idle + tiltY;
  world.rotation.x = tiltX;
  if (hop) {
    const k = Math.min(1, (now - hop.t0) / hop.dur);
    const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    knight.position.lerpVectors(hop.from, hop.to, e);
    knight.position.y = .07 + Math.sin(Math.PI * k) * 1.4;
    knight.rotation.z = Math.sin(Math.PI * k) * .25;
    if (k === 1) { hop = null; knight.rotation.z = 0; }
  }
  render();
  const settling = Math.abs(targetTiltX - tiltX) + Math.abs(targetTiltY - tiltY) > .001;
  if (reduceMotion && !hop && !settling) { running = false; return; }
  requestAnimationFrame(frameLoop);
}
function wake() { if (!running && visible) { running = true; requestAnimationFrame(frameLoop); } }

new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) wake(); }).observe(host);
document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) wake(); });
new ResizeObserver(resize).observe(host);
// Easter egg: typing "e4" makes the knight do a hop
window.addEventListener("knightjump", () => {
  if (hop) return;
  const options = legalJumps();
  if (options.length) jumpTo(...options[Math.floor(Math.random() * options.length)]);
});
window.addEventListener("themechange", () => { applyPalette(); render(); });
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { applyPalette(); render(); });

resize();
wake();
// 2. Nf3: the opening move
setTimeout(() => jumpTo(5, 2), reduceMotion ? 0 : 900);
