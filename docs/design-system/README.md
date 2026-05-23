# Design System

The first design system is intentionally small. It exists to support UI
iteration, not to freeze a brand too early.

## Current Direction

- Quiet enterprise palette: white, soft green-gray surfaces, dark text, and
  restrained teal actions.
- Dense information layout: cards and rows should scan quickly.
- Cards use `0.5rem` radius or less.
- Buttons are direct commands, not decorative pills.
- Proof UI is secondary and should not dominate the catalog content.
- Product visuals use Chakra-rendered industrial panels for the first UI pass.
  Replace with real/generated product imagery only after the layout direction is
  accepted.

## Chakra Ownership

- Chakra UI is the styling system for the demo frontend.
- Theme tokens live in `src/app/providers/chakraTheme.ts`.
- Page components should use Chakra primitives and style props instead of custom
  CSS classes.
- `src/shared/ui/global.css` is only for minimal document reset.

## Responsive Rules

- Product cards stack to one column on narrow viewports.
- Header navigation wraps instead of overflowing.
- Tables can start as card-like rows until a real dense table pattern is chosen.
- Text must not overlap or depend on viewport-width font scaling.
