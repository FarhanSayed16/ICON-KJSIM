/**
 * Initials-based gradient avatar data URL when a photo is missing.
 */
export function getInitialsAvatar(name = '?', size = 200) {
  const initials = String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('') || '?';

  const colors = ['#B71C1C', '#1A237E', '#7B1FA2', '#1565C0', '#C62828'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const c1 = colors[Math.abs(hash) % colors.length];
  const c2 = colors[Math.abs(hash >> 3) % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
    font-family="Arial,sans-serif" font-size="${Math.round(size * 0.36)}" font-weight="700" fill="#fff">${initials}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
