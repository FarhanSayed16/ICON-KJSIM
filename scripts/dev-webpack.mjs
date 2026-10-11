import { rmSync, existsSync, writeFileSync, readFileSync, mkdirSync } from 'fs';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import { createServer } from 'net';
import { join } from 'path';

const root = process.cwd();
const nextDir = join(root, '.next');
const markerPath = join(nextDir, 'icon-bundler');
const bundler = 'webpack';
const port = Number(process.env.PORT) || 3000;

function portIsFree(p) {
  return new Promise((resolve) => {
    const srv = createServer()
      .once('error', () => resolve(false))
      .once('listening', () => srv.close(() => resolve(true)))
      .listen(p);
  });
}

function needsClean() {
  if (!existsSync(nextDir)) return false;
  try {
    return readFileSync(markerPath, 'utf8').trim() !== bundler;
  } catch {
    // No marker — leftover Turbopack artifacts; wipe to avoid a bundler mix
    return true;
  }
}

// A second server would silently move to :3001 while the browser keeps talking
// to the first one — and wiping .next under a running server breaks every tab.
if (!(await portIsFree(port))) {
  console.error(
    `\n[dev] Port ${port} is already in use — another dev server is running.\n` +
      `[dev] Stop it first (Ctrl+C in that terminal), then run "npm run dev" again.\n`
  );
  process.exit(1);
}

if (needsClean()) {
  console.log('[dev] Clearing .next (bundler cache mismatch or leftover Turbopack artifacts)…');
  rmSync(nextDir, { recursive: true, force: true });
}

mkdirSync(nextDir, { recursive: true });
writeFileSync(markerPath, bundler, 'utf8');

const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, 'dev', '--webpack', '--port', String(port)], {
  stdio: 'inherit',
  cwd: root,
  env: process.env,
});

const forward = (signal) => {
  if (!child.killed) child.kill(signal);
};
process.on('SIGINT', forward);
process.on('SIGTERM', forward);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
