# Page Inventory

| Route | Status | Purpose | Data mode | Next decision |
| --- | --- | --- | --- | --- |
| `/` | Scaffolded | Catalog entry, featured products, release proof | typed mock | review first visual direction |
| `/catalog` | Scaffolded | Product list and first filter strip | typed mock | validate row density |
| `/catalog/:productId` | Scaffolded | Product detail, specs, source evidence | typed mock | validate detail hierarchy |
| `/pricing` | Planned | Price books, tiers, currency/region switch | typed mock | dense table pattern |
| `/compare` | Planned | Product and plan comparison | typed mock | comparison row model |
| `/resources` | Planned | Documents, certificates, manuals | typed mock | file card pattern |
| `/releases` | Planned | Catalog releases and future diff entry | typed mock | diff visualization |
| `/quote` | Scaffolded | Runtime interaction form | mock form | backend mutation contract |

## Page Status Rules

- `Planned`: spec exists or is expected before code.
- `Scaffolded`: route exists with enough code to review flow and contracts.
- `Designed`: visual and responsive direction accepted.
- `Done`: implementation, docs, responsive behavior, and proof UI are stable.
