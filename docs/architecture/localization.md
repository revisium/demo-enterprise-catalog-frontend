# Localization

Localization is part of the source-data contract, not only a UI concern. The
frontend starts with English display strings and a visible language selector,
then connects localized content once the CMS and price projects exist.

## Supported Languages

The initial language set follows the six United Nations official languages:

| Code | English name | Native label | Direction | Future ownership             |
| ---- | ------------ | ------------ | --------- | ---------------------------- |
| `en` | English      | English      | `ltr`     | default UI and fallback      |
| `ar` | Arabic       | العربية      | `rtl`     | CMS, price labels, documents |
| `zh` | Chinese      | 中文         | `ltr`     | CMS, price labels, documents |
| `fr` | French       | Français     | `ltr`     | CMS, price labels, documents |
| `ru` | Russian      | Русский      | `ltr`     | CMS, price labels, documents |
| `es` | Spanish      | Español      | `ltr`     | CMS, price labels, documents |

## Frontend Contract

- `src/shared/i18n/languages.ts` owns language codes, native labels, direction,
  and the default locale.
- The header exposes a language selector immediately, even while page copy is
  still English mock content.
- Page data should eventually receive localized fields from Revisium, not
  hard-coded translation maps in React components.
- Arabic requires `dir="rtl"` support before it can be marked production-ready.

## Revisium Ownership

`enterprise-catalog-cms` should own localized CMS fields:

- page title, summary, body blocks;
- news/blog title, excerpt, body, tags;
- solution pages and SEO metadata;
- media alt text.

`enterprise-catalog-price` should own localized commercial labels:

- price-book names;
- region display names;
- currency labels;
- tier labels;
- legal/compliance copy attached to price books.

Backend dictionary APIs can expose supported languages, fallback rules, regions,
currencies, and category labels for runtime clients.

## Fallback Rules

- English is the canonical fallback.
- CMS content can fall back field-by-field while clearly indicating draft or
  missing translation state in internal tooling.
- Public pages should avoid mixing languages inside one content block once real
  CMS data is connected.
