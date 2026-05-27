# Page Inventory

| Route                   | Status    | Purpose                                                 | Data mode    | Next decision                  |
| ----------------------- | --------- | ------------------------------------------------------- | ------------ | ------------------------------ |
| `/`                     | Prototype | Guided plan command center and next actions             | typed mock   | visual density approval        |
| `/catalog`              | Prototype | Full server catalog discovery                           | typed mock   | filter density approval        |
| `/catalog/:productId`   | Prototype | One server plan: specs, add-ons, regions, related plans | typed mock   | item detail hierarchy approval |
| `/pricing`              | Prototype | Regional price-book row analysis                        | typed mock   | price table density approval   |
| `/pricing/:priceBookId` | Prototype | One price book: status, computed rows, related books    | typed mock   | detail density approval        |
| `/locations`            | Prototype | Data-center stock, setup, and support market selection  | typed mock   | capacity layout approval       |
| `/compare`              | Prototype | Scenario-based short-list decision                      | typed mock   | matrix density approval        |
| `/resources`            | Prototype | Customer docs, saved reads, helpful feedback            | typed mock   | right-rail content approval    |
| `/resources/:slug`      | Prototype | One guide: article body, checklist, related guides      | typed mock   | guide summary approval         |
| `/releases`             | Prototype | Product/news updates, reactions, saved announcements    | typed mock   | feed row density approval      |
| `/releases/:slug`       | Prototype | One update: impact, affected paths, related updates     | typed mock   | update summary approval        |
| `/quote`                | Prototype | Public quote draft, readiness, add-ons, review path     | mock form    | quote rail approval            |
| `/app`                  | Prototype | User session, preferences, quotes, favorites, audit     | backend mock | console rail approval          |
| `/app/plans/:planId`    | Prototype | One saved plan: package, related quotes, next actions   | backend mock | saved-plan action approval     |
| `/app/quotes/:quoteId`  | Prototype | One quote: timeline, comments, related saved plans      | backend mock | conversation action approval   |

## Page Status Rules

- `Planned`: spec exists or is expected before code.
- `Scaffolded`: route exists with enough code to review flow and contracts.
- `Prototype`: route is intentionally being iterated visually and may change
  before docs/PR stabilization.
- `Designed`: visual and responsive direction accepted.
- `Done`: implementation, docs, responsive behavior, and proof UI are stable.
