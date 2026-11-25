// Wok This Way — a midnight diner cooking game
// Entrypoint for make.fun: copies game/ and optional screenshots/ into MAKEFUN_OUTPUT_DIR,
// then writes dossier.json using the vendor buildDossier helper.

import { existsSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

const OUTPUT_ENV_VAR = 'MAKEFUN_OUTPUT_DIR';
const DEFAULT_OUTPUT_DIR = '/output';

function resolveOutputDir(): string {
  const dir = process.env[OUTPUT_ENV_VAR]?.trim();
  return resolve(dir && dir.length > 0 ? dir : DEFAULT_OUTPUT_DIR);
}

function copyGameAssets(outputDir: string, rootDir: string): void {
  const gameSrc = join(rootDir, 'game');
  const gameDst = join(outputDir, 'game');
  cpSync(gameSrc, gameDst, { recursive: true, force: true });

  const screenshotsSrc = join(rootDir, 'screenshots');
  if (existsSync(screenshotsSrc)) {
    const screenshotsDst = join(outputDir, 'screenshots');
    cpSync(screenshotsSrc, screenshotsDst, { recursive: true, force: true });
  }
}

function writeDossier(outputDir: string): { path: string; bytes: number } {
  const dossier = buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  });

  const dossierPath = join(outputDir, 'dossier.json');
  // buildDossier returns a Uint8Array of canonical JSON bytes.
  writeFileSync(dossierPath, dossier);
  return { path: dossierPath, bytes: dossier.length };
}

function main(): void {
  const rootDir = resolve(import.meta.dirname ?? '.');
  const outputDir = resolveOutputDir();

  mkdirSync(outputDir, { recursive: true });
  copyGameAssets(outputDir, rootDir);
  const { path, bytes } = writeDossier(outputDir);

  console.log(`Wok This Way dossier written to ${path} (${bytes} bytes)`);
}

main();
