@echo off
cd /d "c:\Users\DELL\Downloads\aurora-luxe-ecommerce"
git add .
git commit -m "feat: redesign Featured Collections section + fix Axios Network Error

- Redesigned FeaturedCollection.tsx with Playfair Display heading, luxury
  editorial 2-col grid (large hero + stacked small cards + wide banner)
- Compact card heights (420px / 320px / 340px desktop), warm radial bg,
  gold micro-dot texture, bottom gradient overlays, always-visible CTAs
- Added Imperial Combos as 4th collection card
- Fixed AxiosError Network Error: updated .env.local and api.ts fallback
  from dead localhost:3001 to live Render backend (aurora-luxe.onrender.com)
- Fixed hardcoded 127.0.0.1:3001 fallback in page.tsx SSR fetcher
- Added 15s timeout for Render cold starts + response error interceptor
- Fixed backend CORS: explicit origin allowlist (localhost:3000, Vercel)"
git push origin main
