# Resource Explorer

A small, polished Next.js + TypeScript app that explores the **Rick & Morty API**.
Features: searchable, filterable, sortable infinite list of characters, per-item detail pages, favorites persisted to `localStorage`, theme toggle (light/dark), client caching via TanStack/React Query, loading skeletons and error handling.

---

# Quick start — run locally

Prereqs: Node 18+ (or current LTS), npm (or yarn)

```bash
# 1. install
npm install

# 2. dev server
npm run dev
# open http://localhost:3000

# 3. build for production
npm run build
npm run start

# 4. type-check
npx tsc --noEmit
```

No environment variables required — the app talks directly to the public Rick & Morty API.

---

# What’s included / quick feature map

* Dataset: **Rick & Morty API** (`src/lib/api.ts`)
* List view with infinite loading (React Query `useInfiniteQuery`) and "Load more"
* Detail view at `/characters/[id]` with notes (local-only) and favorite toggle
* Debounced search (350ms) bound to the URL (`?q=...`) + filter (status, species) + sort (name/id asc/desc)
* URL is source of truth for search/filter/sort/favorites (shareable)
* Favorites persisted to `localStorage` (useFavorites hook)
* Loading skeletons + error states + retry button
* Theme toggle (light/dark) persisted to `localStorage` and SSR-hydration-safe
* Client caching & background refetch provided by TanStack Query
* Notes stored per-character in `localStorage`

---

# Project structure (high-level)

```
src/
  app/
    layout.tsx          # imports globals.css, wraps Providers
    globals.css         # global theme + layout styles
    page.tsx            # main list page (search/filter/sort + infinite query)
    pages/
      CharacterDetail.tsx
    providers.tsx       # QueryClient + ThemeProvider
  components/
    Layout.tsx
    SearchBar.tsx
    Filters.tsx
    CharacterCard.tsx
    LoadingSkeleton.tsx
  hooks/
    useDebounce.ts
    useFavorites.ts
    useMounted.ts
    useTheme.tsx
  lib/
    api.ts              # fetchCharacters, fetchCharacterById (typed)
```

---

# How it works (technical notes)

* **Data fetching**: TanStack/React Query `useInfiniteQuery` to fetch paginated results and handle cancellation (AbortSignal). Query keys include search/filter params so results are cached/synced.
* **URL sync**: Search, filters, sort and favorites flag are serialized to the URL (via `history.replaceState` / `useSearchParams`). Visiting a URL restores state.
* **Hydration safe**: Theme is deterministic on the server (default `"dark"`). Client reads `localStorage` in `useEffect` and updates `document.documentElement` after mount to avoid hydration mismatches. Dynamic UI (theme toggle) is only rendered after mount (`useMounted`).
* **Favorites & notes**: Lightweight hooks using `localStorage`. Favorites stored as a map of ids → `true`. Notes saved as `note_char_<id>`.
* **UX**: Skeletons for loading, explicit error UI with Retry, helpful "No results" messaging. Focus outlines and semantic elements for basic accessibility.
* **Cancel & race conditions**: React Query provides cancellation; query function receives `signal` and the fetch wrapper uses it.

---

# Trade-offs and decisions (why I built it this way)

* **React Query chosen** because it provides caching, background updates, and built-in support for cancellation — speeds development and improves UX for paginated data.
* **Favorites & notes are local-only** (simple, fast to implement, no backend). Trade-off: no cross-device sync. If remote sync were required I'd add a small API and optimistic updates.
* **No virtualization (react-window)** — the API delivers a small page size; virtualization adds complexity only necessary for very large lists. If usage hits thousands of items I’d add it next.
* **Theme handling**: I prioritized avoiding hydration mismatch by applying a deterministic server default and only reading `localStorage` on mount. This keeps SSR stable but causes a single client update if the user had the opposite preference.
* **No E2E tests included** in this iteration — would add a small Playwright smoke test for the happy path as a priority.
* **Accessibility**: focused on basic affordances (labels, alt, focus). A full a11y audit is recommended as next step.


---

# Submission checklist

* [yes] Public Git repo with commit history
* [yes] README (this file) with run steps, architecture, trade-offs
* [yes] App runs with `npm install` + `npm run dev`
* [yes] Must-haves implemented: search/filter/sort, infinite list, detail route, favorites, URL-state
* [yes] Nice-to-have: React Query caching, theme toggle
* [no] Hosted preview (optional) — recommend deploying to Vercel

---


---

