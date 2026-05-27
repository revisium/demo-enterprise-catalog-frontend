import { makeAutoObservable } from 'mobx';

import type { TranslationKey } from 'src/shared/i18n';

import {
  HomePageDataSource,
  type BillingTermId,
  type RegionId,
  type ServerPlan,
  type ServerPlanId,
  type UseCaseId,
} from '../api/HomePageDataSource';

type HomeTranslate = (key: TranslationKey) => string;

interface LabelSummaryKeys {
  readonly label: TranslationKey;
  readonly summary: TranslationKey;
}

interface PlanRowViewModel extends ServerPlan {
  readonly displayPrice: string;
  readonly selected: boolean;
  readonly selectable: boolean;
}

interface ChoiceRowViewModel<TId extends string> {
  readonly active: boolean;
  readonly id: TId;
  readonly label: string;
  readonly summary: string;
}

interface RegionChoiceRowViewModel {
  readonly active: boolean;
  readonly availability: string;
  readonly id: RegionId;
  readonly label: string;
}

interface SuggestedPlanRowViewModel extends PlanRowViewModel {
  readonly availabilityLabel: string;
  readonly displayPriceLabel: string;
  readonly hardwareSummary: string;
  readonly name: string;
}

export interface HomeLabelValueRow {
  readonly label: string;
  readonly value: string;
}

const useCaseCopyKeys = {
  database: {
    label: 'home.useCase.database.label',
    summary: 'home.useCase.database.summary',
  },
  storage: {
    label: 'home.useCase.storage.label',
    summary: 'home.useCase.storage.summary',
  },
  testing: {
    label: 'home.useCase.testing.label',
    summary: 'home.useCase.testing.summary',
  },
  'web-app': {
    label: 'home.useCase.webApp.label',
    summary: 'home.useCase.webApp.summary',
  },
} as const satisfies Record<UseCaseId, LabelSummaryKeys>;

const regionCopyKeys = {
  'de-fra': {
    availability: 'home.region.deFra.availability',
    label: 'home.region.deFra.label',
  },
  'nl-ams': {
    availability: 'home.region.nlAms.availability',
    label: 'home.region.nlAms.label',
  },
  'sg-sin': {
    availability: 'home.region.sgSin.availability',
    label: 'home.region.sgSin.label',
  },
  'us-nyc': {
    availability: 'home.region.usNyc.availability',
    label: 'home.region.usNyc.label',
  },
} as const satisfies Record<
  RegionId,
  { readonly availability: TranslationKey; readonly label: TranslationKey }
>;

const billingTermCopyKeys = {
  monthly: {
    label: 'home.billing.monthly.label',
    summary: 'home.billing.monthly.summary',
  },
  yearly: {
    label: 'home.billing.yearly.label',
    summary: 'home.billing.yearly.summary',
  },
} as const satisfies Record<BillingTermId, LabelSummaryKeys>;

const planCopyKeys = {
  'business-vm': {
    label: 'home.plan.businessVm.name',
    summary: 'home.plan.businessVm.summary',
  },
  'database-d4': {
    label: 'home.plan.databaseD4.name',
    summary: 'home.plan.databaseD4.summary',
  },
  'dedicated-r2': {
    label: 'home.plan.dedicatedR2.name',
    summary: 'home.plan.dedicatedR2.summary',
  },
  'starter-vps': {
    label: 'home.plan.starterVps.name',
    summary: 'home.plan.starterVps.summary',
  },
  'storage-s3': {
    label: 'home.plan.storageS3.name',
    summary: 'home.plan.storageS3.summary',
  },
} as const satisfies Record<ServerPlanId, LabelSummaryKeys>;

const planSetupKeys = {
  '4 hour setup': 'home.setup.fourHours',
  'instant setup': 'home.setup.instant',
  'same day setup': 'home.setup.sameDay',
} as const satisfies Record<string, TranslationKey>;

const planAvailabilityKeys = {
  '2 units left': 'home.availability.twoUnitsLeft',
  '3 units left': 'home.availability.threeUnitsLeft',
  'Ready now': 'home.availability.readyNow',
  'Ready today': 'home.availability.readyToday',
} as const satisfies Record<string, TranslationKey>;

export class HomePageViewModel {
  readonly dataSource: HomePageDataSource;
  readonly canReserveServer = false;

  selectedBillingTermId: BillingTermId = 'monthly';
  selectedRegionId: RegionId = 'de-fra';
  selectedUseCaseId: UseCaseId = 'web-app';
  selectedPlanId: ServerPlanId = 'starter-vps';

  constructor(dataSource = new HomePageDataSource()) {
    this.dataSource = dataSource;
    makeAutoObservable(this, { dataSource: false });
  }

  get useCases() {
    return this.dataSource.getUseCaseOptions();
  }

  get regions() {
    return this.dataSource.getRegionOptions();
  }

  get billingTerms() {
    return this.dataSource.getBillingTermOptions();
  }

  get plans() {
    return this.dataSource.getServerPlans();
  }

  get selectedUseCase() {
    const useCase = this.useCases.find((item) => item.id === this.selectedUseCaseId);

    if (!useCase) {
      throw new Error('HelioStack catalog requires at least one use case option');
    }

    return useCase;
  }

  get selectedRegion() {
    const region = this.regions.find((item) => item.id === this.selectedRegionId);

    if (!region) {
      throw new Error('HelioStack catalog requires at least one region option');
    }

    return region;
  }

  get selectedBillingTerm() {
    const term = this.billingTerms.find((item) => item.id === this.selectedBillingTermId);

    if (!term) {
      throw new Error('HelioStack catalog requires at least one billing term option');
    }

    return term;
  }

  get selectedPlan() {
    const plan = this.plans.find((item) => item.id === this.selectedPlanId);

    if (!plan) {
      throw new Error('HelioStack catalog requires at least one server plan');
    }

    return plan;
  }

  get selectedCatalogProduct() {
    return this.dataSource
      .getSnapshot()
      .products.find((product) => product.id === this.selectedPlan.catalogProductId);
  }

  get matchingPlans() {
    return this.plans.filter(
      (plan) =>
        plan.regionIds.includes(this.selectedRegionId) &&
        plan.useCaseIds.includes(this.selectedUseCaseId),
    );
  }

  get regionPlans() {
    return this.plans.filter((plan) => plan.regionIds.includes(this.selectedRegionId));
  }

  get selectablePlans() {
    if (this.matchingPlans.length > 0) {
      return this.matchingPlans;
    }

    if (this.regionPlans.length > 0) {
      return this.regionPlans;
    }

    return this.plans;
  }

  get planRows(): readonly PlanRowViewModel[] {
    const selectableIds = new Set(this.selectablePlans.map((plan) => plan.id));

    return this.plans.map((plan) => ({
      ...plan,
      displayPrice: this.getPlanPrice(plan),
      selected: plan.id === this.selectedPlan.id,
      selectable: selectableIds.has(plan.id),
    }));
  }

  get suggestedPlanRows(): readonly PlanRowViewModel[] {
    const selectableRows = this.planRows.filter((plan) => plan.selectable);

    return selectableRows.slice(0, 3);
  }

  get hasExactPlanMatches() {
    return this.matchingPlans.length > 0;
  }

  get selectedPrice() {
    return this.getPlanPrice(this.selectedPlan);
  }

  get selectedSetupLabel() {
    return this.selectedCatalogProduct?.availabilityByRegion.find(
      (region) => region.regionId === this.selectedRegionId,
    )?.setupHours;
  }

  get selectedStockCount() {
    const stock = this.selectedCatalogProduct?.availabilityByRegion.find(
      (region) => region.regionId === this.selectedRegionId,
    )?.stock;

    return typeof stock === 'number' ? stock : null;
  }

  get quotePath() {
    const params = new URLSearchParams({
      plan: this.selectedPlan.catalogProductId,
      region: this.selectedRegionId,
      term: this.selectedBillingTermId,
    });

    return `/quote?${params.toString()}`;
  }

  getUseCaseChoiceRows(t: HomeTranslate): readonly ChoiceRowViewModel<UseCaseId>[] {
    return this.useCases.map((useCase) => ({
      ...getUseCaseCopy(useCase.id, t),
      active: this.selectedUseCaseId === useCase.id,
      id: useCase.id,
    }));
  }

  getRegionChoiceRows(t: HomeTranslate): readonly RegionChoiceRowViewModel[] {
    return this.regions.map((region) => ({
      ...getRegionCopy(region.id, t),
      active: this.selectedRegionId === region.id,
      id: region.id,
    }));
  }

  getBillingTermChoiceRows(t: HomeTranslate): readonly ChoiceRowViewModel<BillingTermId>[] {
    return this.billingTerms.map((term) => ({
      ...getBillingTermCopy(term.id, t),
      active: this.selectedBillingTermId === term.id,
      id: term.id,
    }));
  }

  getSelectedPlanCopy(t: HomeTranslate) {
    return getPlanCopy(this.selectedPlan.id, t);
  }

  getSelectionRows(t: HomeTranslate): readonly HomeLabelValueRow[] {
    return [
      { label: t('home.need'), value: getUseCaseCopy(this.selectedUseCaseId, t).label },
      { label: t('home.region'), value: getRegionCopy(this.selectedRegionId, t).label },
      { label: t('home.plan'), value: getPlanCopy(this.selectedPlan.id, t).name },
      { label: t('home.contract'), value: getBillingTermCopy(this.selectedBillingTermId, t).label },
      { label: t('home.stock'), value: this.getStockLabel(t) },
      { label: t('home.setup'), value: this.getSetupSummaryLabel(t) },
    ];
  }

  getMetricRows(t: HomeTranslate): readonly HomeLabelValueRow[] {
    return [
      { label: t('home.metric.cpu'), value: formatHardwareValue(this.selectedPlan.cpu, t) },
      { label: t('home.metric.memory'), value: this.selectedPlan.ram },
      { label: t('home.metric.storage'), value: this.selectedPlan.storage },
      { label: t('home.metric.network'), value: this.selectedPlan.network },
    ];
  }

  getSuggestedPlanRows(t: HomeTranslate): readonly SuggestedPlanRowViewModel[] {
    return this.suggestedPlanRows.map((plan) => ({
      ...plan,
      availabilityLabel: getPlanAvailabilityLabel(plan, t),
      displayPriceLabel: formatPrice(plan.displayPrice, t),
      hardwareSummary: formatHardwareSummary(plan, t),
      name: getPlanCopy(plan.id, t).name,
    }));
  }

  getSelectedPriceLabel(t: HomeTranslate) {
    return formatPrice(this.selectedPrice, t);
  }

  getSelectedSetupAvailabilityLabel(t: HomeTranslate) {
    return `${getPlanSetupLabel(this.selectedPlan, t)} · ${getPlanAvailabilityLabel(
      this.selectedPlan,
      t,
    )}`;
  }

  selectUseCase(useCaseId: UseCaseId) {
    this.selectedUseCaseId = useCaseId;
    this.selectRecommendedPlan();
  }

  selectRegion(regionId: RegionId) {
    this.selectedRegionId = regionId;
    this.selectRecommendedPlan();
  }

  selectBillingTerm(termId: BillingTermId) {
    this.selectedBillingTermId = termId;
  }

  selectPlan(planId: ServerPlanId) {
    if (!this.selectablePlans.some((plan) => plan.id === planId)) {
      return;
    }

    this.selectedPlanId = planId;
  }

  private getPlanPrice(plan: ServerPlan) {
    if (this.selectedBillingTermId === 'yearly') {
      return plan.yearlyPrice;
    }

    return plan.monthlyPrice;
  }

  private getSetupSummaryLabel(t: HomeTranslate) {
    return typeof this.selectedSetupLabel === 'number'
      ? `${this.selectedSetupLabel}${t('home.setup.hourSuffix')}`
      : getPlanSetupLabel(this.selectedPlan, t);
  }

  private getStockLabel(t: HomeTranslate) {
    return typeof this.selectedStockCount === 'number'
      ? `${this.selectedStockCount} ${t('home.units')}`
      : getPlanAvailabilityLabel(this.selectedPlan, t);
  }

  private selectRecommendedPlan() {
    if (
      this.selectedPlan.regionIds.includes(this.selectedRegionId) &&
      this.selectedPlan.useCaseIds.includes(this.selectedUseCaseId)
    ) {
      return;
    }

    const nextPlan = this.selectablePlans[0];

    if (nextPlan) {
      this.selectedPlanId = nextPlan.id;
    }
  }
}

function getCopy(keys: LabelSummaryKeys, t: HomeTranslate) {
  return {
    label: t(keys.label),
    summary: t(keys.summary),
  };
}

function getUseCaseCopy(id: UseCaseId, t: HomeTranslate) {
  return getCopy(useCaseCopyKeys[id], t);
}

function getRegionCopy(id: RegionId, t: HomeTranslate) {
  const keys = regionCopyKeys[id];

  return {
    availability: t(keys.availability),
    label: t(keys.label),
  };
}

function getBillingTermCopy(id: BillingTermId, t: HomeTranslate) {
  return getCopy(billingTermCopyKeys[id], t);
}

function getPlanCopy(id: ServerPlanId, t: HomeTranslate) {
  const copy = getCopy(planCopyKeys[id], t);

  return {
    name: copy.label,
    summary: copy.summary,
  };
}

function formatPrice(price: string, t: HomeTranslate) {
  return price.replace('/mo', `/${t('home.price.month')}`);
}

function formatHardwareValue(value: string, t: HomeTranslate) {
  return value.replace(' cores', ` ${t('home.unit.cores')}`);
}

function formatHardwareSummary(plan: ServerPlan, t: HomeTranslate) {
  return `${formatHardwareValue(plan.cpu, t)} · ${plan.ram} · ${plan.storage}`;
}

function getPlanSetupLabel(plan: ServerPlan, t: HomeTranslate) {
  const key = planSetupKeys[plan.setup as keyof typeof planSetupKeys];

  return key ? t(key) : plan.setup;
}

function getPlanAvailabilityLabel(plan: ServerPlan, t: HomeTranslate) {
  const key = planAvailabilityKeys[plan.availability as keyof typeof planAvailabilityKeys];

  return key ? t(key) : plan.availability;
}
