// Recipes + order generation + dish matching. Pure logic, no drawing.
import { RECIPES, MAX_ORDERS, VIP } from './config.js';
import { pick } from './random.js';

export function recipeById(id) {
  return RECIPES.find((r) => r.id === id);
}

export function ingredientById(list, id) {
  return list.find((i) => i.id === id);
}

// A processed item is { ing, action, quality? }. A dish is ready when the
// plate's processed items match a recipe's steps as a multiset (order of
// steps does not matter — the cook's route is the player's choice).
// A recipe with altSteps has TWO valid routes: the main steps, or the
// alternate steps under its route name (smokey, charred, pan-toasted…).
export function stepKey(step) {
  return `${step.ing}:${step.action}`;
}

export function recipeVariants(recipe) {
  const variants = [{ route: null, steps: recipe.steps }];
  if (recipe.altSteps) variants.push({ route: recipe.altRoute, steps: recipe.altSteps });
  return variants;
}

function multisetKey(steps) {
  return steps.map(stepKey).sort().join('|');
}

// Which recipe (if any) the plate completes, and by which route.
export function matchInfo(plateItems) {
  if (plateItems.length === 0) return null;
  const have = multisetKey(plateItems);
  for (const r of RECIPES) {
    for (const v of recipeVariants(r)) {
      if (multisetKey(v.steps) === have) return { recipe: r, route: v.route };
    }
  }
  return null;
}

export function matchingRecipe(plateItems) {
  const info = matchInfo(plateItems);
  return info ? info.recipe : null;
}

// The alternate route's name when the plate matched through it, else null.
export function matchRoute(plateItems) {
  const info = matchInfo(plateItems);
  return info ? info.route : null;
}

// Does any active order still need this processed item (either route)?
export function itemIsUseful(plateItems, orders, item) {
  const test = plateItems.concat([item]);
  return RECIPES.some((r) => {
    if (!orders.some((o) => o.recipeId === r.id)) return false;
    return recipeVariants(r).some((v) => {
      const need = v.steps.map(stepKey);
      const got = test.map(stepKey);
      return got.every((k) => {
        const n = need.filter((x) => x === k).length;
        const g = got.filter((x) => x === k).length;
        return g <= n;
      }) && test.length <= need.length;
    });
  });
}

export function createOrder(rng, id, lifeSeconds, nowMs) {
  const recipe = pick(rng, RECIPES);
  // Some tickets come in gold: VIP orders live shorter and pay triple.
  const vip = rng() < VIP.chance;
  const life = vip ? Math.round(lifeSeconds * VIP.lifeFactor) : lifeSeconds;
  return {
    id,
    recipeId: recipe.id,
    name: recipe.name,
    steps: recipe.steps,
    vip,
    life,
    bornAt: nowMs,
    expiresAt: nowMs + life * 1000,
  };
}

export function nextOrderId(state) {
  state.orderSeq += 1;
  return state.orderSeq;
}

export function spawnOrderIfDue(state, rng, nowMs) {
  if (state.orders.length >= MAX_ORDERS) return null;
  if (nowMs < state.nextOrderAt) return null;
  const order = createOrder(rng, nextOrderId(state), state.orderLife, nowMs);
  state.orders.push(order);
  state.nextOrderAt = nowMs + state.orderEvery * 1000;
  return order;
}

export function expiredOrders(state, nowMs) {
  return state.orders.filter((o) => nowMs >= o.expiresAt);
}
