# Site en Sanity live zetten

Stappen om zowel de Next.js-website (geulstraatamsterdam.nl) als Sanity Studio live te deployen.

---

## 1. Sanity Studio live (Sanity Cloud)

1. **CLI en inloggen**
   - In de projectroot (deze map, waar `studio/` staat):
     ```bash
     npm install -g @sanity/cli
     sanity login
     ```
   - Browser opent voor inloggen op Sanity.

2. **Deploy**
   - Vanuit projectroot:
     ```bash
     npm run deploy:studio
     ```
   - Of vanuit de `studio/` map: `npm run deploy`.
   - Kies bij eerste keer een hostnaam (bijv. `geulstraat`; in `studio/sanity.cli.js` staat al `studioHost: 'geulstraat'`).
   - Studio is daarna bereikbaar op: **https://geulstraat.sanity.studio**

3. **Dataset**
   - In [sanity.io/manage](https://sanity.io/manage) kun je bij je project een **production** dataset beheren. De studio gebruikt al `production`; geen wijziging nodig tenzij je een andere dataset wilt.

---

## 2. Next.js-site live (Vercel)

1. **Code in Git**
   - Zet het project in een Git-repo (GitHub/GitLab/Bitbucket) en push alle wijzigingen.

2. **Vercel-project**
   - Ga naar [vercel.com](https://vercel.com) → log in → **Add New Project**.
   - Importeer de repo; Vercel herkent Next.js.
   - **Root Directory**: als alleen deze map (de Next.js-app) in de repo staat, laat je die op de root. Staat de app in een submap, stel die dan in als root.

3. **Environment variables**
   - In Vercel: Project → **Settings** → **Environment Variables**.
   - Vul in (zie ook `.env.example`):

   | Naam | Waarde | Opmerking |
   |------|--------|-----------|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `vs1rb6mu` | Zelfde als in Studio |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` | |
   | `RESEND_API_KEY` | *(jouw Resend API key)* | Voor contactformulier |
   | `RECIPIENT_EMAIL` | `info@geulstraatamsterdam.nl` | Ontvanger contactformulier |

   Daarna opnieuw deployen (Redeploy).

4. **Domein**
   - In Vercel: Project → **Settings** → **Domains**.
   - Voeg `geulstraatamsterdam.nl` (en eventueel `www.geulstraatamsterdam.nl`) toe.
   - Zet bij je domeinprovider de DNS zoals Vercel aangeeft (A-record of CNAME).

---

## 3. CORS (Sanity)

- Ga naar [sanity.io/manage](https://sanity.io/manage) → jouw project → **API** → **CORS origins**.
- Voeg toe:
  - `https://geulstraatamsterdam.nl`
  - `https://www.geulstraatamsterdam.nl`
  - Eventueel de Vercel preview-URL (bijv. `https://*.vercel.app`) voor preview-deploys.

Zonder deze stappen kunnen verzoeken van de live site naar de Sanity API geblokkeerd worden.

---

## 4. Volgorde

1. Sanity deployen en controleren dat je op https://geulstraat.sanity.studio kunt inloggen.
2. Next.js op Vercel deployen met de juiste env vars.
3. CORS in Sanity instellen voor de live site-URL(s).
4. Contactformulier testen (Resend-domeinverificatie voor `geulstraatamsterdam.nl` indien nodig).

---

## 5. Handige commando’s

| Doel | Commando |
|------|----------|
| Sanity Studio lokaal | `cd studio && npm run dev` |
| Sanity deployen | `npm run deploy:studio` (vanuit projectroot) |
| Next.js lokaal | `npm run dev` |
| Next.js build (test) | `npm run build` |
