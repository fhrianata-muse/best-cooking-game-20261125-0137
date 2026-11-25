// Canvas painter — the whole kitchen in one 1280x300 frame.
import { FIELD, PALETTE, STATIONS, INGREDIENTS } from './config.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, font, align = 'left', weight = '') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

export function ingredientColor(id) {
  const ing = INGREDIENTS.find((i) => i.id === id);
  return ing ? ing.color : '#999';
}

export function ingredientName(id) {
  const ing = INGREDIENTS.find((i) => i.id === id);
  return ing ? ing.name : id;
}

// One ingredient drawn by shape, not colour alone.
export function drawIngredient(ctx, id, x, y, size, label) {
  const ing = INGREDIENTS.find((i) => i.id === id);
  const r = size / 2;
  ctx.save();
  ctx.translate(x, y);
  if (!ing) { ctx.restore(); return; }
  if (ing.shape === 'round') {
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.2, 0, 0, r * 1.15);
    g.addColorStop(0, '#F0715F'); g.addColorStop(0.6, ing.color); g.addColorStop(1, '#B03324');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    // leafy star stem
    ctx.fillStyle = '#4E7A3A';
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * r * 0.28, -r * 0.82 + Math.sin(a) * r * 0.12, r * 0.3, r * 0.11, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#2F5223';
    ctx.fillRect(-1.4, -r - 5, 2.8, 6);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2); ctx.fill();
  } else if (ing.shape === 'rings') {
    ctx.fillStyle = '#EFE3CC';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#C9B18C'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#B9A888';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(-r * 0.4, -r * 0.4, r * 0.2, 0, Math.PI * 2); ctx.fill();
  } else if (ing.shape === 'fish') {
    const g = ctx.createLinearGradient(0, -r * 0.6, 0, r * 0.6);
    g.addColorStop(0, '#B7D2E8'); g.addColorStop(0.55, ing.color); g.addColorStop(1, '#5B84AE');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r - 9, -8); ctx.lineTo(-r - 9, 8); ctx.closePath(); ctx.fill();
    // top fin + gill curve
    ctx.fillStyle = '#5B84AE';
    ctx.beginPath(); ctx.moveTo(-r * 0.25, -r * 0.42); ctx.lineTo(r * 0.15, -r * 0.78); ctx.lineTo(r * 0.35, -r * 0.38); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(43,33,24,0.4)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(r * 0.32, 0, r * 0.3, -1.1, 1.1); ctx.stroke();
    ctx.fillStyle = '#2B2118';
    ctx.beginPath(); ctx.arc(r * 0.55, -2, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(r * 0.55 + 0.8, -2.8, 0.8, 0, Math.PI * 2); ctx.fill();
  } else if (ing.shape === 'loaf') {
    const g = ctx.createLinearGradient(0, -r * 0.6, 0, r * 0.6);
    g.addColorStop(0, '#DCA95E'); g.addColorStop(1, '#B9852F');
    ctx.fillStyle = g;
    rr(ctx, -r, -r * 0.6, r * 2, r * 1.2, r * 0.5); ctx.fill();
    // baker's scores: three pale diagonal slashes
    ctx.fillStyle = '#F1DCB2';
    [-0.45, 0, 0.45].forEach((fx) => {
      ctx.save(); ctx.translate(r * fx, -r * 0.28); ctx.rotate(0.5);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 0.22, r * 0.07, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  } else if (ing.shape === 'leaves') {
    for (let i = 0; i < 5; i += 1) {
      const lx = -11 + i * 5.5;
      const ly = -3 + (i % 2) * 6;
      ctx.fillStyle = i % 2 ? '#5E8F46' : ing.color;
      ctx.beginPath(); ctx.ellipse(lx, ly, 9.5, 6, -0.55 + i * 0.28, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2F5223'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(lx - 6, ly + 3); ctx.lineTo(lx + 6, ly - 3); ctx.stroke();
    }
  } else if (ing.shape === 'wedge') {
    const g = ctx.createLinearGradient(0, -r * 0.4, 0, r * 0.5);
    g.addColorStop(0, '#F7DC6B'); g.addColorStop(1, ing.color);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(-r, r * 0.5); ctx.lineTo(r, r * 0.5); ctx.lineTo(r, -r * 0.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#C98A1B'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-r, r * 0.5); ctx.lineTo(r, r * 0.5); ctx.lineTo(r, -r * 0.4); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = '#C98A1B';
    ctx.beginPath(); ctx.arc(-r * 0.25, r * 0.22, 2.8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.3, r * 0.18, 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.62, -r * 0.08, 1.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
  if (label) text(ctx, label, x, y + r + 11, 11, '#F6E8C8', 'system-ui, sans-serif', 'center', '700');
}

// A small zone pill for the hot stations: green PERFECT or red BURNT,
// pinned to the top strip of the cooking surface.
function drawZonePill(ctx, cx, cy, zone) {
  if (zone === 'under') return;
  const label = zone === 'perfect' ? '★ PERFECT — TAKE IT!' : 'BURNT!';
  const w = zone === 'perfect' ? 118 : 62;
  ctx.fillStyle = zone === 'perfect' ? '#4E7A3A' : '#C22E1F';
  rr(ctx, cx - w / 2, cy - 8, w, 16, 8); ctx.fill();
  ctx.strokeStyle = 'rgba(251,247,238,0.7)'; ctx.lineWidth = 1.2;
  rr(ctx, cx - w / 2, cy - 8, w, 16, 8); ctx.stroke();
  text(ctx, label, cx, cy + 0.5, 9.5, '#FBF7EE', 'system-ui, sans-serif', 'center', '800');
}

function drawSteam(ctx, x, y, t) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i += 1) {
    const ph = t / 900 + i * 2.1;
    const sx = x - 14 + i * 14 + Math.sin(ph) * 4;
    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.quadraticCurveTo(sx + 5, y - 10, sx - 2, y - 20);
    ctx.stroke();
  }
  ctx.restore();
}

function drawProgress(ctx, x, y, w, frac, color) {
  ctx.fillStyle = 'rgba(43,33,24,0.85)';
  rr(ctx, x, y, w, 10, 5); ctx.fill();
  ctx.fillStyle = color;
  if (frac > 0.01) { rr(ctx, x + 1, y + 1, (w - 2) * Math.min(1, frac), 8, 4); ctx.fill(); }
}

// Doneness bar: three coloured zones — UNDER (blue) / PERFECT (green) /
// BURNT (red) — with the cook's current position marked. The zones are
// the game: take the item off while the marker is in the green.
export const DONENESS_ZONES = { perfectFrom: 0.7, perfectTo: 1.15, max: 1.6 };
export function donenessZone(d) {
  if (d < DONENESS_ZONES.perfectFrom) return 'under';
  if (d <= DONENESS_ZONES.perfectTo) return 'perfect';
  return 'burnt';
}

function drawDonenessBar(ctx, x, y, w, d) {
  const Z = DONENESS_ZONES;
  const seg = (from, to, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x + (from / Z.max) * w, y, ((to - from) / Z.max) * w, 12);
  };
  ctx.fillStyle = 'rgba(20,12,6,0.9)';
  rr(ctx, x - 2, y - 2, w + 4, 16, 7); ctx.fill();
  seg(0, Z.perfectFrom, '#5B84AE');
  seg(Z.perfectFrom, Z.perfectTo, '#4E7A3A');
  seg(Z.perfectTo, Z.max, '#C22E1F');
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x, y, w, 4);
  // position marker: a brass needle with a white tip at the current d
  const mx = x + (Math.min(d, Z.max) / Z.max) * w;
  ctx.fillStyle = '#FBF7EE';
  ctx.beginPath(); ctx.moveTo(mx - 5, y - 6); ctx.lineTo(mx + 5, y - 6); ctx.lineTo(mx, y + 1); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#F2A007';
  ctx.fillRect(mx - 1.5, y - 1, 3, 14);
  // zone captions under the bar
  text(ctx, 'UNDER', x + (0.35 / Z.max) * w, y + 21, 8, '#BFD4EA', 'system-ui, sans-serif', 'center', '700');
  text(ctx, 'PERFECT', x + (0.925 / Z.max) * w, y + 21, 8, '#BFE3B0', 'system-ui, sans-serif', 'center', '700');
  text(ctx, 'BURNT', x + (1.375 / Z.max) * w, y + 21, 8, '#F3B1A6', 'system-ui, sans-serif', 'center', '700');
}

// A finished dish, drawn properly — each recipe gets its own plate, so a
// ready dish reads as food worth serving, not three ingredient dots.
export function drawDish(ctx, recipeId, x, y, w) {
  const u = w / 100; // unit scale: dish drawn in a 100x56 box
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(u, u);
  const plate = (rx, ry) => {
    ctx.fillStyle = 'rgba(43,26,12,0.25)';
    ctx.beginPath(); ctx.ellipse(0, 34, rx, ry * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.ceramic;
    ctx.beginPath(); ctx.ellipse(0, 28, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = PALETTE.saffron; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(0, 28, rx * 0.82, ry * 0.8, 0, 0, Math.PI * 2); ctx.stroke();
  };
  const herb = (hx, hy) => {
    ctx.fillStyle = PALETTE.herb;
    ctx.beginPath(); ctx.ellipse(hx, hy, 8, 3, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 6, hy + 3, 6, 2.4, 0.5, 0, Math.PI * 2); ctx.fill();
  };
  const soup = (liquid, chunks) => {
    // bowl: dark body, wide liquid surface with floating chunks
    ctx.fillStyle = '#3F4A55';
    ctx.beginPath(); ctx.moveTo(-42, 14); ctx.quadraticCurveTo(0, 52, 42, 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2B333B';
    ctx.fillRect(-44, 40, 88, 4);
    ctx.fillStyle = liquid;
    ctx.beginPath(); ctx.ellipse(0, 14, 42, 11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-12, 11, 14, 3.4, -0.15, 0, Math.PI * 2); ctx.fill();
    chunks.forEach(([cx, cy, c, r]) => {
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    });
    herb(16, 8);
  };
  const salad = (withRings) => {
    plate(46, 17);
    ctx.fillStyle = '#4E7A3A';
    for (let i = 0; i < 7; i += 1) {
      ctx.beginPath();
      ctx.ellipse(-24 + (i % 4) * 15, 16 + Math.floor(i / 4) * 10, 11, 6.5, -0.4 + (i % 3) * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#5E8F46';
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath(); ctx.ellipse(-16 + i * 11, 13 + (i % 2) * 7, 8, 4.6, 0.3, 0, Math.PI * 2); ctx.fill();
    }
    // tomato halves + cheese shavings on top
    ctx.fillStyle = '#D64533';
    ctx.beginPath(); ctx.arc(-10, 20, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(13, 24, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F08A75';
    ctx.beginPath(); ctx.arc(-10, 20, 3.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(13, 24, 3.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F7DC6B';
    for (let i = 0; i < 6; i += 1) {
      ctx.save(); ctx.translate(-18 + i * 7, 10 + (i % 2) * 12); ctx.rotate(i * 0.7);
      ctx.fillRect(-3.4, -1.1, 6.8, 2.2); ctx.restore();
    }
    if (withRings) {
      ctx.strokeStyle = '#E8DCC8'; ctx.lineWidth = 2.4;
      [[-22, 26], [22, 15], [2, 28]].forEach(([cx, cy]) => {
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.stroke();
      });
    }
    herb(24, 8);
  };
  const fishPlate = () => {
    plate(46, 17);
    const g = ctx.createLinearGradient(0, 4, 0, 34);
    g.addColorStop(0, '#A9C6DE'); g.addColorStop(0.55, '#7FA8C9'); g.addColorStop(1, '#5B84AE');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(-2, 22, 30, 10.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-31, 22); ctx.lineTo(-42, 13); ctx.lineTo(-42, 31); ctx.closePath(); ctx.fill();
    // char marks from the grate
    ctx.strokeStyle = 'rgba(43,26,12,0.75)'; ctx.lineWidth = 2.6;
    [-14, -2, 10].forEach((lx) => {
      ctx.beginPath(); ctx.moveTo(lx - 3, 14); ctx.lineTo(lx + 3, 30); ctx.stroke();
    });
    ctx.fillStyle = '#2B2118';
    ctx.beginPath(); ctx.arc(18, 19, 2.2, 0, Math.PI * 2); ctx.fill();
    // lemon wedge
    ctx.fillStyle = '#F2C230';
    ctx.beginPath(); ctx.moveTo(28, 30); ctx.arc(28, 30, 8, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#C98A1B'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(28, 30); ctx.lineTo(28, 23); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, 30); ctx.lineTo(22, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(28, 30); ctx.lineTo(34, 26); ctx.stroke();
    herb(-30, 8);
  };
  const sandwich = (fish) => {
    plate(46, 17);
    // bottom bread, filling, lettuce fringe, tilted top bread — strata show
    ctx.fillStyle = '#C89B5A';
    rr(ctx, -30, 26, 60, 10, 5); ctx.fill();
    ctx.fillStyle = fish ? '#7FA8C9' : '#F2A007';
    rr(ctx, -28, 21, 56, 7, 3); ctx.fill();
    ctx.fillStyle = '#4E7A3A';
    for (let i = 0; i < 6; i += 1) {
      ctx.beginPath(); ctx.arc(-24 + i * 10, 21, 4.4, 0, Math.PI); ctx.fill();
    }
    ctx.save(); ctx.translate(0, 8); ctx.rotate(-0.07);
    ctx.fillStyle = '#DCA95E';
    rr(ctx, -30, 0, 60, 13, 6); ctx.fill();
    ctx.fillStyle = '#B9852F';
    [-16, 0, 16].forEach((sx) => { ctx.beginPath(); ctx.ellipse(sx, 4, 4.6, 1.7, 0.4, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
    herb(30, 6);
  };

  if (recipeId === 'tomato-soup') soup('#E8542F', [[-18, 13, '#D64533', 4.4], [4, 16, '#D64533', 3.8], [20, 12, '#E8DCC8', 3.4], [-4, 10, '#E8DCC8', 2.8]]);
  else if (recipeId === 'fish-soup') soup('#D9A441', [[-16, 14, '#7FA8C9', 4.6], [10, 11, '#D64533', 3.6], [22, 15, '#E8DCC8', 3]]);
  else if (recipeId === 'onion-soup') soup('#C98A4B', [[-14, 12, '#E8DCC8', 3.6], [8, 15, '#E8DCC8', 3], [20, 11, '#F2C230', 3.4]]);
  else if (recipeId === 'harvest-soup') soup('#D2691E', [[-18, 14, '#D64533', 4], [6, 11, '#4E7A3A', 3.6], [20, 14, '#7FA8C9', 4]]);
  else if (recipeId === 'green-salad') salad(false);
  else if (recipeId === 'garden-plate') salad(true);
  else if (recipeId === 'grilled-fish' || recipeId === 'seared-fish') fishPlate();
  else if (recipeId === 'cheese-sandwich') sandwich(false);
  else if (recipeId === 'fish-sandwich') sandwich(true);
  else if (recipeId === 'bruschetta') {
    plate(46, 17);
    // Two distinct toasts: dark crust rim, pale crumb, tomato dice and
    // basil on top — separate slices, not one merged oval.
    [-1, 1].forEach((side) => {
      ctx.save(); ctx.translate(side * 19, 21); ctx.rotate(side * 0.14);
      ctx.fillStyle = '#A96F27'; rr(ctx, -17, -8, 34, 16, 7); ctx.fill();
      ctx.fillStyle = '#EBC07C'; rr(ctx, -14.5, -5.5, 29, 11, 5); ctx.fill();
      ctx.fillStyle = '#D64533';
      [[-9, -3], [-1, -4.5], [7, -3], [-5, 1.5], [4, 1.5]].forEach(([cx, cy]) => {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(cx * 0.3);
        ctx.fillRect(-3, -3, 6, 6); ctx.restore();
      });
      ctx.fillStyle = '#4E7A3A';
      ctx.beginPath(); ctx.ellipse(0, -6.5, 4.6, 2.2, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
  } else if (recipeId === 'tomato-bake') {
    ctx.fillStyle = '#8A4A2B';
    ctx.beginPath(); ctx.ellipse(0, 26, 44, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F2A007';
    ctx.beginPath(); ctx.ellipse(0, 23, 40, 13.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#E8542F';
    ctx.beginPath(); ctx.arc(-14, 21, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(12, 25, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F08A75';
    ctx.beginPath(); ctx.arc(-14, 21, 3.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(12, 25, 3.4, 0, Math.PI * 2); ctx.fill();
    herb(24, 12);
  } else {
    plate(46, 17);
  }
  ctx.restore();
}

function stationFrame(ctx, st, highlight, label) {
  // soft drop shadow under the whole counter block
  ctx.fillStyle = 'rgba(43,26,12,0.38)';
  rr(ctx, st.x + 5, st.y + 8, st.w, st.h, 12); ctx.fill();
  // counter body: vertical wood gradient, never a flat card
  const g = ctx.createLinearGradient(0, st.y, 0, st.y + st.h);
  g.addColorStop(0, highlight ? '#7A4E26' : '#68452A');
  g.addColorStop(0.45, PALETTE.wood);
  g.addColorStop(1, '#462B15');
  ctx.fillStyle = g;
  rr(ctx, st.x, st.y, st.w, st.h, 10); ctx.fill();
  // wood grain: wavy darker streaks across the body
  ctx.strokeStyle = 'rgba(30,18,8,0.28)';
  ctx.lineWidth = 1.4;
  [0.3, 0.55, 0.8].forEach((fy, gi) => {
    ctx.beginPath();
    for (let px = 0; px <= st.w; px += 16) {
      const py = st.y + st.h * fy + Math.sin(px / 34 + gi * 2.2) * 2;
      if (px === 0) ctx.moveTo(st.x + px, py); else ctx.lineTo(st.x + px, py);
    }
    ctx.stroke();
  });
  // inner work surface, lit from above
  const ig = ctx.createLinearGradient(0, st.y + 24, 0, st.y + st.h - 6);
  ig.addColorStop(0, '#835C33');
  ig.addColorStop(1, '#6B4423');
  ctx.fillStyle = ig;
  rr(ctx, st.x + 6, st.y + 24, st.w - 12, st.h - 30, 8); ctx.fill();
  // 3D edge: bright top lip, dark bottom lip
  ctx.fillStyle = 'rgba(255,232,185,0.55)';
  ctx.fillRect(st.x + 9, st.y + 2, st.w - 18, 3);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(st.x + 9, st.y + st.h - 5, st.w - 18, 3);
  // brass name plaque, centred at the top
  const pw = label.length * 8.4 + 22;
  const px = st.x + st.w / 2 - pw / 2;
  ctx.fillStyle = 'rgba(43,26,12,0.4)';
  rr(ctx, px + 1.5, st.y + 6.5, pw, 17, 8); ctx.fill();
  const bg = ctx.createLinearGradient(0, st.y + 4, 0, st.y + 21);
  bg.addColorStop(0, '#EBC063'); bg.addColorStop(1, '#C2922F');
  ctx.fillStyle = bg;
  rr(ctx, px, st.y + 4, pw, 17, 8); ctx.fill();
  text(ctx, label, st.x + st.w / 2, st.y + 12.5, 11.5, '#3A2A12', 'system-ui, sans-serif', 'center', '800');
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = FIELD.width;
  canvas.height = FIELD.height;

  function drawChef(s, t) {
    const c = s.chef;
    const bob = s.screen === 'play' ? Math.sin(t / 180) * 1.5 : 0;
    ctx.save();
    ctx.translate(c.x, c.y + bob);
    // Scale 1.4: the chef is a character, not a token — big enough for a
    // face, a neckerchief and the carried ingredient to read at a glance.
    ctx.scale(1.4, 1.4);
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(0, 25, 24, 6.5, 0, 0, Math.PI * 2); ctx.fill();
    // coat body with shaded sides + two buttons
    const cg = ctx.createLinearGradient(-15, 0, 15, 0);
    cg.addColorStop(0, '#E9E0CC'); cg.addColorStop(0.5, '#FBF7EE'); cg.addColorStop(1, '#E9E0CC');
    ctx.fillStyle = cg;
    rr(ctx, -14, -8, 28, 31, 8); ctx.fill();
    ctx.fillStyle = '#2B2118';
    ctx.beginPath(); ctx.arc(-3.5, 2, 1.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3.5, 2, 1.3, 0, Math.PI * 2); ctx.fill();
    // saffron apron with a pocket line
    ctx.fillStyle = PALETTE.saffron;
    rr(ctx, -11, 6, 22, 17, 5); ctx.fill();
    ctx.strokeStyle = '#C77F06'; ctx.lineWidth = 1.2;
    rr(ctx, -6, 12, 12, 7, 2); ctx.stroke();
    // arms: sleeves angled out, hands as skin dots
    ctx.fillStyle = '#F1EAD8';
    rr(ctx, -19, -6, 6, 16, 3); ctx.fill();
    rr(ctx, 13, -6, 6, 16, 3); ctx.fill();
    ctx.fillStyle = '#E8B48A';
    ctx.beginPath(); ctx.arc(-16, 12, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, 12, 3, 0, Math.PI * 2); ctx.fill();
    // head: face with eyes, brows, smile and blush
    ctx.fillStyle = '#EFC09A';
    ctx.beginPath(); ctx.arc(0, -17, 11.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2B2118';
    ctx.beginPath(); ctx.arc(-4.2, -18, 1.7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4.2, -18, 1.7, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#2B2118'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(-6, -22.5); ctx.lineTo(-2.4, -22.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(2.4, -22.5); ctx.lineTo(6, -22.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -13.5, 3.6, 0.25, Math.PI - 0.25); ctx.stroke();
    ctx.fillStyle = 'rgba(214,69,51,0.35)';
    ctx.beginPath(); ctx.arc(-7.6, -13.8, 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7.6, -13.8, 2.4, 0, Math.PI * 2); ctx.fill();
    // neckerchief triangle under the chin
    ctx.fillStyle = '#D64533';
    ctx.beginPath(); ctx.moveTo(-6, -7.5); ctx.lineTo(6, -7.5); ctx.lineTo(0, -1.5); ctx.closePath(); ctx.fill();
    // tall hat: shaded puff + saffron band
    ctx.fillStyle = '#FBF7EE';
    rr(ctx, -12.5, -36, 25, 10, 5); ctx.fill();
    ctx.beginPath(); ctx.arc(-6, -33, 6.5, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -35.5, 7.5, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -33, 6.5, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(180,160,130,0.5)';
    ctx.beginPath(); ctx.arc(7.5, -30, 4.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.saffron;
    ctx.fillRect(-12.5, -27.5, 25, 3.4);
    // carried item on a small plate above the hat — big and clear
    if (s.carry) {
      ctx.fillStyle = 'rgba(251,247,238,0.97)';
      ctx.beginPath(); ctx.arc(0, -52, 14.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = PALETTE.brass; ctx.lineWidth = 2; ctx.stroke();
      ctx.strokeStyle = PALETTE.saffron; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, -52, 10.5, 0, Math.PI * 2); ctx.stroke();
      drawIngredient(ctx, s.carry.ing, 0, -52, 19, null);
      if (s.carry.quality === 'perfect') {
        text(ctx, '★', 13, -62, 11, '#4E7A3A', 'system-ui, sans-serif', 'center', '800');
      } else if (s.carry.quality === 'burnt') {
        text(ctx, '✕', 13, -62, 11, '#D64533', 'system-ui, sans-serif', 'center', '800');
      }
    }
    ctx.restore();
  }

  function drawPantry(s) {
    const st = STATIONS[0];
    stationFrame(ctx, st, s.hoverStation === 'pantry', 'PANTRY');
    // Back shelf of jars on a thin rail under the plaque — no empty
    // surfaces (reference rule: density). Jars vary in height and fill.
    ctx.fillStyle = '#462B15';
    ctx.fillRect(st.x + 14, st.y + 40, st.w - 28, 3);
    const jarColors = ['#D64533', '#4E7A3A', '#F2C230', '#7FA8C9', '#C89B5A'];
    jarColors.forEach((c, i) => {
      const jx = st.x + 36 + i * 52;
      const jh = 11 + (i % 3) * 2;
      const jt = st.y + 40 - jh;
      ctx.fillStyle = c;
      rr(ctx, jx - 9, jt, 18, jh, 3); ctx.fill();
      ctx.fillStyle = PALETTE.wood;
      ctx.fillRect(jx - 7, jt - 3.5, 14, 4);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(jx - 6, jt + 2, 3, jh - 4);
    });
    INGREDIENTS.forEach((ing, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = st.x + 48 + col * 92;
      const y = st.y + 52 + row * 56;
      // crate cell with its own shadow, then the ingredient big, with a
      // soft shadow pooled under it and its name below.
      ctx.fillStyle = 'rgba(43,26,12,0.35)';
      rr(ctx, x - 33, y - 22, 68, 52, 8); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      rr(ctx, x - 34, y - 26, 68, 52, 8); ctx.fill();
      ctx.fillStyle = 'rgba(43,26,12,0.3)';
      ctx.beginPath(); ctx.ellipse(x, y + 12, 17, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      drawIngredient(ctx, ing.id, x, y - 4, 37, ing.name);
      text(ctx, ing.key, x + 27, y - 21, 11, PALETTE.brass, 'system-ui, sans-serif', 'center', '700');
    });
  }

  function drawChopping(s, t) {
    const st = STATIONS[1];
    stationFrame(ctx, st, s.hoverStation === 'chopping', 'CHOPPING');
    // Oil bottle + salt pot on the back edge — no empty counter.
    ctx.fillStyle = '#4E7A3A';
    rr(ctx, st.x + 16, st.y + 26, 14, 22, 4); ctx.fill();
    ctx.fillStyle = '#2F5223';
    ctx.fillRect(st.x + 20, st.y + 20, 6, 7);
    ctx.fillStyle = '#FBF7EE';
    ctx.beginPath(); ctx.arc(st.x + st.w - 30, st.y + 36, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#D9A441';
    ctx.fillRect(st.x + st.w - 36, st.y + 22, 12, 5);
    // board
    ctx.fillStyle = '#E8DCC8';
    rr(ctx, st.x + 22, st.y + 52, st.w - 44, 62, 8); ctx.fill();
    ctx.strokeStyle = '#B9A888'; ctx.lineWidth = 2;
    rr(ctx, st.x + 22, st.y + 52, st.w - 44, 62, 8); ctx.stroke();
    const p = s.processing && s.processing.station === 'chopping' ? s.processing : null;
    if (p) {
      const cx = st.x + st.w / 2;
      drawIngredient(ctx, p.item.ing, cx - 30, st.y + 84, 38, null);
      // knife, animated chop
      const ky = st.y + 58 + Math.sin(t / 90) * 6;
      ctx.fillStyle = '#9AA7B0';
      ctx.fillRect(cx + 18, ky, 34, 6);
      ctx.fillStyle = '#2B2118';
      ctx.fillRect(cx + 48, ky - 2, 12, 10);
      drawProgress(ctx, st.x + 30, st.y + 122, st.w - 60, p.progress, PALETTE.saffron);
      text(ctx, 'CHOPPING…', cx, st.y + 140, 11, PALETTE.cream, 'system-ui, sans-serif', 'center', '700');
    } else {
      // Idle board shows tools, not instruction text: a knife and a tomato half.
      ctx.fillStyle = '#9AA7B0';
      ctx.fillRect(st.x + 52, st.y + 66, 52, 7);
      ctx.fillStyle = '#2B2118';
      ctx.fillRect(st.x + 100, st.y + 63, 16, 13);
      drawIngredient(ctx, 'tomato', st.x + st.w - 58, st.y + 84, 34, null);
      // a cut face beside it: pale flesh with seed dots
      ctx.fillStyle = '#F08A75';
      ctx.beginPath(); ctx.arc(st.x + st.w - 30, st.y + 92, 7.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F6C1B2';
      ctx.beginPath(); ctx.arc(st.x + st.w - 32, st.y + 90, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(st.x + st.w - 27, st.y + 94, 1.6, 0, Math.PI * 2); ctx.fill();
      text(ctx, 'Board ready — bring food to chop', st.x + st.w / 2, st.y + 140, 10.5, '#D8C9AE', 'system-ui, sans-serif', 'center');
    }
  }

  function drawStove(s, t) {
    const st = STATIONS[2];
    stationFrame(ctx, st, s.hoverStation === 'stove', 'STOVE');
    ctx.fillStyle = PALETTE.grill;
    rr(ctx, st.x + 18, st.y + 40, st.w - 36, 74, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    rr(ctx, st.x + 18, st.y + 40, st.w - 36, 10, 5); ctx.fill();
    // burners
    ctx.fillStyle = '#1B1B1B';
    ctx.beginPath(); ctx.arc(st.x + 74, st.y + 78, 27, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(st.x + st.w - 66, st.y + 78, 27, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(st.x + 74, st.y + 78, 19, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(st.x + st.w - 66, st.y + 78, 19, 0, Math.PI * 2); ctx.stroke();
    const p = s.processing && s.processing.station === 'stove' ? s.processing : null;
    const potX = st.x + 74;
    const potY = st.y + 78;
    const cooking = p || s.potSimmer;
    if (cooking) {
      // Flames licking the pot — a sign of life under it.
      ctx.fillStyle = '#E8542F';
      for (let i = 0; i < 3; i += 1) {
        const fx = potX - 26 + i * 26;
        const fh = 10 + Math.sin(t / 150 + i) * 3;
        ctx.beginPath(); ctx.moveTo(fx - 6, potY + 22); ctx.lineTo(fx, potY + 22 - fh); ctx.lineTo(fx + 6, potY + 22); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = '#F2A007';
      ctx.beginPath(); ctx.moveTo(potX - 5, potY + 20); ctx.lineTo(potX, potY + 10); ctx.lineTo(potX + 5, potY + 20); ctx.closePath(); ctx.fill();
    }
    // The pot, big: gradient steel body, and when cooking, an open rim
    // showing the soup itself — liquid, floating chunks, bubbles, steam.
    const pg = ctx.createLinearGradient(potX - 48, 0, potX + 48, 0);
    pg.addColorStop(0, '#2E3841'); pg.addColorStop(0.5, '#55626E'); pg.addColorStop(1, '#2E3841');
    ctx.fillStyle = pg;
    rr(ctx, potX - 48, potY - 16, 96, 38, 7); ctx.fill();
    ctx.fillStyle = PALETTE.steel;
    ctx.fillRect(potX - 58, potY - 8, 10, 5);
    ctx.fillRect(potX + 48, potY - 8, 10, 5);
    if (cooking) {
      const item = p ? p.item.ing : 'tomato';
      const liquid = item === 'fish' ? '#D9A441' : item === 'onion' ? '#C98A4B' : '#E8542F';
      ctx.fillStyle = '#232B32';
      ctx.beginPath(); ctx.ellipse(potX, potY - 16, 48, 11, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = liquid;
      ctx.beginPath(); ctx.ellipse(potX, potY - 16, 44, 9.5, 0, 0, Math.PI * 2); ctx.fill();
      // floating chunks of the ingredient + rising bubbles
      drawIngredient(ctx, item, potX - 20, potY - 17, 15, null);
      drawIngredient(ctx, item, potX + 16, potY - 14, 12, null);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 3; i += 1) {
        const bx = potX - 8 + i * 11;
        const by = potY - 19 + Math.sin(t / 260 + i * 1.7) * 1.6;
        ctx.beginPath(); ctx.arc(bx, by, 2.1, 0, Math.PI * 2); ctx.fill();
      }
      drawSteam(ctx, potX, potY - 30, t);
    } else {
      // Idle: the lid sits on the pot, knob up.
      ctx.fillStyle = PALETTE.steel;
      ctx.beginPath(); ctx.ellipse(potX, potY - 16, 48, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#78858F';
      ctx.beginPath(); ctx.ellipse(potX, potY - 18, 40, 7.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = PALETTE.brass;
      ctx.beginPath(); ctx.arc(potX, potY - 24, 4.5, 0, Math.PI * 2); ctx.fill();
    }
    // Right burner: a frying pan with a tomato slice waiting.
    ctx.fillStyle = '#2E2A26';
    ctx.beginPath(); ctx.arc(st.x + st.w - 66, st.y + 78, 21, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#5A5A5A';
    ctx.fillRect(st.x + st.w - 48, st.y + 75, 28, 5);
    drawIngredient(ctx, 'tomato', st.x + st.w - 66, st.y + 76, 20, null);
    if (p) {
      const d = p.elapsed / p.total;
      drawDonenessBar(ctx, st.x + 30, st.y + 118, st.w - 60, d);
      drawZonePill(ctx, st.x + st.w / 2, st.y + 49, donenessZone(d));
    } else {
      text(ctx, 'Take food off in the green PERFECT window', st.x + st.w / 2, st.y + 130, 10.5, '#C9BBA6', 'system-ui, sans-serif', 'center');
    }
    // brass knobs
    ctx.fillStyle = PALETTE.brass;
    ctx.beginPath(); ctx.arc(st.x + 46, st.y + 106, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(st.x + 64, st.y + 106, 4.5, 0, Math.PI * 2); ctx.fill();
  }

  function drawGrill(s, t) {
    const st = STATIONS[3];
    stationFrame(ctx, st, s.hoverStation === 'grill', 'GRILL');
    ctx.fillStyle = '#1B1B1B';
    rr(ctx, st.x + 16, st.y + 40, st.w - 32, 72, 8); ctx.fill();
    // glowing coals under the grate when something is on it
    const p = s.processing && s.processing.station === 'grill' ? s.processing : null;
    if (p) {
      ctx.fillStyle = 'rgba(232,84,47,0.5)';
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath(); ctx.arc(st.x + 34 + i * 23, st.y + 100, 5 + Math.sin(t / 300 + i) * 1.4, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.strokeStyle = '#5A5A5A'; ctx.lineWidth = 3;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath(); ctx.moveTo(st.x + 24, st.y + 52 + i * 12); ctx.lineTo(st.x + st.w - 24, st.y + 52 + i * 12); ctx.stroke();
    }
    if (p) {
      // The item, big on the grate, with char stripes searing in as it
      // cooks — the longer it sits, the darker the marks.
      const d = p.elapsed / p.total;
      drawIngredient(ctx, p.item.ing, st.x + st.w / 2, st.y + 76, 54, null);
      ctx.strokeStyle = `rgba(43,26,12,${0.25 + Math.min(0.55, d * 0.5)})`;
      ctx.lineWidth = 3;
      [-16, 0, 16].forEach((off) => {
        ctx.beginPath(); ctx.moveTo(st.x + st.w / 2 + off - 4, st.y + 64); ctx.lineTo(st.x + st.w / 2 + off + 4, st.y + 88); ctx.stroke();
      });
      drawSteam(ctx, st.x + st.w / 2, st.y + 48, t);
      drawDonenessBar(ctx, st.x + 24, st.y + 118, st.w - 48, d);
      drawZonePill(ctx, st.x + st.w / 2, st.y + 49, donenessZone(d));
    } else {
      // Idle grill: a raw fish waits on the grate, tongs beside it.
      drawIngredient(ctx, 'fish', st.x + st.w / 2 - 12, st.y + 76, 46, null);
      ctx.strokeStyle = '#9AA7B0'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(st.x + st.w - 34, st.y + 56); ctx.lineTo(st.x + st.w - 22, st.y + 92); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(st.x + st.w - 26, st.y + 56); ctx.lineTo(st.x + st.w - 14, st.y + 92); ctx.stroke();
      text(ctx, 'Hot grate — fish & bread', st.x + st.w / 2, st.y + 132, 11, PALETTE.cream, 'system-ui, sans-serif', 'center', '700');
    }
  }

  function drawPlating(s) {
    const st = STATIONS[4];
    stationFrame(ctx, st, s.hoverStation === 'plating', 'PLATING');
    const cx = st.x + st.w / 2;
    const cy = st.y + 84;
    if (s.readyRecipe) {
      // A finished dish is drawn as the dish itself — soup bowl, layered
      // sandwich, grilled fish with lemon — not as ingredient dots.
      drawDish(ctx, s.readyRecipe.id, cx, cy - 26, 118);
      // With a route, the name + route alone fits the pill; without one,
      // the READY prefix fits instead.
      const label = s.readyRoute
        ? s.readyRecipe.name.toUpperCase() + ' · ' + s.readyRoute.toUpperCase()
        : 'READY: ' + s.readyRecipe.name.toUpperCase();
      ctx.fillStyle = PALETTE.saffron;
      rr(ctx, cx - 68, st.y + 120, 136, 22, 11); ctx.fill();
      text(ctx, label, cx, st.y + 131, label.length > 26 ? 9 : 10, '#2B2118', 'system-ui, sans-serif', 'center', '800');
      return;
    }
    // Mid-assembly: the plate with the items piled on it so far, each
    // with a pooled shadow, middle one raised — layers building up.
    ctx.fillStyle = 'rgba(43,26,12,0.3)';
    ctx.beginPath(); ctx.ellipse(cx, cy + 16, 66, 12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = PALETTE.ceramic;
    ctx.beginPath(); ctx.ellipse(cx, cy, 64, 36, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = PALETTE.saffron; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(cx, cy, 54, 30, 0, 0, Math.PI * 2); ctx.stroke();
    const spots = [[cx - 29, cy + 5], [cx, cy - 11], [cx + 29, cy + 5]];
    s.plateItems.forEach((item, i) => {
      ctx.fillStyle = 'rgba(43,26,12,0.22)';
      ctx.beginPath(); ctx.ellipse(spots[i][0], spots[i][1] + 9, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      drawIngredient(ctx, item.ing, spots[i][0], spots[i][1], 34, null);
      if (item.quality === 'perfect') {
        text(ctx, '★', spots[i][0] + 13, spots[i][1] - 13, 12, '#4E7A3A', 'system-ui, sans-serif', 'center', '800');
      }
    });
    text(ctx, s.plateItems.length + ' / 3 on the plate', cx, st.y + 131, 11, PALETTE.cream, 'system-ui, sans-serif', 'center', '600');
  }

  function drawServe(s) {
    const st = STATIONS[5];
    stationFrame(ctx, st, s.hoverStation === 'serve', 'SERVE');
    ctx.fillStyle = '#2B2118';
    rr(ctx, st.x + 8, st.y + 44, st.w - 16, 56, 6); ctx.fill();
    ctx.fillStyle = PALETTE.brass;
    ctx.beginPath(); ctx.arc(st.x + st.w / 2, st.y + 66, 12, Math.PI, 0); ctx.fill();
    ctx.fillRect(st.x + st.w / 2 - 2, st.y + 66, 4, 8);
    text(ctx, 'RING', st.x + st.w / 2, st.y + 92, 10, PALETTE.cream, 'system-ui, sans-serif', 'center', '700');
    text(ctx, 'TO', st.x + st.w / 2, st.y + 106, 10, PALETTE.cream, 'system-ui, sans-serif', 'center', '700');
    text(ctx, 'SERVE', st.x + st.w / 2, st.y + 120, 10, PALETTE.cream, 'system-ui, sans-serif', 'center', '700');
    if (s.readyRecipe) {
      ctx.fillStyle = PALETTE.saffron;
      ctx.beginPath(); ctx.arc(st.x + st.w - 12, st.y + 14, 8, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawWallDecor() {
    // String lights along the top edge — warm glow, Kokoro Kitchen style.
    ctx.fillStyle = '#7A5230';
    ctx.fillRect(0, 4, FIELD.width, 2);
    const bulbColors = ['#F2A007', '#FFD27A', '#F2A007', '#FF8A5C'];
    for (let x = 30; x < FIELD.width; x += 42) {
      ctx.strokeStyle = '#7A5230'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x, 5); ctx.lineTo(x, 12); ctx.stroke();
      ctx.fillStyle = bulbColors[(x / 42) % 4 | 0];
      ctx.beginPath(); ctx.arc(x, 16, 4, 0, Math.PI * 2); ctx.fill();
    }
    // Range hood over the stove — big brass hood, pixel-kitchen rule.
    ctx.fillStyle = PALETTE.brass;
    ctx.beginPath(); ctx.moveTo(596, 66); ctx.lineTo(624, 26); ctx.lineTo(756, 26); ctx.lineTo(784, 66); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#B9852F';
    ctx.fillRect(636, 26, 108, 8);
    ctx.fillStyle = '#8A5A28';
    for (let i = 0; i < 5; i += 1) ctx.fillRect(650 + i * 18, 44, 8, 14);
    // Hanging rail, right wall: ladles, pan, chilli + garlic strings.
    ctx.fillStyle = '#2B2118';
    ctx.fillRect(836, 40, 420, 4);
    const hangX = [860, 900, 940];
    hangX.forEach((hx, i) => {
      ctx.strokeStyle = '#2B2118'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(hx, 44); ctx.lineTo(hx, 58); ctx.stroke();
      ctx.fillStyle = i === 2 ? '#3F4A55' : PALETTE.steel;
      ctx.beginPath(); ctx.arc(hx, 64, i === 2 ? 11 : 7, 0, Math.PI * 2); ctx.fill();
    });
    // chilli string
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = '#C22E1F';
      ctx.beginPath(); ctx.ellipse(1000, 52 + i * 5, 4, 6, 0.3, 0, Math.PI * 2); ctx.fill();
    }
    // garlic string
    for (let i = 0; i < 3; i += 1) {
      ctx.fillStyle = '#F1EAD8';
      ctx.beginPath(); ctx.arc(1040, 52 + i * 6, 5, 0, Math.PI * 2); ctx.fill();
    }
    // Herb pots on the wall between window and hood: terracotta + tufts.
    [508, 548].forEach((hx, i) => {
      ctx.fillStyle = '#B85C33';
      ctx.beginPath(); ctx.moveTo(hx - 9, 44); ctx.lineTo(hx + 9, 44); ctx.lineTo(hx + 6, 58); ctx.lineTo(hx - 6, 58); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#4E7A3A';
      for (let b = 0; b < 4; b += 1) {
        ctx.beginPath(); ctx.ellipse(hx - 6 + b * 4, 40 - (b % 2) * 3, 3.4, 6.5, -0.4 + b * 0.25, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#8A4A2B';
      ctx.fillRect(hx - 10, 42, 20, 3);
      void i;
    });
    // Pendant lamps over stove, grill and plating: cord, brass shade,
    // warm bulb. Their light pools are painted in draw().
    [680, 910, 1090].forEach((lx) => {
      ctx.strokeStyle = '#3A2A1A'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, 20); ctx.stroke();
      const sg = ctx.createLinearGradient(lx - 22, 20, lx + 22, 20);
      sg.addColorStop(0, '#8A5A28'); sg.addColorStop(0.5, '#D9A441'); sg.addColorStop(1, '#8A5A28');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.moveTo(lx - 6, 20); ctx.lineTo(lx + 6, 20); ctx.lineTo(lx + 23, 40); ctx.lineTo(lx - 23, 40); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFD27A';
      ctx.beginPath(); ctx.arc(lx, 43, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,210,122,0.35)';
      ctx.beginPath(); ctx.arc(lx, 43, 10, 0, Math.PI * 2); ctx.fill();
    });
    // Window with evening light, left of the hood: sun + hills inside.
    ctx.save();
    rr(ctx, 330, 26, 150, 40, 8); ctx.clip();
    ctx.fillStyle = '#F2C879';
    ctx.fillRect(330, 26, 150, 40);
    ctx.fillStyle = '#F2A007';
    ctx.beginPath(); ctx.arc(450, 38, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7A9A4E';
    ctx.beginPath(); ctx.moveTo(330, 66); ctx.quadraticCurveTo(380, 44, 430, 66); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5E7F38';
    ctx.beginPath(); ctx.moveTo(400, 66); ctx.quadraticCurveTo(440, 50, 480, 66); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = PALETTE.woodEdge; ctx.lineWidth = 4;
    rr(ctx, 330, 26, 150, 40, 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(405, 26); ctx.lineTo(405, 66); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(330, 46); ctx.lineTo(480, 46); ctx.stroke();
  }

  function draw(s, t) {
    // wall: warm vertical gradient (lit from above) + a subtle tile grid
    const wg = ctx.createLinearGradient(0, 0, 0, 220);
    wg.addColorStop(0, '#F9EFCE');
    wg.addColorStop(0.55, PALETTE.wall);
    wg.addColorStop(1, '#EDD9AC');
    ctx.fillStyle = wg;
    ctx.fillRect(0, 0, FIELD.width, 220);
    ctx.strokeStyle = 'rgba(122,82,48,0.10)';
    ctx.lineWidth = 1;
    for (let tx = 0; tx <= FIELD.width; tx += 64) {
      ctx.beginPath(); ctx.moveTo(tx, 8); ctx.lineTo(tx, 216); ctx.stroke();
    }
    for (let ty = 44; ty <= 216; ty += 43) {
      ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(FIELD.width, ty); ctx.stroke();
    }
    ctx.fillStyle = PALETTE.wallTrim;
    ctx.fillRect(0, 216, FIELD.width, 6);
    text(ctx, 'SAFFRON LINE — EMBER KITCHEN', 24, 34, 15, PALETTE.ink, 'Georgia, serif', 'left', '700');
    drawWallDecor();
    // floor tiles
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 16; col += 1) {
        ctx.fillStyle = (row + col) % 2 === 0 ? PALETTE.floor : PALETTE.floorAlt;
        ctx.fillRect(col * 80, 222 + row * 39, 80, 39);
      }
    }
    // brass border where wall meets floor
    ctx.fillStyle = PALETTE.brass;
    ctx.fillRect(0, 220, FIELD.width, 3);
    // runner rug down the chef lane — the lane is a walkway, not empty tile.
    ctx.fillStyle = '#8A3B2E';
    ctx.fillRect(0, 228, FIELD.width, 22);
    ctx.fillStyle = PALETTE.brass;
    ctx.fillRect(0, 228, FIELD.width, 3);
    ctx.fillRect(0, 247, FIELD.width, 3);
    ctx.fillStyle = '#F2A007';
    for (let x = 60; x < FIELD.width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 239); ctx.lineTo(x + 8, 233); ctx.lineTo(x + 16, 239); ctx.lineTo(x + 8, 245);
      ctx.closePath(); ctx.fill();
    }

    drawPantry(s);
    drawChopping(s, t);
    drawStove(s, t);
    drawGrill(s, t);
    drawPlating(s);
    drawServe(s);

    // Warm light pools under the pendant lamps (stove, grill, plating):
    // soft amber ellipses pooled on the counters, brighter at the centre.
    [[680, 140, 170], [910, 140, 130], [1090, 140, 120]].forEach(([cx, cy, r]) => {
      const g = ctx.createRadialGradient(cx, cy, 8, cx, cy, r);
      g.addColorStop(0, 'rgba(255,196,64,0.20)');
      g.addColorStop(0.6, 'rgba(242,160,7,0.10)');
      g.addColorStop(1, 'rgba(242,160,7,0)');
      ctx.fillStyle = g;
      ctx.save();
      ctx.translate(cx, cy); ctx.scale(1, 0.62); ctx.translate(-cx, -cy);
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.restore();
    });

    // Low service pass along the bottom — a second counter row, so no
    // horizontal band of the frame is empty (iteration round 4).
    ctx.fillStyle = '#8A5A28';
    ctx.fillRect(0, 258, FIELD.width, 8);
    ctx.fillStyle = '#5A3A22';
    ctx.fillRect(0, 266, FIELD.width, 34);
    ctx.fillStyle = '#7A5230';
    for (let x = 0; x < FIELD.width; x += 160) ctx.fillRect(x, 266, 3, 34);
    ctx.fillStyle = PALETTE.brass;
    ctx.fillRect(0, 266, FIELD.width, 2);
    // drawer fronts with brass knobs — the pass reads as cabinetry, not a
    // flat brown band.
    for (let x = 0; x < FIELD.width; x += 160) {
      ctx.fillStyle = '#6B4423';
      rr(ctx, x + 14, 274, 132, 18, 4); ctx.fill();
      ctx.fillStyle = PALETTE.brass;
      ctx.beginPath(); ctx.arc(x + 80, 283, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    // items resting on the pass, left cluster: clean plates, bread, greens, towel
    ctx.fillStyle = PALETTE.ceramic;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath(); ctx.ellipse(64, 252 - i * 4, 17, 5, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#7A5230';
    rr(ctx, 176, 244, 52, 14, 4); ctx.fill();
    drawIngredient(ctx, 'bread', 190, 240, 20, null);
    drawIngredient(ctx, 'bread', 214, 238, 20, null);
    ctx.fillStyle = '#3F4A55';
    ctx.beginPath(); ctx.arc(330, 250, 16, 0, Math.PI); ctx.fill();
    drawIngredient(ctx, 'greens', 330, 240, 22, null);
    ctx.fillStyle = '#E8DCC8';
    rr(ctx, 380, 246, 26, 14, 3); ctx.fill();
    ctx.fillStyle = '#D64533';
    ctx.fillRect(380, 246, 26, 3);
    // items on the pass, right cluster: sauce bottles, tomato crate, cat
    ctx.fillStyle = '#4E7A3A';
    rr(ctx, 884, 234, 12, 24, 3); ctx.fill();
    ctx.fillStyle = '#D64533';
    rr(ctx, 902, 238, 12, 20, 3); ctx.fill();
    ctx.fillStyle = '#7A5230';
    rr(ctx, 952, 240, 64, 18, 4); ctx.fill();
    ctx.fillStyle = '#D64533';
    ctx.beginPath(); ctx.arc(968, 238, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(984, 236, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1000, 238, 7, 0, Math.PI * 2); ctx.fill();
    // sleeping cat on the pass, far right — a sign of life
    ctx.fillStyle = '#8A8A8A';
    ctx.beginPath(); ctx.ellipse(1230, 250, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(1246, 246, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1242, 240); ctx.lineTo(1244, 234); ctx.lineTo(1247, 240); ctx.closePath(); ctx.fill();
    text(ctx, 'z z', 1258, 240, 11, '#5A4A38', 'system-ui, sans-serif', 'left', '700');

    drawChef(s, t);

    // Served banner, pinned to the pass counter — never over the stations.
    if (s.servedBanner) {
      ctx.fillStyle = 'rgba(43,33,24,0.92)';
      rr(ctx, 430, 258, 420, 38, 12); ctx.fill();
      ctx.strokeStyle = PALETTE.brass; ctx.lineWidth = 3;
      rr(ctx, 430, 258, 420, 38, 12); ctx.stroke();
      text(ctx, s.servedBanner.text, 640, 272, 19, '#F2A007', 'Georgia, serif', 'center', '700');
      text(ctx, '★'.repeat(s.servedBanner.stars || 3), 640, 289, 13, '#F2A007', 'system-ui, sans-serif', 'center');
    }

    // Vignette: the frame edges fall off into warm shadow, the lit
    // centre of the kitchen holds the eye.
    const vg = ctx.createRadialGradient(640, 130, 320, 640, 150, 780);
    vg.addColorStop(0, 'rgba(59,36,18,0)');
    vg.addColorStop(1, 'rgba(59,36,18,0.20)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);

    // popups (score feedback)
    s.popups.forEach((p) => {
      const age = (s.timeMs - p.bornAt) / 1000;
      if (age > 1.4) return;
      ctx.globalAlpha = 1 - age / 1.4;
      text(ctx, p.text, p.x, p.y - age * 30, 16, p.color, 'system-ui, sans-serif', 'center', '800');
      ctx.globalAlpha = 1;
    });

    // No in-canvas message bar: the same message already shows in the DOM
    // footer (#hint), and the bar used to sit on top of the pass counter.
  }

  return { draw, drawIngredient };
}
