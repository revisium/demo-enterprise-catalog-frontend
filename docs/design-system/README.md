# Design System

The first design system is intentionally small. It exists to support UI
iteration, not to freeze a brand too early.

## Current Direction

- Premium Apple-like B2B palette: white surfaces, soft blue-tinted page
  background, restrained cyan/blue accents, dark graphite text, and occasional
  dark contrast panels for price or purchase actions.
- Layout should feel spacious and product-grade, not like an infrastructure
  terminal. Use fewer panels with more breathing room before adding density.
- Cards use `0.5rem` radius or less.
- Buttons are direct commands, not decorative pills.
- The header and footer are constrained to the same `1240px` content width as
  the page body.
- Customer-facing UI must not expose Revisium mechanics, mock-state labels, row
  IDs, or source-layer proof widgets.

## Current Layout Contract

- Header: glass-like sticky bar, constrained content, public navigation, portal
  entry, quote CTA, and language control.
- Main page spacing: `24-36px` vertical page padding and `20-24px` gaps between
  major widgets.
- Home layout: left configurator, right recommendation and plan list.
- Footer: simple constrained link strip for pricing, docs, updates, and customer
  portal.
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
