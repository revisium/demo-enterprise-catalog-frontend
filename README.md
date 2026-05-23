# demo-enterprise-catalog-frontend

Public frontend for the Nexora Systems enterprise catalog demo.

The site should feel like a real B2B product catalog before it feels like a
Revisium demo. Visitors browse products, SaaS plans, pricing, resources,
solutions, and catalog releases. Revisium proof appears through source links,
release diffs, and explainer UI.

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

- Enterprise catalog portal, not a generic marketing landing page.
- Dense but scannable product and pricing pages.
- Rich product imagery: devices, diagrams, datasheets, certificates, logos.
- Public user flows first; Revisium source layer second.
- No user-generated content surfaces such as comments, reviews, or community
  posts.

## Primary Route Flow

1. Home
2. Catalog list
3. Product detail
4. Pricing / price book
5. Compare products or plans
6. Resources / documents
7. Catalog releases and diff
8. Developers / partners
9. Request quote

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
