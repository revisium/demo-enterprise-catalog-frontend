# Page Inventory

| Route                 | Status    | Purpose                                                 | Data mode    | Next decision                  |
| --------------------- | --------- | ------------------------------------------------------- | ------------ | ------------------------------ |
| `/`                   | Prototype | Guided plan command center and next actions             | typed mock   | visual density approval        |
| `/catalog`            | Prototype | Full server catalog discovery                           | typed mock   | filter density approval        |
| `/catalog/:productId` | Prototype | One server plan: specs, add-ons, regions, related plans | typed mock   | item detail hierarchy approval |
| `/pricing`            | Prototype | Regional price-book row analysis                        | typed mock   | price table density approval   |
| `/locations`          | Prototype | Data-center stock, setup, and support market selection  | typed mock   | location card/table pattern    |
| `/compare`            | Prototype | Scenario-based short-list decision                      | typed mock   | scenario ranking approval      |
| `/resources`          | Prototype | Customer docs, saved reads, helpful feedback            | typed mock   | docs detail pattern            |
| `/releases`           | Prototype | Product/news updates, reactions, saved announcements    | typed mock   | announcement detail pattern    |
| `/quote`              | Prototype | Public quote draft, readiness, add-ons, review path     | mock form    | backend mutation contract      |
| `/app`                | Prototype | Organization quotes, saved plans, favorites, API keys   | backend mock | quote detail conversation      |

## Page Status Rules

- `Planned`: spec exists or is expected before code.
- `Scaffolded`: route exists with enough code to review flow and contracts.
- `Prototype`: route is intentionally being iterated visually and may change
  before docs/PR stabilization.
- `Designed`: visual and responsive direction accepted.
- `Done`: implementation, docs, responsive behavior, and proof UI are stable.
