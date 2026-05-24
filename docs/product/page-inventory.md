# Page Inventory

| Route                 | Status     | Purpose                                                | Data mode    | Next decision                    |
| --------------------- | ---------- | ------------------------------------------------------ | ------------ | -------------------------------- |
| `/`                   | Prototype  | Server-plan picker and recommended price               | typed mock   | approve premium layout direction |
| `/catalog`            | Prototype  | Full cloud/dedicated server catalog                    | typed mock   | validate filter density          |
| `/catalog/:productId` | Scaffolded | Server plan detail, specs, regions, add-ons            | typed mock   | validate detail hierarchy        |
| `/pricing`            | Prototype  | Price rows by plan, region, add-ons, support, and term | typed mock   | quote handoff validation         |
| `/locations`          | Prototype  | Data-center stock and support windows                  | typed mock   | location card/table pattern      |
| `/compare`            | Prototype  | Scenario-based server plan comparison                  | typed mock   | quote handoff validation         |
| `/resources`          | Prototype  | Docs, roles, topics, saved reads, helpful feedback     | typed mock   | docs detail pattern              |
| `/releases`           | Prototype  | Stock, docs, price-book updates, saved announcements   | typed mock   | announcement detail pattern      |
| `/quote`              | Prototype  | Quote draft, readiness, add-ons, and review path       | mock form    | backend mutation contract        |
| `/app`                | Prototype  | Organization quotes, saved plans, favorites, API keys  | backend mock | quote detail conversation        |

## Page Status Rules

- `Planned`: spec exists or is expected before code.
- `Scaffolded`: route exists with enough code to review flow and contracts.
- `Prototype`: route is intentionally being iterated visually and may change
  before docs/PR stabilization.
- `Designed`: visual and responsive direction accepted.
- `Done`: implementation, docs, responsive behavior, and proof UI are stable.
