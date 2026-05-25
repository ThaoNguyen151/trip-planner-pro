# Contributions & Workflow Conventions

A short document covering the **project structure**, **run commands**, and **commit naming** to ensure team alignment.

---

## Environment Requirements

- **Node.js** (recommended version compatible with `package.json` / CI)
- **npm** (the project uses `npm` for installing dependencies and running scripts)

Installing dependencies:

```bash
npm install
```

---

## Directory Structure (Summary)

```text
trip-planner-pro/
├── .github/workflows/     # CI (lint + build) on push/PR
├── .husky/                # Git hooks (pre-commit, commit-msg)
├── commitlint.config.mjs  # Rules for validating commit messages
├── public/                # Static assets (favicon, …)
├── scripts/husky/         # Node-driven hooks (lint-staged, commitlint)
├── server/                # `static.mjs` — serves the `dist/` build (not an API)
├── src/
│   ├── assets/            # Images, SVGs, …
│   ├── components/ui/     # shadcn/ui components (e.g., Button)
│   ├── constants/         # Constants (routes, storage keys, …)
│   ├── hooks/             # React hooks (e.g., store wrappers)
│   ├── layouts/           # Shared layouts (App shell: sidebar + header)
│   ├── lib/               # Utilities (e.g., `cn()`)
│   ├── pages/             # Route-based pages (dashboard, itinerary, …)
│   ├── routes/            # `react-router` configuration (`createBrowserRouter`)
│   ├── stores/            # Zustand + persist (localStorage)
│   ├── types/             # Shared TypeScript types
│   ├── App.tsx            # Root: `RouterProvider`
│   ├── main.tsx           # Entry + CSS imports
│   └── index.css          # Tailwind + shadcn theme
├── vite.config.ts         # Alias `@` → `src/`
├── tsconfig.*.json
└── eslint.config.js
```

**Business Note:** This is a **frontend-only** project; user data can be stored locally via **Zustand + `localStorage`** (no backend/DB in this repo).

---

## Import Aliases

In the codebase, prefer importing via aliases:

```ts
import { Button } from "@/components/ui/button";
```

The `@/*` alias points to the `src/` directory (configured in `tsconfig` and `vite.config.ts`).

---

## Common Commands

| Command           | Description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `npm run dev`     | Runs the dev server (Vite + HMR)                                                                 |
| `npm run build`   | Runs TypeScript checks + builds the production app into `dist/`                                  |
| `npm run lint`    | Runs ESLint across the entire project                                                            |
| `npm run preview` | Previews the build locally using `vite preview`                                                  |
| `npm start`       | Serves the `dist/` directory using Node (`server/static.mjs`) — requires a prior `npm run build` |

---

## Git hooks (Husky)

After running `npm install`, the `prepare` script automatically registers **Husky**. Two main hooks are utilized:

1. **`pre-commit`** — triggers **lint-staged**: runs `eslint --fix` only on staged `.ts` / `.tsx` files (logic resides in `scripts/husky/pre-commit.mjs`).
2. **`commit-msg`** — triggers **commitlint** (Conventional Commits), driven by `scripts/husky/commit-msg.mjs`.

If you absolutely need to bypass the hooks (only when strictly necessary, e.g., a temporary hotfix):

```bash
git commit --no-verify -m "..."
```

Do not abuse this option; the **CI** workflow (`.github/workflows/ci.yml`) will still enforce linting and building.

---

## Commit Naming Conventions (Mandatory via Conventional Commits)

Commit messages must strictly follow the format below:

```text
<type>: <short description>
```

**Commonly Used `type` values**

| Type       | When to Use                                 |
| ---------- | ------------------------------------------- |
| `feat`     | A new feature                               |
| `fix`      | A bug fix                                   |
| `docs`     | Documentation changes only                  |
| `style`    | Format, UI tweaks with no logic changes     |
| `refactor` | Code restructuring with no behavior changes |
| `test`     | Adding or fixing tests                      |
| `chore`    | Tooling, configs, or dependency updates     |
| `perf`     | Code changes that improve performance       |
| `build`    | Build system or bundler changes             |
| `ci`       | CI/CD configuration changes                 |
| `revert`   | Reverting a previous commit                 |

**Valid Examples**

```text
feat: add itinerary page layout
fix: correct sidebar active state
chore: update eslint config
docs: add contributing guide
```

**Invalid Examples** (will be rejected by commitlint):

```text
updated stuff
fix bug
WIP
```

You can optionally include a specific scope:

```text
feat(ui): add budget card component
fix(router): redirect unknown paths to dashboard
```

Detailed rules are defined in `commitlint.config.mjs` (extending `@commitlint/config-conventional`).

---

## Testing Commit Messages Locally

```bash
echo "feat: test message" | npx commitlint
```

---

## Pull Requests

- Prioritize clean, branch-specific work with compliant commit messages as outlined above.
- Ensure that both `npm run lint` and `npm run build` run successfully before opening a PR (aligning with the CI checks).

If you have any questions regarding the structure or hooks, please open an issue or bring it up in the team chat to ensure consensus.
