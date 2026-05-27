# Visual Assets

The current UI uses Chakra-rendered product panels plus a first generated raster
intro image set so layout can stabilize before committing to final brand assets.
The intro set uses the product palette of blue, graphite, glassy white surfaces,
and a restrained copper amber accent (`accent.400`, `#f59e0b`) so sections feel
more distinct without becoming separate visual brands.

## Logo

Keep the current `HS` mark as a temporary system mark. Generate or commission a
proper HelioStack logo after the company legend and UI direction are accepted.

Logo requirements:

- works as a compact header mark and full wordmark;
- feels premium and technical, not consumer SaaS;
- supports light and dark surfaces;
- has accessible alt text;
- can be represented as SVG in the repo after approval.

## Product Imagery

Generated product imagery is useful after page density and hierarchy are
accepted. The first asset set lives in `src/shared/assets/page-intros/` and
covers public section intro blocks with enterprise-style raster infographics:

- cloud server rack;
- data-center/location imagery;
- documentation/API thumbnails;
- price-book revision proof visual.
- portal/account workspace visual.
- quote preparation / cost projection visual.
- comparison matrix visual;
- update/release timeline visual.

Intro images are decorative support assets: use generated raster PNGs with
alpha, keep them free of readable text and logos, render them as isolated
objects without UI frames or background plates, hide them on mobile during the
first layout pass, and do not use them as source-data proof.

Generated images should not replace source-data proof. They support the catalog
experience; Revisium evidence still comes from project/table/row links, diffs,
requests, and responses.
