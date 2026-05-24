# Page Inventory

| Route                 | Status     | Purpose                                                | Data mode    | Next decision                    |
| --------------------- | ---------- | ------------------------------------------------------ | ------------ | -------------------------------- |
| `/`                   | Prototype  | Server-plan picker and recommended price               | typed mock   | approve premium layout direction |
| `/catalog`            | Prototype  | Full cloud/dedicated server catalog                    | typed mock   | validate filter density          |
| `/catalog/:productId` | Scaffolded | Server plan detail, specs, regions, add-ons            | typed mock   | validate detail hierarchy        |
| `/pricing`            | Prototype  | Price rows by plan, region, add-ons, support, and term | typed mock   | quote handoff validation         |
| `/locations`          | Prototype  | Data-center stock and support windows                  | typed mock   | location card/table pattern      |
| `/compare`            | Prototype  | Server plan comparison                                 | typed mock   | comparison row model             |
| `/resources`          | Prototype  | Docs, SLA, networking, billing, API docs               | typed mock   | docs index pattern               |
| `/releases`           | Prototype  | Stock, docs, and price-book updates                    | typed mock   | update timeline pattern          |
| `/quote`              | Scaffolded | Runtime quote request form                             | mock form    | backend mutation contract        |
| `/app`                | Prototype  | Authorized customer portal dashboard                   | backend mock | auth shell and dashboard widgets |

## Page Status Rules

- `Planned`: spec exists or is expected before code.
- `Scaffolded`: route exists with enough code to review flow and contracts.
- `Prototype`: route is intentionally being iterated visually and may change
  before docs/PR stabilization.
- `Designed`: visual and responsive direction accepted.
- `Done`: implementation, docs, responsive behavior, and proof UI are stable.
