import { catalogSnapshot } from 'src/entities/catalog';
import { releaseUpdates, resourceArticles } from 'src/entities/content';
import {
  portalQuotes,
  portalSavedPlans,
  type PortalDemoSession,
  type PortalQuote,
} from 'src/entities/portal';
import { priceBooks } from 'src/entities/pricing';
import { supportedLocales } from 'src/shared/i18n';

type PortalActionStatus = 'accepted' | 'rejected';

interface PortalActionResult {
  readonly checks: readonly string[];
  readonly message: string;
  readonly status: PortalActionStatus;
}

const activeCurrencyIds = ['usd'] as const;
const quoteStatuses = new Set<PortalQuote['status']>([
  'Customer reply',
  'Draft',
  'Sales review',
  'Submitted',
]);

export function handlePortalPreferenceAction({
  formData,
  session,
}: {
  readonly formData: FormData;
  readonly session: PortalDemoSession;
}): PortalActionResult {
  const languageId = getFormValue(formData, 'languageId');
  const currencyId = getFormValue(formData, 'currencyId');
  const regionId = getFormValue(formData, 'regionId');
  const organizationId = getFormValue(formData, 'organizationId');
  const checks = [
    validateLanguage(languageId),
    validateCurrency(currencyId),
    validateRegion(regionId),
    validateUserOrganization(session, organizationId),
  ];

  return createActionResult({
    checks,
    message: 'Preference update accepted by backend mock.',
  });
}

export function handlePortalFavoriteAction({
  formData,
  session,
}: {
  readonly formData: FormData;
  readonly session: PortalDemoSession;
}): PortalActionResult {
  const planId = getFormValue(formData, 'planId');
  const savedPlan = portalSavedPlans.find((plan) => plan.id === planId);
  const checks = [
    validateOwnedSavedPlan(savedPlan, session),
    validateCatalogPlan(savedPlan?.plan),
    validateActivePriceBook(),
    validateRegionByLabel(savedPlan?.region),
  ];

  return createActionResult({
    checks,
    message: 'Favorite mutation accepted by backend mock.',
  });
}

export function handlePortalQuoteCommentAction({
  formData,
  session,
}: {
  readonly formData: FormData;
  readonly session: PortalDemoSession;
}): PortalActionResult {
  const quoteId = getFormValue(formData, 'quoteId');
  const statusId = getFormValue(formData, 'statusId');
  const quote = portalQuotes.find((item) => item.id === quoteId);
  const checks = [
    validateOwnedQuote(quote, session),
    validateQuoteStatus(statusId),
    validateCatalogPlan(quote?.plan),
    validateActivePriceBook(),
    validateRegionByLabel(quote?.region),
  ];

  return createActionResult({
    checks,
    message: 'Quote comment accepted by backend mock.',
  });
}

export function handlePortalContentFeedbackAction({
  formData,
  session,
}: {
  readonly formData: FormData;
  readonly session: PortalDemoSession;
}): PortalActionResult {
  const articleId = getFormValue(formData, 'articleId');
  const updateId = getFormValue(formData, 'updateId');
  const organizationId = getFormValue(formData, 'organizationId');
  const hasTarget = articleId.length > 0 || updateId.length > 0;
  const checks = [
    validateUserOrganization(session, organizationId),
    hasTarget ? 'feedback target provided' : 'rejected: missing feedback target',
    articleId ? validateArticle(articleId) : 'articleId skipped',
    updateId ? validateUpdate(updateId) : 'updateId skipped',
  ];

  return createActionResult({
    checks,
    message: 'Content feedback accepted by backend mock.',
  });
}

function createActionResult({
  checks,
  message,
}: {
  readonly checks: readonly string[];
  readonly message: string;
}): PortalActionResult {
  const failedCheck = checks.find((check) => check.startsWith('rejected:'));

  return {
    checks,
    message: failedCheck ?? message,
    status: failedCheck ? 'rejected' : 'accepted',
  };
}

function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === 'string' ? value : '';
}

function validateArticle(articleId: string): string {
  const article = resourceArticles.find((item) => item.id === articleId);

  return article ? `articleId ${articleId} published` : `rejected: unknown articleId ${articleId}`;
}

function validateActivePriceBook(): string {
  const priceBook = priceBooks.find((item) => item.status === 'Active');

  return priceBook ? `priceBookId ${priceBook.id} active` : 'rejected: no active price book';
}

function validateCatalogPlan(planName: string | undefined): string {
  const product = catalogSnapshot.products.find((item) => item.name === planName);

  return product ? `plan ${product.id} active` : `rejected: unknown plan ${planName ?? ''}`;
}

function validateCurrency(currencyId: string): string {
  return activeCurrencyIds.includes(currencyId as (typeof activeCurrencyIds)[number])
    ? `currencyId ${currencyId} active`
    : `rejected: unsupported currencyId ${currencyId}`;
}

function validateLanguage(languageId: string): string {
  const locale = supportedLocales.find((item) => item.code === languageId);

  return locale ? `languageId ${languageId} active` : `rejected: unknown languageId ${languageId}`;
}

function validateOwnedQuote(quote: PortalQuote | undefined, session: PortalDemoSession): string {
  if (!quote) {
    return 'rejected: unauthorized quoteId';
  }

  if (quote.requesterUserId !== session.user.id) {
    return 'rejected: unauthorized quoteId';
  }

  return `quoteId ${quote.id} owned by ${session.user.id}`;
}

function validateOwnedSavedPlan(
  savedPlan: (typeof portalSavedPlans)[number] | undefined,
  session: PortalDemoSession,
): string {
  if (!savedPlan) {
    return 'rejected: unauthorized planId';
  }

  if (savedPlan.ownerUserId !== session.user.id) {
    return 'rejected: unauthorized planId';
  }

  return `planId ${savedPlan.id} owned by ${session.user.id}`;
}

function validateQuoteStatus(statusId: string): string {
  return quoteStatuses.has(statusId as PortalQuote['status'])
    ? `statusId ${statusId} allowed`
    : `rejected: unsupported statusId ${statusId}`;
}

function validateRegion(regionId: string): string {
  const region = catalogSnapshot.products
    .flatMap((product) => product.availabilityByRegion)
    .find((item) => item.regionId === regionId);

  return region ? `regionId ${regionId} active` : `rejected: unknown regionId ${regionId}`;
}

function validateRegionByLabel(regionLabel: string | undefined): string {
  const region = catalogSnapshot.products
    .flatMap((product) => product.availabilityByRegion)
    .find((item) => item.regionLabel === regionLabel);

  return region
    ? `regionId ${region.regionId} active`
    : `rejected: unknown region ${regionLabel ?? ''}`;
}

function validateUpdate(updateId: string): string {
  const update = releaseUpdates.find((item) => item.id === updateId);

  return update ? `updateId ${updateId} published` : `rejected: unknown updateId ${updateId}`;
}

function validateUserOrganization(session: PortalDemoSession, organizationId: string): string {
  return session.user.organizationIds.includes(organizationId)
    ? `organizationId ${organizationId} available for ${session.user.id}`
    : 'rejected: unauthorized organizationId';
}
