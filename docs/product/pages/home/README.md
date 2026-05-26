# Home

## Purpose

Show HelioStack as a real cloud server catalog and let visitors complete one
clear task: pick a use case, data center, and contract term, then see a
recommended server plan with price, availability, and next actions.

The home page is not a landing page. It is a working selector for cloud and
dedicated server plans. Marketing copy should stay secondary to the selection
workflow and price result.

## Current Data Mode

Typed mock server plans, regions, and billing terms. The home page owns
explicit localized display copy for those mock records instead of relying on
the visual text translator fallback.

## Current UX Scope

- keep the plan selector as the first screen;
- show the recommended plan, price, stock, and setup window immediately, with
  hardware specs in a separate framed block below the recommendation card;
- keep a compact selection summary visible for review;
- show only a short set of selectable matching-plan suggestions, with the full
  catalog kept on `/catalog`;
- on desktop, keep the selector rail and recommendation content in the same
  document scroll flow;
- route the selected plan into the quote flow while keeping full catalog access
  nearby;
- preserve selected plan, region, and billing term in the quote URL.

## Proof Layer

Do not show detailed source-layer or Revisium proof widgets on the public home
page. Source-layer detail belongs in docs, internal proof views, and future
developer-facing pages.

## Next UI Decisions

- Whether the light premium theme is accepted as the base design system.
- How much plan density belongs on the first viewport.
- Whether location details should stay on the home page or move fully to
  `/locations`.
- Whether the temporary `HS` mark is enough until the logo asset PR.
