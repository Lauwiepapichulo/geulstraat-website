# Wat moet ik nog doen? (superkort)

## Lokaal de site zien met content

1. **Terminal openen**  
   In Cursor: onderaan op **Terminal** klikken (of toets **Ctrl+`** / **Cmd+`**).

2. **Dev server (her)starten**  
   In die terminal typen:
   ```bash
   npm run dev
   ```
   Als er al iets draait, eerst **Ctrl+C** doen, daarna opnieuw `npm run dev`.

3. **Site openen**  
   In je browser gaan naar: **http://localhost:3000**  
   Je zou nu de homepage met nieuws en buurtacties moeten zien.

4. **Klaar.**  
   Er is verder niets dat je handmatig hoeft in te vullen voor de basis. De Sanity-verbinding staat al goed (`.env.local` is aangemaakt).

---

## Optioneel later (als je wilt)

- **Contactformulier laten werken:** in Resend een API-key maken en in Vercel bij het project onder Settings → Environment variables toevoegen als `RESEND_API_KEY`.
- **Automatisch vertalen naar Engels:** DeepL API-key en Sanity write token toevoegen in Vercel (zelfde plek: Environment variables). Zonder dit werkt de site gewoon; alleen de automatische vertaling dan niet.

Voor nu: **stap 1–3** is genoeg.
