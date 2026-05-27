# Page Patterns

## Enterprise Catalog First

The first screen must look like a useful B2B catalog portal, not a Revisium
marketing page. Revisium proof is visible as a source layer after the catalog
experience is understandable.

## Mock Data Contract

Mock data should match future contract shape:

- stable IDs;
- nested `specs` objects;
- arrays for protocols, documents, metrics, tiers, and bundle items;
- explicit future table or backend ownership in page specs.

## Proof Layer

Do not show source-layer proof inside the customer-facing layout during the
mock-first phase. Data-backed pages should first read as useful product pages.

After backend/Revisium connection, proof can appear in a separate explainer
surface with real links, requests, response examples, source fields, and
revision evidence.

## Query Page Polish

Catalog, pricing, and locations pages should always provide:

- clear filter hints in customer language;
- empty states with a reset action;
- primary reset-filter actions only while the current query differs from the
  default view, so the action disappears immediately after a successful reset;
- browse-list items that only navigate to detail pages should make the whole
  item clickable with a visible hover state instead of adding `Open` buttons;
- keep explicit buttons for row selection, quote requests, saved/helpful
  feedback, and other state-changing actions;
- mobile layouts that keep row labels, prices, stock, and setup text readable;
- no mock labels, project names, table names, row IDs, or source widgets in the
  public layout.
