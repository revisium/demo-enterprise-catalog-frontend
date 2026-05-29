# Locations

## Purpose

Show data-center regions by available stock, setup time, support window, and
server families available in each region.

## Current Data Mode

Prototype typed mock data from the shared catalog snapshot.

## Query Shape

- family chips model OR filters over related plans;
- stock and support controls model AND filters over regional availability;
- readiness filter models a computed field constraint;
- sort covers total stock, fastest setup, computed readiness score, plan count,
  region name, and latest related plan update;
- rows group nested availability records by region;
- the customer-facing filter summary shows visible regions, stock threshold,
  support window, and sort label without exposing source-table or mock details.

## Layout Contract

- first screen uses the same premium public-page shell as pricing and catalog:
  compact intro, three filter/summary panels, and no marketing-only hero;
- show a compact desktop-only raster intro visual that signals global regional
  capacity without replacing the operational filters;
- results use a two-column desktop layout: region capacity rows on the left and
  a right-side shortlist with the best visible capacity match;
- each region row shows data-center codes, family chips, stock/setup/family
  coverage/support metrics, and up to four related server-plan rows;
- mobile keeps filters stacked and lets each region capacity card shrink to a
  compact readable width before horizontal scrolling, matching pricing table
  behavior instead of collapsing the plan rows into a broken narrow stack;
- show the primary reset action only while filters or sort differ from the
  default query, and hide it after reset;
- make region shortlist items and related plan rows clickable with hover
  feedback instead of rendering small `Open` or `View capacity` buttons;
- public copy must stay customer-facing: no source widgets, row IDs, internal
  table names, or mock-state labels.

## Computed Fields

- `readinessScore` is an integer from `0` to `100`, rounded to the nearest
  integer;
- `readinessScore = round((stockScore * 0.35 + setupScore * 0.25 +
familyScore * 0.25 + supportScore * 0.15) * 100)`;
- `stockScore = min(totalRegionalStock, 120) / 120`;
- `setupScore = max(0, 24 - fastestSetupHours) / 24`;
- `familyScore = familyCoveragePercent / 100`;
- `supportScore = enterpriseCoveragePercent / 100`;
- `familyCoveragePercent` shows how much of the server family catalog is
  available in the region;
- `enterpriseCoveragePercent` shows how much of the related plan list carries
  enterprise support;
- related plan rows expose `priceEfficiencyScore` for future sorting and
  comparison.
- missing or zero denominators produce `0`, not `Infinity` or `NaN`.

Example test vector:

- `totalRegionalStock = 120`
- `fastestSetupHours = 1`
- `familyCoveragePercent = 100`
- `enterpriseCoveragePercent = 50`
- `readinessScore = 91`

Readiness filter bands:

- `all`: no readiness constraint;
- `medium`: include regions with `readinessScore >= 70`;
- `high`: include regions with `readinessScore >= 85`.

When sorting by readiness, higher score wins. If scores tie, keep the existing
stable page order from the current grouped region list.

## Related Lists

Each location row shows related server plan rows with data-center code, monthly
price, stock, and a link to the server detail page.

Each location row also links to Location Detail, where the selected region
becomes an item page with related plan filters, computed-field sorting, and
alternative region lists.

## Future Contract

Candidate tables: `regions`, `data_centers`, `availability_current`,
`server_plans`, `plan_hardware_links`, `sla_tiers`.
