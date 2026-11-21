import Phaser from 'phaser';
import { W, H } from './ui';

// ───────────────────────── 색 도구 ─────────────────────────
type G = Phaser.GameObjects.Graphics;
const mix = (a: number, b: number, t: number) => {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
};
const light = (c: number, t: number) => mix(c, 0xffffff, t);
const dark = (c: number, t: number) => mix(c, 0x000000, t);
const rng = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const P = Math.PI;
const poly = (g: G, pts: { x: number; y: number }[], close = true) => g.fillPoints(pts.map(p => new Phaser.Math.Vector2(p.x, p.y)), close);

// ───────────────────────── 인물 ─────────────────────────
export type Expr = 'smile' | 'worry' | 'angry' | 'awe' | 'sad';
type Head = 'none' | 'cloth' | 'nemes' | 'veil';
interface FigDef {
  robe: number; trim: number; sash: number; skin: number; hair: number;
  beard?: number; head?: Head; hc?: number; hc2?: number; staff?: boolean; whip?: boolean; tamb?: boolean;
}
export const FIG: Record<string, FigDef> = {
  moses:    { robe: 0x9b6b43, trim: 0x3f6fb5, sash: 0x3f6fb5, skin: 0xe0b08a, hair: 0xd9d9d9, beard: 0xe8e8e8, head: 'cloth', hc: 0xf2ead8, hc2: 0x9b6b43, staff: true },
  prince:   { robe: 0xf5efe0, trim: 0xd4a62a, sash: 0x2f5fa8, skin: 0xe0b08a, hair: 0x2a1a10, head: 'none' },
  aaron:    { robe: 0xf2f2f2, trim: 0xd4a62a, sash: 0xd4a62a, skin: 0xe0b08a, hair: 0x888888, beard: 0xd0d0d0, head: 'cloth', hc: 0xffffff, hc2: 0xd4a62a },
  pharaoh:  { robe: 0xf5efe0, trim: 0xd4a62a, sash: 0xd4a62a, skin: 0xd49a6a, hair: 0x1a1a1a, head: 'nemes', hc: 0xd4a62a, hc2: 0x2f5fa8 },
  overseer: { robe: 0x9a2f2f, trim: 0x3a2a1a, sash: 0x3a2a1a, skin: 0xc98a5a, hair: 0x1a1a1a, head: 'none', whip: true },
  hebrew:   { robe: 0xb89a6a, trim: 0x8a6a3a, sash: 0x8a6a3a, skin: 0xe0b08a, hair: 0x3a2a1a, head: 'cloth', hc: 0xe8dcc0, hc2: 0xb89a6a },
  jethro:   { robe: 0x4f8a5a, trim: 0xe8dcc0, sash: 0xe8dcc0, skin: 0xd9a47a, hair: 0xcccccc, beard: 0xdddddd, head: 'cloth', hc: 0xf2ead8, hc2: 0x4f8a5a },
  girl:     { robe: 0xc86a9a, trim: 0xf2d070, sash: 0xf2d070, skin: 0xe0b08a, hair: 0x2a1a10, head: 'veil', hc: 0xf0e0f0 },
  zipporah: { robe: 0x4a8ac8, trim: 0xf2d070, sash: 0xf2d070, skin: 0xe0b08a, hair: 0x2a1a10, head: 'veil', hc: 0xf6efe0 },
  miriam:   { robe: 0x7a5ab5, trim: 0xf2d070, sash: 0xf2d070, skin: 0xe0b08a, hair: 0x2a1a10, head: 'veil', hc: 0xf0e0f0, tamb: true },
  shepherd: { robe: 0x6a6a6a, trim: 0x3a3a3a, sash: 0x3a3a3a, skin: 0xc98a5a, hair: 0x2a2a2a, beard: 0x2a2a2a, head: 'cloth', hc: 0x8a8a8a, hc2: 0x6a6a6a },
  magician: { robe: 0x3a2a5a, trim: 0xd4a62a, sash: 0xd4a62a, skin: 0xc98a5a, hair: 0x1a1a1a, head: 'cloth', hc: 0x3a2a5a, hc2: 0xd4a62a },
};

export function drawFigure(g: G, f: FigDef, expr: Expr = 'smile') {
  g.fillStyle(0x000000, 0.16); g.fillEllipse(0, 2, 96, 14);
  if (f.head === 'veil') {
    g.fillStyle(f.hc!); poly(g, [{ x: -30, y: -168 }, { x: 30, y: -168 }, { x: 42, y: -96 }, { x: -42, y: -96 }], true);
  }
  if (f.head === 'nemes') {
    g.fillStyle(f.hc!);
    poly(g, [{ x: -30, y: -168 }, { x: 30, y: -168 }, { x: 40, y: -108 }, { x: 22, y: -104 }, { x: 22, y: -150 }, { x: -22, y: -150 }, { x: -22, y: -104 }, { x: -40, y: -108 }], true);
    g.fillStyle(f.hc2!);
    [-130, -118].forEach(y => { g.fillRect(-40, y, 18, 5); g.fillRect(22, y, 18, 5); });
  }
  // 옷
  g.fillStyle(f.robe); poly(g, [{ x: -36, y: 0 }, { x: 36, y: 0 }, { x: 24, y: -118 }, { x: -24, y: -118 }], true);
  g.fillStyle(f.trim); g.fillRect(-35, -9, 70, 9);
  g.fillStyle(f.sash); poly(g, [{ x: -27, y: -74 }, { x: 27, y: -74 }, { x: 26, y: -63 }, { x: -26, y: -63 }], true);
  g.fillStyle(f.trim); g.fillTriangle(-18, -118, 18, -118, 0, -96);
  // 팔 + 손
  g.fillStyle(f.robe); g.fillEllipse(-34, -92, 20, 56); g.fillEllipse(34, -92, 20, 56);
  g.fillStyle(f.skin); g.fillCircle(-36, -64, 8); g.fillCircle(38, -64, 8);
  // 지팡이 / 채찍 / 소고
  if (f.staff) {
    g.lineStyle(7, 0x6b4423); g.lineBetween(42, 4, 42, -204);
    g.fillStyle(0x6b4423); g.fillCircle(42, -206, 7);
    g.fillStyle(f.skin); g.fillCircle(42, -66, 8);
  }
  if (f.whip) {
    g.lineStyle(4, 0x2a1a10); g.lineBetween(40, -68, 72, -132); g.lineBetween(72, -132, 104, -112); g.lineBetween(104, -112, 112, -86);
  }
  if (f.tamb) {
    g.lineStyle(6, 0xd4a62a); g.strokeCircle(46, -112, 18);
    g.fillStyle(0xf5f5f5); [[46, -130], [46, -94], [28, -112], [64, -112]].forEach(([x, y]) => g.fillCircle(x, y, 3.5));
  }
  // 머리
  g.fillStyle(f.skin); g.fillRect(-7, -124, 14, 10); g.fillCircle(0, -142, 24);
  if (f.head === 'cloth') {
    g.fillStyle(f.hc!); g.beginPath(); g.arc(0, -146, 28, P, 2 * P, false); g.closePath(); g.fillPath();
    poly(g, [{ x: -28, y: -146 }, { x: -22, y: -112 }, { x: -12, y: -118 }, { x: -20, y: -142 }], true);
    poly(g, [{ x: 28, y: -146 }, { x: 22, y: -112 }, { x: 12, y: -118 }, { x: 20, y: -142 }], true);
    g.lineStyle(4, f.hc2!); g.beginPath(); g.arc(0, -146, 26, P * 1.12, P * 1.88, false); g.strokePath();
  } else if (f.head === 'nemes') {
    g.fillStyle(f.hc!); g.beginPath(); g.arc(0, -146, 27, P, 2 * P, false); g.closePath(); g.fillPath();
    g.lineStyle(4, f.hc2!); g.beginPath(); g.arc(0, -146, 24, P * 1.1, P * 1.9, false); g.strokePath();
    g.fillStyle(0xf0c040); g.fillTriangle(-4, -170, 4, -170, 0, -182);
  } else if (f.head === 'veil') {
    g.fillStyle(f.hc!); g.beginPath(); g.arc(0, -146, 27, P, 2 * P, false); g.closePath(); g.fillPath();
  } else {
    g.fillStyle(f.hair); g.beginPath(); g.arc(0, -144, 25, P, 2 * P, false); g.closePath(); g.fillPath();
  }
  if (f.beard) {
    g.fillStyle(f.beard); poly(g, [{ x: -20, y: -138 }, { x: 20, y: -138 }, { x: 15, y: -110 }, { x: 0, y: -100 }, { x: -15, y: -110 }], true);
  }
  // 얼굴
  g.fillStyle(0x2a1a10); g.fillCircle(-8, -146, 3.2); g.fillCircle(8, -146, 3.2);
  g.lineStyle(2.5, 0x3a2a1a);
  const brow = (ax: number, ay: number, bx: number, by: number) => g.lineBetween(ax, ay, bx, by);
  if (expr === 'angry') { brow(-14, -158, -3, -152); brow(14, -158, 3, -152); }
  else if (expr === 'worry' || expr === 'sad') { brow(-14, -151, -3, -157); brow(14, -151, 3, -157); }
  else if (expr === 'awe') { brow(-13, -157, -4, -158); brow(4, -158, 13, -157); }
  else { brow(-13, -153, -4, -155); brow(4, -155, 13, -153); }
  g.lineStyle(3, f.beard ? 0x5a3a2a : 0x7a3a2a);
  if (expr === 'smile') { g.beginPath(); g.arc(0, -138, 7, P * 0.15, P * 0.85, false); g.strokePath(); g.fillStyle(0xf08080, 0.3); g.fillCircle(-15, -139, 5); g.fillCircle(15, -139, 5); }
  else if (expr === 'sad' || expr === 'worry') { g.beginPath(); g.arc(0, -127, 7, P * 1.15, P * 1.85, false); g.strokePath(); }
  else if (expr === 'angry') g.lineBetween(-6, -130, 6, -130);
  else { g.fillStyle(0x4a2a1a); g.fillCircle(0, -130, 4.5); }
}

export function figure(scene: Phaser.Scene, key: string, x: number, y: number, s: number, expr: Expr = 'smile', flip = false): G {
  const g = scene.add.graphics({ x, y });
  drawFigure(g, FIG[key] ?? FIG.hebrew, expr);
  g.setScale(flip ? -s : s, s);
  return g;
}

// ───────────────────────── 소품 (원점 = 바닥 가운데, 위쪽이 -y) ─────────────────────────
function drawSheep(g: G) {
  g.fillStyle(0x000000, 0.14); g.fillEllipse(0, 2, 80, 10);
  g.fillStyle(0x3a3030); g.fillRect(-18, -14, 6, 14); g.fillRect(12, -14, 6, 14);
  g.fillStyle(0xf6f6f6); g.fillCircle(-18, -30, 17); g.fillCircle(2, -36, 20); g.fillCircle(20, -30, 16); g.fillCircle(-2, -24, 20);
  g.fillStyle(0x3a3030); g.fillEllipse(38, -32, 22, 20); g.fillStyle(0xffffff); g.fillCircle(42, -35, 2.5);
}
function drawCow(g: G) {
  g.fillStyle(0x000000, 0.14); g.fillEllipse(0, 2, 110, 12);
  g.fillStyle(0xe8e0d0); g.fillRect(-34, -30, 9, 30); g.fillRect(22, -30, 9, 30);
  g.fillEllipse(0, -52, 104, 54); g.fillEllipse(58, -62, 34, 28);
  g.fillStyle(0x3a2a22); g.fillEllipse(-18, -58, 26, 18); g.fillEllipse(14, -44, 20, 14); g.fillCircle(66, -66, 2.5);
  g.fillStyle(0xcfa070); g.fillEllipse(68, -56, 14, 10);
  g.lineStyle(4, 0xcfc0a0); g.lineBetween(50, -78, 46, -88); g.lineBetween(62, -80, 66, -90);
  g.lineStyle(4, 0x3a2a22); g.lineBetween(-52, -60, -64, -36);
}
function drawBush(g: G) {
  g.fillStyle(0x000000, 0.18); g.fillEllipse(0, 2, 150, 16);
  g.fillStyle(0x4a7a3a); [[-40, -30, 32], [0, -48, 40], [40, -30, 32], [-14, -22, 30], [18, -22, 30]].forEach(([x, y, r]) => g.fillCircle(x, y, r));
  g.fillStyle(0x6aa04a); [[-30, -44, 14], [20, -60, 16], [34, -34, 12]].forEach(([x, y, r]) => g.fillCircle(x, y, r));
}
function drawFlame(g: G, s = 1) {
  const f = (c: number, w: number, h: number) => { g.fillStyle(c); g.fillTriangle(-w, 0, w, 0, 0, -h); g.fillCircle(0, 0, w); };
  f(0xff7a1a, 22 * s, 80 * s); f(0xffb02e, 15 * s, 56 * s); f(0xfff0a0, 8 * s, 32 * s);
}
function drawLight(g: G, r = 160) {
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * 2 * P, a2 = a + 0.1;
    g.fillStyle(0xfff2b0, 0.13); g.fillTriangle(0, 0, Math.cos(a) * r * 2.4, Math.sin(a) * r * 2.4, Math.cos(a2) * r * 2.4, Math.sin(a2) * r * 2.4);
  }
  [r, r * 0.7, r * 0.45, r * 0.25].forEach((rr, i) => { g.fillStyle(0xfff2b0, 0.1 + i * 0.1); g.fillCircle(0, 0, rr); });
}
function drawPalm(g: G) {
  g.fillStyle(0x7a5a3a); poly(g, [{ x: -9, y: 0 }, { x: 9, y: 0 }, { x: 5, y: -150 }, { x: -5, y: -150 }], true);
  g.lineStyle(9, 0x3f8f4a);
  [[-70, -118], [-55, -150], [-20, -174], [20, -174], [55, -150], [70, -118]].forEach(([x, y]) => {
    g.lineBetween(0, -150, x * 0.55, y - 14); g.lineBetween(x * 0.55, y - 14, x, y + 20);
  });
  g.fillStyle(0x6a4a2a); g.fillCircle(-6, -146, 6); g.fillCircle(7, -144, 6);
}
function drawReeds(g: G) {
  const r = rng(7);
  for (let i = 0; i < 9; i++) {
    const x = (i - 4) * 12 + r() * 6, h = 60 + r() * 60;
    g.lineStyle(4, 0x4a7a3a); g.lineBetween(x, 0, x + (r() - 0.5) * 14, -h);
    g.fillStyle(0x7a5a2a); g.fillEllipse(x + (r() - 0.5) * 14, -h - 8, 8, 20);
  }
}
function drawPyramid(g: G) {
  g.fillStyle(0xd9b56a); g.fillTriangle(-150, 0, 150, 0, 0, -150);
  g.fillStyle(0xb8934a); g.fillTriangle(0, -150, 150, 0, 20, 0);
}
function drawBricks(g: G) {
  const rows = [[0, 4], [1, 3], [2, 2], [3, 1]];
  rows.forEach(([r, n]) => {
    for (let i = 0; i < n; i++) {
      g.fillStyle(0xb5703c); g.fillRect(-60 + r * 14 + i * 32, -(r + 1) * 20, 30, 18);
      g.fillStyle(0x8a502a); g.fillRect(-60 + r * 14 + i * 32, -(r + 1) * 20 + 14, 30, 4);
    }
  });
}
function drawWell(g: G) {
  g.fillStyle(0x000000, 0.18); g.fillEllipse(0, 2, 110, 14);
  g.fillStyle(0x9a948a); g.fillRect(-42, -56, 84, 56);
  g.fillStyle(0xb8b2a6); g.fillEllipse(0, -56, 84, 22);
  g.fillStyle(0x2a3a4a); g.fillEllipse(0, -56, 62, 14);
  g.lineStyle(5, 0x6b4423); g.lineBetween(-40, -56, -40, -112); g.lineBetween(40, -56, 40, -112); g.lineBetween(-48, -112, 48, -112);
  g.lineStyle(2, 0x6b4423); g.lineBetween(0, -112, 0, -70);
  g.fillStyle(0x6b4423); g.fillRect(-7, -72, 14, 12);
}
function drawSnake(g: G) {
  g.lineStyle(11, 0x4a9a3a);
  let px = -70, py = -10;
  for (let i = 1; i <= 24; i++) {
    const t = i / 24, x = -70 + t * 140, y = -10 - Math.sin(t * P * 2.2) * 26 - t * 30;
    g.lineBetween(px, py, x, y); px = x; py = y;
  }
  g.fillStyle(0x4a9a3a); g.fillCircle(px + 4, py - 2, 13);
  g.fillStyle(0xffffff); g.fillCircle(px + 8, py - 6, 3.5); g.fillStyle(0x111111); g.fillCircle(px + 9, py - 6, 1.8);
  g.lineStyle(2, 0xd02020); g.lineBetween(px + 16, py, px + 26, py - 3);
}
function drawHouse(g: G) {  // 먼 마을 집 (유월절)
  g.fillStyle(0xd9c8a0); g.fillRect(-50, -70, 100, 70);
  g.fillStyle(0x4a3a2a); g.fillRect(-14, -50, 28, 50);
  g.fillStyle(0xb02020); g.fillRect(-18, -54, 4, 54); g.fillRect(14, -54, 4, 54); g.fillRect(-18, -58, 36, 5);
  g.fillStyle(0xf6d36a); g.fillRect(24, -52, 16, 14);
}
function drawCrowd(g: G) {
  const cols = [0xb89a6a, 0x9a6a5a, 0x6a8a9a, 0x8a9a5a, 0xc8a85a, 0x9a7ab0, 0xb87a5a];
  const r = rng(11);
  for (let i = 0; i < 12; i++) {
    const x = -200 + i * 36 + r() * 12, h = 30 + r() * 12, c = cols[i % cols.length];
    g.fillStyle(0x000000, 0.12); g.fillEllipse(x, 1, 24, 5);
    g.fillStyle(c); poly(g, [{ x: x - 12, y: 0 }, { x: x + 12, y: 0 }, { x: x + 7, y: -h }, { x: x - 7, y: -h }], true);
    g.fillStyle(0xe0b08a); g.fillCircle(x, -h - 8, 8);
    g.fillStyle(dark(c, 0.3)); g.beginPath(); g.arc(x, -h - 9, 9, P, 2 * P, false); g.closePath(); g.fillPath();
  }
}
function drawSwarm(g: G, color: number) {
  const r = rng(23);
  for (let i = 0; i < 46; i++) {
    const x = (r() - 0.5) * 520, y = -60 - r() * 170;
    g.fillStyle(0xffffff, 0.35); g.fillEllipse(x - 4, y - 3, 8, 4); g.fillEllipse(x + 4, y - 3, 8, 4);
    g.fillStyle(color); g.fillEllipse(x, y, 9, 5);
  }
}
function drawChariot(g: G, flip = 1) {
  const X = (x: number) => x * flip;
  g.fillStyle(0x000000, 0.15); g.fillEllipse(0, 2, 150, 12);
  // 말
  g.fillStyle(0x6a3a22); g.fillEllipse(X(-52), -46, 70, 36); g.fillRect(X(-80) - 4, -34, 7, 34); g.fillRect(X(-36) - 4, -34, 7, 34);
  poly(g, [{ x: X(-76), y: -60 }, { x: X(-84), y: -90 }, { x: X(-62), y: -84 }, { x: X(-62), y: -56 }], true);
  g.fillStyle(0x3a2012); g.fillTriangle(X(-84), -90, X(-76), -98, X(-72), -86);
  // 수레
  g.fillStyle(0xc8a040); g.fillRect(X(-10) - (flip < 0 ? 64 : 0), -62, 64, 34);
  g.fillStyle(0x2f5fa8); g.fillRect(X(-10) - (flip < 0 ? 64 : 0), -62, 64, 8);
  g.lineStyle(5, 0x6b4423); g.strokeCircle(X(24), -20, 20);
  g.lineBetween(X(24), -40, X(24), 0); g.lineBetween(X(4), -20, X(44), -20);
  g.lineStyle(4, 0x6b4423); g.lineBetween(X(-20), -50, X(-10), -50);
  // 병사
  g.fillStyle(0xe0b08a); g.fillCircle(X(20), -82, 9); g.fillStyle(0x2f5fa8); g.fillRect(X(20) - 8, -74, 16, 14);
}
function drawPillar(g: G, kind: 'cloud' | 'fire') {
  if (kind === 'cloud') {
    for (let i = 0; i < 9; i++) {
      const y = -i * 36; const r = 34 + (i % 2) * 6;
      g.fillStyle(0xffffff, 0.92); g.fillCircle(-12, y, r); g.fillCircle(14, y - 10, r - 4);
      g.fillStyle(0xdfe8f4, 0.8); g.fillCircle(0, y - 18, r - 10);
    }
  } else {
    g.fillStyle(0xff9a2a, 0.25); g.fillEllipse(0, -150, 160, 360);
    g.fillStyle(0xff7a1a, 0.9); poly(g, [{ x: -34, y: 0 }, { x: 34, y: 0 }, { x: 20, y: -150 }, { x: 8, y: -300 }, { x: -8, y: -300 }, { x: -22, y: -150 }], true);
    g.fillStyle(0xffc040, 0.95); poly(g, [{ x: -18, y: 0 }, { x: 18, y: 0 }, { x: 10, y: -150 }, { x: 0, y: -260 }, { x: -10, y: -150 }], true);
    g.fillStyle(0xfff6c0, 0.95); poly(g, [{ x: -8, y: 0 }, { x: 8, y: 0 }, { x: 4, y: -120 }, { x: -4, y: -120 }], true);
  }
}
function drawBasket(g: G) {
  g.fillStyle(0x000000, 0.14); g.fillEllipse(0, 2, 100, 12);
  g.fillStyle(0xe0b08a); g.fillCircle(0, -34, 16);
  g.fillStyle(0x2a1a10); g.fillCircle(-5, -36, 2); g.fillCircle(5, -36, 2);
  g.fillStyle(0xfff0e0); g.fillEllipse(0, -22, 40, 22);
  g.fillStyle(0xb88a4a); poly(g, [{ x: -46, y: -30 }, { x: 46, y: -30 }, { x: 36, y: 0 }, { x: -36, y: 0 }], true);
  g.lineStyle(3, 0x8a5a2a); [-18, 0, 18].forEach(x => g.lineBetween(x, -30, x * 0.8, 0)); g.lineBetween(-42, -14, 42, -14);
}
function drawTent(g: G) {
  g.fillStyle(0xc8a878); g.fillTriangle(-50, 0, 50, 0, 0, -70); g.fillStyle(0x4a3a2a); g.fillTriangle(-12, 0, 12, 0, 0, -34);
}
function drawDrops(g: G) {   // 폭풍 / 우박 줄기
  const r = rng(5);
  for (let i = 0; i < 40; i++) {
    const x = r() * W, y = 40 + r() * 280;
    g.lineStyle(3, 0xe8f4ff, 0.7); g.lineBetween(x, y, x - 8, y + 22);
  }
}
function drawSmoke(g: G) {
  [[-30, -20, 30], [10, -52, 36], [-6, -96, 40], [28, -140, 36]].forEach(([x, y, r], i) => { g.fillStyle(0x6a5a52, 0.55 - i * 0.08); g.fillCircle(x, y, r); });
}
type PropFn = (g: G) => void;
const PROPS: Record<string, PropFn> = {
  sheep: drawSheep, cow: drawCow, bush: drawBush, flame: g => drawFlame(g, 1), light: g => drawLight(g),
  palm: drawPalm, reeds: drawReeds, pyramid: drawPyramid, bricks: drawBricks, well: drawWell, snake: drawSnake,
  house: drawHouse, crowd: drawCrowd, flies: g => drawSwarm(g, 0x2a2a2a), locusts: g => drawSwarm(g, 0x6a8a2a),
  gnats: g => drawSwarm(g, 0x5a4a3a), chariot: g => drawChariot(g, 1), chariotL: g => drawChariot(g, -1),
  cloud: g => drawPillar(g, 'cloud'), fire: g => drawPillar(g, 'fire'), basket: drawBasket, tent: drawTent,
  drops: drawDrops, smoke: drawSmoke,
};

// ───────────────────────── 작은 아이콘 (미니게임용, 64px 기준) ─────────────────────────
function drawIconGfx(g: G, kind: string) {
  switch (kind) {
    case 'frog':
      g.fillStyle(0x3f9a3a); g.fillEllipse(0, 10, 56, 38); g.fillEllipse(-26, 22, 20, 12); g.fillEllipse(26, 22, 20, 12);
      g.fillCircle(-14, -8, 12); g.fillCircle(14, -8, 12);
      g.fillStyle(0xffffff); g.fillCircle(-14, -9, 7); g.fillCircle(14, -9, 7);
      g.fillStyle(0x111111); g.fillCircle(-14, -8, 3.5); g.fillCircle(14, -8, 3.5);
      g.lineStyle(3, 0x1f5a1f); g.beginPath(); g.arc(0, 8, 12, 0.15 * P, 0.85 * P, false); g.strokePath(); break;
    case 'bee':
      g.fillStyle(0xffffff, 0.7); g.fillEllipse(-8, -14, 22, 12); g.fillEllipse(8, -14, 22, 12);
      g.fillStyle(0xf2c02a); g.fillEllipse(0, 4, 44, 30);
      g.fillStyle(0x222222); g.fillRect(-8, -9, 6, 26); g.fillRect(6, -9, 6, 26);
      g.fillCircle(-24, 4, 7); g.fillTriangle(22, 4, 34, 4, 22, 8); break;
    case 'locust':
      g.fillStyle(0x7a9a2a); g.fillEllipse(0, 6, 52, 22); g.fillCircle(-26, 0, 11);
      g.fillStyle(0x5a7a1a); g.fillEllipse(8, -4, 40, 14);
      g.lineStyle(4, 0x4a6a14); g.lineBetween(8, 10, 24, 26); g.lineBetween(24, 26, 34, 14); g.lineBetween(-8, 12, -14, 28); g.lineBetween(-26, -6, -40, -22);
      g.fillStyle(0x111111); g.fillCircle(-30, -2, 2.5); break;
    case 'sheep':
      g.fillStyle(0x3a3030); g.fillRect(-14, 12, 6, 14); g.fillRect(10, 12, 6, 14);
      g.fillStyle(0xf6f6f6); g.fillCircle(-14, 0, 15); g.fillCircle(2, -6, 17); g.fillCircle(16, 0, 14); g.fillCircle(0, 6, 17);
      g.fillStyle(0x3a3030); g.fillEllipse(30, 0, 19, 17); g.fillStyle(0xffffff); g.fillCircle(33, -3, 2.2); break;
    case 'person':
      drawFigure(g, FIG.hebrew, 'worry'); g.setScale(0.3); g.y = 28; break;
    case 'lamp':
      g.fillStyle(0xc89a3a); g.fillEllipse(0, 14, 50, 22); g.fillTriangle(18, 10, 36, 4, 22, 16);
      g.fillStyle(0xe8b84a); g.fillEllipse(-2, 10, 36, 14);
      g.fillStyle(0xff8a1a); g.fillTriangle(-12, 2, 4, 2, -4, -22); g.fillStyle(0xfff0a0); g.fillTriangle(-8, 2, 0, 2, -4, -10); break;
    case 'hail':
      g.fillStyle(0xcfe8ff); g.fillCircle(0, 0, 20); g.fillStyle(0xffffff); g.fillCircle(-6, -6, 7);
      g.lineStyle(3, 0x8ab8e8); g.strokeCircle(0, 0, 20); break;
    default: break;
  }
}
const ICON_KIND: Record<string, string> = { '🐸': 'frog', '🐝': 'bee', '🦗': 'locust', '🐑': 'sheep', '🚶': 'person', '🕯️': 'lamp', '❄️': 'hail' };

// 미니게임용: 그림이 있으면 그림(Container), 없으면 이모지 글자
export type Icon = Phaser.GameObjects.Container | Phaser.GameObjects.Text;
export function makeIcon(scene: Phaser.Scene, emoji: string, x: number, y: number, size: number, fallback: (s: string, size: number) => Phaser.GameObjects.Text): Icon {
  const kind = ICON_KIND[emoji];
  if (!kind) return fallback(emoji, size).setPosition(x, y).setOrigin(0.5);
  const g = scene.add.graphics();
  drawIconGfx(g, kind);
  const sc = size / 64;
  if (kind !== 'person') g.setScale(sc); else g.setScale(g.scaleX * sc * 1.1);
  const c = scene.add.container(x, y, [g]);
  c.setSize(size * 1.1, size * 1.1);
  return c;
}

// ───────────────────────── 배경 ─────────────────────────
const sky = (g: G, top: number, bot: number, h = 280) => { g.fillGradientStyle(top, top, bot, bot, 1); g.fillRect(0, 0, W, h); };
const sunDisc = (g: G, x = 770, y = 120) => {
  g.fillStyle(0xfff6c8, 0.28); g.fillCircle(x, y, 78); g.fillStyle(0xfff6c8, 0.45); g.fillCircle(x, y, 56); g.fillStyle(0xfff2b0); g.fillCircle(x, y, 40);
};
const sandOf = (bg: number) => mix(0xe3c07a, bg, 0.2);

type Theme = (g: G, bg: number, water?: number) => void;
const THEMES: Record<string, Theme> = {
  desert: (g, bg) => {
    sky(g, light(bg, 0.45), light(bg, 0.1), 275); sunDisc(g);
    g.fillStyle(mix(sandOf(bg), bg, 0.35)); g.fillEllipse(180, 290, 560, 100); g.fillEllipse(740, 296, 640, 84);
    g.fillStyle(sandOf(bg)); g.fillRect(0, 280, W, 260);
    g.fillStyle(dark(sandOf(bg), 0.12)); g.fillEllipse(480, 540, 1400, 250);
  },
  palace: (g, bg) => {
    g.fillStyle(light(bg, 0.2)); g.fillRect(0, 0, W, 300);
    g.fillStyle(dark(bg, 0.12)); g.fillRect(0, 0, W, 44);
    const r = rng(3);
    for (let i = 0; i < 26; i++) { g.fillStyle(dark(bg, 0.22)); g.fillRect(20 + i * 36, 52, 7, 12 + r() * 6); g.fillRect(24 + i * 36, 70, 14, 5); }
    g.fillStyle(0xf2c94a); g.fillCircle(480, 150, 54); g.fillStyle(0xfff0b0); g.fillCircle(480, 150, 38);
    g.fillStyle(0x2f5fa8); g.fillEllipse(400, 150, 90, 22); g.fillEllipse(560, 150, 90, 22);
    [90, 300, 660, 870].forEach(x => {
      g.fillStyle(0x000000, 0.12); g.fillRect(x - 24, 60, 62, 250);
      g.fillStyle(light(bg, 0.55)); g.fillRect(x - 27, 60, 54, 245);
      g.fillStyle(light(bg, 0.75)); g.fillRect(x - 33, 54, 66, 14); g.fillRect(x - 33, 296, 66, 12);
      g.fillStyle(0xd4a62a); g.fillRect(x - 27, 110, 54, 5); g.fillRect(x - 27, 250, 54, 5);
    });
    g.fillStyle(dark(bg, 0.3)); g.fillRect(0, 306, W, 234);
    g.lineStyle(2, dark(bg, 0.45)); for (let i = 0; i < 12; i++) g.lineBetween(i * 90, 306, i * 140 - 240, 540);
    g.lineBetween(0, 380, W, 380); g.lineBetween(0, 470, W, 470);
  },
  work: (g, bg) => THEMES.desert(g, bg),
  nile: (g, bg, water = 0x3d8fd0) => {
    sky(g, light(bg, 0.45), light(bg, 0.1), 250); sunDisc(g, 200, 110);
    g.fillStyle(mix(0x7a9a4a, bg, 0.2)); g.fillRect(0, 230, W, 310);
    g.fillStyle(water); g.fillRect(0, 232, W, 62);      // 강은 멀리, 사람들은 둑 위에 서요
    g.fillStyle(light(water, 0.25), 0.7); const r = rng(9);
    for (let i = 0; i < 20; i++) { const x = r() * W, y = 238 + r() * 48; g.fillRect(x, y, 30 + r() * 26, 3); }
    g.fillStyle(dark(mix(0x7a9a4a, bg, 0.2), 0.1)); g.fillEllipse(480, 540, 1400, 250);
  },
  mountain: (g, bg) => {
    sky(g, light(bg, 0.5), light(bg, 0.15), 270); sunDisc(g, 190, 110);
    g.fillStyle(mix(0x8a6a4a, bg, 0.25)); g.fillTriangle(250, 280, 620, 280, 440, 60); g.fillTriangle(520, 280, 900, 280, 720, 110);
    g.fillStyle(dark(mix(0x8a6a4a, bg, 0.25), 0.25)); g.fillTriangle(440, 60, 620, 280, 470, 280); g.fillTriangle(720, 110, 900, 280, 740, 280);
    g.fillStyle(mix(0x9ab05a, bg, 0.15)); g.fillRect(0, 270, W, 270);
    g.fillStyle(dark(mix(0x9ab05a, bg, 0.15), 0.12)); g.fillEllipse(480, 540, 1400, 260);
  },
  night: (g, bg) => {
    sky(g, dark(bg, 0.55), bg, 290);
    const r = rng(17);
    for (let i = 0; i < 70; i++) { g.fillStyle(0xffffff, 0.35 + r() * 0.6); g.fillCircle(r() * W, r() * 250, 0.8 + r() * 1.6); }
    g.fillStyle(0xfff6d0); g.fillCircle(790, 90, 34); g.fillStyle(dark(bg, 0.5)); g.fillCircle(804, 82, 30);
    g.fillStyle(mix(0x4a3a30, bg, 0.3)); g.fillRect(0, 290, W, 250);
    g.fillStyle(dark(mix(0x4a3a30, bg, 0.3), 0.3)); g.fillEllipse(480, 540, 1400, 250);
  },
  dark: (g, bg) => {
    g.fillStyle(dark(bg, 0.2)); g.fillRect(0, 0, W, H);
    g.fillStyle(0x000000, 0.35); g.fillRect(0, 280, W, 260);
  },
  storm: (g, bg) => {
    sky(g, dark(bg, 0.35), light(bg, 0.05), 280);
    [[120, 70, 220], [340, 50, 260], [600, 74, 240], [820, 56, 250], [480, 110, 300]].forEach(([x, y, w]) => { g.fillStyle(dark(bg, 0.3), 0.9); g.fillEllipse(x, y, w, 70); g.fillStyle(dark(bg, 0.15), 0.9); g.fillEllipse(x + 20, y + 14, w * 0.8, 50); });
    g.fillStyle(mix(0xb0a080, bg, 0.3)); g.fillRect(0, 280, W, 260);
    g.fillStyle(dark(mix(0xb0a080, bg, 0.3), 0.12)); g.fillEllipse(480, 540, 1400, 250);
  },
  field: (g, bg) => {
    sky(g, light(bg, 0.5), light(bg, 0.15), 260); sunDisc(g, 170, 110);
    g.fillStyle(mix(0x9ab04a, bg, 0.3)); g.fillEllipse(260, 280, 700, 110); g.fillEllipse(780, 286, 720, 100);
    g.fillStyle(mix(0xa8b84a, bg, 0.25)); g.fillRect(0, 276, W, 264);
    g.fillStyle(dark(mix(0xa8b84a, bg, 0.25), 0.1)); g.fillEllipse(480, 540, 1400, 250);
  },
  house: (g, bg) => {
    g.fillStyle(light(bg, 0.25)); g.fillRect(0, 0, W, 300);
    g.fillStyle(dark(bg, 0.1)); g.fillRect(0, 0, W, 30);
    g.fillStyle(0xf6e08a, 0.35); g.fillCircle(150, 140, 120); g.fillStyle(0xf6e08a, 0.5); g.fillCircle(150, 140, 60);
    g.fillStyle(0xd8a84a); g.fillRect(120, 110, 60, 14); g.fillStyle(0xff8a1a); g.fillTriangle(138, 110, 162, 110, 150, 80);
    g.fillStyle(dark(bg, 0.25)); g.fillRect(0, 300, W, 240);
    g.lineStyle(2, dark(bg, 0.45)); g.lineBetween(0, 390, W, 390); g.lineBetween(0, 470, W, 470);
  },
  sea: (g, bg) => {
    sky(g, light(bg, 0.4), light(bg, 0.05), 346);
    g.fillStyle(0xd9b56a); g.fillRect(0, 150, W, 200);
    const wall = (pts: { x: number; y: number }[]) => { g.fillStyle(0x1f6fb0); poly(g, pts, true); };
    wall([{ x: 0, y: 0 }, { x: 392, y: 40 }, { x: 440, y: 246 }, { x: 196, y: 350 }, { x: 0, y: 350 }]);
    wall([{ x: W, y: 0 }, { x: 568, y: 40 }, { x: 520, y: 246 }, { x: 764, y: 350 }, { x: W, y: 350 }]);
    g.fillStyle(0x2f8fd0, 0.8); poly(g, [{ x: 0, y: 60 }, { x: 300, y: 90 }, { x: 330, y: 240 }, { x: 120, y: 330 }, { x: 0, y: 330 }], true);
    poly(g, [{ x: W, y: 60 }, { x: 660, y: 90 }, { x: 630, y: 240 }, { x: 840, y: 330 }, { x: W, y: 330 }], true);
    g.lineStyle(4, 0xe8f6ff, 0.75);
    [60, 120, 190, 260].forEach(y => { g.lineBetween(0, y, 380, y + 24); g.lineBetween(W, y, 580, y + 24); });
    g.fillStyle(0xe8f6ff, 0.9); [[392, 40], [568, 40], [370, 70], [590, 70]].forEach(([x, y]) => g.fillCircle(x, y, 14));
    g.fillStyle(0x0f4f80, 0.7); [[90, 140], [260, 210], [860, 160], [700, 220]].forEach(([x, y]) => { g.fillEllipse(x, y, 34, 14); g.fillTriangle(x + 14, y, x + 28, y - 8, x + 28, y + 8); });
    g.fillStyle(0xe3c07a); poly(g, [{ x: 196, y: 350 }, { x: 440, y: 246 }, { x: 520, y: 246 }, { x: 764, y: 350 }], true);
    g.fillStyle(0xcaa660); g.fillRect(0, 350, W, 190);
  },
  shore: (g, bg) => {
    sky(g, light(bg, 0.4), light(bg, 0.05), 160);
    g.fillStyle(0x2f7fc0); g.fillRect(0, 150, W, 140);
    g.fillStyle(0x4a9ad8); g.fillRect(0, 150, W, 40);
    g.lineStyle(3, 0xe8f6ff, 0.7); const r = rng(4);
    for (let i = 0; i < 18; i++) { const x = r() * W, y = 170 + r() * 110; g.lineBetween(x, y, x + 36, y); }
    g.fillStyle(0xe3c07a); g.fillRect(0, 286, W, 254); g.fillStyle(0xcaa660); g.fillEllipse(480, 540, 1400, 250);
    g.fillStyle(0xe3c07a); g.fillEllipse(480, 286, 1100, 40);
  },
};

// ───────────────────────── 장면 사전 ─────────────────────────
interface Def { t: string; w?: number; f?: [string, number, Expr?][]; p?: [string, number, number, number?][] }
const SC: Record<string, Def> = {
  palace_empty: { t: 'palace' },
  nile_baby: { t: 'nile', p: [['palm', 120, 300, 0.9], ['basket', 480, 330, 1.3], ['reeds', 760, 330, 1]] },
  work_hebrews: { t: 'work', p: [['bricks', 200, 336], ['pyramid', 700, 282, 1.1]], f: [['hebrew', 420, 'worry'], ['hebrew', 560, 'sad'], ['hebrew', 700, 'worry']] },
  work_overseer: { t: 'work', p: [['pyramid', 700, 282, 1.1]], f: [['hebrew', 400, 'worry'], ['overseer', 580, 'angry']] },
  work_prince_think: { t: 'work', p: [['pyramid', 700, 282, 1.1]], f: [['prince', 480, 'worry']] },
  work_fight: { t: 'work', p: [['pyramid', 700, 282, 1.1]], f: [['hebrew', 330, 'worry'], ['prince', 480, 'angry'], ['overseer', 650, 'angry']] },
  work_worry: { t: 'work', p: [['pyramid', 700, 282, 1.1]], f: [['prince', 480, 'worry']] },
  palace_pharaoh: { t: 'palace', f: [['pharaoh', 600, 'angry']] },
  palace_sad: { t: 'palace', f: [['pharaoh', 560, 'sad']] },
  palace_audience: { t: 'palace', f: [['moses', 330, 'smile'], ['aaron', 440, 'smile'], ['pharaoh', 650, 'angry']] },
  palace_magicians: { t: 'palace', f: [['magician', 330, 'awe'], ['magician', 440, 'awe'], ['pharaoh', 640, 'angry']] },
  snake_pharaoh: { t: 'palace', f: [['aaron', 340, 'smile'], ['magician', 700, 'awe'], ['pharaoh', 580, 'angry']], p: [['+snake', 470, 330, 1.2]] },
  desert_leave: { t: 'desert', f: [['prince', 480, 'sad']] },
  desert_sad: { t: 'desert', f: [['prince', 480, 'sad']] },
  desert_arrive: { t: 'desert', f: [['moses', 480, 'sad']] },
  well_girls: { t: 'desert', p: [['well', 640, 300, 1.2], ['sheep', 780, 330, 1]], f: [['girl', 300, 'smile'], ['zipporah', 400, 'smile'], ['girl', 500, 'worry']] },
  well_shepherds: { t: 'desert', p: [['well', 780, 296, 1.1]], f: [['moses', 330, 'angry'], ['girl', 450, 'worry'], ['shepherd', 580, 'angry'], ['shepherd', 690, 'angry']] },
  well_help: { t: 'desert', p: [['well', 660, 300, 1.1], ['sheep', 790, 332, 1], ['sheep', 250, 332, 0.8]], f: [['moses', 400, 'smile'], ['zipporah', 520, 'smile']] },
  house_jethro: { t: 'house', f: [['moses', 360, 'smile'], ['jethro', 600, 'smile']] },
  house_wedding: { t: 'house', f: [['moses', 400, 'smile'], ['zipporah', 560, 'smile']] },
  desert_sheep: { t: 'desert', p: [['sheep', 260, 336], ['sheep', 640, 330, 0.9], ['sheep', 790, 340, 1]], f: [['moses', 440, 'smile']] },
  mountain: { t: 'mountain', p: [['sheep', 260, 336, 0.9], ['sheep', 720, 336, 0.9]], f: [['moses', 480, 'smile']] },
  bush: { t: 'mountain', p: [['bush', 640, 322, 1.2], ['flame', 600, 262], ['flame', 660, 240, 1.2], ['flame', 710, 268]], f: [['moses', 380, 'awe']] },
  bush_god: { t: 'mountain', p: [['light', 640, 220], ['bush', 640, 322, 1.2], ['flame', 610, 262], ['flame', 670, 240, 1.2]], f: [['moses', 360, 'awe']] },
  bush_worry: { t: 'mountain', p: [['light', 640, 220], ['bush', 640, 322, 1.2], ['flame', 610, 262]], f: [['moses', 360, 'worry']] },
  desert_aaron: { t: 'desert', f: [['moses', 400, 'smile'], ['aaron', 560, 'smile']] },
  desert_snake: { t: 'desert', p: [['snake', 480, 336, 1.2]], f: [['moses', 330, 'awe'], ['aaron', 700, 'awe']] },
  desert_walk: { t: 'desert', f: [['moses', 420, 'smile'], ['aaron', 560, 'smile']] },
  storm_two: { t: 'storm', f: [['moses', 420, 'smile'], ['aaron', 560, 'smile']] },
  nile_blood: { t: 'nile', w: 0xa01818, p: [['palm', 110, 300, 0.9], ['reeds', 800, 330, 1]], f: [['moses', 400, 'smile'], ['aaron', 540, 'worry']] },
  nile_river: { t: 'nile', p: [['palm', 110, 300, 0.9], ['reeds', 840, 330, 1]] },
  nile_frogs: { t: 'nile', w: 0x4a9a6a, p: [['palm', 110, 300, 0.9], ['reeds', 840, 330, 1]] },
  gnats: { t: 'desert', p: [['+gnats', 480, 300]], f: [['moses', 400, 'smile'], ['aaron', 560, 'smile']] },
  field_flies: { t: 'field', p: [['+flies', 480, 300], ['sheep', 230, 336, 0.9], ['sheep', 740, 336, 0.9]], f: [['moses', 440, 'smile']] },
  field_cows: { t: 'field', p: [['cow', 330, 336, 1.1], ['cow', 560, 332, 1], ['cow', 760, 340, 1.1]] },
  field_safe: { t: 'field', p: [['sheep', 300, 336], ['sheep', 470, 332, 0.9], ['sheep', 640, 336], ['sheep', 790, 340, 0.8]] },
  ash: { t: 'storm', p: [['smoke', 480, 322, 1.2]], f: [['moses', 360, 'smile'], ['aaron', 600, 'smile']] },
  storm_hail: { t: 'storm', p: [['+drops', 0, 0]], f: [['moses', 480, 'awe']] },
  field_locust: { t: 'field', p: [['+locusts', 480, 300]] },
  dark: { t: 'dark' },
  dark_lamps: { t: 'dark' },
  night_passover: { t: 'night', p: [['house', 250, 330, 1.1], ['house', 480, 322, 0.9], ['house', 720, 330, 1.1]] },
  house_passover: { t: 'house', f: [['hebrew', 460, 'smile'], ['girl', 580, 'smile']], p: [['house', 780, 330, 1]] },
  exodus: { t: 'desert', p: [['crowd', 520, 336, 1.1]], f: [['moses', 330, 'smile'], ['aaron', 440, 'smile']] },
  // 5장
  pillar_fire: { t: 'night', p: [['fire', 700, 330, 1.1], ['crowd', 360, 336, 0.9]], f: [['moses', 540, 'smile']] },
  pillar_cloud: { t: 'desert', p: [['cloud', 700, 330, 1.0], ['crowd', 330, 336, 0.9]], f: [['moses', 540, 'smile']] },
  shore: { t: 'shore', p: [['crowd', 300, 336, 0.9]], f: [['moses', 620, 'worry']] },
  chase: { t: 'desert', p: [['chariot', 700, 308, 0.9], ['chariot', 820, 300, 0.7], ['crowd', 320, 336, 0.9]], f: [['pharaoh', 500, 'angry']] },
  shore_empty: { t: 'shore' },
  sea_calm: { t: 'shore', p: [['crowd', 280, 336, 0.9]], f: [['moses', 620, 'smile']] },
  sea_ready: { t: 'shore', p: [['cloud', 830, 316, 0.7]], f: [['moses', 480, 'awe']] },
  sea_open: { t: 'sea', f: [['moses', 480, 'awe']] },
  sea_cross: { t: 'sea', p: [['crowd', 480, 346, 0.7]], f: [['moses', 400, 'smile']] },
  sea_chase: { t: 'sea', p: [['chariot', 480, 262, 0.55]], f: [['moses', 330, 'worry']] },
  sea_close: { t: 'shore', p: [['chariot', 620, 300, 0.8], ['chariot', 800, 296, 0.6]], f: [['moses', 360, 'awe']] },
  miriam: { t: 'desert', p: [['crowd', 650, 336, 1]], f: [['miriam', 400, 'smile'], ['moses', 520, 'smile']] },
  free: { t: 'desert', p: [['crowd', 600, 336, 1.1]], f: [['moses', 360, 'smile']] },
};

export const ICON_SCENE: Record<string, string> = {
  '🏛️': 'palace_empty', '👶': 'nile_baby', '🧱': 'work_hebrews', '😠': 'work_overseer', '🤔': 'work_prince_think',
  '💭': 'work_prince_think', '⚔️': 'work_fight', '😰': 'work_worry', '👑': 'palace_pharaoh', '🌅': 'desert_leave',
  '💫': 'desert_sad', '🏜️': 'desert_arrive', '👧': 'well_girls', '🧔': 'well_shepherds', '🐑': 'well_help',
  '🏠': 'house_jethro', '💍': 'house_wedding', '🐏': 'desert_sheep', '⛰️': 'mountain', '🔥': 'bush', '✨': 'bush_god',
  '😟': 'bush_worry', '🤝': 'desert_aaron', '🐍': 'desert_snake', '🚶': 'desert_walk', '😤': 'palace_pharaoh',
  '🔟': 'storm_two', '🩸': 'nile_blood', '🌊': 'nile_river', '🐸': 'nile_frogs', '🦟': 'gnats', '🧙': 'palace_magicians',
  '🐄': 'field_cows', '💨': 'ash', '🌨️': 'storm_hail', '❄️': 'storm_hail', '🦗': 'field_locust', '🌑': 'dark',
  '🕯️': 'dark_lamps', '🌙': 'night_passover', '😢': 'palace_sad', '🐝': 'field_flies', '🥁': 'miriam',
};
export const SCENE_NAMES = Object.keys(SC);

const SPEAKER_FIG: Record<string, string> = { 모세: 'moses', 바로: 'pharaoh', 이드로: 'jethro', 아론: 'aaron', 미리암: 'miriam', 백성: 'hebrew' };

interface Opts { bg: number; speaker?: string; compact?: boolean; chapter?: number; figures?: boolean }

// 장면 하나를 그려서, 만들어진 그래픽 목록을 돌려줍니다.
export function drawScene(scene: Phaser.Scene, name: string | undefined, o: Opts): G[] {
  const def = SC[name ?? ''] ?? SC.desert_walk;
  const out: G[] = [];
  const bgG = scene.add.graphics(); out.push(bgG);
  (THEMES[def.t] ?? THEMES.desert)(bgG, o.bg, def.w);

  const compact = !!o.compact, fs = compact ? 0.5 : 0.95, ground = compact ? 332 : 324;
  const propAt = (n: string, x: number, y: number, s = 1) => {
    if (x < -900) return;
    const g = scene.add.graphics({ x, y }); PROPS[n.replace('+', '')]?.(g); g.setScale(s); out.push(g);
  };
  // 뒤쪽 소품
  def.p?.filter(p => !p[0].startsWith('+')).forEach(([n, x, y, s]) => propAt(n, x, compact ? y + 4 : y, (s ?? 1) * (compact ? 0.7 : 1)));

  if (o.figures !== false) {
    let figs = def.f ?? [];
    const sp = o.speaker ? (o.chapter === 1 && o.speaker === '모세' ? 'prince' : SPEAKER_FIG[o.speaker]) : undefined;
    if (!figs.length && sp) figs = [[sp, 480, 'smile']];
    figs.forEach(([k, x, e]) => {
      const key = o.chapter === 1 && k === 'moses' ? 'prince' : k;
      out.push(figure(scene, key, x, ground, fs, e ?? 'smile'));
    });
    if (o.speaker === '하나님' && !def.p?.some(p => p[0] === 'light')) {
      const l = scene.add.graphics({ x: 480, y: 120 }); drawLight(l, 120); out.push(l);
    }
  }
  // 앞쪽 소품
  def.p?.filter(p => p[0].startsWith('+')).forEach(([n, x, y, s]) => propAt(n, x, y, s ?? 1));
  return out;
}

// 소품 하나만 그려서 돌려줘요 (움직이는 장면용)
export function prop(scene: Phaser.Scene, name: string, x: number, y: number, s = 1): G {
  const g = scene.add.graphics({ x, y }); PROPS[name]?.(g); g.setScale(s); return g;
}

// 전투 장면 배경 (캐릭터는 따로 그림)
export function drawBackdrop(scene: Phaser.Scene, theme: string, bg: number): G {
  const g = scene.add.graphics(); (THEMES[theme] ?? THEMES.desert)(g, bg); return g;
}
