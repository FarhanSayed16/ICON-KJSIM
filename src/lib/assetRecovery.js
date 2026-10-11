export const RELOAD_KEY = 'icon_asset_reload_at';
export const RELOAD_COOLDOWN_MS = 20000;

/**
 * Runs inline in <head> before any CSS/JS loads. A page whose HTML outlived the
 * dev server build (restart, cache wipe, disposed route) references /_next files
 * that now 404 — the user sees bare HTML. Reload once to fetch fresh HTML; the
 * cooldown prevents a reload loop if the asset is genuinely missing.
 */
export const assetRecoveryScript = `(function(){
var K=${JSON.stringify(RELOAD_KEY)},C=${RELOAD_COOLDOWN_MS};
function r(){try{var t=+sessionStorage.getItem(K)||0;if(Date.now()-t<C)return;sessionStorage.setItem(K,String(Date.now()));}catch(e){}location.reload();}
window.__iconReload=r;
window.addEventListener('error',function(e){var t=e.target;if(!t||!t.tagName)return;var g=t.tagName;if(g!=='LINK'&&g!=='SCRIPT')return;var u=String(t.href||t.src||'');if(u.indexOf('/_next/')!==-1)r();},true);
})();`;

export function reloadForStaleAssets() {
  if (typeof window === 'undefined') return;
  if (typeof window.__iconReload === 'function') {
    window.__iconReload();
    return;
  }
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    /* sessionStorage blocked */
  }
  window.location.reload();
}

export function isStaleChunkError(reason) {
  if (!reason) return false;
  const name = reason.name || '';
  const message = String(reason.message || reason || '');
  return (
    name === 'ChunkLoadError' ||
    message.includes('Loading chunk') ||
    message.includes('Loading CSS chunk') ||
    message.includes('Failed to load chunk') ||
    message.includes('enqueueModel') ||
    message.includes('frame.join is not a function') ||
    message.includes('Failed to find Server Action') ||
    message.includes('/_next/_next/')
  );
}
