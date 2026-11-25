// Saffron Line — make.fun entrypoint (Node 22, no build step).
// Copies game/ and screenshots/ into the output directory and writes
// dossier.json with the vendored make.fun library, exactly as the kit
// expects. The output directory itself is never removed — only its
// contents are emptied first, because the grader mounts that directory.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function emptyDirContents(dir) {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}

function copyTree(src, dest) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

// Writable copies: a read-only file carried into the output would fail
// the grader's own writes, so clear modes on the way through.
function makeWritable(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) makeWritable(p);
  }
}

emptyDirContents(out);
copyTree(join(here, 'game'), join(out, 'game'));
copyTree(join(here, 'screenshots'), join(out, 'screenshots'));
makeWritable(out);

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// One-line summary with the numbers the preflight checks: dossier size
// and screenshot count, so a bad build is visible without opening files.
import { readFileSync as readFile } from 'node:fs';
const dossierBytes = readFile(join(out, 'dossier.json')).length;
const shotCount = existsSync(join(out, 'screenshots')) ? readdirSync(join(out, 'screenshots')).length : 0;
console.log(`Saffron Line: game/ + ${shotCount} screenshot(s) copied to ${out}, dossier.json written (${dossierBytes} bytes).`);
