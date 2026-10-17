# Mohammed Nasim P — 3D Portfolio

A futuristic, responsive React + Three.js portfolio for Mohammed Nasim P.

## Stack
- Vite + React
- Three.js / React Three Fiber
- Drei
- Framer Motion
- Lucide React
- GSAP dependency included for future scroll choreography

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown by the server, normally:

```text
http://localhost:5173
```

### Toolchains

This project ships **two** toolchains:

| Script | Tool | Notes |
| --- | --- | --- |
| `npm run dev` | **Webpack** (`webpack-dev-server`) | Pure-JavaScript toolchain — works on all machines, including ones where Windows Smart App Control / WDAC blocks native build binaries (`rollup.win32-x64-msvc.node`, `esbuild.exe`). |
| `npm run build` | **Webpack** | Production bundle in `dist/`. |
| `npm run dev:vite` | **Vite** | Original toolchain; faster, but requires native binaries to be executable. |
| `npm run build:vite` / `npm run preview:vite` | **Vite** | Same as above. |

> **Note:** If your Windows machine has Smart App Control (or an Application Control / Device Guard policy) turned **on**, native binaries shipped inside npm packages — such as rollup's `.node` binding and esbuild's `esbuild.exe` — are blocked at the OS level, and any Vite command will crash with `ERR_DLOPEN_FAILED: An Application Control policy has blocked this file`. Use the default `npm run dev` / `npm run build` (webpack) there, or turn Smart App Control off in *Windows Security → App & browser control* (irreversible — it cannot be re-enabled without resetting Windows) to restore the Vite workflow.

## Build

```bash
npm run build        # webpack -> dist/
npm run preview      # vite preview (static server for dist/)
```


## Backend API

An Express 5 service in `server/` provides the portfolio content and the
interactive features. It stores enquiries, analytics and assistant messages in
SQLite via Node's built-in `node:sqlite` (no native dependency).

```bash
cp .env.example .env     # then fill in what you need (all optional)
npm run server           # API on http://localhost:8787
npm run server:dev       # same, with --watch
npm run start            # API serving the built dist/ on one origin
npm run dev:full         # frontend dev server + API together
```

Everything degrades gracefully: with no `.env` the API still serves content,
stores enquiries in `data/portfolio.db`, and answers the assistant from its
local knowledge engine.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/portfolio`, `/projects`, `/skills`, `/services`, `/experience`, `/education`, `/certifications`, `/achievements` | Portfolio content (shared with the frontend through `src/data/portfolio.js`) |
| `GET /api/stats/public` | Public counters used by the hero stats strip |
| `POST /api/contact` | Validated + rate-limited enquiry form, returns a reference ticket |
| `POST /api/chat` | Portfolio assistant — Gemini when `GEMINI_API_KEY` is set, local knowledge engine otherwise |
| `POST /api/analytics/events` | Page views, project views, resume downloads, outbound clicks |
| `GET /api/health` | Service status and enabled features |

Set `SMTP_*` + `CONTACT_TO` to email enquiries, `GEMINI_API_KEY` for AI answers,
and `ADMIN_TOKEN` to unlock `GET /api/admin/messages`.

When the API is unreachable the frontend silently falls back to the bundled
static content, so the site never renders empty.

## Replace the avatar
The hero character is a transparent PNG so it composites over the animated
background — no frame, no border:

`public/assets/nasim-character.png`

Replace it with any cut-out character image (identical name, transparent
background) and the glow, rings and cursor interaction keep working. The
character follows the cursor and, while the pointer is over it, the hero copy
slides to the opposite side — driven by the `--px` / `--py` / `--pull` custom
properties written in `src/lib/useHeroPointer.js`.

## Resume
The uploaded resume is copied to:

`public/assets/Mohammed-Nasim-Resume.pdf`

## Contact form
The form posts to `POST /api/contact`. The API validates the payload with Zod,
stores the enquiry with a reference ticket, and emails it when SMTP is
configured. Field-level validation errors are surfaced inline in the form.
