# mes-adresses i18n Audit & Remediation Plan

Branch `us-port`. Read-only audit — no source changed. Verified with `node scripts/check-i18n.mjs`.

## Headline

Catalog health is excellent; the gap is **untranslated code**, concentrated almost entirely in the **`signalement/` (reports) feature** plus a handful of **enum→label maps that bypass next-intl**.

- `en.json` ↔ `es.json`: **1027 / 1027 keys, perfect parity.** `check-i18n` passes (2 benign warnings: `help.tutorial`, `mapControls.styleOSM` — same word in both languages, intentional).
- No literal `t("…")` call in code references a missing catalog key.
- ~26 component files render hardcoded strings that never enter next-intl.

> Caveat on `check-i18n`: it only compares en↔es parity, placeholders, and plurals. It does **not** detect hardcoded JSX strings or code→catalog references. Passing it is necessary, not sufficient.

---

## Findings by area

### A. `signalement/` feature — the bulk of the work (~26 files)
The entire reports subtree was hand-translated to **hardcoded English** and never wired to next-intl. None of these files import `next-intl`. Representative strings:

| File | Sample hardcoded strings |
|---|---|
| `signalement/signalements-page.tsx` | "Bulk actions", "Confirm bulk action", "Ignore reports", "Are you sure you want to dismiss these reports?" |
| `signalement/signalement-form/signalement-form-buttons.tsx` | "Accept", "Back", "Cancel", "Reason", "Please specify the reason for rejection…" |
| `signalement/signalement-form/numero/signalement-create-numero.tsx` | "Address creation request", "Add the address to this street", "Accepting this report may create a duplicate" |
| `signalement/signalement-list.tsx` | "Filters", "Refresh reports", "Search for a report", "There are currently no reports" |
| `signalement/signalement-form/voie/signalement-delete-voie.tsx` | "Request to delete a street", "By accepting this report, the street…" |
| `signalement/signalement-header.tsx` | "Comment:", "Reason:", "Submitted", "Submitted on" |
| `signalement/signalement-page.tsx` | "Reports", "Back to reports list", "Unable to find the report location." |
| `signalement/product-tour/signalement-product-tour.tsx` | full onboarding tour copy (5+ sentences) |
| `signalement/purge-expired-signalements-dialog.tsx` | "Update reports", "This operation may take some time, please wait." |
| + update/delete/create variants for numero / voie / toponyme, list-item, diff cards, viewers | "Current address", "Proposed change", "Dismiss", "Review", "Close", etc. |

### B. Enum → label maps that bypass next-intl (foundational)
These short helpers hardcode labels, so even the English isn't translatable and the existing positionTypes catalog is partly bypassed:

1. **`src/lib/positions-types-list.ts` → `getPositionName()`** returns a hardcoded English name (e.g. "Postal delivery"). Used in all signalement position diffs (`signalement-position-diff.tsx`, `signalement-position.tsx`) and the map-diff hooks (`useSignalementMapDiff{Creation,Update,Deletion}`). Bypasses the `positionTypes` namespace entirely.
2. **`src/components/signalement/signalement-type-badge.tsx` → `signalementTypeMap`** hardcodes "Create" / "Update" / "Delete" labels.
3. **Inconsistent FR→EN bridging.** The API serves **French** position enums (`Position.type` = `entrée`, `bâtiment`, …; see `openapi-api-bal/models/Position.ts`). The bridge `getPositionTypeKey()` (FR→EN key) exists but is applied **only in `map/editable-marker.tsx`**. In `bal/position-item.tsx` and `grouped-actions.tsx`, the `<Select>` binds `value={marker.type}` (raw French) against options whose values are English keys, and read-only mode calls `tp(marker.type)` directly — so a French value won't pre-select and won't resolve in the `positionTypes` namespace. Worth normalizing at the boundary or applying `getPositionTypeKey` consistently.

> Good pattern to copy: BAL status is done right — `computeStatus()` returns a `key`, and `status-badge.tsx` does `t(\`${key}.label\`)` against the `balStatusInfo` namespace.

### C. French-language leftovers (specific lines)
- `signalement/signalement-diff/signalement-position-diff.tsx:119` → `"Suppression de position"`
- `signalement/signalement-diff/signalement-position-diff.tsx:138` → `"Ajout de position"`
- `src/hooks/bal-data-import.ts:27` → `throw new Error("Le fichier CSV est invalide.")`
- (`accent-tool.tsx` contains French accented characters but is a legitimate French-accent input helper — leave as-is. Other diacritic hits are code comments only.)

### D. Hardcoded toast / error messages (outside signalement)
- `src/components/new/index.tsx:138,157` — toast `message:` hardcoded English ("An error occurred while creating/importing the Local Address Base") even though the file otherwise uses next-intl.
- `src/hooks/publish-process.ts:47,80` — "Unable to retrieve data from the National Address Platform", "Unable to create an authorization process".
- `src/components/signalement/purge-expired-signalements-dialog.tsx:94` — "An error occurred while updating the reports…".
- Lower priority / dev-internal: `lib/bal-admin/index.ts:41`, `lib/mattermost/index.ts:33`, `contexts/draw.tsx:196` (thrown internal errors), `app/api/home-drawer-data/demo-data.ts:62` (demo seed content).

### E. `src/app/global-error.tsx`
"An error has occurred." / "Try again". Note: this renders **outside** the next-intl provider, so it can't use `useTranslations` directly — needs a static fallback or a manually-loaded message. Handle as a special case.

### F. Catalog dead-key check (low priority)
244 of 1027 leaf keys aren't matched to a **literal** `t()` call — but this is mostly **dynamic access**, not dead keys: `positionTypes.*` via `tp(value)`, `balStatusInfo.*` and `status.*` via `t(\`${key}.label\`)`, etc. Not actionable as-is. If you want a true dead-key sweep later, the namespaces most worth eyeballing manually are `common` (35), `editor` (33), and `jurisdiction` (29).

---

## Proposed order

1. **Enum bridges (B + C French leftovers).** Small, foundational, and they unblock correct rendering everywhere downstream. Make `getPositionName`/position rendering go through the `positionTypes` namespace, apply `getPositionTypeKey` consistently (or normalize at the API boundary), move `signalementTypeMap` labels into a catalog namespace, and kill the two French strings + the CSV error. Add matching `es` keys.
2. **`signalement/` feature (A).** The big batch — introduce a `signalement.*` namespace and convert sub-folder by sub-folder so each step is reviewable: `signalement-diff/` → `signalement-form/` → `signalement-viewer/` → list/header/page → `product-tour/`. Keep en/es in lockstep as you go.
3. **Stray toasts/errors (D).** `new/index.tsx`, `publish-process.ts`, `purge-expired-signalements-dialog.tsx`.
4. **Edge cases (E + remaining D).** `global-error.tsx` static fallback, demo-data, internal thrown errors.
5. **Verify.** `yarn check-i18n` + `yarn lint`, then re-run the hardcoded-string scan to confirm signalement is clean. Consider extending `check-i18n` to also flag hardcoded JSX text so this can't regress.

---

## Resolution log (completed June 2026)

All three planned sections are done; `node scripts/check-i18n.mjs` and `npx tsc --noEmit` both pass with catalogs at **1162 / 1162** parity.

- **Section 1 — enum bridges.** `src/lib/positions-types-list.ts` rewritten: `positionsTypesList` entries are now `{ value: Position.type (French API enum), key: English i18n slug }`, so `<Select>` options round-trip French to the API while labels render via `tp(option.key)`. `getPositionTypeKey()` normalizes any value (French enum or English key) → English key; `getPositionName` (hardcoded English) **deleted**. Applied consistently in `position-item.tsx`, `grouped-actions.tsx`, `editable-marker.tsx`, the signalement position diffs, and the `useSignalementMapDiff*` hooks. `signalementTypeMap` now holds colors only; labels via `signalement.type.*`. French leftovers (`signalement-position-diff.tsx`, CSV error in `bal-data-import.ts`) removed.
- **Section 2 — whole `signalement/` feature** (~40 files) moved into a large `signalement.*` namespace (type, position, positionDiff, parcelle, diffCard, page, tabs, bulkActions, list, header, form, buttons, viewer, purge, tour). Rejection-reason options use stable keys + a new `getLabel` prop on `BadgeSelect`. Re-scan: **0** hardcoded UI strings remain in `signalement/`.
- **Section 3 — stray toasts + edge cases.** `new/index.tsx` (`newBase.createError/importError` + `common.error`), `publish-process.ts` (new `publishProcess` namespace), shared `product-tour.tsx` Joyride `locale` (French "Passer"/"Terminer" → new `productTour` namespace), and `global-error.tsx` (renders outside the next-intl provider → imports `messages/{en,es}.json` directly and selects via `document.documentElement.lang`; keys under `globalError`).

### Intentionally NOT internationalized (decided)
Dev-facing thrown `Error` diagnostics are left as stable English on purpose — they surface in console/Sentry, never in the UI, and live in non-React lib files where `useTranslations` isn't available:
- `src/lib/bal-admin/index.ts` — "Error while fetching bal events" (failed admin-events fetch; caught upstream).
- `src/lib/mattermost/index.ts` — "Failed to fetch news" (news widget degrades gracefully).
- `src/contexts/draw.tsx` — "Unknown drawing mode" (invariant guard on an internal enum switch; unreachable via UI).

### Known follow-up
- `getSuggestedBALName` in `new/index.tsx` returns a hardcoded English **default value** ("Addresses of {name}") that gets saved as the base's name. Left as-is — translating a persisted default is a product decision, not a label fix.

---

## UI language selector (completed June 24, 2026)

A visible en/es switcher now lives in the header. Verified with `node scripts/check-i18n.mjs` (parity 1164/1164) and `npx tsc --noEmit` (clean).

### Root cause found while building it
The app has **no `[locale]` URL segment and no middleware**, so next-intl's `requestLocale` was always `undefined` → `request.ts` always fell back to `defaultLocale`. The UI was effectively **locked to English**; Spanish was unreachable regardless of the catalogs. The `Link/redirect/useRouter` wrappers exported from `src/i18n/routing.ts` are **unused** anywhere in the tree, so the `localePrefix: "as-needed"` routing config was dead.

### Approach: next-intl "without i18n routing" (cookie-based)
Locale is persisted in a `NEXT_LOCALE` cookie instead of the URL — the standard next-intl pattern when there's no `[locale]` segment.

- **`src/i18n/locale.ts`** (new, `"use server"`): `getUserLocale()` reads + validates the cookie against `routing.locales` (fallback `defaultLocale`); `setUserLocale(locale)` writes it (`path:"/"`, `sameSite:"lax"`, 1-year `maxAge`). Cookie write is only legal inside a server action / route handler, which this is.
- **`src/i18n/request.ts`**: now `const locale = await getUserLocale();` — no longer reads the (always-undefined) `requestLocale`. This makes locale-bearing routes dynamic, which is expected for cookie-based locale.
- **`src/i18n/routing.ts`**: added `export type Locale = (typeof routing.locales)[number];`.
- **`src/components/language-switcher.tsx`** (new, client): shared `useSwitchLocale()` hook calls `setUserLocale` inside `useTransition` then `router.refresh()` so the server layout re-renders with the new catalog. Exports `LanguageSwitcher` (desktop: minimal `TranslateIcon` button → popover, active locale gets `TickIcon`) and `LanguageMenuItems` (a `Menu.Group` for embedding).
- **`header.tsx`**: `<LanguageSwitcher />` added to the desktop button row.
- **`mobile-layout/mobile-help-menu.tsx`**: `<LanguageMenuItems />` appended to the existing popover menu.
- **Catalogs**: new `language` namespace — en `{label:"Language", english:"English", spanish:"Spanish"}`, es `{label:"Idioma", english:"Inglés", spanish:"Español"}`.

### Not yet runtime-verified
`yarn`/`next dev` aren't on the sandbox PATH, so the cookie round-trip + `router.refresh()` flip was confirmed only by types + i18n parity, not by running the dev server. Worth a manual smoke test: pick Español, confirm UI switches and the choice survives reload.
