# Plan: waarom werkt Sanity / Engels niet?

## Mogelijke oorzaken

### 1. Sanity niet verbonden (geen content)
- **Check:** Is `.env.local` aanwezig met `NEXT_PUBLIC_SANITY_PROJECT_ID=vs1rb6mu` en `NEXT_PUBLIC_SANITY_DATASET=production`?
- **Zonder:** De client valt terug op `your-project-id` → Sanity API geeft geen data → lege homepage/nieuws.
- **Fix:** Juiste env vars lokaal en op Vercel.

### 2. Engels: cookie / locale
- **Check:** Bij "Engels" selecteren zet LanguageContext een cookie (`locale=en`) en doet `router.refresh()`. Ziet de server die cookie?
- **Mogelijk:** Cookie wordt niet gezet (path/domain), of `getLocale()` faalt en geeft altijd `nl`.
- **Fix:** getLocale() had al try/catch; controleren of cookie-naam overal hetzelfde is (LOCALE_COOKIE_NAME).

### 3. Engels: vertaling (DeepL / Sanity write)
- **Check:** Zijn `DEEPL_API_KEY` en `SANITY_API_WRITE_TOKEN` gezet? Zonder die geeft `ensurePostTranslated` null → we tonen NL content (geen crash).
- **Mogelijk:** Vertaling faalt (quota, netwerk) → we vangen af maar tonen dan NL.

### 4. Schema / GROQ
- **Check:** Sanity-schema heeft `title_en`, `body_en` etc. Oude documenten hebben die velden niet; GROQ geeft dan null/leeg. We vallen terug op NL, dus dat zou moeten werken.
- **Mogelijk:** Als de query zelf faalt (bijv. onbekend veld in oude dataset), zou fetch kunnen falen.

---

## Beslissing: terug naar veilige versie

Omdat niet duidelijk is of het probleem lokaal (env), cookie, of vertaling is: **terug naar de versie die live werkt.**

- **Blijft:** UI-taal (navigatie, knoppen) via LanguageContext + translations.ts; wanneer je Engels kiest, worden alleen die teksten Engels.
- **Wordt teruggedraaid:** Server-side `getLocale()` en EN-content (nieuws/buurtacties altijd Nederlands uit Sanity). Geen `ensurePostTranslated` / `ensureBuurtActieTranslated` op de pagina’s.
- **Resultaat:** Site gedraagt zich weer als de huidige live versie: altijd Nederlandse content uit Sanity, alleen de vaste teksten (nav, knoppen) wisselen van taal.

De Engelse velden in Sanity en de vertaal-API kunnen blijven bestaan voor later; ze worden alleen niet meer gebruikt op de pagina’s.
