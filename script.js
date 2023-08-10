const inc = 0.01;
let points = [];
let curve = [];
let time = 0;
let drawFull = true;
let toggleLines = true;
let auto = false;
const sat = 70;

function Start() {
  dj.createCanvas(FULL);
  dj.bodyBackground(187);
  dj.setColorMode(HSL);

  InitPoints(4);
}

function InitPoints(n) {
  const start = [];
  for (let i = 0; i < n; i++) {
    start[i] = dj.vector.new(dj.random(0, width), dj.random(0, height));
  }
  points[0] = start;
}

function Draw() {
  dj.background(0);

  if (drawFull) DrawFullCurve();
  DrawCurrentPoint();

  DrawCurve();
  if (toggleLines) DrawLines();
  DrawPoint();

  if (auto) {
    time += inc;
    if (time > 1) time = 0;
  }

  dj.slower("x");
  dj.faster("y");
}

function mouseDown(x, y) {
  const point = GetClosestPoint(x, y, 100);
  if (point) point.set(x, y);
}

function keyDown(keys) {
  if (keys.includes("q")) time -= inc;
  if (keys.includes("w")) time += inc;
  time = dj.constrain(time, 0, 1);
}

function keyPressed(key) {
  if (key == " ") {
    curve = [];
    drawFull = !drawFull;
  }
  if (key == "s")
    points[0].push(
      dj.vector.add(points[0][points[0].length - 1], dj.vector.random(50, 100))
    );
  if (key == "a") auto = !auto;
  if (key == "l") toggleLines = !toggleLines;
}

function GetClosestPoint(x, y, max) {
  let min = Infinity;
  let index = -1;
  points[0].forEach((p, i) => {
    const d = dj.dist(x, y, p.x, p.y);
    if (d < max && d < min) {
      min = d;
      index = i;
    }
  });
  return index != -1 ? points[0][index] : false;
}

function DrawLines() {
  points.forEach((gen, i) => {
    if (i !== 0) {
      dj.stroke(dj.map(i, 0, points.length - 1, 0, 360), sat, 50);
      dj.strokeWeight(2);
      dj.lines(gen);
      dj.strokeWeight(8);
      if (i < points.length - 1) for (const p of gen) dj.point(p);
    }
  });
  dj.stroke(0, sat, 50);
  dj.strokeWeight(4);
  dj.lines(points[0]);
  dj.strokeWeight(12);
  for (const p of points[0]) dj.point(p);
}

function DrawCurrentPoint() {
  for (let i = 1; i < points[0].length; i++) {
    points[i] = lerpedPoints(points[i - 1], time);
  }
}

function DrawFullCurve() {
  curve = [];
  for (let t = 0; t <= 1 + inc * 0.5; t += inc) {
    for (let i = 1; i < points[0].length; i++) {
      points[i] = lerpedPoints(points[i - 1], t);
    }
    curve.push(points[points.length - 1][0]);
  }
}

function DrawCurve() {
  dj.stroke(0, sat, 100);
  dj.strokeWeight(4);
  dj.lines(curve);
}

function DrawPoint() {
  dj.stroke(0, sat, 100);
  dj.strokeWeight(16);
  dj.point(points[points.length - 1][0]);
}

function lerpedPoints(p, t) {
  let next = [];
  for (let i = 0; i < p.length - 1; i++) {
    next.push(lerp(p[i], p[i + 1], t));
  }
  return next;
}

function lerp(a, b, t) {
  const x = a.x + (b.x - a.x) * t;
  const y = a.y + (b.y - a.y) * t;
  const p = dj.vector.new(x, y);
  return p;
}
