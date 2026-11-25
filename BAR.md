# BAR — Saffron Line (best-cooking-game-20261125-0137)

## Judging bar (from competition.yaml, judge criteria in order)
1. Complete cooking game, shown in screenshots of the game itself: a kitchen
   and an order board, ingredients on the counter, one dish mid-assembly, a
   timer and a plate ready to serve. A non-playable entry loses to a playable one.
2. Fun and depth: orders that push you to plan a route through the kitchen,
   recipes that combine in different ways, pressure that grows without adding
   chores.
3. Feel and polish: chopping and plating that answer at once, a timer you can
   feel, and a service rush that reads in a glance.
4. Look and originality: food drawn so it looks worth serving, counters you
   can read at a glance, a kitchen with a look of its own. Original names,
   art, sounds — no copy of a commercial game.
5. Structure: the source split into files with one clear job each, named for
   what they do.

The first criterion on which two entries differ decides, unless a later one
differs by much more.

## Measurable targets
- 12 recipes, each a different combination of ingredients and steps.
- 6 stations: Pantry, Chopping, Stove, Grill, Plating, Serve.
- 6 ingredients on the pantry counter: tomato, onion, fish, bread, greens, cheese.
- 3 service rushes (RUSH 1 at 60 s, RUSH 2 at 120 s, RUSH 3 at 150 s into the shift).
- Shift timer 180 seconds; orders carry their own countdown bars.
- Scoring: 100 per ingredient processed correctly, 200 per dish served plus
  time bonus, combo x2/x3 for consecutive clean serves, -10 wrong step,
  -50 expired order.

## Scorecard (0-3 per category) — premium gate
- Completeness: kitchen + order board + ingredients + mid-assembly dish +
  timer + plate ready, all visible in the cover screenshot; game playable
  start to finish (title -> play -> serve -> shift end).
- Depth: 12 recipes with distinct step combinations; order routing matters
  (chop before cook before plate); rushes raise pressure by shortening order
  windows, not by adding chores.
- Feel: chop/cook/serve answer at once (sound + animation + score popup);
  timer turns red and ticks under 30 s; rush banner reads in a glance.
- Look: LOOK.md palette and materials; food drawn with shape + highlight;
  stations readable at a glance; one warm style across the frame.
- Structure: one job per file (config, random, recipes, audio, render,
  input, shots, main), named for what they do.

Gate: every category >= 2, average >= 2.3 is the FLOOR. Target after the
reference pass and two screenshot iteration rounds: average >= 2.6.
Density check (from the references): no empty counter in any screenshot;
hanging tools and jars visible; warm light pools over stove/grill; a
garnished ready plate and a sleeping cat in frame. No automatic failure
standing (placeholder-dominated frame, primitive+glow hero,
indistinguishable roles, fog/darkness standing in for geometry, HUD
stat-cards, no diagnostics).

## Iteration round 4 (independent judges J1+J2, absolute average 2.4)
Both judges agreed on the same three gaps, fixed in this round:
1. Empty floor band (~15-25% of every frame) — fixed with a runner rug +
   a service pass counter row along the bottom (clean plates, bread
   basket, greens bowl, sauce bottles, tomato crate, sleeping cat).
2. Food too small and abstract; mid-assembly dish weakest — pot enlarged
   to 76x36, plate to 64x36, plated food stacked in a layered arc, grill
   fish enlarged.
3. Rush urgency unreadable; served banner covered the kitchen; chef
   covered station labels — timer red + pulsing from 60 s, RUSH badge in
   the header, Served banner moved onto the pass counter, chef at scale
   1.2 standing in the gaps between stations (y 252), served shot keeps
   a garnished ready plate on the pass.

## Scorecard — upgrade pass (2026-11-25, judged on the new captures)
| Category | Score | Evidence |
|---|---|---|
| Completeness | 3 | All 4 shots re-captured; doneness bar + PERFECT pill on cover, gold VIP ticket on rush, VIP banner + PERFECT popup on served — the new systems are visible, not just implemented |
| Depth | 3 | Doneness windows with take-off timing, 7 dual-route recipes, VIP economy; verified end-to-end by work/serve-test-upgrade.mjs: 12/12 checks pass with exact score deltas (PERFECT +150 total, route serve 675 incl. +40, VIP serve 1920 = 3×, burnt bin −25) |
| Feel | 3 | Take-it-in-the-green tension, PERFECT/BURNT pills and popups, gold served banner; capture.mjs play-test passes, 0 console errors |
| Look | 3 | Wood grain + 3D lips + soft shadows on every station, drawn dishes (soup surface, char stripes, sandwich strata, two-toast bruschetta), light pools + vignette, cream-readable labels; side-by-side vs work/old-shots/ shows no flat card remaining |
| Structure | 3 | Systems named in the outline: config (DONENESS, VIP, bonuses), recipes (recipeVariants/matchRoute), main (donenessOf/takeCooked), render (drawDonenessBar/drawDish/drawZonePill) |

Honest delta vs the round-4 card (absolute 2.8): Depth 2→3 is the real
gain; Look stays 3 but now survives comparison with the old captures
instead of only passing the checklist.
