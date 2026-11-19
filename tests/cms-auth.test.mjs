import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createApp } from '../cms-auth/server.mjs';

const ORIGINS = ['https://preview.responsible-it.nl'];

async function withServer(fetchImpl, fn) {
  const server = createServer(createApp({ clientId: 'cid', clientSecret: 'secret', allowedOrigins: ORIGINS, fetchImpl }));
  await new Promise((r) => server.listen(0, r));
  try {
    return await fn(`http://127.0.0.1:${server.address().port}`);
  } finally {
    server.close();
  }
}

test('/auth redirects to GitHub with a state that is also set as a cookie', () =>
  withServer(fetch, async (base) => {
    const r = await fetch(`${base}/auth?provider=github&scope=repo,user`, { redirect: 'manual' });
    assert.equal(r.status, 302);
    const loc = new URL(r.headers.get('location'));
    assert.equal(loc.origin + loc.pathname, 'https://github.com/login/oauth/authorize');
    assert.equal(loc.searchParams.get('client_id'), 'cid');
    assert.equal(loc.searchParams.get('scope'), 'repo,user');
    assert.match(r.headers.get('set-cookie'), new RegExp(`cms_auth_state=${loc.searchParams.get('state')};.*HttpOnly`));
  }));

test('/auth rejects other providers', () =>
  withServer(fetch, async (base) => {
    assert.equal((await fetch(`${base}/auth?provider=gitlab`)).status, 400);
  }));

test('/callback refuses a state that does not match the cookie, without calling GitHub', () => {
  let called = false;
  return withServer(async () => { called = true; }, async (base) => {
    const r = await fetch(`${base}/callback?code=x&state=aaaa`, { headers: { cookie: 'cms_auth_state=bbbb' } });
    assert.equal(r.status, 400);
    assert.equal(called, false);
    assert.doesNotMatch(await r.text(), /authorization:github:success/);
  });
});

test('/callback swaps the code for a token and only posts it to allowed origins', () => {
  const fakeGitHub = async (url, init) => {
    assert.equal(url, 'https://github.com/login/oauth/access_token');
    assert.deepEqual(JSON.parse(init.body), { client_id: 'cid', client_secret: 'secret', code: 'abc' });
    return new Response(JSON.stringify({ access_token: 'gho_token</script>' }), { status: 200 });
  };
  return withServer(fakeGitHub, async (base) => {
    const r = await fetch(`${base}/callback?code=abc&state=s1`, { headers: { cookie: 'cms_auth_state=s1' } });
    assert.equal(r.status, 200);
    const html = await r.text();
    assert.match(html, /authorization:github:success:/);
    assert.match(html, /gho_token\\u003c\/script>/); // no early </script>
    assert.ok(html.includes(JSON.stringify(ORIGINS)));
    assert.match(r.headers.get('set-cookie'), /cms_auth_state=;.*Max-Age=0/);
  });
});

test('/callback reports a GitHub error', () =>
  withServer(async () => new Response(JSON.stringify({ error: 'bad_verification_code' }), { status: 200 }), async (base) => {
    const r = await fetch(`${base}/callback?code=abc&state=s1`, { headers: { cookie: 'cms_auth_state=s1' } });
    assert.equal(r.status, 502);
    assert.match(await r.text(), /authorization:github:error:.*bad_verification_code/);
  }));
