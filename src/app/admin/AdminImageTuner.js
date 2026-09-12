'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { TEAM_MEMBERS } from '@/lib/data';
import {
  HiOutlineClipboardCopy, HiOutlineCheck,
  HiOutlineZoomIn, HiOutlineZoomOut,
  HiArrowUp, HiArrowDown, HiArrowLeft, HiArrowRight,
  HiOutlineEye, HiOutlineRefresh,
} from 'react-icons/hi';

export default function AdminImageTuner() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showAllPreview, setShowAllPreview] = useState(true);

  const [adjustments, setAdjustments] = useState(() => {
    const init = {};
    TEAM_MEMBERS.forEach((_, i) => {
      init[i] = { posX: 50, posY: 50, zoom: 100 };
    });
    return init;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  const selected = TEAM_MEMBERS[selectedIndex];
  const adj = adjustments[selectedIndex];

  const updateField = useCallback((field, value) => {
    setAdjustments(prev => ({
      ...prev,
      [selectedIndex]: { ...prev[selectedIndex], [field]: value },
    }));
  }, [selectedIndex]);

  const nudge = useCallback((field, delta) => {
    setAdjustments(prev => {
      const cur = prev[selectedIndex][field];
      let next = cur + delta;
      if (field === 'posX' || field === 'posY') next = Math.max(0, Math.min(100, next));
      if (field === 'zoom') next = Math.max(80, Math.min(250, next));
      return { ...prev, [selectedIndex]: { ...prev[selectedIndex], [field]: Math.round(next) } };
    });
  }, [selectedIndex]);

  const resetCurrent = () => {
    setAdjustments(prev => ({ ...prev, [selectedIndex]: { posX: 50, posY: 50, zoom: 100 } }));
  };

  const resetAll = () => {
    const init = {};
    TEAM_MEMBERS.forEach((_, i) => { init[i] = { posX: 50, posY: 50, zoom: 100 }; });
    setAdjustments(init);
  };

  // --- Drag to reposition ---
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: adj.posX, startPosY: adj.posY };
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const s = 0.3;
      const nx = Math.max(0, Math.min(100, Math.round(dragRef.current.startPosX - dx * s)));
      const ny = Math.max(0, Math.min(100, Math.round(dragRef.current.startPosY - dy * s)));
      setAdjustments(prev => ({ ...prev, [selectedIndex]: { ...prev[selectedIndex], posX: nx, posY: ny } }));
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [isDragging, selectedIndex]);

  // --- Keyboard ---
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const step = e.shiftKey ? 10 : 2;
      switch (e.key) {
        case 'ArrowUp': e.preventDefault(); nudge('posY', -step); break;
        case 'ArrowDown': e.preventDefault(); nudge('posY', step); break;
        case 'ArrowLeft': e.preventDefault(); nudge('posX', -step); break;
        case 'ArrowRight': e.preventDefault(); nudge('posX', step); break;
        case '+': case '=': nudge('zoom', 5); break;
        case '-': nudge('zoom', -5); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [nudge]);

  // --- Output ---
  const getOutput = () => TEAM_MEMBERS.map((m, i) => {
    const a = adjustments[i];
    if (a.posX === 50 && a.posY === 50 && a.zoom === 100) return null;
    return { name: m.name, pos: `${a.posX}% ${a.posY}%`, zoom: a.zoom !== 100 ? a.zoom : null };
  }).filter(Boolean);

  const copyValues = () => {
    const out = getOutput();
    if (!out.length) { alert('No changes yet!'); return; }
    const txt = out.map(o => {
      let l = `${o.name}: object-position: ${o.pos};`;
      if (o.zoom) l += ` scale: ${(o.zoom / 100).toFixed(2)};`;
      return l;
    }).join('\n');
    navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const presets = [
    { label: 'Face Top', x: 50, y: 15 },
    { label: 'Face Center', x: 50, y: 35 },
    { label: 'Center', x: 50, y: 50 },
    { label: 'Bottom', x: 50, y: 75 },
    { label: 'Left', x: 25, y: 40 },
    { label: 'Right', x: 75, y: 40 },
  ];

  const hasChanges = adj.posX !== 50 || adj.posY !== 50 || adj.zoom !== 100;

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.4rem', margin: 0 }}>📸 Image Position Tuner</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setShowAllPreview(!showAllPreview)} style={toolbarBtnStyle}>
            <HiOutlineEye size={15} /> {showAllPreview ? 'Hide' : 'Show'} Cards
          </button>
          <button onClick={resetAll} style={toolbarBtnStyle}><HiOutlineRefresh size={15} /> Reset All</button>
          <button onClick={copyValues} className="btn-primary" style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {copied ? <><HiOutlineCheck size={15} /> Copied!</> : <><HiOutlineClipboardCopy size={15} /> Copy Values</>}
          </button>
        </div>
      </div>

      {/* Instruction bar */}
      <div style={{ background: 'rgba(183,28,28,0.04)', border: '1px solid rgba(183,28,28,0.12)', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        💡 <strong>Drag</strong> the preview image to reposition. Use <strong>arrow keys</strong> for fine control (Shift = bigger step). <strong>+/-</strong> to zoom. Click a card below to select it.
      </div>

      {/* All Cards Preview — shown as a grid at the top */}
      {showAllPreview && (
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${TEAM_MEMBERS.filter(m => m.photo).length}, 1fr)`,
          gap: '0.75rem', marginBottom: '1.5rem',
        }}>
          {TEAM_MEMBERS.map((member, i) => {
            if (!member.photo) return null;
            const a = adjustments[i];
            const isSelected = selectedIndex === i;
            const isModified = a.posX !== 50 || a.posY !== 50 || a.zoom !== 100;
            return (
              <div
                key={i}
                onClick={() => setSelectedIndex(i)}
                style={{
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  border: isSelected ? '3px solid var(--crimson)' : '1px solid var(--border-light)',
                  background: 'var(--bg-white)', transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 16px rgba(183,28,28,0.15)' : 'none',
                }}
              >
                {/* Image — EXACT same ratio as the website card (220px height at ~280px width) */}
                <div style={{ width: '100%', aspectRatio: '280 / 220', position: 'relative', overflow: 'hidden', background: '#f3f4f6' }}>
                  <Image
                    src={member.photo} alt={member.name} fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: `${a.posX}% ${a.posY}%`,
                      transform: `scale(${a.zoom / 100})`,
                      transition: 'all 0.2s ease',
                    }}
                    sizes="250px"
                  />
                </div>
                <div style={{ padding: '0.5rem 0.6rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--crimson)', fontWeight: 500 }}>{member.role}</div>
                  {isModified && <div style={{ fontSize: '0.6rem', color: '#4CAF50', marginTop: '2px' }}>● modified</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Panel */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem',
        background: 'var(--bg-white)', border: '1px solid var(--border-light)',
        borderRadius: '14px', overflow: 'hidden',
      }}>
        {/* LEFT: Large interactive preview */}
        <div style={{ position: 'relative' }}>
          {/* Label */}
          <div style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 5,
            background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '4px 10px',
            borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, backdropFilter: 'blur(4px)',
          }}>
            {selected?.name} — Drag to reposition
          </div>

          {/* Position badge */}
          <div style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 5,
            background: 'rgba(0,0,0,0.65)', color: '#51cf66', padding: '4px 10px',
            borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'monospace', backdropFilter: 'blur(4px)',
          }}>
            {adj.posX}% {adj.posY}% {adj.zoom !== 100 && `· ${adj.zoom}%`}
          </div>

          {selected?.photo ? (
            <div
              onMouseDown={handleMouseDown}
              style={{
                width: '100%', aspectRatio: '280 / 220', position: 'relative', overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', background: '#1a1a2e',
              }}
            >
              <Image
                src={selected.photo} alt={selected.name} fill draggable={false}
                style={{
                  objectFit: 'cover',
                  objectPosition: `${adj.posX}% ${adj.posY}%`,
                  transform: `scale(${adj.zoom / 100})`,
                  transition: isDragging ? 'none' : 'all 0.15s ease',
                  pointerEvents: 'none',
                }}
                sizes="600px"
                priority
              />
              {/* Rule of thirds grid */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '33.33% 33.33%',
                opacity: isDragging ? 1 : 0, transition: 'opacity 0.2s ease',
              }} />
              {/* Border highlight on drag */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                border: isDragging ? '3px solid var(--crimson)' : '3px solid transparent',
                transition: 'border 0.15s ease',
              }} />
            </div>
          ) : (
            <div style={{ aspectRatio: '280 / 220', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', background: '#f3f4f6' }}>
              No photo
            </div>
          )}
        </div>

        {/* RIGHT: Controls */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'auto' }}>
          
          {/* Member name */}
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '2px' }}>{selected?.name}</h3>
            <span style={{ color: 'var(--crimson)', fontSize: '0.85rem', fontWeight: 500 }}>{selected?.role}</span>
            {hasChanges && <span style={{ marginLeft: '0.75rem', fontSize: '0.7rem', color: '#4CAF50', fontWeight: 600 }}>● Modified</span>}
          </div>

          {/* D-Pad + Position */}
          <div>
            <SectionLabel>Position</SectionLabel>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              {/* D-pad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 36px)', gridTemplateRows: 'repeat(3, 36px)', gap: '3px', flexShrink: 0 }}>
                <div />
                <DPadBtn onClick={() => nudge('posY', -5)}><HiArrowUp size={16} /></DPadBtn>
                <div />
                <DPadBtn onClick={() => nudge('posX', -5)}><HiArrowLeft size={16} /></DPadBtn>
                <DPadBtn onClick={resetCurrent} highlight>RST</DPadBtn>
                <DPadBtn onClick={() => nudge('posX', 5)}><HiArrowRight size={16} /></DPadBtn>
                <div />
                <DPadBtn onClick={() => nudge('posY', 5)}><HiArrowDown size={16} /></DPadBtn>
                <div />
              </div>
              {/* Sliders */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <SliderRow label="X" value={adj.posX} min={0} max={100} onChange={(v) => updateField('posX', v)} />
                <SliderRow label="Y" value={adj.posY} min={0} max={100} onChange={(v) => updateField('posY', v)} />
              </div>
            </div>
          </div>

          {/* Zoom */}
          <div>
            <SectionLabel>Zoom</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <SmallBtn onClick={() => nudge('zoom', -5)}><HiOutlineZoomOut size={16} /></SmallBtn>
              <input type="range" min="80" max="250" step="5" value={adj.zoom}
                onChange={(e) => updateField('zoom', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <SmallBtn onClick={() => nudge('zoom', 5)}><HiOutlineZoomIn size={16} /></SmallBtn>
              <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 700, minWidth: '40px', textAlign: 'right' }}>{adj.zoom}%</span>
            </div>
          </div>

          {/* Presets */}
          <div>
            <SectionLabel>Presets</SectionLabel>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {presets.map((p) => {
                const active = adj.posX === p.x && adj.posY === p.y;
                return (
                  <button key={p.label} onClick={() => { updateField('posX', p.x); updateField('posY', p.y); }}
                    style={{
                      padding: '4px 11px', fontSize: '0.72rem', borderRadius: '6px', cursor: 'pointer',
                      border: active ? '1.5px solid var(--crimson)' : '1px solid var(--border-light)',
                      background: active ? 'rgba(183,28,28,0.06)' : 'var(--bg-light)',
                      color: active ? 'var(--crimson)' : 'var(--text-secondary)',
                      fontWeight: active ? 700 : 400,
                    }}
                  >{p.label}</button>
                );
              })}
            </div>
          </div>

          {/* Live CSS output */}
          <div style={{
            background: '#1a1a2e', borderRadius: '8px', padding: '0.65rem 0.85rem',
            fontFamily: 'monospace', fontSize: '0.78rem', color: '#e0e0e0', lineHeight: 1.6, marginTop: 'auto',
          }}>
            <div style={{ color: '#666' }}>/* {selected?.name} */</div>
            <div>object-position: <span style={{ color: '#51cf66' }}>{adj.posX}% {adj.posY}%</span>;</div>
            {adj.zoom !== 100 && <div>transform: scale(<span style={{ color: '#51cf66' }}>{(adj.zoom / 100).toFixed(2)}</span>);</div>}
          </div>
        </div>
      </div>

      {/* Generated output block */}
      {getOutput().length > 0 && (
        <div style={{
          background: '#1a1a2e', color: '#e0e0e0', borderRadius: '10px',
          padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8, marginTop: '1.25rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ color: '#666' }}>/* All changes — Copy & paste to chat */</span>
            <button onClick={copyValues} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '3px 10px',
              borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <HiOutlineClipboardCopy size={13} /> Copy
            </button>
          </div>
          {getOutput().map((o, i) => (
            <div key={i}>
              <span style={{ color: '#ff6b6b' }}>{o.name}</span>: object-position: <span style={{ color: '#51cf66' }}>{o.pos}</span>;
              {o.zoom && <> scale: <span style={{ color: '#51cf66' }}>{(o.zoom / 100).toFixed(2)}</span>;</>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Tiny Sub-Components ── */

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
      {children}
    </div>
  );
}

function DPadBtn({ children, onClick, highlight }) {
  return (
    <button onClick={onClick} style={{
      width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--border-light)', borderRadius: '8px', cursor: 'pointer',
      background: highlight ? 'var(--crimson)' : 'var(--bg-light)',
      color: highlight ? '#fff' : 'var(--text-secondary)',
      fontSize: highlight ? '0.55rem' : 'inherit', fontWeight: highlight ? 800 : 400,
    }}>{children}</button>
  );
}

function SmallBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid var(--border-light)', borderRadius: '7px', cursor: 'pointer',
      background: 'var(--bg-light)', color: 'var(--text-secondary)', flexShrink: 0,
    }}>{children}</button>
  );
}

function SliderRow({ label, value, min, max, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '18px' }}>{label}:</span>
      <input type="range" min={min} max={max} step={1} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ flex: 1 }}
      />
      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

const toolbarBtnStyle = {
  padding: '7px 14px', borderRadius: '8px', fontSize: '0.82rem',
  display: 'flex', alignItems: 'center', gap: '5px',
  border: '1px solid var(--border-light)', background: 'var(--bg-light)',
  cursor: 'pointer', color: 'var(--text-secondary)',
};
