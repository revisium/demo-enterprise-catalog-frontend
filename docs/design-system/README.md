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
  the same `1240px` content rail as the pages.
- Main page spacing: `24-36px` vertical page padding and `20-24px` gaps between
  major widgets.
- Home layout: left configurator, right recommendation and plan list.
- Public sections use the same page shell: `pagePremiumBg`, `1240px`
  constrained content, `8px` panels, `surface.200` borders, and blue
  `brand.50`/`brand.500` badges.
- Product, catalog, quote, and planned pages use `recommendationBg` for the main
  intro panel and `surface.900` for compact dark status/action panels.
- Footer: constrained product summary plus grouped links for explore,
  resources, and account actions.
- Text inside buttons must wrap inside the control. Use stable min-heights for
  option cards so descriptions cannot visually escape their parent.

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
