// GitHub OAuth helper for Sveltia CMS (the `backend.base_url` in src/admin/schema.yml).
//
// The CMS opens a popup on  /auth?provider=github&scope=…  → we redirect to GitHub's consent page →
// GitHub returns to /callback?code=…&state=… → we swap the code for a token (that needs the client
// secret, which is why this can't run in the browser) and hand the token to the CMS window with the
// Netlify/Decap postMessage handshake. The token is the editor's own; nothing is stored here.
//
// Env: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (OAuth App of the responsibleIT org),
//      ALLOWED_ORIGINS (comma-separated origins of the /admin pages allowed to receive a token),
//      PORT (default 3000). No dependencies: Node 22's built-in http and fetch.

import { createServer } from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const STATE_COOKIE = 'cms_auth_state';
const DEFAULT_SCOPE = 'repo,user';

export function createApp({ clientId, clientSecret, allowedOrigins, fetchImpl = fetch }) {
  if (!clientId || !clientSecret) throw new Error('GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required');
  if (!allowedOrigins?.length) throw new Error('ALLOWED_ORIGINS is required');

  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/health') return send(res, 200, 'ok', 'text/plain');

      if (url.pathname === '/auth') {
        if (url.searchParams.get('provider') !== 'github') {
          return send(res, 400, page('error', 'Unsupported provider', allowedOrigins));
        }
        const requested = url.searchParams.get('scope') ?? '';
        const scope = /^[a-z:_,]+$/.test(requested) ? requested : DEFAULT_SCOPE;
        const state = randomBytes(16).toString('hex');
        const target = new URL('https://github.com/login/oauth/authorize');
        target.search = new URLSearchParams({ client_id: clientId, scope, state }).toString();
        res.writeHead(302, {
          Location: target.toString(),
          'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store',
        });
        return res.end();
      }

      if (url.pathname === '/callback') {
        const clear = `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state') ?? '';
        const expected = readCookie(req.headers.cookie, STATE_COOKIE) ?? '';
        if (!code || !sameString(state, expected)) {
          return send(res, 400, page('error', 'Login expired or invalid; please try again.', allowedOrigins), 'text/html', clear);
        }
        const r = await fetchImpl('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
        });
        const body = await r.json().catch(() => ({}));
        if (!r.ok || !body.access_token) {
          const message = body.error_description || body.error || `GitHub returned ${r.status}`;
          return send(res, 502, page('error', message, allowedOrigins), 'text/html', clear);
        }
        return send(res, 200, page('success', body.access_token, allowedOrigins), 'text/html', clear);
      }

      return send(res, 404, 'Not found', 'text/plain');
    } catch (err) {
      console.error(err);
      return send(res, 500, page('error', 'Internal error', allowedOrigins));
    }
  };
}

// The popup page. It announces itself to the CMS window ("authorizing:github"); the CMS answers
// from its own origin, and only if that origin is allowed does the page post the result back to it.
function page(status, value, allowedOrigins) {
  const content = status === 'success'
    ? { token: value, provider: 'github' }
    : { message: value, provider: 'github' };
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
  return `<!doctype html><meta charset="utf-8"><title>Sign in</title>
<p>${status === 'success' ? 'Signed in, you can close this window.' : 'Sign-in failed: ' + escapeHtml(value)}</p>
<script>
(function () {
  var allowed = ${js(allowedOrigins)}, message = ${js(message)};
  if (!window.opener) return;
  window.addEventListener('message', function (e) {
    if (allowed.indexOf(e.origin) === -1 || e.data !== 'authorizing:github') return;
    window.opener.postMessage(message, e.origin);
  });
  window.opener.postMessage('authorizing:github', '*');
})();
</script>`;
}

function send(res, status, body, type = 'text/html', cookie) {
  const headers = { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' };
  if (cookie) headers['Set-Cookie'] = cookie;
  res.writeHead(status, headers);
  res.end(body);
}

function readCookie(header, name) {
  for (const part of (header ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return undefined;
}

function sameString(a, b) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const app = createApp({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  });
  const port = Number(process.env.PORT ?? 3000);
  createServer(app).listen(port, () => console.log(`cms-auth listening on :${port}`));
}
