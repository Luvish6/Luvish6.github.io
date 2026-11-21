/* Mate-in-one puzzle: a smothered mate. Solution: Ng5-f7#
   White: Kg1 Qd1 Ng5 Pa2 Pb2 Pf2 Pg2 Ph2
   Black: Kh8 Qa5 Rg8 Pa7 Pb7 Pg7 Ph7                                   */
(function () {
  const el = document.getElementById("puzzle");
  if (!el) return;
  const statusEl = document.getElementById("puzzleStatus");
  const START = {
    g1: "wK", d1: "wQ", g5: "wN", a2: "wP", b2: "wP", f2: "wP", g2: "wP", h2: "wP",
    h8: "bK", a5: "bQ", g8: "bR", a7: "bP", b7: "bP", g7: "bP", h7: "bP",
  };
  const GLYPH = { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" };
  const NAME = { K: "king", Q: "queen", R: "rook", B: "bishop", N: "knight", P: "pawn" };
  const FILES = "abcdefgh";
  const SOLUTION = ["g5", "f7"];
  let pos, selected, solved, busy;

  const at = (f, r) => FILES[f] + (r + 1);
  const fr = sq => [FILES.indexOf(sq[0]), +sq[1] - 1];

  function targets(sq) {
    const p = pos[sq];
    if (!p || p[0] !== "w") return [];
    const [f, r] = fr(sq), out = [];
    const ok = (F, R) => F >= 0 && F < 8 && R >= 0 && R < 8;
    const add = (F, R) => { if (!ok(F, R)) return false; const t = pos[at(F, R)]; if (!t) { out.push(at(F, R)); return true; } if (t[0] === "b") out.push(at(F, R)); return false; };
    const slide = dirs => dirs.forEach(([df, dr]) => { let F = f + df, R = r + dr; while (add(F, R)) { F += df; R += dr; } });
    const type = p[1];
    if (type === "N") [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]].forEach(([a, b]) => add(f + a, r + b));
    if (type === "K") [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]].forEach(([a, b]) => add(f + a, r + b));
    if (type === "Q") slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
    if (type === "P") {
      if (ok(f, r + 1) && !pos[at(f, r + 1)]) {
        out.push(at(f, r + 1));
        if (r === 1 && !pos[at(f, r + 2)]) out.push(at(f, r + 2));
      }
      [-1, 1].forEach(d => { const t = ok(f + d, r + 1) && pos[at(f + d, r + 1)]; if (t && t[0] === "b") out.push(at(f + d, r + 1)); });
    }
    return out;
  }

  function draw() {
    el.innerHTML = "";
    const legal = selected ? targets(selected) : [];
    for (let r = 7; r >= 0; r--) {
      for (let f = 0; f < 8; f++) {
        const sq = at(f, r), p = pos[sq];
        const b = document.createElement("button");
        b.type = "button";
        b.className = "psq " + ((f + r) % 2 === 0 ? "d" : "l");
        if (sq === selected) b.classList.add("sel");
        if (legal.includes(sq)) b.classList.add(p ? "cap" : "dot");
        if (solved && (sq === "h8")) b.classList.add("mated");
        if (solved && sq === "f7") b.classList.add("win");
        b.setAttribute("aria-label", sq + (p ? ` ${p[0] === "w" ? "white" : "black"} ${NAME[p[1]]}` : ""));
        if (p) {
          const s = document.createElement("span");
          s.className = "pc " + p[0];
          s.textContent = GLYPH[p[1]] + "︎";
          b.appendChild(s);
        }
        if (f === 0) b.insertAdjacentHTML("beforeend", `<span class="coord rank">${r + 1}</span>`);
        if (r === 0) b.insertAdjacentHTML("beforeend", `<span class="coord file">${FILES[f]}</span>`);
        b.addEventListener("click", () => tap(sq));
        el.appendChild(b);
      }
    }
  }

  function say(msg, cls) {
    statusEl.textContent = msg;
    statusEl.className = "puzzle-status" + (cls ? " " + cls : "");
  }

  function tap(sq) {
    if (solved || busy) return;
    const p = pos[sq];
    if (selected && targets(selected).includes(sq)) return move(selected, sq);
    if (p && p[0] === "w") { selected = sq; draw(); return; }
    if (p && p[0] === "b") say("That's a black piece. You're playing White.");
    selected = null;
    draw();
  }

  function move(from, to) {
    pos[to] = pos[from];
    delete pos[from];
    selected = null;
    if (from === SOLUTION[0] && to === SOLUTION[1]) {
      solved = true;
      draw();
      say("♞ Smothered mate! The black king is trapped by its own pieces, and only the knight can deliver it.", "good");
      return;
    }
    busy = true;
    draw();
    say("Not mate, Black escapes. Have another look…", "bad");
    setTimeout(() => { busy = false; reset(true); }, 1300);
  }

  function reset(keepMsg) {
    pos = { ...START };
    selected = null; solved = false;
    draw();
    if (!keepMsg) say("Tap a white piece, then tap where it should go.");
  }

  document.getElementById("puzzleReset").addEventListener("click", () => reset());
  document.getElementById("puzzleHint").addEventListener("click", () => {
    if (solved) return;
    selected = "g5";
    draw();
    say("Hint: the black king is boxed in by its own rook and pawns. Which piece can jump over them?");
  });

  reset();
})();
