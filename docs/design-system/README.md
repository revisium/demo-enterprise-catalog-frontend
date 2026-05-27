# Design System

The first design system is intentionally small. It exists to support UI
iteration, not to freeze a brand too early.

## Current Direction

- Premium Apple-like B2B palette: white surfaces, soft blue-tinted page
  background, restrained cyan/blue accents, dark graphite text, and occasional
  dark contrast panels for price or purchase actions. Chakra theme tokens encode
  this as blue `brand`, graphite `ink` (`500`, `600`, `700`, `900`), and cool
  neutral `surface` scales.
- Layout should feel spacious and product-grade, not like an infrastructure
  terminal. Use fewer panels with more breathing room before adding density.
- Cards use `0.5rem` radius or less.
- Buttons are direct commands, not decorative pills.
- The header and footer are constrained to the same `1240px` content width as
  the page body.
- Customer-facing UI must not expose Revisium mechanics, mock-state labels, row
  IDs, or source-layer proof widgets.

## Current Layout Contract

- Header: glass-like sticky bar, constrained content, compact brand mark,
  horizontally scrollable public navigation, portal entry, quote CTA, and
  language control. Desktop uses a three-column grid so navigation stays inside
  the same `1240px` content rail as the pages. Phone and tablet widths keep only
  brand, language, and burger in the header; account and quote actions move into
  the full-screen menu.
- Main page spacing: `24-36px` vertical page padding and `20-24px` gaps between
  major widgets.
- Home layout: left configurator and right recommendation column scroll
  together in the document flow, with compact selection summary, short
  matching-plan suggestions, and concise next-step links.
- Public sections use the same page shell: `pagePremiumBg`, `1240px`
  constrained content, `8px` panels, `surface.200` borders, and blue
  `brand.50`/`brand.500` badges.
- White cards and framed white control blocks use compact `12px` internal
  padding by default; larger spacing should stay reserved for true intro or
  feature panels.
- Dense summary micro-panels such as query summaries may use `8px` internal
  padding when the content is label/value rows and sits inside a larger control
  block.
- Public route intro blocks align their eyebrow and H1 from the same top rail
  across navigation tabs; push/replace route changes without hash targets reset
  document scroll to avoid preserved-position title jumps, while hash targets
  and back/forward navigation preserve browser scroll behavior.
- Public route intro H1 text uses restrained display sizing (`3xl` on compact
  screens and `5xl` from desktop/tablet layouts) so section titles stay calm
  next to dense catalog controls. Do not add terminal periods to these display
  headings.
- Public intro metric summaries are temporarily hidden during density review;
  keep their data and component wiring in place so they can be restored or
  removed intentionally before publishing the next PR.
- Product, catalog, quote, and planned pages use `recommendationBg` for the main
  intro panel and `surface.900` for compact dark status/action panels.
- Locations use the pricing/catalog density pattern: compact filter panels,
  white result rows, a single dark capacity/snapshot panel, and customer-facing
  availability language.
- Footer: constrained product summary plus grouped links for explore,
  resources, and account actions.
- Text inside buttons must wrap inside the control. Use stable min-heights for
  option cards so descriptions cannot visually escape their parent.
- Buttons, link-buttons, filter chips, and select controls use pointer cursors
  when enabled, not-allowed cursors when disabled, and subtle hover states with
  border, shadow, and lift feedback.
- Pointer clicks and browser-tab restoration must not leave a focus frame on
  buttons or navigation links. Keyboard navigation still gets a visible
  brand-colored focus outline through `:focus-visible`.
- Language switching is an adaptive-layout stress tool during the mock-first
  stage. The app-shell, home selector, and route-level mock pages must tolerate
  longer Russian/French/Spanish labels, compact Chinese labels, and Arabic RTL
  direction without overlap. Brand marks and product names remain literal unless
  a page contract explicitly localizes them. Dense first-screen experiences
  should use explicit translation keys instead of relying on DOM-level visual
  translation.

## Chakra Ownership

- Chakra UI is the styling system for the demo frontend.
- Theme tokens live in `src/app/providers/chakraTheme.ts`.
- Page components should use Chakra primitives and style props instead of custom
  CSS classes.
- `src/shared/ui/global.css` is only for minimal document reset.

## Assets

See [`assets.md`](./assets.md). The current `HS` mark is temporary; generated
logo and product imagery should be handled after the company legend and page
hierarchy are accepted.

## Responsive Rules

- Product and server cards stack to one column on narrow viewports.
- Header navigation scrolls horizontally inside the constrained header area
  instead of stretching across the viewport.
- Tables can start as card-like rows until a real dense table pattern is chosen.
- Text must not overlap or depend on viewport-width font scaling.
- Compare, resources, releases, quote, and customer-console pages use the same
  third-column rail pattern as locations so featured summaries, saved lists,
  previews, and actions align vertically with the main two-column content area.
