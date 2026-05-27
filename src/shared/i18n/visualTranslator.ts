import { defaultLocale, type LocaleCode } from './languages';
import { localizeVisualText } from './visualTranslations';

const skippedTextSelector = 'script, style, noscript, svg, code, pre, [data-i18n-skip]';
const skippedAttributeSelector = 'script, style, noscript, svg, [data-i18n-skip]';
const translatedAttributeNames = ['aria-label', 'alt', 'placeholder', 'title'] as const;

interface TextTranslationState {
  readonly source: string;
  readonly translated: string;
}

const translatedTextNodes = new WeakMap<Text, TextTranslationState>();
const originalElementAttributes = new WeakMap<Element, Map<string, string>>();

export function startVisualTranslator(locale: LocaleCode) {
  translateTree(document.body, locale);
  document.documentElement.removeAttribute('data-i18n-pending');

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData' && mutation.target instanceof Text) {
        translateTextNode(mutation.target, locale);
      }

      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        translateElementAttributes(mutation.target, locale);
      }

      for (const node of mutation.addedNodes) {
        translateNode(node, locale);
      }
    }
  });

  observer.observe(document.body, {
    attributeFilter: [...translatedAttributeNames],
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

function translateNode(node: Node, locale: LocaleCode) {
  if (node instanceof Text) {
    translateTextNode(node, locale);
    return;
  }

  if (node instanceof Element) {
    translateElementAttributes(node, locale);
    translateTree(node, locale);
  }
}

function translateTree(root: ParentNode, locale: LocaleCode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    if (node instanceof Text) {
      translateTextNode(node, locale);
    }

    node = walker.nextNode();
  }

  if (root instanceof Element) {
    translateElementAttributes(root, locale);
  }

  for (const element of root.querySelectorAll(`[${translatedAttributeNames.join('],[')}]`)) {
    translateElementAttributes(element, locale);
  }
}

function translateTextNode(node: Text, locale: LocaleCode) {
  if (shouldSkipTextNode(node)) {
    return;
  }

  const currentText = node.nodeValue ?? '';
  const previousState = translatedTextNodes.get(node);
  const sourceText =
    previousState &&
    (currentText === previousState.source || currentText === previousState.translated)
      ? previousState.source
      : currentText;

  const nextText = locale === defaultLocale ? sourceText : localizeVisualText(locale, sourceText);

  translatedTextNodes.set(node, {
    source: sourceText,
    translated: nextText,
  });

  if (currentText !== nextText) {
    node.nodeValue = nextText;
  }
}

function translateElementAttributes(element: Element, locale: LocaleCode) {
  if (element.closest(skippedAttributeSelector)) {
    return;
  }

  const originals = getOriginalElementAttributes(element);

  for (const attributeName of translatedAttributeNames) {
    const attributeValue = element.getAttribute(attributeName);

    if (!attributeValue) {
      continue;
    }

    const originalValue = originals.get(attributeName) ?? attributeValue;

    if (!originals.has(attributeName)) {
      originals.set(attributeName, originalValue);
    }

    const nextValue =
      locale === defaultLocale ? originalValue : localizeVisualText(locale, originalValue);

    if (attributeValue !== nextValue) {
      element.setAttribute(attributeName, nextValue);
    }
  }
}

function getOriginalElementAttributes(element: Element) {
  const originals = originalElementAttributes.get(element) ?? new Map<string, string>();

  if (!originalElementAttributes.has(element)) {
    originalElementAttributes.set(element, originals);
  }

  return originals;
}

function shouldSkipTextNode(node: Text) {
  const parent = node.parentElement;

  return !parent || Boolean(parent.closest(skippedTextSelector));
}
