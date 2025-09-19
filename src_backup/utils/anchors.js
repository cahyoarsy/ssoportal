export function navigateHash(href, options = { smooth: true }) {
  if (!href || typeof href !== 'string' || !href.startsWith('#')) return;
  const id = href.slice(1);
  try {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ behavior: options.smooth ? 'smooth' : 'auto', block: 'start' });
    }
    if (typeof window !== 'undefined' && window.location) {
      try {
        window.location.hash = href;
        if (window.location.hash !== href && typeof window.location.assign === 'function') {
          // Fallback for JSDOM / strict environments
          window.location.assign(href);
        }
      } catch (_) {
        try {
          if (typeof window.location.assign === 'function') {
            window.location.assign(href);
          }
        } catch (__) {
          // ignore
        }
      }
      try {
        // Testing aid: record last navigated hash
        window.__NAV_HASH = href;
        window.dispatchEvent(new Event('hashchange'));
      } catch (_) { /* noop */ }
    }
  } catch (_) {
    // no-op in non-DOM environment
  }
}

export function handleAnchorClick(e, href) {
  if (href && href.startsWith('#')) {
    e.preventDefault();
    navigateHash(href);
  }
}
