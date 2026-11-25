// Saffron Line — game state machine and UI wiring.
// Boot and the one loop: input every frame, world in fixed steps,
// renderer paints what is there. Screens: title, play, paused, end.
import { FIELD, SHIFT_SECONDS, ORDER_EVERY, ORDER_LIFE, MAX_ORDERS, RUSHES, PROCESS_SECONDS, DONENESS, VIP, SCORING, CHEF_START, BEST_KEY, STATIONS, INGREDIENTS, RECIPES } from './config.js';
import { ingredientColor } from './render.js';
import { createRandom } from './random.js';
import { createOrder, spawnOrderIfDue, expiredOrders, matchingRecipe, matchRoute, recipeVariants, itemIsUseful, recipeById } from './recipes.js';
import { createAudio } from './audio.js';
import { createRenderer, ingredientName } from './render.js';
import { createInput, ACTION_PAUSE, ACTION_RESTART, ACTION_MUTE, ACTION_INTERACT } from './input.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seedParam = Number.parseInt(params.get('seed') ?? '', 10);
const seed = Number.isInteger(seedParam) ? seedParam : 7;

const canvas = document.getElementById('game');
const renderer = createRenderer(canvas);
const audio = createAudio();
const rng = createRandom(seed);

const el = {
  timer: document.getElementById('timer'),
  score: document.getElementById('score'),
  coins: document.getElementById('coins'),
  combo: document.getElementById('combo'),
  rush: document.getElementById('rush'),
  orders: document.getElementById('orders'),
  overlay: document.getElementById('overlay'),
  hint: document.getElementById('hint'),
  muteBtn: document.getElementById('mute-btn'),
  pauseBtn: document.getElementById('pause-btn'),
  restartBtn: document.getElementById('restart-btn'),
};

function freshState() {
  return {
    screen: 'title',
    frozen: false,
    timeMs: 0,
    timeLeft: SHIFT_SECONDS,
    elapsed: 0,
    score: 0,
    coins: 0,
    combo: 0,
    served: 0,
    orders: [],
    orderSeq: 0,
    orderEvery: ORDER_EVERY,
    orderLife: ORDER_LIFE,
    nextOrderAt: 0,
    plateItems: [],
    readyRecipe: null,
    readyRoute: null,
    carry: null,
    processing: null,
    potSimmer: false,
    chef: { x: CHEF_START.x, y: CHEF_START.y },
    chefTarget: null,
    popups: [],
    message: 'Welcome to Saffron Line — press Play, then pick an ingredient.',
    rushLabel: '',
    rushIndex: 0,
    hoverStation: null,
    servedBanner: null,
    stars: 0,
    lastTickSecond: -1,
  };
}

let state = freshState();

function readBest() {
  try { return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0; } catch (e) { return 0; }
}
function saveBest(v) {
  try { window.localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* private mode */ }
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}

function actionVerb(action) {
  return action === 'chop' ? 'chop' : action === 'stove' ? 'simmer' : action === 'grill' ? 'grill' : 'plate';
}

function renderOrders() {
  el.orders.innerHTML = state.orders.map((o) => {
    const left = Math.max(0, (o.expiresAt - state.timeMs) / 1000);
    const frac = Math.max(0, left / o.life);
    const steps = o.steps.map((s) => `${ingredientName(s.ing)} ${actionVerb(s.action)}`).join(' + ');
    // The badge is a drawn plate, not a letter: a ceramic disc with one
    // food mound per recipe step, coloured by that step's ingredient.
    const mounds = o.steps.map((s, i) => {
      const pos = ['left:6px;top:13px', 'left:14px;top:6px', 'left:22px;top:13px'][i % 3];
      return `<i style="${pos};background:${ingredientColor(s.ing)}"></i>`;
    }).join('');
    // Time bar runs green -> amber -> red as the ticket ages.
    const barColor = frac > 0.5 ? '#4E7A3A' : frac > 0.25 ? '#F2A007' : '#D64533';
    const recipe = recipeById(o.recipeId);
    const alt = recipe && recipe.altRoute
      ? `<div class="ticket-alt">alt route: ${recipe.altRoute} (+${SCORING.routeBonus})</div>` : '';
    const vipTag = o.vip ? '<span class="vip-tag">★ VIP ×3</span>' : '';
    return `<div class="ticket${o.vip ? ' vip' : ''}" id="order-${o.id}">
      <span class="dish-badge">${mounds}</span>
      <div class="ticket-name">${o.name}${vipTag}</div>
      <div class="ticket-steps">${steps}</div>
      ${alt}
      <div class="ticket-bar"><div class="ticket-fill" style="width:${Math.round(frac * 100)}%;background:${barColor}"></div></div>
      <div class="ticket-time">${Math.ceil(left)}s</div>
    </div>`;
  }).join('') || '<div class="ticket empty">No tickets — the next order is coming.</div>';
}

function renderHud() {
  el.timer.textContent = fmtTime(Math.max(0, state.timeLeft));
  // Urgency must read in a glance: red + pulsing from 60 s, not 30 s
  // (the rush shot's 00:47 timer read as calm before this change).
  el.timer.classList.toggle('danger', state.timeLeft <= 60 && state.screen === 'play');
  el.score.textContent = String(state.score);
  el.coins.textContent = String(state.coins);
  el.combo.textContent = state.combo > 1 ? 'x' + state.combo : '—';
  el.rush.textContent = state.rushLabel;
  el.rush.classList.toggle('on', state.rushLabel.length > 0);
  el.hint.textContent = state.message;
}

function popup(x, y, text, color) {
  state.popups.push({ x, y, text, color, bornAt: state.timeMs });
  if (state.popups.length > 6) state.popups.shift();
}

function addScore(n, x, y, label) {
  state.score = Math.max(0, state.score + n);
  if (n > 0) popup(x, y, (label ? label + ' ' : '') + '+' + n, '#F2A007');
  else if (n < 0) popup(x, y, String(n), '#D64533');
}

function showOverlay(html) {
  el.overlay.innerHTML = html;
  el.overlay.classList.remove('hidden');
}
function hideOverlay() {
  el.overlay.classList.add('hidden');
  el.overlay.innerHTML = '';
}

function showTitle() {
  state.screen = 'title';
  showOverlay(`<div class="panel" id="title-panel">
    <h1>Saffron Line</h1>
    <p class="tagline">12 recipes · 6 stations · 3 rushes · 1 kitchen</p>
    <p>Take ingredients from the pantry, chop on the board, simmer on the
    stove, grill on the grate, plate the dish, ring the bell to serve.
    Serve the ticket before its bar runs out.</p>
    <p>Watch the doneness bar on the stove and grill: take food off in the
    green PERFECT window for +50 — leave it and it burns. Most dishes have
    a second route (smokey, charred, pan-toasted) worth a bonus, and gold
    VIP tickets pay triple.</p>
    <p class="keys">Move WASD / arrows · 1–6 take ingredient · E / Space interact ·
    P pause · R restart · M mute</p>
    <button data-act="play" id="play-btn">Play — start the shift</button>
    <p class="best">Best shift: ${readBest()} points</p>
  </div>`);
}

function showPause() {
  state.screen = 'paused';
  showOverlay(`<div class="panel" id="pause-panel">
    <h1>Paused</h1><p>The kitchen waits. Orders do not — resume soon.</p>
    <button data-act="resume" id="resume-btn">Resume</button>
    <button data-act="restart" id="restart-btn2">Restart shift</button>
  </div>`);
}

function showEnd() {
  state.screen = 'end';
  const stars = state.score >= 2500 ? 3 : state.score >= 1200 ? 2 : 1;
  state.stars = stars;
  const best = Math.max(readBest(), state.score);
  saveBest(best);
  showOverlay(`<div class="panel" id="end-panel">
    <h1>Shift over</h1>
    <p class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</p>
    <p>Score <b>${state.score}</b> · Served <b>${state.served}</b> dishes ·
    Coins <b>${state.coins}</b> · Best <b>${best}</b></p>
    <button data-act="restart" id="again-btn">Play again</button>
  </div>`);
}

function startShift() {
  const keepBest = readBest();
  state = freshState();
  state.screen = 'play';
  state.timeMs = 0;
  state.nextOrderAt = 2000;
  hideOverlay();
  audio.unlock();
  // Two tickets on the board from the first second — the kitchen opens busy.
  state.orders.push(createOrder(rng, 1, ORDER_LIFE, 0));
  state.orders.push(createOrder(rng, 2, ORDER_LIFE, 0));
  state.orderSeq = 2;
  state.nextOrderAt = 14000;
  state.message = 'Pick an ingredient from the pantry (1–6 or click).';
  renderOrders();
  renderHud();
}

function nearestStation() {
  let best = null;
  let bestD = Infinity;
  for (const st of STATIONS) {
    const cx = st.x + st.w / 2;
    const cy = st.y + st.h / 2;
    const d = Math.hypot(state.chef.x - cx, state.chef.y - (cy + 90));
    if (d < bestD) { bestD = d; best = st; }
  }
  return best;
}

function chefGoTo(st) {
  // Chef walks low (y 252) so the hat stays below the station panels.
  state.chefTarget = { x: st.x + st.w / 2, y: 252 };
}

function takeIngredient(ingId) {
  if (state.screen !== 'play' || state.frozen) return;
  if (state.carry) { state.message = 'Hands full — process or plate what you carry first.'; return; }
  if (state.processing) { state.message = 'Wait for the station to finish.'; return; }
  state.carry = { ing: ingId, action: null };
  audio.pickup();
  chefGoTo(STATIONS[0]);
  state.message = `${ingredientName(ingId)} in hand — chop, simmer or grill it, then plate.`;
  renderHud();
}

function stationNeedsAction(stationId, ingId) {
  // Either route counts: an ingredient may reach a station through the
  // alternate route even when the main recipe never sends it there.
  return RECIPES.some((r) => recipeVariants(r).some((v) =>
    v.steps.some((s) => s.ing === ingId && s.action === stationId)));
}

function startProcessing(stationId) {
  const carry = state.carry;
  if (!carry || carry.action) {
    state.message = 'Bring a raw ingredient here first.';
    addScore(SCORING.wrongStep, state.chef.x, 200, '');
    audio.fail();
    return;
  }
  // Station ids and recipe actions differ at one place: the chopping
  // board's action is 'chop'. Map the station to its action first.
  const action = stationId === 'chopping' ? 'chop' : stationId;
  if (!stationNeedsAction(action, carry.ing)) {
    state.message = `${ingredientName(carry.ing)} never goes on the ${stationId} — try another station.`;
    addScore(SCORING.wrongStep, state.chef.x, 200, '');
    audio.fail();
    return;
  }
  state.processing = {
    station: stationId,
    item: { ing: carry.ing, action },
    progress: 0,
    total: PROCESS_SECONDS[action],
    elapsed: 0,
  };
  state.carry = null;
  if (stationId === 'stove') { audio.sizzle(); state.potSimmer = true; }
  else audio.chop();
  const st = STATIONS.find((s) => s.id === stationId);
  chefGoTo(st);
  state.message = action === 'chop'
    ? `${actionVerb(action)}ing ${ingredientName(state.processing.item.ing)}…`
    : `${actionVerb(action)}ing ${ingredientName(state.processing.item.ing)} — click the ${stationId} again in the green PERFECT window to take it off.`;
}

function finishProcessing() {
  const p = state.processing;
  state.processing = null;
  state.carry = p.item;
  state.potSimmer = false;
  addScore(SCORING.process, state.chef.x, 200, ingredientName(p.item.ing));
  audio.ding();
  const past = p.item.action === 'chop' ? 'chopped' : p.item.action === 'stove' ? 'simmered' : p.item.action === 'grill' ? 'grilled' : 'plated';
  state.message = `${ingredientName(p.item.ing)} ${past} — plate it or keep cooking.`;
}

// Doneness zone of the item now on the heat: 'under' | 'perfect' | 'burnt'.
function donenessOf(p) {
  const d = p.elapsed / p.total;
  if (d < DONENESS.perfectFrom) return 'under';
  if (d <= DONENESS.perfectTo) return 'perfect';
  return 'burnt';
}

// Clicking the stove/grill while it cooks takes the item off the heat.
// The zone at that moment is stamped on the item as its quality.
function takeCooked() {
  const p = state.processing;
  const zone = donenessOf(p);
  const item = { ing: p.item.ing, action: p.item.action, quality: zone };
  state.processing = null;
  state.potSimmer = false;
  state.carry = item;
  const st = STATIONS.find((s) => s.id === p.station);
  const cx = st ? st.x + st.w / 2 : state.chef.x;
  if (zone === 'perfect') {
    addScore(SCORING.process, cx, 200, ingredientName(item.ing));
    state.score += SCORING.perfectBonus;
    popup(cx, 120, `PERFECT! +${SCORING.perfectBonus}`, '#4E7A3A');
    state.message = `PERFECT ${ingredientName(item.ing)} — off the heat in the green window. Plate it!`;
    audio.ding();
  } else if (zone === 'under') {
    addScore(SCORING.process, cx, 200, ingredientName(item.ing));
    state.message = `${ingredientName(item.ing)} is underdone — it still plates, but no PERFECT bonus.`;
    audio.pickup();
  } else {
    state.message = `${ingredientName(item.ing)} is BURNT — plating it bins it (${SCORING.burntPlated}).`;
    popup(cx, 120, 'BURNT!', '#D64533');
    audio.fail();
  }
  renderHud();
}

function plateCarried() {
  const carry = state.carry;
  if (!carry) { state.message = 'Nothing to plate — bring a processed ingredient.'; return; }
  // A burnt item never reaches a plate: plating it bins it, at a cost.
  if (carry.quality === 'burnt') {
    addScore(SCORING.burntPlated, state.chef.x, 200, '');
    state.message = `The burnt ${ingredientName(carry.ing)} goes in the bin (${SCORING.burntPlated}). Watch the green window next time.`;
    state.carry = null;
    audio.fail();
    renderHud();
    return;
  }
  let item = null;
  if (carry.action) item = carry;
  else if (RECIPES.some((r) => r.steps.some((s) => s.ing === carry.ing && s.action === 'plate'))) {
    item = { ing: carry.ing, action: 'plate' };
  } else {
    state.message = `${ingredientName(carry.ing)} is raw — process it first (chop / simmer / grill).`;
    addScore(SCORING.wrongStep, state.chef.x, 200, '');
    audio.fail();
    return;
  }
  if (!itemIsUseful(state.plateItems, state.orders, item) && state.plateItems.length > 0) {
    state.message = 'That does not belong on this plate — check the tickets.';
    addScore(SCORING.wrongStep, state.chef.x, 200, '');
    audio.fail();
    return;
  }
  state.plateItems.push(item);
  state.carry = null;
  audio.pickup();
  chefGoTo(STATIONS[4]);
  const match = matchingRecipe(state.plateItems);
  state.readyRecipe = match;
  state.readyRoute = match ? matchRoute(state.plateItems) : null;
  if (match) {
    state.message = state.readyRoute
      ? `${match.name} is ready — the ${state.readyRoute} route! Ring the bell!`
      : `${match.name} is ready — ring the bell at the Serve window!`;
    audio.ding();
  } else {
    state.message = `Plated ${ingredientName(item.ing)} — ${3 - state.plateItems.length} step(s) to a full dish.`;
  }
}

function serveDish() {
  if (!state.readyRecipe) {
    state.message = 'No finished dish on the plate yet.';
    audio.fail();
    return;
  }
  const idx = state.orders.findIndex((o) => o.recipeId === state.readyRecipe.id);
  if (idx < 0) {
    state.message = `No ticket asks for ${state.readyRecipe.name} right now.`;
    audio.fail();
    return;
  }
  const order = state.orders[idx];
  const left = Math.max(0, (order.expiresAt - state.timeMs) / 1000);
  const bonus = Math.round(left) * SCORING.timeBonusPerSecond;
  state.combo += 1;
  const mult = state.combo >= 3 ? 3 : state.combo >= 2 ? 2 : 1;
  // Alternate route pays its bonus; a gold VIP ticket triples the serve.
  const routeBonus = state.readyRoute ? SCORING.routeBonus : 0;
  const gained = (SCORING.serve + bonus + routeBonus) * mult * (order.vip ? VIP.valueMult : 1);
  state.score += gained;
  state.coins += 4 + state.combo + (order.vip ? 10 : 0);
  state.served += 1;
  state.orders.splice(idx, 1);
  state.plateItems = [];
  const routeName = state.readyRoute;
  state.readyRecipe = null;
  state.readyRoute = null;
  state.servedBanner = { text: order.vip ? `VIP Served!  +${gained}` : `Served!  +${gained}`, stars: mult };
  state.servedBannerAt = state.timeMs;
  audio.serve();
  popup(1120, 120, order.vip ? `VIP +${gained}` : `Served! +${gained}`, '#F2A007');
  state.message = `${order.name} served with ${Math.round(left)}s to spare — combo x${mult}`
    + (routeName ? ` · ${routeName} route +${routeBonus}` : '')
    + (order.vip ? ` · VIP x${VIP.valueMult}!` : '') + '.';
  chefGoTo(STATIONS[5]);
  renderOrders();
  renderHud();
}

function onStation(id) {
  if (state.screen !== 'play' || state.frozen) return;
  audio.unlock();
  if (id === 'pantry') { state.message = 'Pantry: press 1–6 or click an ingredient to take it.'; renderHud(); return; }
  if (id === 'chopping') { startProcessing('chopping'); return; }
  // On the heat, a second click takes the item off — that click is the
  // doneness decision, so it comes before starting anything new.
  if (id === 'stove') { if (state.processing && state.processing.station === 'stove') takeCooked(); else startProcessing('stove'); return; }
  if (id === 'grill') { if (state.processing && state.processing.station === 'grill') takeCooked(); else startProcessing('grill'); return; }
  if (id === 'plating') { plateCarried(); return; }
  if (id === 'serve') { serveDish(); return; }
}

function onKeyAction(action) {
  if (action === ACTION_MUTE) {
    audio.setMuted(!audio.isMuted());
    el.muteBtn.textContent = audio.isMuted() ? 'Sound: off' : 'Sound: on';
    return;
  }
  if (action === ACTION_RESTART) { startShift(); return; }
  if (action === ACTION_PAUSE) {
    if (state.screen === 'play') showPause();
    else if (state.screen === 'paused') { state.screen = 'play'; hideOverlay(); }
    return;
  }
  if (action === ACTION_INTERACT) {
    if (state.screen === 'title') { startShift(); return; }
    if (state.screen !== 'play') return;
    const st = nearestStation();
    if (st) onStation(st.id);
  }
}

function update(dtMs) {
  const dt = dtMs / 1000;
  state.timeMs += dtMs;
  if (state.screen !== 'play') return;

  // chef walks to target
  if (state.chefTarget) {
    const dx = state.chefTarget.x - state.chef.x;
    const dy = state.chefTarget.y - state.chef.y;
    const d = Math.hypot(dx, dy);
    const step = 340 * dt;
    if (d <= step) { state.chef.x = state.chefTarget.x; state.chef.y = state.chefTarget.y; state.chefTarget = null; }
    else { state.chef.x += (dx / d) * step; state.chef.y += (dy / d) * step; }
  }

  // processing progress — chopping finishes itself; stove/grill items
  // keep cooking through the doneness zones until the cook takes them
  // off, or they burn away at DONENESS.max and free the station.
  if (state.processing) {
    const p = state.processing;
    p.elapsed += dt;
    p.progress = p.elapsed / p.total;
    if (p.station === 'chopping') {
      p.progress = Math.min(1, p.progress);
      if (p.progress >= 1) finishProcessing();
    } else if (p.progress >= DONENESS.max) {
      const st = STATIONS.find((s) => s.id === p.station);
      popup(st ? st.x + st.w / 2 : 640, 120, 'BURNT AWAY!', '#D64533');
      state.message = `${ingredientName(p.item.ing)} burned away on the ${p.station} — the station is free.`;
      state.processing = null;
      state.potSimmer = false;
      audio.fail();
    }
  }

  // rush transitions
  while (state.rushIndex < RUSHES.length && state.elapsed >= RUSHES[state.rushIndex].at) {
    const rush = RUSHES[state.rushIndex];
    state.rushLabel = rush.label;
    state.orderEvery = rush.orderEvery;
    state.orderLife = rush.orderLife;
    state.rushIndex += 1;
    state.message = `${rush.label} — tickets arrive faster and expire sooner!`;
    audio.ding();
  }

  // orders
  spawnOrderIfDue(state, rng, state.timeMs);
  const dead = expiredOrders(state, state.timeMs);
  dead.forEach((o) => {
    state.orders = state.orders.filter((x) => x.id !== o.id);
    state.combo = 0;
    addScore(SCORING.expiredOrder, 640, 200, '');
    state.message = `${o.name} expired — the ticket is gone.`;
    audio.fail();
  });

  // shift timer
  const prevWhole = Math.ceil(state.timeLeft);
  state.elapsed += dt;
  state.timeLeft = Math.max(0, SHIFT_SECONDS - state.elapsed);
  const whole = Math.ceil(state.timeLeft);
  if (whole !== prevWhole && whole <= 10 && whole > 0) audio.tick();
  if (state.timeLeft <= 0) { showEnd(); }

  // popups age out
  state.popups = state.popups.filter((p) => state.timeMs - p.bornAt < 1400);
  if (state.servedBanner && state.timeMs - (state.servedBannerAt || 0) > 1800) state.servedBanner = null;
}

let last = 0;
function frame(t) {
  const dt = last ? Math.min(100, t - last) : 16;
  last = t;
  if (!state.frozen) update(dt);
  renderer.draw(state, t);
  renderHud();
  renderOrders();
  requestAnimationFrame(frame);
}

// Wiring
createInput(canvas, {
  onIngredient: takeIngredient,
  onStation,
  onHover: (st) => { state.hoverStation = st; },
  onMove: (dx, dy) => {
    if (state.screen !== 'play') return;
    state.chefTarget = null;
    state.chef.x = Math.max(40, Math.min(1240, state.chef.x + dx * 26));
    state.chef.y = Math.max(232, Math.min(272, state.chef.y + dy * 18));
  },
  onKey: onKeyAction,
});

el.overlay.addEventListener('click', (ev) => {
  const act = ev.target && ev.target.dataset ? ev.target.dataset.act : null;
  if (act === 'play' || act === 'restart') startShift();
  else if (act === 'resume') { state.screen = 'play'; hideOverlay(); }
});
el.muteBtn.addEventListener('click', () => onKeyAction(ACTION_MUTE));
el.pauseBtn.addEventListener('click', () => onKeyAction(ACTION_PAUSE));
el.restartBtn.addEventListener('click', () => onKeyAction(ACTION_RESTART));

// Boot
if (shotName) {
  stageShot(state, shotName);
  state.timeMs = 0;
  window.__shotReady = false;
  renderer.draw(state, 600);
  renderHud();
  renderOrders();
  window.__shotReady = true;
} else {
  showTitle();
  renderHud();
  renderOrders();
  requestAnimationFrame(frame);
}

// Test hooks for the headless play-test (not part of the game UI).
window.__game = {
  state: () => state,
  start: startShift,
  take: takeIngredient,
  station: onStation,
  fmtTime,
};
