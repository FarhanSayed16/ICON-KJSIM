import { rmSync, existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { spawn } from 'child_process';
import { join } from 'path';

const root = process.cwd();
const nextDir = join(root, '.next');
const markerPath = join(nextDir, 'icon-bundler');
const bundler = 'webpack';

function needsClean() {
  if (!existsSync(nextDir)) return false;
  try {
    const prev = readFileSync(markerPath, 'utf8').trim();
    return prev !== bundler;
  } catch {
    // No marker or unreadable — wipe to avoid Turbopack/webpack mix
    return true;
  }
}

if (needsClean()) {
  console.log('[dev] Clearing .next (bundler cache mismatch or leftover Turbopack artifacts)…');
  rmSync(nextDir, { recursive: true, force: true });
}

mkdirSync(nextDir, { recursive: true });
writeFileSync(markerPath, bundler, 'utf8');

const child = spawn('npx', ['next', 'dev', '--webpack'], {
  stdio: 'inherit',
  shell: true,
  cwd: root,
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
