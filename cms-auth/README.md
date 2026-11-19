# cms-auth: inloggen met GitHub in de beheeromgeving

Sveltia CMS (`/admin`) praat met GitHub namens de redacteur en heeft daarvoor een GitHub-token nodig. De knop
**Sign in with GitHub** haalt dat token op via OAuth. Voor OAuth is een *client secret* nodig, en dat mag niet
in de browser staan. Daarom draait deze kleine hulpserver apart op RITA. Zonder `base_url` stuurt Sveltia
de inlog naar Netlify, en dat werkt alleen voor sites die op Netlify draaien: dan zie je "Not Found".

```
/admin ──popup──→ cms-auth/auth ──302──→ github.com (toestemming) ──→ cms-auth/callback
   ↑                                                                       │ code → token (met secret)
   └──────────── postMessage "authorization:github:success:{token}" ───────┘ alleen naar ALLOWED_ORIGINS
```

- `server.mjs` is alles: Node 22, geen dependencies. Er wordt niets opgeslagen. Het token is dat van de
  redacteur zelf, met diens eigen rechten.
- De `state`-parameter staat ook in een HttpOnly-cookie. Bij `/callback` moeten die twee gelijk zijn, anders
  volgt een 400 en wordt GitHub niet gevraagd.
- De popup geeft het token alleen aan een venster waarvan de origin in `ALLOWED_ORIGINS` staat.
- Tests: `tests/cms-auth.test.mjs` (draait mee met `docker compose run --rm cli npm test`).

## Zoals het nu staat

| Onderdeel | Waarde |
|---|---|
| Adres | `https://cms-auth.responsible-it.nl` (`/auth`, `/callback`, `/health`) |
| DNS | A-record `cms-auth.responsible-it.nl` → `185.88.141.173` (Greenhost) |
| GitHub OAuth App | onder de organisatie **responsibleIT** (Settings → Developer settings → OAuth Apps) |
| Coolify-app | `rit-cms-auth` (`b0n7ajzb9vqseviqtjkzbgvb`), Werkplaats applications → production |
| Bron | Public GitHub, `responsibleIT/rit-website-eleventy`, branch `main`, base directory `/cms-auth`, Dockerfile `/Dockerfile`, poort 3000 |
| CMS | `backend.base_url: https://cms-auth.responsible-it.nl` in `src/admin/schema.yml` |

Omgevingsvariabelen (in Coolify, niet in de repo):

| Variabele | Inhoud |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID van de OAuth App |
| `GITHUB_CLIENT_SECRET` | client secret van de OAuth App (geheim) |
| `ALLOWED_ORIGINS` | kommagescheiden origins van `/admin`-pagina's, nu `https://preview.responsible-it.nl,https://rit.paws.home` |

## Opnieuw opzetten (stap voor stap)

Zo is het ingericht. Volg dezelfde stappen voor een nieuw domein of een nieuwe server.

1. **DNS.** Maak een A-record voor de helper (bijv. `cms-auth.responsible-it.nl` → IP van de server).
   Subdomeinen hebben elk een eigen record nodig, want er is geen wildcard. Doe dit vóór de eerste deploy:
   Traefik probeert het Let's Encrypt-certificaat maar één keer, en pas bij de volgende deploy opnieuw.
2. **GitHub OAuth App.** Een eigenaar van de organisatie opent
   <https://github.com/organizations/responsibleIT/settings/applications/new> en vult in:
   - *Application name*: `RIT website CMS` (dit zien redacteuren op het toestemmingsscherm)
   - *Homepage URL*: `https://preview.responsible-it.nl`
   - *Authorization callback URL*: `https://cms-auth.responsible-it.nl/callback`
   - *Enable Device Flow*: uit

   Klik daarna op *Register application*, kopieer de **Client ID** en klik op **Generate a new client secret**.
   GitHub toont het secret maar één keer. Omdat de app van de organisatie zelf is, blokkeren de
   OAuth-beperkingen van de organisatie hem niet.
3. **Coolify-app.** Maak een nieuwe resource: *Public Repository*,
   `https://github.com/responsibleIT/rit-website-eleventy`, branch `main`, build pack **Dockerfile**,
   base directory `/cms-auth`, poort `3000`, domein `https://cms-auth.responsible-it.nl`.
   Via de API kan het ook (`POST /api/v1/applications/public`, met `"instant_deploy": false`).
4. **Omgevingsvariabelen.** Zet `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` en `ALLOWED_ORIGINS` in de app
   (*Environment Variables*). Zonder deze drie start de server niet.
5. **Deploy** in Coolify. Controleer daarna:
   ```bash
   curl https://cms-auth.responsible-it.nl/health        # ok
   curl -sI 'https://cms-auth.responsible-it.nl/auth?provider=github&scope=repo,user' | grep -i location
   #   → https://github.com/login/oauth/authorize?client_id=<jouw id>&…
   ```
6. **CMS laten verwijzen.** Zet `base_url` onder `backend:` in `src/admin/schema.yml` en push naar `main`.
   CI bouwt de site en `/admin/config.yml` bevat dan de `base_url`.
7. **Testen.** Ga naar `/admin`, klik op *Sign in with GitHub*, geef toestemming. De popup sluit en de
   beheeromgeving laadt.

Leg elke wijziging aan Coolify of de server vast in het wijzigingslog van `host-audit-responsible-it.md`
(in de werkmap boven deze repo).

## Beheer

- **Code van de helper gewijzigd?** CI deployt alleen de site, niet deze app. Klik in Coolify op *Redeploy*
  bij `rit-cms-auth`, of gebruik `POST /api/v1/deploy?uuid=b0n7ajzb9vqseviqtjkzbgvb`.
- **Site naar een ander domein** (bijv. `responsible-it.nl`): voeg de nieuwe origin toe aan
  `ALLOWED_ORIGINS` en redeploy. Pas de *Homepage URL* van de OAuth App aan als je wilt. De callback-URL
  blijft gelijk zolang de helper op `cms-auth.` blijft.
- **Secret vervangen:** maak in de OAuth App een nieuw secret aan, zet het in Coolify, redeploy en verwijder
  daarna het oude secret in GitHub.
- **Nieuwe redacteur:** geef die schrijfrechten op de repository (direct of via een team). Aan de helper
  hoeft niets te veranderen.
- **Lokaal** (`docker compose up -d dev`, `http://localhost:…`): die origin staat niet in `ALLOWED_ORIGINS`.
  Log daar in met *Sign in with Token*: een fine-grained token voor deze repository met Contents en Pull
  requests op lezen en schrijven.

## Als het niet werkt

| Wat je ziet | Oorzaak |
|---|---|
| Popup naar `api.netlify.com` met "Not Found" | `base_url` ontbreekt in `/admin/config.yml`, of de oude versie zit nog in de cache |
| Popup blijft open met "Signed in, you can close this window." en de CMS logt niet in | de origin van `/admin` staat niet in `ALLOWED_ORIGINS` |
| "Login expired or invalid" | de popup deed er langer dan 10 minuten over, of cookies voor `cms-auth.` zijn geblokkeerd |
| `incorrect_client_credentials` / `bad_verification_code` | Client ID of secret in Coolify klopt niet |
| GitHub meldt "redirect_uri is not associated with this application" | de callback-URL in de OAuth App wijkt af van `https://<helper>/callback` |
| Certificaatfout op `cms-auth.` | de DNS ontbrak bij de eerste deploy: redeploy, dan vraagt Traefik het certificaat opnieuw aan |
| Inloggen lukt, maar opslaan geeft 403/404 | het GitHub-account heeft geen schrijfrechten op de repository |
