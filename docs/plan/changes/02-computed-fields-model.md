# 02 — Typed computed-fields model

## Context

`efficiency 17`, `score 13`, `readiness 85`, `fit 74` are unexplained numbers
that read as filler and undercut the "computed fields" story. Replace them with
a small, intentional set of computed fields of varied types — the actual demo of
Revisium derived/computed values.

## Computed set (derive in entity/model layer, not in views)

| Field | Type | Derivation |
| --- | --- | --- |
| `pricePerCore` | number | `pricing.monthlyUsd / hardware.cpuCores` |
| `pricePerGbRam` | number | `pricing.monthlyUsd / hardware.ramGb` |
| `regionsInStock` | number (array aggregate) | count of `availability[]` where stock > 0 |
| `instantSetup` | boolean | `setupHours <= 1` |
| `availableEverywhere` | boolean | in stock across all active regions |
| `valueTier` | string/enum | Economy / Balanced / Performance from price-per-performance |
| `topRegions` | string[] | regions with the most stock (chips) |

## Change

- Add these as computed selectors in `src/entities/catalog/model/*` and
  `src/entities/pricing/model/*` (reuse existing `catalogComputed.ts`).
- Remove `efficiency` / `score` / `readiness` / `fit` surfaces:
  - Product detail stat cards and rows.
  - Pricing rows (`score N`) and Pricing detail (`Minimum score`).
  - Compare (`Quote fit`, `Score`), Locations (`Best readiness`).
- Present booleans as badges, `valueTier` as a labeled tag, numbers with units
  (`$3.0/core`), `topRegions` as chips.
- Optional: glossary tooltip from `glossary_terms` for `valueTier`.

## Files

- `src/entities/catalog/model/catalogComputed.ts`, `catalogTypes.ts`
- `src/entities/pricing/model/*`
- consumers: ProductDetail, Pricing, PricingDetail, Compare, Locations VMs + UI

## Acceptance

- No `efficiency`/`score`/`readiness`/`fit` strings remain in `src/`.
- New fields render with correct types (badge/tag/number+unit/chips).
- `npm run verify` green.
