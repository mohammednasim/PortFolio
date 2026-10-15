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


## Replace the avatar
The current interactive 3D hero uses the uploaded portrait as a textured 3D card inside a Three.js scene. Replace:

`public/assets/nasim.jpg`

with another portrait if needed.

For a true rigged 3D human, export a `.glb`/`.gltf` character from Blender or another 3D workflow and replace `PortraitCard` in `src/components/Scene.jsx` with a Drei `useGLTF` model.

## Resume
The uploaded resume is copied to:

`public/assets/Mohammed-Nasim-Resume.pdf`

## Contact form
The contact form uses a `mailto:` action so it works without a backend. For production, connect it to Formspree, Resend, EmailJS, a serverless function, or your own API.
