import { defaultLocale, type LocaleCode } from './languages';
import { messages } from './messages';
import visualTextEntriesJson from './visualTranslations.data.json';

type LocaleTupleIndex = 0 | 1 | 2 | 3 | 4 | 5;
type TranslationTuple = readonly [string, string, string, string, string, string];

const visualTextEntries = visualTextEntriesJson as unknown as Record<string, TranslationTuple>;

const localeIndexes = {
  en: 0,
  ar: 1,
  zh: 2,
  fr: 3,
  ru: 4,
  es: 5,
} as const satisfies Record<LocaleCode, LocaleTupleIndex>;

const exactTextTranslations = new Map<string, TranslationTuple>();
type MessageKey = keyof typeof messages.en;

const messageTextEntries = (Object.keys(messages.en) as MessageKey[]).map(
  (key) =>
    [
      messages.en[key],
      messages.ar[key],
      messages.zh[key],
      messages.fr[key],
      messages.ru[key],
      messages.es[key],
    ] as const satisfies TranslationTuple,
);

const exactTranslationTuples = [...messageTextEntries, ...Object.values(visualTextEntries)];
const phraseTextEntries = Object.values(visualTextEntries).sort(
  (left, right) => right[0].length - left[0].length,
);

for (const tuple of exactTranslationTuples) {
  exactTextTranslations.set(normalizeText(tuple[0]), tuple);
}

export function localizeVisualText(locale: LocaleCode, source: string): string {
  if (locale === defaultLocale || !shouldTranslate(source)) {
    return source;
  }

  const normalizedSource = normalizeText(source);
  const exactTranslation = exactTextTranslations.get(normalizedSource);

  if (exactTranslation) {
    return preserveOuterWhitespace(source, getTupleValue(exactTranslation, locale));
  }

  const terminalPeriodTranslation = exactTextTranslations.get(`${normalizedSource}.`);

  if (terminalPeriodTranslation) {
    return preserveOuterWhitespace(
      source,
      removeTerminalPeriod(getTupleValue(terminalPeriodTranslation, locale)),
    );
  }

  return phraseTextEntries.reduce((text, tuple) => {
    const target = getTupleValue(tuple, locale);

    return tuple[0] === target ? text : replacePhrase(text, tuple[0], target);
  }, source);
}

function getTupleValue(tuple: TranslationTuple, locale: LocaleCode) {
  return tuple[localeIndexes[locale]];
}

function shouldTranslate(source: string) {
  const trimmed = source.trim();

  return (
    trimmed.length > 1 &&
    /[A-Za-z]/.test(trimmed) &&
    !trimmed.includes('@') &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('http') &&
    !/^[A-Z0-9._/-]+$/.test(trimmed)
  );
}

function normalizeText(source: string) {
  return source.replace(/\s+/g, ' ').trim();
}

function preserveOuterWhitespace(source: string, translated: string) {
  const leading = getLeadingWhitespace(source);
  const trailing = getTrailingWhitespace(source);

  return `${leading}${translated}${trailing}`;
}

function removeTerminalPeriod(source: string) {
  let endIndex = source.length;

  while (endIndex > 0 && isTerminalPeriod(source.charCodeAt(endIndex - 1))) {
    endIndex -= 1;
  }

  return endIndex === source.length ? source : source.slice(0, endIndex);
}

function isTerminalPeriod(characterCode: number) {
  return (
    characterCode === 46 ||
    characterCode === 0x3002 ||
    characterCode === 0xff0e ||
    characterCode === 0xff61
  );
}

function getLeadingWhitespace(source: string) {
  let index = 0;

  while (index < source.length && /\s/.exec(source[index] ?? '')) {
    index += 1;
  }

  return source.slice(0, index);
}

function getTrailingWhitespace(source: string) {
  let index = source.length - 1;

  while (index >= 0 && /\s/.exec(source[index] ?? '')) {
    index -= 1;
  }

  return source.slice(index + 1);
}

function replacePhrase(source: string, phrase: string, translated: string) {
  const escapedPhrase = escapeRegExp(phrase);
  const hasWordEdges = /^[A-Za-z0-9]/.test(phrase) && /[A-Za-z0-9]$/.test(phrase);
  const pattern = hasWordEdges
    ? new RegExp(`(?<![A-Za-z0-9])${escapedPhrase}(?![A-Za-z0-9])`, 'g')
    : new RegExp(escapedPhrase, 'g');

  return source.replace(pattern, translated);
}

function escapeRegExp(source: string) {
  return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
