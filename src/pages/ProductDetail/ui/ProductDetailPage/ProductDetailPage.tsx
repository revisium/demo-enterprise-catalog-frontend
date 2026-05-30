import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';

import { type LocaleCode, type TranslationKey, useI18n } from 'src/shared/i18n';
import { createReturnState } from 'src/shared/routing';
import {
  BackNavButton,
  EmptyState,
  FilterButton,
  InteractiveListCard,
  PageSectionSurface,
  MetricGrid,
  ProductVisual,
  PanelHeroCallout,
  SelectField,
} from 'src/shared/ui';
import {
  ProductDetailPageViewModel,
  type ProductResourceVisual,
} from '../../model/ProductDetailPageViewModel';
import { DetailRowsCard } from '../DetailRowsCard/DetailRowsCard';

const sectionHeadingProps = {
  color: 'brand.500',
  fontSize: 'xs',
  fontWeight: '800',
  textTransform: 'uppercase',
} as const;

export const ProductDetailPage = observer(function ProductDetailPage() {
  const location = useLocation();
  const params = useParams();
  const [vm] = useState(() => new ProductDetailPageViewModel(params.productId));
  const returnState = createReturnState(location);
  const { locale, t } = useI18n();
  const alternativeSortOptions = getAlternativeSortOptions(t);
  const sectionGap = { base: '4', md: '5' } as const;

  return (
    <PageSectionSurface flex="1">
      <Container maxW="1240px" px={{ base: '3', md: '5' }} py={{ base: '6', md: '9' }}>
        <Stack gap={sectionGap}>
          <BackNavButton fallbackTo="/catalog" />

          <Grid
            alignItems="stretch"
            gap={sectionGap}
            templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(380px, 460px)' }}
          >
            <Stack
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="4"
              justify="space-between"
              p="3"
            >
              <Flex
                align="center"
                color="ink.500"
                fontSize="sm"
                fontWeight="700"
                gap="2"
                wrap="wrap"
              >
                <Text>{vm.product.family}</Text>
                <Badge bg="successBg" borderRadius="8px" color="successText">
                  {vm.product.lifecycle}
                </Badge>
              </Flex>
              <Heading as="h1" color="ink.900" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1">
                {vm.product.name}
              </Heading>
              <Text color="ink.700" fontSize="md" maxW="720px">
                {vm.product.summary}
              </Text>
              <Stack gap="3">
                <Flex gap="2" wrap="wrap">
                  {vm.product.protocols.map((protocol) => (
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500" key={protocol}>
                      {protocol}
                    </Badge>
                  ))}
                </Flex>
                <Stack align="start" gap="2">
                  <Button asChild bg="ctaBg" borderRadius="8px" color="white">
                    <Link state={returnState} to={vm.quotePath}>
                      Request quote
                    </Link>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              bg="recommendationBg"
              borderColor="panelBorderStrong"
              borderRadius="8px"
              borderWidth="1px"
              boxShadow="panel"
              gap="3"
              h="100%"
              p="3"
            >
              <MetricGrid
                ariaLabel="Product metrics"
                columns={{ base: 2, sm: 2 }}
                metrics={vm.summaryMetrics}
              />
              <PanelHeroCallout eyebrow="Commercial summary" title={`$${vm.product.pricing.monthlyUsd}/mo`}>
                <Text color="darkPanelText" fontSize="sm">
                  {vm.commercialTermLabel}
                </Text>
                <Text color="darkPanelText" fontSize="sm">
                  {vm.product.customerNote}
                </Text>
              </PanelHeroCallout>
            </Stack>
          </Grid>

          <Stack gap={sectionGap}>
            <Grid
              alignItems="stretch"
              gap={sectionGap}
              templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(380px, 460px)' }}
            >
              <Stack gap={sectionGap} h={{ lg: '100%' }} justify={{ lg: 'space-between' }}>
                <Grid gap="3" templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}>
                  <WorkbenchCard
                    badge={formatRegionCount(locale, vm.visibleRegionRows.length)}
                    eyebrow={t('productDetail.controls.regionalAvailability')}
                    metric={
                      vm.inStockRegionsOnly
                        ? t('productDetail.controls.availableRegions')
                        : t('productDetail.controls.allRegions')
                    }
                  >
                    <FilterButton
                      onClick={() => vm.setInStockRegionsOnly(!vm.inStockRegionsOnly)}
                      selected={vm.inStockRegionsOnly}
                      tone="success"
                    >
                      {t('productDetail.controls.inStockOnly')}
                    </FilterButton>
                  </WorkbenchCard>

                  <WorkbenchCard
                    badge={formatPlanCount(locale, vm.alternativeRows.length)}
                    eyebrow={t('productDetail.controls.alternativePlans')}
                    metric={getOptionLabel(alternativeSortOptions, vm.alternativeSortId)}
                  >
                    <SelectField
                      compact
                      label={t('productDetail.controls.sort')}
                      labelGap="2"
                      onChange={(value) => vm.setAlternativeSort(value)}
                      options={alternativeSortOptions}
                      value={vm.alternativeSortId}
                    />
                  </WorkbenchCard>
                </Grid>

                <Stack
                  bg="white"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  boxShadow="0 18px 45px rgba(16, 24, 40, 0.06)"
                  data-i18n-skip
                  gap="4"
                  overflow="hidden"
                  p="4"
                >
                  <Flex align="start" gap="3" justify="space-between" wrap="wrap">
                    <Stack gap="1">
                      <Heading as="h2" {...sectionHeadingProps}>
                        {t('productDetail.resources.eyebrow')}
                      </Heading>
                      <Text color="ink.900" fontSize="xl" fontWeight="780" lineHeight="1.15">
                        {t('productDetail.resources.title')}
                      </Text>
                    </Stack>
                    <Badge bg="brand.50" borderRadius="8px" color="brand.500">
                      {formatResourceLinksCount(
                        locale,
                        vm.addOnRows.length + vm.documentRows.length + 1,
                      )}
                    </Badge>
                  </Flex>

                  <Grid gap="4" templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}>
                    <Stack gap="2" minW="0">
                      <Text
                        color="ink.500"
                        fontSize="xs"
                        fontWeight="800"
                        textTransform="uppercase"
                      >
                        {t('productDetail.resources.addons')}
                      </Text>
                      {vm.addOnRows.map((addon) => (
                        <RelatedResourceLink
                          href={addon.href}
                          key={addon.id}
                          label={getAddOnLabel(addon.id, t)}
                          returnState={returnState}
                          targetLabel={getTargetLabel(addon.targetLabel, t)}
                          visual={addon.visual}
                        />
                      ))}
                    </Stack>

                    <Stack gap="2" minW="0">
                      <Text
                        color="ink.500"
                        fontSize="xs"
                        fontWeight="800"
                        textTransform="uppercase"
                      >
                        {t('productDetail.resources.documents')}
                      </Text>
                      {vm.documentRows.map((document) => (
                        <RelatedResourceLink
                          href={document.href}
                          key={document.id}
                          label={getDocumentLabel(document.label, t)}
                          returnState={returnState}
                          targetLabel={getTargetLabel(document.targetLabel, t)}
                          visual={document.visual}
                        />
                      ))}
                      <RelatedResourceLink
                        href="/pricing"
                        label={t('productDetail.resources.checkPriceRows')}
                        returnState={returnState}
                        targetLabel={t('nav.pricing')}
                        visual="pricing"
                      />
                    </Stack>
                  </Grid>
                </Stack>
              </Stack>

              <Stack gap={sectionGap}>
                <DetailRowsCard keyPrefix="spec" rows={[...vm.technicalRows, ...vm.packageRows]} title="Specifications" />
              </Stack>
            </Grid>
          </Stack>

          <Stack gap={sectionGap}>
            <Stack
              bg="white"
              borderColor="surface.200"
              borderRadius="8px"
              borderWidth="1px"
              gap="3"
              overflowX={{ base: 'auto', md: 'visible' }}
              p="3"
              pb={{ base: '1', md: '3' }}
            >
              <Heading as="h2" {...sectionHeadingProps}>
                Regional availability
              </Heading>
              {vm.hasNoRegionMatches ? (
                <EmptyState
                  actionLabel="Show all regions"
                  onAction={() => vm.setInStockRegionsOnly(false)}
                  summary="This plan has no in-stock regions under the current availability view."
                  title="No in-stock regions"
                />
              ) : null}
              {vm.visibleRegionRows.map((region) => (
                <Grid
                  alignItems="center"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  columnGap={{ base: '3', md: '6' }}
                  gap="3"
                  key={region.regionId}
                  minW={{ base: '620px', md: '0' }}
                  p="3"
                  templateColumns="minmax(0, 1fr) auto auto auto"
                  w="100%"
                >
                  <Stack gap="1">
                    <Box asChild alignSelf="start" color="ink.900" fontWeight="780">
                      <Link state={returnState} to={region.locationHref}>
                        {region.regionLabel}
                      </Link>
                    </Box>
                    <Text color="ink.500" fontSize="sm">
                      {region.dataCenterCode} · {region.supportWindow}
                    </Text>
                  </Stack>
                  <Text color="ink.900" fontWeight="700">
                    {region.stock} units
                  </Text>
                  <Text color="ink.500" fontSize="sm">
                    setup {region.setupHours}h
                  </Text>
                  <Stack align={{ base: 'start', md: 'end' }} gap="2">
                    <Badge bg="successBg" borderRadius="8px" color="successText">
                      {region.readinessScore} readiness
                    </Badge>
                    <Button asChild borderRadius="8px" size="xs" variant="outline">
                      <Link state={returnState} to={region.quoteHref}>
                        Quote here
                      </Link>
                    </Button>
                  </Stack>
                </Grid>
              ))}
            </Stack>
          </Stack>

          <Stack
            bg="white"
            borderColor="surface.200"
            borderRadius="8px"
            borderWidth="1px"
            gap="3"
            p="3"
          >
            <Flex align="center" justify="space-between" gap="3" wrap="wrap">
              <Stack gap="1">
                <Heading as="h2" {...sectionHeadingProps}>
                  Alternative plans
                </Heading>
                <Text color="ink.500" fontSize="sm">
                  Similar capacity in matching regions
                </Text>
              </Stack>
              <Button asChild borderRadius="8px" size="sm" variant="outline">
                <Link state={returnState} to="/catalog">
                  Browse catalog
                </Link>
              </Button>
            </Flex>
            <Grid
              gap="3"
              overflowX={{ base: 'auto', md: 'visible' }}
              pb={{ base: '1', md: '0' }}
              templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }}
            >
              {vm.alternativeRows.map((row) => (
                <InteractiveListCard
                  ariaLabel={`Open server plan: ${row.plan.name}`}
                  alignItems="stretch"
                  bg="panelGlassBg"
                  borderColor="surface.200"
                  borderRadius="8px"
                  borderWidth="1px"
                  cursor="pointer"
                  gap="3"
                  key={row.plan.id}
                  minW={{ base: '560px', md: '0' }}
                  overflow="hidden"
                  p="3"
                  returnState={returnState}
                  position="relative"
                  templateColumns="88px minmax(0, 1fr) auto"
                  to={row.detailHref}
                >
                  <ProductVisual
                    alt={row.plan.imageAlt}
                    minH="24"
                    radius="control"
                    tone={row.plan.visualTone}
                  />
                  <Stack gap="2" pointerEvents="none">
                    <Stack gap="0">
                      <Text color="ink.900" fontWeight="780">
                        {row.plan.name}
                      </Text>
                      <Text color="ink.500" fontSize="sm">
                        {row.plan.family} · {row.overlapRegionCount} matching regions · updated{' '}
                        {row.displayUpdatedDate}
                      </Text>
                    </Stack>
                    <Flex gap="2" wrap="wrap">
                      <Badge bg="panelSubtleBg" borderRadius="8px" color="ink.700">
                        ${row.plan.pricing.monthlyUsd}/mo
                      </Badge>
                      <Badge bg="successBg" borderRadius="8px" color="successText">
                        {row.priceEfficiencyScore} efficiency
                      </Badge>
                    </Flex>
                  </Stack>
                  <Stack align="stretch" gap="2" position="relative" zIndex="2">
                    <Button
                      alignSelf="start"
                      asChild
                      borderRadius="8px"
                      size="sm"
                      variant="outline"
                    >
                      <Link state={returnState} to={row.quoteHref}>
                        Quote
                      </Link>
                    </Button>
                  </Stack>
                </InteractiveListCard>
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </PageSectionSurface>
  );
});

function WorkbenchCard({
  badge,
  children,
  eyebrow,
  metric,
}: {
  readonly badge: string;
  readonly children: ReactNode;
  readonly eyebrow: string;
  readonly metric: ReactNode;
}) {
  return (
    <Stack
      bg="white"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      boxShadow="0 18px 45px rgba(16, 24, 40, 0.06)"
      data-i18n-skip
      gap="4"
      minW="0"
      overflow="hidden"
      p="4"
      position="relative"
    >
      <Box bg="brand.500" h="1" left="0" position="absolute" right="0" top="0" />
      <Flex align="start" gap="3" justify="space-between">
        <Stack gap="1" minW="0">
          <Heading as="h2" {...sectionHeadingProps}>
            {eyebrow}
          </Heading>
          <Text color="ink.900" fontSize="xl" fontWeight="780" lineHeight="1.15">
            {metric}
          </Text>
        </Stack>
        <Badge bg="brand.50" borderRadius="8px" color="brand.500" flexShrink="0">
          {badge}
        </Badge>
      </Flex>
      <Stack align="start" gap="3">
        {children}
      </Stack>
    </Stack>
  );
}

function RelatedResourceLink({
  href,
  label,
  returnState,
  targetLabel,
  visual,
}: {
  readonly href: string;
  readonly label: string;
  readonly returnState: ReturnType<typeof createReturnState>;
  readonly targetLabel: string;
  readonly visual: ProductResourceVisual;
}) {
  return (
    <Grid
      asChild
      alignItems="center"
      borderColor="surface.200"
      borderRadius="8px"
      color="inherit"
      gap="3"
      minH="64px"
      p="2.5"
      templateColumns={{ base: '42px minmax(0, 1fr)', sm: '42px minmax(0, 1fr) auto' }}
      textDecoration="none"
      transition="background-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease"
      _focusVisible={{
        boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.28)',
        outline: 'none',
      }}
      _hover={{
        bg: 'surface.50',
        boxShadow: 'inset 3px 0 0 #0b5bd3',
        color: 'brand.500',
      }}
    >
      <Link state={returnState} to={href}>
        <ResourceGlyph visual={visual} />
        <Stack gap="0" minW="0">
          <Text color="ink.900" fontSize="sm" fontWeight="720">
            {label}
          </Text>
          <Text color="ink.500" display={{ base: 'block', sm: 'none' }} fontSize="xs">
            {targetLabel}
          </Text>
        </Stack>
        <ResourceTargetBadge label={targetLabel} />
      </Link>
    </Grid>
  );
}

function ResourceGlyph({ visual }: { readonly visual: ProductResourceVisual }) {
  if (visual === 'pricing' || visual === 'billing') {
    return (
      <ResourceGlyphFrame tone={visual === 'pricing' ? 'dark' : 'success'}>$</ResourceGlyphFrame>
    );
  }

  if (visual === 'api') {
    return (
      <ResourceGlyphFrame tone="brand">
        <Text fontSize="xs" fontWeight="900" letterSpacing="0">
          API
        </Text>
      </ResourceGlyphFrame>
    );
  }

  if (visual === 'backup') {
    return (
      <ResourceGlyphFrame tone="brand">
        <Stack gap="1" w="5">
          <Box bg="brand.500" borderRadius="999px" h="1.5" w="5" />
          <Box bg="successBorder" borderRadius="999px" h="1.5" w="3.5" />
          <Box bg="surface.200" borderRadius="999px" h="1.5" w="4" />
        </Stack>
      </ResourceGlyphFrame>
    );
  }

  if (visual === 'lifecycle') {
    return (
      <ResourceGlyphFrame tone="neutral">
        <Stack gap="1" w="5">
          <Flex align="center" gap="1">
            <Box bg="successBorder" borderRadius="2px" h="1.5" w="1.5" />
            <Box bg="ink.500" borderRadius="999px" h="1" w="3.5" />
          </Flex>
          <Flex align="center" gap="1">
            <Box bg="brand.500" borderRadius="2px" h="1.5" w="1.5" />
            <Box bg="ink.500" borderRadius="999px" h="1" w="4" />
          </Flex>
          <Flex align="center" gap="1">
            <Box bg="surface.200" borderRadius="2px" h="1.5" w="1.5" />
            <Box bg="ink.500" borderRadius="999px" h="1" w="3" />
          </Flex>
        </Stack>
      </ResourceGlyphFrame>
    );
  }

  if (visual === 'monitoring') {
    return (
      <ResourceGlyphFrame tone="success">
        <Flex align="end" gap="1" h="5">
          <Box bg="successText" borderRadius="999px" h="2" w="1.5" />
          <Box bg="successText" borderRadius="999px" h="4" w="1.5" />
          <Box bg="successText" borderRadius="999px" h="3" w="1.5" />
          <Box bg="successText" borderRadius="999px" h="5" w="1.5" />
        </Flex>
      </ResourceGlyphFrame>
    );
  }

  if (visual === 'network') {
    return (
      <ResourceGlyphFrame tone="brand">
        <Box h="6" position="relative" w="6">
          <Box
            bg="brand.500"
            borderRadius="999px"
            h="2"
            left="0"
            position="absolute"
            top="2"
            w="2"
          />
          <Box
            bg="brand.500"
            borderRadius="999px"
            h="2"
            position="absolute"
            right="0"
            top="0"
            w="2"
          />
          <Box
            bg="brand.500"
            borderRadius="999px"
            bottom="0"
            h="2"
            position="absolute"
            right="0"
            w="2"
          />
          <Box
            bg="brand.500"
            h="1px"
            left="2"
            position="absolute"
            top="3"
            transform="rotate(-24deg)"
            transformOrigin="left center"
            w="4"
          />
          <Box
            bg="brand.500"
            bottom="2.5"
            h="1px"
            left="2"
            position="absolute"
            transform="rotate(24deg)"
            transformOrigin="left center"
            w="4"
          />
        </Box>
      </ResourceGlyphFrame>
    );
  }

  if (visual === 'support') {
    return (
      <ResourceGlyphFrame tone="dark">
        <Box
          borderColor="white"
          borderRadius="999px"
          borderWidth="2px"
          h="5"
          position="relative"
          w="5"
        >
          <Box
            bg="white"
            borderRadius="999px"
            bottom="-1px"
            h="1.5"
            position="absolute"
            right="-2px"
            w="3"
          />
          <Box
            bg="white"
            borderRadius="999px"
            bottom="1"
            h="1"
            left="1.5"
            position="absolute"
            w="2.5"
          />
        </Box>
      </ResourceGlyphFrame>
    );
  }

  return (
    <ResourceGlyphFrame tone="neutral">
      <Box
        borderColor="brand.500"
        borderRadius="3px"
        borderWidth="2px"
        h="5"
        position="relative"
        w="4"
      >
        <Box bg="brand.500" h="1.5" position="absolute" right="-2px" top="-2px" w="1.5" />
      </Box>
    </ResourceGlyphFrame>
  );
}

function ResourceGlyphFrame({
  children,
  tone,
}: {
  readonly children: ReactNode;
  readonly tone: 'brand' | 'dark' | 'neutral' | 'success';
}) {
  if (tone === 'dark') {
    return (
      <Flex
        align="center"
        bg="surface.900"
        borderRadius="8px"
        color="white"
        flexShrink="0"
        fontWeight="800"
        h="10"
        justify="center"
        w="10"
      >
        {children}
      </Flex>
    );
  }

  if (tone === 'success') {
    return (
      <Flex
        align="center"
        bg="successBg"
        borderColor="successBorder"
        borderRadius="8px"
        borderWidth="1px"
        color="successText"
        flexShrink="0"
        fontWeight="800"
        h="10"
        justify="center"
        w="10"
      >
        {children}
      </Flex>
    );
  }

  return (
    <Flex
      align="center"
      bg={tone === 'brand' ? 'brand.50' : 'panelSubtleBg'}
      borderColor={tone === 'brand' ? 'brandBorderMuted' : 'surface.200'}
      borderRadius="8px"
      borderWidth="1px"
      color="brand.500"
      flexShrink="0"
      fontWeight="800"
      h="10"
      justify="center"
      w="10"
    >
      {children}
    </Flex>
  );
}

function ResourceTargetBadge({ label }: { readonly label: string }) {
  return (
    <Badge
      bg="surface.100"
      borderColor="surface.200"
      borderRadius="8px"
      borderWidth="1px"
      color="ink.600"
      display={{ base: 'none', sm: 'inline-flex' }}
      flexShrink="0"
    >
      {label}
    </Badge>
  );
}

type ProductDetailTranslate = (key: TranslationKey) => string;

interface ProductDetailOption {
  readonly id: string;
  readonly label: string;
}

function getAlternativeSortOptions(t: ProductDetailTranslate): readonly ProductDetailOption[] {
  return [
    { id: 'price-efficiency', label: t('productDetail.controls.sort.bestPriceEfficiency') },
    { id: 'monthly-price', label: t('productDetail.controls.sort.lowestMonthlyPrice') },
    { id: 'stock', label: t('productDetail.controls.sort.mostStock') },
    { id: 'recently-updated', label: t('productDetail.controls.sort.recentlyUpdated') },
  ];
}

function getOptionLabel(options: readonly ProductDetailOption[], id: string) {
  return options.find((option) => option.id === id)?.label ?? id;
}

const resourceLinkLabelByLocale: Record<
  LocaleCode,
  Partial<Record<Intl.LDMLPluralRule, string>> & { readonly other: string }
> = {
  ar: {
    few: 'روابط',
    many: 'رابطا',
    one: 'رابط',
    other: 'رابط',
    two: 'رابطان',
    zero: 'روابط',
  },
  en: {
    one: 'link',
    other: 'links',
  },
  es: {
    one: 'enlace',
    other: 'enlaces',
  },
  fr: {
    one: 'lien',
    other: 'liens',
  },
  ru: {
    few: 'ссылки',
    many: 'ссылок',
    one: 'ссылка',
    other: 'ссылки',
  },
  zh: {
    other: '个链接',
  },
};

const regionLabelByLocale: Record<
  LocaleCode,
  Partial<Record<Intl.LDMLPluralRule, string>> & { readonly other: string }
> = {
  ar: {
    one: 'منطقة',
    other: 'مناطق',
    two: 'منطقتان',
  },
  en: {
    one: 'region',
    other: 'regions',
  },
  es: {
    one: 'region',
    other: 'regiones',
  },
  fr: {
    one: 'region',
    other: 'regions',
  },
  ru: {
    few: 'региона',
    many: 'регионов',
    one: 'регион',
    other: 'региона',
  },
  zh: {
    other: '个区域',
  },
};

const planLabelByLocale: Record<
  LocaleCode,
  Partial<Record<Intl.LDMLPluralRule, string>> & { readonly other: string }
> = {
  ar: {
    one: 'خطة',
    other: 'خطط',
    two: 'خطتان',
  },
  en: {
    one: 'plan',
    other: 'plans',
  },
  es: {
    one: 'plan',
    other: 'planes',
  },
  fr: {
    one: 'plan',
    other: 'plans',
  },
  ru: {
    few: 'плана',
    many: 'планов',
    one: 'план',
    other: 'плана',
  },
  zh: {
    other: '个方案',
  },
};

function formatRegionCount(locale: LocaleCode, count: number) {
  return formatLocalizedCount(locale, count, regionLabelByLocale);
}

function formatPlanCount(locale: LocaleCode, count: number) {
  return formatLocalizedCount(locale, count, planLabelByLocale);
}

function formatResourceLinksCount(locale: LocaleCode, count: number) {
  return formatLocalizedCount(locale, count, resourceLinkLabelByLocale);
}

function formatLocalizedCount(
  locale: LocaleCode,
  count: number,
  labels: Record<
    LocaleCode,
    Partial<Record<Intl.LDMLPluralRule, string>> & { readonly other: string }
  >,
) {
  const pluralRule = new Intl.PluralRules(locale).select(count);
  const label = labels[locale][pluralRule] ?? labels[locale].other;

  return `${count} ${label}`;
}

function getAddOnLabel(addonId: string, t: ProductDetailTranslate) {
  if (addonId === 'backup') {
    return t('productDetail.resources.addon.backup');
  }

  if (addonId === 'ipv4') {
    return t('productDetail.resources.addon.ipv4');
  }

  if (addonId === 'lifecycle-rules') {
    return t('productDetail.resources.addon.lifecycleRules');
  }

  if (addonId === 'monitoring') {
    return t('productDetail.resources.addon.monitoring');
  }

  if (addonId === 'private-vlan') {
    return t('productDetail.resources.addon.privateVlan');
  }

  if (addonId === 'support') {
    return t('productDetail.resources.addon.support');
  }

  return addonId;
}

function getDocumentLabel(label: string, t: ProductDetailTranslate) {
  const normalized = label.toLowerCase();

  if (normalized.includes('api')) {
    return t('productDetail.resources.doc.apiOverview');
  }

  if (normalized.includes('backup')) {
    return t('productDetail.resources.doc.backupPolicy');
  }

  if (normalized.includes('billing') || normalized.includes('terms')) {
    return t('productDetail.resources.doc.billingTerms');
  }

  if (normalized.includes('database')) {
    return t('productDetail.resources.doc.databaseSizingGuide');
  }

  if (normalized.includes('driver') || normalized.includes('matrix')) {
    return t('productDetail.resources.doc.driverMatrix');
  }

  if (normalized.includes('gpu')) {
    return t('productDetail.resources.doc.gpuSetupGuide');
  }

  if (normalized.includes('hardware')) {
    return t('productDetail.resources.doc.hardwareProfile');
  }

  if (normalized.includes('network')) {
    return t('productDetail.resources.doc.networkGuide');
  }

  if (normalized.includes('quick')) {
    return t('productDetail.resources.doc.quickStart');
  }

  if (normalized.includes('remote')) {
    return t('productDetail.resources.doc.remoteHandsGuide');
  }

  if (normalized.includes('sla exhibit')) {
    return t('productDetail.resources.doc.slaExhibit');
  }

  if (normalized.includes('sla')) {
    return t('productDetail.resources.doc.slaNote');
  }

  if (normalized.includes('storage')) {
    return t('productDetail.resources.doc.storageGuide');
  }

  return t('productDetail.resources.doc.planGuide');
}

function getTargetLabel(targetLabel: string, t: ProductDetailTranslate) {
  if (targetLabel === 'Document guide') {
    return t('productDetail.resources.target.documentGuide');
  }

  if (targetLabel === 'Pricing rows') {
    return t('productDetail.resources.target.pricingRows');
  }

  if (targetLabel === 'Quote request') {
    return t('productDetail.resources.target.quoteRequest');
  }

  return t('productDetail.resources.target.resourceGuide');
}
