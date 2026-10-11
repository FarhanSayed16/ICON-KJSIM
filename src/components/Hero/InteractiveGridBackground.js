'use client';

import { useRef, useEffect } from 'react';

export default function InteractiveGridBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    const CELL_SIZE = 48;

    // Map of active grid cells: key `${col},${row}` -> { col, row, intensity, hoverTime }
    const activeCells = new Map();
    let prevMouse = null;
    let lastMouseMove = Date.now();

    // Ambient static tiles seen in the mockup (Image 1)
    const ambientTiles = [
      { colOffset: 14, row: 2, phase: 0 },
      { colOffset: 18, row: 5, phase: 1.2 },
      { colOffset: 11, row: 9, phase: 2.4 },
      { colOffset: 16, row: 13, phase: 3.6 },
      { colOffset: 8, row: 17, phase: 4.8 },
      { colOffset: 17, row: 18, phase: 5.5 },
    ];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const activateCell = (col, row, now) => {
      const maxCols = Math.ceil(width / CELL_SIZE);
      const maxRows = Math.ceil(height / CELL_SIZE);
      if (col < 0 || col >= maxCols || row < 0 || row >= maxRows) return;

      const key = `${col},${row}`;
      activeCells.set(key, {
        col,
        row,
        intensity: 1.0,
        hoverTime: now,
      });
    };

    // Interpolate points between previous and current mouse pos to prevent gaps on fast cursor moves
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = Date.now();
      lastMouseMove = now;

      if (prevMouse) {
        const dx = x - prevMouse.x;
        const dy = y - prevMouse.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.floor(dist / (CELL_SIZE * 0.4)));

        for (let i = 0; i <= steps; i++) {
          const ix = prevMouse.x + (dx * i) / steps;
          const iy = prevMouse.y + (dy * i) / steps;
          const col = Math.floor(ix / CELL_SIZE);
          const row = Math.floor(iy / CELL_SIZE);
          activateCell(col, row, now);
        }
      } else {
        const col = Math.floor(x / CELL_SIZE);
        const row = Math.floor(y / CELL_SIZE);
        activateCell(col, row, now);
      }

      prevMouse = { x, y };
    };

    const handlePointerLeave = () => {
      prevMouse = null;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    const render = () => {
      const now = Date.now();
      ctx.clearRect(0, 0, width, height);

      const numCols = Math.ceil(width / CELL_SIZE);
      const numRows = Math.ceil(height / CELL_SIZE);

      // ── 1. Draw Subtle Light Grid Lines ──
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let c = 0; c <= numCols; c++) {
        const x = c * CELL_SIZE + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      // Horizontal lines
      for (let r = 0; r <= numRows; r++) {
        const y = r * CELL_SIZE + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // ── 2. Draw Soft Ambient Tiles (from Image 1 Mockup) ──
      const timeSec = now * 0.0015;
      ambientTiles.forEach((tile) => {
        // Place relative to right side of screen or responsive column
        const col = Math.min(numCols - 1, Math.max(0, tile.colOffset));
        const row = Math.min(numRows - 1, Math.max(0, tile.row));
        const key = `${col},${row}`;

        // Only draw if not currently actively hovered
        if (!activeCells.has(key)) {
          const pulse = 0.14 + 0.1 * Math.sin(timeSec + tile.phase);
          ctx.fillStyle = `rgba(237, 28, 36, ${pulse})`;
          ctx.fillRect(
            col * CELL_SIZE + 1,
            row * CELL_SIZE + 1,
            CELL_SIZE - 1,
            CELL_SIZE - 1
          );
        }
      });

      // ── 3. Update & Draw Interactive Hovered Red Tiles ──
      const timeSinceLastMove = now - lastMouseMove;

      activeCells.forEach((cell, key) => {
        const elapsed = now - cell.hoverTime;

        // Fades into white if not hovered after 1s OR if cursor movement stopped for > 1s
        if (elapsed > 1000 || timeSinceLastMove > 1000) {
          cell.intensity -= 0.02; // Smooth fade over ~600ms
        }

        if (cell.intensity <= 0) {
          activeCells.delete(key);
        } else {
          const x = cell.col * CELL_SIZE + 1;
          const y = cell.row * CELL_SIZE + 1;

          // Somaiya Vitality Red (#ED1C24 / rgb: 237, 28, 36)
          // Transitions smoothly from full vitality red to soft rose and into white
          const alpha = Math.min(0.85, cell.intensity * 0.85);
          ctx.fillStyle = `rgba(183, 32, 46, ${alpha})`;
          ctx.fillRect(x, y, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
