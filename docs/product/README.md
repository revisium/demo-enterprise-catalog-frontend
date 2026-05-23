# Product Routes

This folder owns the frontend route and UX contract for the Nexora Systems demo.

The docs repo owns the public product passport. This folder should grow into the
implementation-facing page specs as the frontend is built.

## Route Map

| Route | Purpose | Main source |
| --- | --- | --- |
| `/` | Enterprise catalog home and featured release | CMS + catalog data |
| `/about` | Demo/product explanation | CMS |
| `/catalog` | Product listing with filters | catalog data |
| `/catalog/[productId]` | Product detail, specs, docs, related bundles | catalog data |
| `/families` | Product families | catalog data |
| `/categories` | Product categories | catalog data |
| `/plans` | SaaS plans and feature limits | catalog data |
| `/pricing` | Price-book overview and region/currency switcher | catalog data |
| `/pricing/[priceBookId]` | Price list with tiered price items | catalog data |
| `/compare` | Product/plan comparison | catalog data + backend if shareable |
| `/solutions` | Industry/use-case landing | CMS + catalog data |
| `/solutions/[slug]` | Solution detail page | CMS |
| `/resources` | Datasheets, manuals, certificates, legal docs | catalog data |
| `/resources/[documentId]` | Document detail and download | catalog data + backend event |
| `/certifications` | Certification index | catalog data |
| `/developers` | API, dictionary, and export overview | CMS + source links |
| `/partners` | Partner enablement entry | CMS |
| `/api` | Generated API overview | CMS + source links |
| `/releases` | Catalog and price-book releases | catalog data |
| `/releases/[releaseId]` | Release detail | catalog data |
| `/release-diff` | Revision/diff proof flow | catalog data |
| `/quote` | Request quote flow | backend runtime |

## First Slice

Build this before expanding:

1. `/`
2. `/catalog`
3. `/catalog/[productId]`
4. `/pricing`
5. `/releases`
6. `/release-diff`
7. source/explainer UI on catalog and pricing pages

## Page Expectations

- Product detail should show nested technical specs, files, related bundles,
  certifications, pricing availability, and source links.
- Pricing pages should show price lists, tiered price items, currencies,
  regions, computed min/max prices, and release/diff evidence.
- Developer/partner pages should frame Revisium as a dictionary/data API without
  becoming the first screen of the demo.
- Quote and saved-product flows are runtime interactions; they must not become
  the source of catalog truth.

## Explainer Evidence

For each data-backed page, expose only evidence that is real:

- GraphQL request and variables;
- sample response;
- project/table/row links;
- computed fields and source fields;
- linked rows;
- file fields;
- revision or diff link when relevant;
- REST/MCP equivalents where available.
