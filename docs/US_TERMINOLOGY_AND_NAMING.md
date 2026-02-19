# US Terminology and Naming Conventions

This project originated with French BAL terminology. For US deployments, use the canonical terms below in all user-facing copy and in new internal code where possible.

## Canonical Vocabulary

| Legacy term | Canonical US term | User-facing label |
| --- | --- | --- |
| `commune` | `jurisdiction` | Jurisdiction |
| `communeNom` | `jurisdictionName` | Jurisdiction name |
| `communeNomsAlt` | `jurisdictionNamesAlt` | Alternate jurisdiction names |
| `voie` / `voies` | `street` / `streets` | Street(s) |
| `toponyme` / `toponymes` | `placeName` / `placeNames` | Place name(s) |
| `numero` / `numeros` (entity) | `address` / `addresses` | Address(es) |
| `numero` (field) | `houseNumber` | House number |
| `suffixe` | `numberSuffix` | Suffix |
| `numeroComplet` | `fullAddressNumber` | Full number |
| `parcelles` | `parcelIds` | Parcels |
| `habilitation` | `authorization` | Access authorization |
| `contour` | `boundary` | Boundary |
| `bbox` | `bounds` | Map extent |
| `BAL` / `baseLocale` | `localAddressBase` | Local Address Base (LAB) |

## Rules for New Work

1. Use canonical US labels in UI text.
2. Keep existing v2 API fields/routes intact unless a migration plan is approved.
3. For new frontend/service code, prefer canonical variable names and map legacy names only at API boundaries.
4. Do not rename persisted DB fields without a migration and rollback plan.
5. If adding aliases, make them additive and non-breaking (legacy + alias during transition).

## Implementation Pattern

1. Receive legacy payloads from API (`commune`, `toponymes`, `numeros`).
2. Map once into canonical domain objects (`jurisdiction`, `placeNames`, `addresses`).
3. Use canonical names throughout feature code and user-facing copy.
4. Map back to legacy payload shape only when calling existing v2 endpoints.

## PR Checklist

- UI copy uses canonical US terminology.
- No breaking rename to existing API fields or routes.
- New code avoids introducing additional legacy French names.
- Any alias/mapping behavior includes tests where practical.
