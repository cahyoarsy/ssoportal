E-LEARNING IML (EMBEDDED VERSION)
---------------------------------

This directory contains a trimmed, embedded-friendly copy of the E-Learning Instalasi Motor Listrik application for integration into the SSO Portal.

Key Adjustments:
1. Added SSO postMessage handshake in index.html:
   - Sends { type: 'EMBED_READY', app: 'elearning-iml' } on load
   - Listens for { type: 'SSO_TOKEN', token } and { type: 'THEME_SYNC', dark }
   - Displays a compact top banner with email / role / TTL / jti
   - Provides a logout button that posts { type: 'SSO_LOGOUT', app: 'elearning-iml' }
2. Removed internal login dependency: authentication is driven by SSO token only.
3. Added lightweight dark theme toggle compatibility (html.dark).
4. Reduced content pages (modul-ajar, materi, pre-test, post-test) to concise demo versions.
5. Static assets duplicated locally (styles.css + supporting HTML partials).

Integration Notes:
- Portal adds this app via APPS list (id: elearning-iml, path: elearning-iml/index.html)
- Theme broadcast is triggered whenever user toggles dark/light in portal.
- Token refresh events automatically update countdown (TTL) because portal re-sends SSO_TOKEN after refresh.

Local Dev:
- Serve portal root (one level above) so public/elearning-iml is accessible.
- Example (PowerShell):
  npx serve -p 5500 d:\Website
  Open: http://localhost:5500/sso-portal/

Security Placeholder:
- JWT is mock (alg none / demo signature). Replace with signed token in production.
- For production, remove exposed debug banners or restrict to admin.

License / Attribution:
Original full-feature code retained separately in elearning-iml root project. This embedded copy is for demonstration inside SSO portal only.
