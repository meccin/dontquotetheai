#!/usr/bin/env node
// Render OG image PNGs from their SVG sources using rsvg-convert.
// Usage:
//   node scripts/build-og-images.mjs           render where needed
//   node scripts/build-og-images.mjs --check   report drift without rendering (exit 1 if any drift)

import { readFileSync, statSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const assetsDir = resolve(repoRoot, 'assets');
const translationsPath = resolve(assetsDir, 'translations.json');

const checkMode = process.argv.includes('--check');

function relPath(p) {
  return p.startsWith(repoRoot + '/') ? p.slice(repoRoot.length + 1) : p;
}

function pathsFor(code) {
  if (code === 'en') {
    return {
      svg: resolve(assetsDir, 'og-image.svg'),
      png: resolve(assetsDir, 'og-image.png'),
    };
  }
  return {
    svg: resolve(assetsDir, `og-image-${code}.svg`),
    png: resolve(assetsDir, `og-image-${code}.png`),
  };
}

function ensureRsvgAvailable() {
  const probe = spawnSync('rsvg-convert', ['--version'], { encoding: 'utf8' });
  if (probe.error && probe.error.code === 'ENOENT') {
    console.error('error: rsvg-convert is not installed or not on PATH.');
    console.error('Install it with one of:');
    console.error('  Debian/Ubuntu: sudo apt install librsvg2-bin');
    console.error('  macOS:         brew install librsvg');
    process.exit(2);
  }
  if (probe.status !== 0) {
    console.error('error: rsvg-convert exists but failed to run --version:');
    if (probe.stderr) console.error(probe.stderr);
    process.exit(2);
  }
}

function render(svg, png) {
  const result = spawnSync('rsvg-convert', ['-w', '1200', '-h', '630', svg, '-o', png], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.error(`error: rsvg-convert failed for ${relPath(svg)}`);
    if (result.stderr) console.error(result.stderr);
    process.exit(1);
  }
}

const translations = JSON.parse(readFileSync(translationsPath, 'utf8'));
const languages = translations.languages ?? [];

let rendered = 0;
let upToDate = 0;
let missingSvg = 0;
let wouldRender = 0;
let rsvgChecked = false;

for (const lang of languages) {
  const { svg, png } = pathsFor(lang.code);

  if (!existsSync(svg)) {
    missingSvg++;
    continue;
  }

  const svgMtime = statSync(svg).mtimeMs;
  const pngExists = existsSync(png);
  const pngMtime = pngExists ? statSync(png).mtimeMs : 0;
  const needsRender = !pngExists || svgMtime > pngMtime;

  if (!needsRender) {
    console.log(`skipped: ${relPath(png)} (up to date)`);
    upToDate++;
    continue;
  }

  const svgDate = new Date(svgMtime).toISOString().slice(0, 10);

  if (checkMode) {
    console.log(`would render: ${relPath(png)} (svg updated ${svgDate})`);
    wouldRender++;
    continue;
  }

  if (!rsvgChecked) {
    ensureRsvgAvailable();
    rsvgChecked = true;
  }
  render(svg, png);
  console.log(`rendered ${relPath(png)} (svg updated ${svgDate})`);
  rendered++;
}

if (checkMode) {
  console.log(
    `Would render ${wouldRender} images, ${upToDate} up to date, ${missingSvg} missing SVGs`,
  );
  process.exit(wouldRender > 0 ? 1 : 0);
}

console.log(`Rendered ${rendered} images, ${upToDate} up to date, ${missingSvg} missing SVGs`);
