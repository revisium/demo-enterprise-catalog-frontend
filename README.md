# demo-enterprise-catalog-frontend

Public frontend for the HelioStack cloud server catalog demo.

The site should feel like a real B2B product catalog before it feels like a
Revisium demo. Visitors choose cloud and dedicated server plans, compare
regional prices, read docs, review updates, and request quotes. Revisium proof
appears through source links, release diffs, and explainer UI outside the
customer-facing layout.

## Related Repos

- `demo-enterprise-catalog-docs`: public product passport and source-of-truth
  boundaries.
- `demo-enterprise-catalog-backend`: runtime interaction API and generated
  Revisium clients.
- `demo-rpg-frontend`: reference implementation pattern.

## Development Mode

This frontend is intentionally being built before backend/Revisium connection.
The first PRs should produce several useful catalog pages with typed mock data,
then stabilize the UI direction, responsive behavior, proof widgets, and design
system. Backend and Revisium contracts come after that.

```bash
npm install
npm run dev
npm run verify
```

Environment defaults live in `.env/`. Keep this demo mock-first until backend
and Revisium contracts are intentionally connected.

Local Sonar follows the same workflow as other Revisium repos:

```bash
cp .env.sonar.example .env.sonar
npm run ci:local:sonar
```

`SONAR_TOKEN` is required for local Sonar. This frontend currently excludes
coverage from the Quality Gate until test coverage is introduced.
In a local Revisium workspace you can also point at an existing env file:

```bash
SONAR_ENV_FILE=../../forms-core/.env.sonar npm run ci:local:sonar
```

## UX Direction

- Premium cloud server catalog, not a generic marketing landing page.
- Scannable server, price-book, location, and customer portal pages.
- Rich product imagery: servers, data centers, docs, diagrams, and logos.
- Public user flows first; Revisium source layer second.
- No user-generated content surfaces such as comments, reviews, or community
  posts.

## Primary Route Flow

1. Home
2. Server catalog
3. Server detail
4. Pricing / price book
5. Locations
6. Compare server plans
7. Docs / resources
8. Updates
9. Request quote
10. Customer portal

Exact route contracts live in [docs/product/README.md](docs/product/README.md).

## Revisium Proof In UI

Pages should be able to expose:

- source project/table/row links;
- GraphQL request and sample response;
- REST/MCP equivalents where they exist;
- computed fields, linked rows, files, and revision/diff evidence;
- a short human explanation of why the page demonstrates a Revisium capability.

## Review And PR Mode

All PRs must follow [REVIEW.md](./REVIEW.md): docs-first changes, local
verification, GitHub Actions, Sonar zero tolerance, review-thread replies, and
thread resolution after fixes are verified.
