# Kiruthiga — Portfolio frontend (React + Vite + Tailwind)

Lavender-pink light theme. Reads all its content from the Django API (`/api/portfolio/`).
If the API is unreachable it shows the bundled snapshot in `src/fallback.json`, so the site never looks empty.

```
npm install
npm run dev        # http://localhost:5173  (talks to http://localhost:8000 by default)
npm run build      # production build in dist/
```

Set `VITE_API_URL` (see `.env.example`) to your deployed backend before building for production.
After editing content in the admin, run `python manage.py export_static` in `backend/` to refresh `src/fallback.json`
and the images/PDFs in `public/`.
