# provider.ai-web

Provider.ai web application built with React, TypeScript, Vite and Tailwind CSS.

## Getting started

Use Node.js 22 or newer.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:5173. The example environment enables API mode. Run the Provider.ai API separately on http://127.0.0.1:4000; the development server proxies `/v1` and `/health` to it. For local design work with mock data, set `VITE_DATA_MODE=mock` in `.env.local`.

## Checks and build

```bash
npm run typecheck
npm test
npm run build
```

Build output is written to `dist/`. Production hosting must serve the frontend and route API requests to the separately deployed API. Variables prefixed with `VITE_` are public browser configuration and must not contain secrets.
