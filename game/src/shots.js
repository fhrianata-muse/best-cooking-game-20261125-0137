// ?shot= staging: deterministic mid-play states, frozen timer, good frame.
import { recipeById } from './recipes.js';

function order(recipeId, life, bornAt, vip = false) {
  const r = recipeById(recipeId);
  return {
    id: recipeId + '-shot',
    recipeId,
    name: r.name,
    steps: r.steps,
    vip,
    life,
    bornAt,
    expiresAt: bornAt + life * 1000,
  };
}

export function stageShot(state, name) {
  state.screen = 'play';
  state.frozen = true;
  state.popups = [];
  state.processing = null;
  state.plateItems = [];
  state.readyRecipe = null;
  state.carry = null;
  state.message = '';
  state.servedBanner = null;
  state.potSimmer = false;

  if (name === 'cover') {
    state.timeLeft = 151;
    state.elapsed = 29;
    state.score = 840;
    state.coins = 12;
    state.combo = 2;
    state.orders = [order('tomato-soup', 45, 0), order('grilled-fish', 45, 0)];
    // Chef stands in the chopping|stove gap (y 252) — clear of station
    // labels and of the simmering pot.
    state.chef = { x: 550, y: 252 };
    state.carry = { ing: 'tomato', action: null };
    // The pot sits in the PERFECT doneness zone (d = 3.4/4 = 0.85): the
    // zoned bar shows blue/green/red with the needle in the green.
    state.processing = { station: 'stove', item: { ing: 'tomato', action: 'stove' }, progress: 0.85, total: 4, elapsed: 3.4 };
    state.potSimmer = true;
    state.plateItems = [{ ing: 'greens', action: 'plate' }, { ing: 'tomato', action: 'chop' }];
    state.readyRecipe = recipeById('green-salad');
    state.plateItems = [{ ing: 'greens', action: 'plate' }, { ing: 'tomato', action: 'chop' }, { ing: 'cheese', action: 'plate' }];
    state.message = 'Green Salad ready — ring the bell to serve!';
  } else if (name === 'pantry') {
    state.timeLeft = 178;
    state.elapsed = 2;
    state.score = 0;
    state.coins = 0;
    state.combo = 0;
    state.orders = [order('cheese-sandwich', 45, 0)];
    // Chef in the pantry|chopping gap, facing the pantry.
    state.chef = { x: 310, y: 252 };
    state.carry = null;
    state.message = 'Pick an ingredient — press 1-6 or click the pantry.';
  } else if (name === 'rush') {
    state.timeLeft = 47;
    state.elapsed = 133;
    state.score = 2140;
    state.coins = 31;
    state.combo = 3;
    state.rushLabel = 'RUSH 3';
    // One gold VIP ticket on the board — shorter life, triple value.
    state.orders = [order('fish-soup', 20, 0, true), order('grilled-fish', 28, 0), order('tomato-bake', 28, 0)];
    // Chef in the stove|grill gap — the 00:47 timer is red now (CSS danger
    // from 60 s) and the RUSH 3 badge is large in the header.
    state.chef = { x: 810, y: 252 };
    state.carry = { ing: 'fish', action: 'grill' };
    // A second fish sears on the grill, also staged in the PERFECT zone.
    state.processing = { station: 'grill', item: { ing: 'fish', action: 'grill' }, progress: 0.85, total: 3, elapsed: 2.55 };
    state.plateItems = [{ ing: 'bread', action: 'grill' }, { ing: 'fish', action: 'grill' }, { ing: 'greens', action: 'plate' }];
    state.readyRecipe = recipeById('fish-sandwich');
    state.message = 'RUSH 3 — three tickets on the board!';
  } else if (name === 'served') {
    state.timeLeft = 118;
    state.elapsed = 62;
    state.score = 1560;
    state.coins = 22;
    state.combo = 2;
    state.orders = [order('tomato-soup', 40, 0), order('bruschetta', 40, 0)];
    // Chef in the plating|serve gap; the banner now sits on the pass
    // counter (bottom), not over the stations.
    state.chef = { x: 1186, y: 252 };
    state.carry = null;
    // The serve that just landed was a gold VIP ticket, tripled.
    state.servedBanner = { text: 'VIP Served!  +600', stars: 3 };
    state.popups = [{ x: 1090, y: 262, text: 'PERFECT! +50', color: '#7BC96B', bornAt: 0 }];
    // A garnished dish stays plated on the pass — the next serve is ready,
    // and the plate is never shown empty in this shot. It was built by
    // the alternate Pan-toasted route, and the plate banner says so.
    state.plateItems = [{ ing: 'bread', action: 'stove' }, { ing: 'tomato', action: 'chop' }, { ing: 'cheese', action: 'plate' }];
    state.readyRecipe = recipeById('bruschetta');
    state.readyRoute = 'Pan-toasted';
    state.message = 'VIP served! The bell rings — next ticket, chef.';
  }
  return state;
}
