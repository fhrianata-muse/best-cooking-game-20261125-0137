// Saffron Line — every tuning number, colour and recipe in one place.
export const FIELD = { width: 1280, height: 300 };

export const PALETTE = {
  wall: '#F6E8C8',
  wallTrim: '#E3CFA3',
  floor: '#C96F3F',
  floorAlt: '#B85C33',
  wood: '#5A3A22',
  woodEdge: '#7A5230',
  brass: '#D9A441',
  saffron: '#F2A007',
  herb: '#4E7A3A',
  tomato: '#D64533',
  ceramic: '#FBF7EE',
  ink: '#2B2118',
  cream: '#FBF7EE',
  shadow: '#3A2A1A',
  steel: '#9AA7B0',
  pot: '#3F4A55',
  grill: '#2E2A26',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const DISPLAY_FONT = 'Georgia, "Times New Roman", serif';

export const SHIFT_SECONDS = 180;
export const RUSHES = [
  { at: 60, label: 'RUSH 1', orderEvery: 12, orderLife: 40 },
  { at: 120, label: 'RUSH 2', orderEvery: 10, orderLife: 34 },
  { at: 150, label: 'RUSH 3', orderEvery: 8, orderLife: 28 },
];
export const ORDER_EVERY = 14;
export const ORDER_LIFE = 45;
export const MAX_ORDERS = 3;

export const PROCESS_SECONDS = { chop: 2, stove: 4, grill: 3 };

// Doneness: stove/grill items keep cooking past "done". The cook must
// take the item off the heat inside the PERFECT window — too early is
// UNDER, too late is BURNT. d = elapsed / PROCESS_SECONDS for the action.
export const DONENESS = {
  perfectFrom: 0.7,   // d below this: UNDER (blue zone)
  perfectTo: 1.15,    // d in [perfectFrom, perfectTo]: PERFECT (green zone)
  max: 1.6,           // d above perfectTo: BURNT (red zone); at max the
                      // item burns away and the station frees itself
};

// VIP gold tickets: rarer, faster, worth a multiple of a normal serve.
export const VIP = { chance: 0.18, lifeFactor: 0.7, valueMult: 3 };

export const SCORING = {
  process: 100,
  perfectBonus: 50,
  routeBonus: 40,
  serve: 200,
  timeBonusPerSecond: 5,
  wrongStep: -10,
  burntPlated: -25,
  expiredOrder: -50,
};

export const INGREDIENTS = [
  { id: 'tomato', name: 'Tomato', key: '1', color: '#D64533', shape: 'round' },
  { id: 'onion', name: 'Onion', key: '2', color: '#E8DCC8', shape: 'rings' },
  { id: 'fish', name: 'Fish', key: '3', color: '#7FA8C9', shape: 'fish' },
  { id: 'bread', name: 'Bread', key: '4', color: '#C89B5A', shape: 'loaf' },
  { id: 'greens', name: 'Greens', key: '5', color: '#4E7A3A', shape: 'leaves' },
  { id: 'cheese', name: 'Cheese', key: '6', color: '#F2C230', shape: 'wedge' },
];

// A step is one ingredient processed at one station, then plated.
// action 'plate' means the ingredient goes straight onto the plate.
// Most recipes also carry ONE alternate route (altSteps + route name):
// the same dish reached through a different station for one step — the
// matcher accepts either route, and the alternate pays a route bonus.
export const RECIPES = [
  { id: 'tomato-soup', name: 'Tomato Soup', steps: [
    { ing: 'tomato', action: 'chop' }, { ing: 'onion', action: 'chop' }, { ing: 'tomato', action: 'stove' } ],
    altRoute: 'Smokey', altSteps: [
    { ing: 'tomato', action: 'grill' }, { ing: 'onion', action: 'chop' }, { ing: 'tomato', action: 'stove' } ] },
  { id: 'green-salad', name: 'Green Salad', steps: [
    { ing: 'greens', action: 'plate' }, { ing: 'tomato', action: 'chop' }, { ing: 'cheese', action: 'plate' } ] },
  { id: 'grilled-fish', name: 'Grilled Fish', steps: [
    { ing: 'fish', action: 'grill' }, { ing: 'greens', action: 'plate' }, { ing: 'tomato', action: 'chop' } ],
    altRoute: 'Pan-seared', altSteps: [
    { ing: 'fish', action: 'stove' }, { ing: 'greens', action: 'plate' }, { ing: 'tomato', action: 'chop' } ] },
  { id: 'cheese-sandwich', name: 'Cheese Sandwich', steps: [
    { ing: 'bread', action: 'grill' }, { ing: 'cheese', action: 'plate' }, { ing: 'tomato', action: 'chop' } ],
    altRoute: 'Pan-toasted', altSteps: [
    { ing: 'bread', action: 'stove' }, { ing: 'cheese', action: 'plate' }, { ing: 'tomato', action: 'chop' } ] },
  { id: 'fish-soup', name: 'Fish Soup', steps: [
    { ing: 'fish', action: 'stove' }, { ing: 'onion', action: 'chop' }, { ing: 'tomato', action: 'chop' } ],
    altRoute: 'Charred', altSteps: [
    { ing: 'fish', action: 'grill' }, { ing: 'onion', action: 'chop' }, { ing: 'tomato', action: 'chop' } ] },
  { id: 'bruschetta', name: 'Bruschetta', steps: [
    { ing: 'bread', action: 'grill' }, { ing: 'tomato', action: 'chop' }, { ing: 'cheese', action: 'plate' } ],
    altRoute: 'Pan-toasted', altSteps: [
    { ing: 'bread', action: 'stove' }, { ing: 'tomato', action: 'chop' }, { ing: 'cheese', action: 'plate' } ] },
  { id: 'onion-soup', name: 'Onion Soup', steps: [
    { ing: 'onion', action: 'chop' }, { ing: 'bread', action: 'grill' }, { ing: 'cheese', action: 'plate' } ] },
  { id: 'garden-plate', name: 'Garden Plate', steps: [
    { ing: 'greens', action: 'plate' }, { ing: 'onion', action: 'chop' }, { ing: 'cheese', action: 'plate' } ] },
  { id: 'seared-fish', name: 'Seared Fish', steps: [
    { ing: 'fish', action: 'grill' }, { ing: 'onion', action: 'chop' }, { ing: 'greens', action: 'plate' } ],
    altRoute: 'Charred', altSteps: [
    { ing: 'fish', action: 'stove' }, { ing: 'onion', action: 'chop' }, { ing: 'greens', action: 'plate' } ] },
  { id: 'tomato-bake', name: 'Tomato Bake', steps: [
    { ing: 'tomato', action: 'stove' }, { ing: 'cheese', action: 'plate' }, { ing: 'bread', action: 'grill' } ],
    altRoute: 'Smokey', altSteps: [
    { ing: 'tomato', action: 'grill' }, { ing: 'cheese', action: 'plate' }, { ing: 'bread', action: 'grill' } ] },
  { id: 'fish-sandwich', name: 'Fish Sandwich', steps: [
    { ing: 'bread', action: 'grill' }, { ing: 'fish', action: 'grill' }, { ing: 'greens', action: 'plate' } ] },
  { id: 'harvest-soup', name: 'Harvest Soup', steps: [
    { ing: 'tomato', action: 'chop' }, { ing: 'greens', action: 'plate' }, { ing: 'fish', action: 'stove' } ] },
];

export const STATIONS = [
  { id: 'pantry', name: 'Pantry', x: 16, y: 70, w: 284, h: 150 },
  { id: 'chopping', name: 'Chopping Board', x: 320, y: 70, w: 220, h: 150 },
  { id: 'stove', name: 'Stove', x: 560, y: 70, w: 240, h: 150 },
  { id: 'grill', name: 'Grill', x: 820, y: 70, w: 180, h: 150 },
  { id: 'plating', name: 'Plating', x: 1020, y: 70, w: 140, h: 150 },
  { id: 'serve', name: 'Serve Window', x: 1172, y: 70, w: 92, h: 150 },
];

export const CHEF_START = { x: 640, y: 252 };
export const BEST_KEY = 'saffron-line.best';
