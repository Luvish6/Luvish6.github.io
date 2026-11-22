function intervalRow(label, estimate, interval, min, max, format) {
  const row = document.createElement("div");
  row.className = "interval-row";
  const text = document.createElement("p");
  text.textContent = label + " " + format(estimate) +
    " (" + format(interval.lower) + " to " + format(interval.upper) + ")";
  const track = document.createElement("div");
  track.className = "interval-track";
  track.setAttribute("aria-hidden", "true");
  const position = value => 100 * (value - min) / (max - min) + "%";
  if (min < 0) {
    const zero = document.createElement("i");
    zero.className = "zero";
    zero.style.left = position(0);
    track.append(zero);
  }
  const range = document.createElement("i");
  range.className = "range";
  range.style.left = position(interval.lower);
  range.style.right = "calc(100% - " + position(interval.upper) + ")";
  const point = document.createElement("i");
  point.className = "point";
  point.style.left = position(estimate);
  track.append(range, point);
  row.append(text, track);
  return row;
}

export function drawIntervals(container, result, pct, pp) {
  const max = Math.max(...result.rates.map(interval => interval.upper)) * 1.07;
  const extent = Math.max(Math.abs(result.interval.lower), Math.abs(result.interval.upper)) * 1.07;
  container.replaceChildren(
    intervalRow("Control", result.a, result.rates[0], 0, max, pct),
    intervalRow("Treatment", result.b, result.rates[1], 0, max, pct),
    intervalRow("Absolute lift", result.difference, result.interval, -extent, extent, pp)
  );
}

export function drawPower(canvas, points, selected, targetPower, number) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const left = 51, right = width - 26, top = 13, bottom = height - 38;
  const x = index => left + (right - left) * index / (points.length - 1);
  const y = power => bottom - (bottom - top) * power;
  ctx.clearRect(0, 0, width, height);
  ctx.font = "14px system-ui";
  ctx.fillStyle = "#18251f";
  ctx.strokeStyle = "#cbd7cf";
  for (const level of [0, .25, .5, .75, 1]) {
    ctx.fillText(100 * level + "%", 3, y(level) + 4);
    ctx.beginPath();
    ctx.moveTo(left, y(level));
    ctx.lineTo(right, y(level));
    ctx.stroke();
  }
  ctx.textAlign = "center";
  ctx.fillText(number.format(points[0].perArm), left, bottom + 18);
  ctx.fillText(number.format(points.at(-1).perArm), right - 12, bottom + 18);
  ctx.fillText("Visitors per arm", (left + right) / 2, height - 2);
  ctx.textAlign = "start";
  ctx.strokeStyle = "#956313";
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(left, y(targetPower));
  ctx.lineTo(right, y(targetPower));
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "#225440";
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach(({ power }, index) => {
    if (index === 0) ctx.moveTo(x(index), y(power));
    else ctx.lineTo(x(index), y(power));
  });
  ctx.stroke();
  ctx.fillStyle = "#225440";
  ctx.beginPath();
  ctx.arc(x(selected), y(points[selected].power), 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.lineWidth = 1;
}
