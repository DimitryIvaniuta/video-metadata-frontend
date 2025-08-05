# Video Metadata Frontend

Production‑grade React + TypeScript SPA for importing and managing video metadata from providers (e.g., YouTube), with JWT authentication and a GraphQL backend.

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [Features](#features)
* [Route Map](#route-map)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Development](#development)
* [Styling](#styling)
* [GraphQL & Codegen](#graphql--codegen)
* [Authentication & Session Lifecycle](#authentication--session-lifecycle)
* [Configuration](#configuration)
* [Testing / Linting](#testing--linting)
* [Production Build & Deploy](#production-build--deploy)
* [Troubleshooting](#troubleshooting)
* [Contributing](#contributing)
* [License](#license)

---

## Tech Stack

* **Runtime:** React 19 + TypeScript, Vite 7
* **GraphQL:** Apollo Client v3, code generation via `@graphql-codegen/*`
* **Auth:** JWT (HS‑256 now, RS‑256 after rotation), refresh via `/api/auth/refresh`
* **Styles:** Tailwind CSS v4 (`@tailwindcss/vite`) + project‑level `SCSS` utilities
* **Router:** `react-router-dom` v7
* **Testing:** Vitest + Testing Library
* **Build tooling:** pnpm, ESLint, Prettier, husky, lint‑staged

---

## Features

* Authenticate once via `POST /api/auth/login`; JWT stored in `localStorage`
* All runtime data fetched via a **single endpoint**: `POST /api/graphql`
* Apollo link stack adds `Authorization: Bearer <token>` to every request
* Automatic token validation, auto‑logout at expiration, and silent token **rotation** on 401 using `POST /api/auth/refresh`
* Strongly typed React hooks generated from the live schema
* Import flows: single video and channel
* Admin screens to list and edit users

---

## Route Map

| Route                    | Component              | Permissions |
| ------------------------ | ---------------------- | ----------- |
| `/login`                 | `<LoginPage/>`         | Public      |
| `/signup`                | `<SignupPage/>`        | Public      |
| `/` (or `/dashboard`)    | `<DashboardPage/>`     | `USER`      |
| `/videos/import`         | `<ImportSinglePage/>`  | `USER`      |
| `/videos/import/channel` | `<ImportChannelPage/>` | `USER`      |
| `/videos`                | `<VideoListPage/>`     | `USER`      |
| `/users`                 | `<UserListPage/>`      | `ADMIN`     |
| `/users/:id`             | `<UserEditPage/>`      | `ADMIN`     |

> Route guards are implemented via the Auth context and router wrappers.

---

## Project Structure

```
video-metadata-frontend/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ lib/
│  │  └─ apolloClient.ts                # Apollo Client + auth & error links
│  ├─ contexts/
│  │  └─ AuthContext.tsx                # JWT session, auto‑logout/refresh
│  ├─ components/
│  │  └─ Modal.tsx                      # Reusable portal‑based modal
│  ├─ graphql/
│  │  ├─ generated/                     # codegen output (hooks/types)
│  │  └─ **/*.graphql                   # operations (queries/mutations)
│  ├─ pages/
│  │  ├─ DashboardPage.tsx
│  │  ├─ LoginPage.tsx
│  │  ├─ SignupPage.tsx
│  │  ├─ ImportSinglePage.tsx
│  │  ├─ ImportChannelPage.tsx
│  │  ├─ VideoListPage.tsx
│  │  ├─ UserListPage.tsx
│  │  └─ UserEditPage.tsx
│  └─ styles/
│     ├─ index.css                      # Tailwind entry (@tailwind …)
│     └─ core.scss                      # Project SCSS utilities (cards, toolbar, etc.)
├─ codegen.yml                          # GraphQL Code Generator config
├─ tailwind.config.cjs                  # Tailwind v4 config (CJS under ESM project)
├─ postcss.config.cjs                   # PostCSS pipeline using @tailwindcss/postcss
├─ vite.config.ts
├─ tsconfig.json
├─ dev-with-links.mjs                   # Vite wrapper w/ clickable compiler links
└─ README.md
```

---

## Getting Started

### Prerequisites

* **Node** ≥ 20.x
* **pnpm** ≥ 8.x (`corepack enable` or install from pnpm.io)
* Backend GraphQL service running at `http://localhost:8080` (see proxy below)

### Install

```bash
pnpm install
```

### Tailwind CSS (already set up)

* `tailwind.config.cjs` with `content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']`
* `postcss.config.cjs` uses `@tailwindcss/postcss` + `autoprefixer`
* `vite.config.ts` includes the plugin:

  ```ts
  import tailwindcss from '@tailwindcss/vite';
  export default defineConfig({ plugins: [react(), tailwindcss()] });
  ```

---

## Development

### Scripts

```bash
pnpm run dev        # starts Vite via dev-with-links (clickable error links)
pnpm run build      # production build
pnpm run preview    # preview the production build
pnpm run test       # unit/integration tests (Vitest)
pnpm run typecheck  # TS in --watch mode
pnpm run codegen    # regenerate GraphQL hooks/types from live schema
```

### Dev server

* Frontend dev server: `http://localhost:5173`
* Vite proxy forwards `/api/*` → `http://localhost:8080` (backend)

> The browser only calls **`POST /api/graphql`** for data and **`POST /api/auth/login`** for the initial login. Refresh is done via **`POST /api/auth/refresh`**.

---

## Styling

* Utility‑first styling with **Tailwind v4** (`@tailwindcss/vite` plugin)
* App‑specific patterns (alert banner, metric cards, toolbar) live in `src/styles/core.scss`
* Import order in `src/main.tsx`:

  ```ts
  import './styles/index.css';  // Tailwind base/components/utilities
  import './styles/core.scss';  // Project SCSS helpers
  ```
* Brand palette (editable in `tailwind.config.cjs`): `primary`, `secondary`, `success`

---

## GraphQL & Codegen

* Live schema pulled from: `http://localhost:8080/api/graphql`
* Operation documents live in: `src/graphql/**/*.graphql`
* Generated output: `src/graphql/generated/` (types + React Apollo hooks)

### Typical workflow

1. Create/modify `.graphql` operations (queries/mutations)
2. Run `pnpm run codegen`
3. Import generated hooks, e.g. `useLoginMutation`, `useMeQuery`, etc.

> The project is configured to produce **fully typed hooks** and operation types. Add custom scalars in `codegen.yml` if needed (e.g., `DateTime`).

---

## Authentication & Session Lifecycle

* **Login:** `POST /api/auth/login` → `{ token, expiresAt }`

    * Token persisted to `localStorage` under `jwtToken`
    * `AuthContext` validates token (`exp` claim), schedules auto‑logout at expiration, and exposes `login()`/`logout()`
* **Per‑request auth:** Apollo `authLink` injects `Authorization: Bearer <token>`
* **Rotation:** Apollo `errorLink` catches 401s, calls `POST /api/auth/refresh` (with cookies), stores new token, **retries** the failed operation
* **Auto‑logout:** timer triggers exactly at `exp` → clears token & redirects to `/login`

> Only `/api/graphql` is called from the SPA for data. Auth endpoints are `/api/auth/login` and `/api/auth/refresh`.

---

## Configuration

### Vite proxy (in `vite.config.ts`)

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### TypeScript

* Uses `"moduleResolution": "bundler"` to avoid extension suffixes in imports
* Includes vite/vitest types; strict mode is enabled

---

## Testing / Linting

* **Vitest** configured with `jsdom` test environment
* **ESLint** + **Prettier** enforced via husky pre‑commit hook

```bash
pnpm run test
pnpm run lint   # if you add an explicit lint script
```

---

## Production Build & Deploy

```bash
pnpm run build
```

Outputs to `dist/`. Serve statically behind your HTTP server (Nginx, CDN, etc.). Ensure backend is reachable at the configured `/api` path or adjust the proxy/base URL accordingly.

---

## Troubleshooting

### Tailwind error: “trying to use `tailwindcss` directly as a PostCSS plugin”

Use the new plugin package. Your `postcss.config.cjs` should be:

```js
module.exports = {
  plugins: [require('@tailwindcss/postcss'), require('autoprefixer')],
};
```

Or remove PostCSS config entirely and rely on `@tailwindcss/vite` only.

### ESM / module resolution red squiggles

Use `"moduleResolution": "bundler"` in `tsconfig.json`. This matches Vite’s resolver and avoids mandatory file extensions in imports.

### Clickable compiler links in the terminal

`dev-with-links.mjs` wraps Vite and converts file\:line\:col to clickable `file:///…` links (OSC 8 hyperlinks). The dev script runs this wrapper by default: `pnpm run dev`.

### Apollo error link typing

`errorLink` is implemented using an explicit `Observable<FetchResult>` so Apollo’s `ErrorHandler` signature is satisfied when retrying after token refresh.

### Tailwind/ESM configs not applied

When `package.json` has `"type": "module"`, rename configs to CommonJS:

* `tailwind.config.cjs`
* `postcss.config.cjs`

Restart Vite after any config change.

---

## Contributing

1. Create a feature branch from `main`
2. Keep GraphQL operations small and colocated under `src/graphql/`
3. Run `pnpm run codegen` after changing operations or the schema
4. Add tests where it makes sense
5. Ensure `pnpm run build` and `pnpm run test` pass before opening a PR

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

**Dimitry Ivaniuta** — [dzmitry.ivaniuta.services@gmail.com](mailto:dzmitry.ivaniuta.services@gmail.com) — [GitHub](https://github.com/DimitryIvaniuta)
