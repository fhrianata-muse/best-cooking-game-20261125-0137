// Mouse + keyboard input. Clicks map to stations and pantry ingredients.
import { STATIONS, INGREDIENTS } from './config.js';

export const ACTION_PAUSE = 'pause';
export const ACTION_RESTART = 'restart';
export const ACTION_MUTE = 'mute';
export const ACTION_INTERACT = 'interact';

function pantryIngredientAt(x, y) {
  const st = STATIONS[0];
  for (let i = 0; i < INGREDIENTS.length; i += 1) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = st.x + 48 + col * 92;
    const cy = st.y + 52 + row * 56;
    if (x >= cx - 34 && x <= cx + 34 && y >= cy - 26 && y <= cy + 26) return INGREDIENTS[i].id;
  }
  return null;
}

function stationAt(x, y) {
  for (const st of STATIONS) {
    if (x >= st.x && x <= st.x + st.w && y >= st.y && y <= st.y + st.h) return st.id;
  }
  return null;
}

export function createInput(canvas, hooks) {
  function canvasPoint(ev) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (ev.clientX - rect.left) * (canvas.width / rect.width),
      y: (ev.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onClick(ev) {
    const p = canvasPoint(ev);
    const ing = pantryIngredientAt(p.x, p.y);
    if (ing) { hooks.onIngredient(ing); return; }
    const st = stationAt(p.x, p.y);
    if (st) hooks.onStation(st);
  }

  function onMove(ev) {
    const p = canvasPoint(ev);
    const st = stationAt(p.x, p.y);
    hooks.onHover(st);
  }

  function onKey(ev) {
    const k = ev.key.toLowerCase();
    if (k === 'p' || k === 'escape') { hooks.onKey(ACTION_PAUSE); return; }
    if (k === 'r') { hooks.onKey(ACTION_RESTART); return; }
    if (k === 'm') { hooks.onKey(ACTION_MUTE); return; }
    if (k === 'e' || k === ' ') { ev.preventDefault(); hooks.onKey(ACTION_INTERACT); return; }
    const ing = INGREDIENTS.find((i) => i.key === k);
    if (ing) { hooks.onIngredient(ing.id); return; }
    const moves = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
    if (moves[k]) { ev.preventDefault(); hooks.onMove(moves[k][0], moves[k][1]); }
  }

  canvas.addEventListener('click', onClick);
  canvas.addEventListener('mousemove', onMove);
  window.addEventListener('keydown', onKey);

  return {
    stationAt,
    pantryIngredientAt,
  };
}
