import { makeAutoObservable } from 'mobx';

import {
  HomePageDataSource,
  type BillingTermId,
  type RegionId,
  type ServerPlan,
  type ServerPlanId,
  type UseCaseId,
} from '../api/HomePageDataSource';

interface PlanRowViewModel extends ServerPlan {
  readonly displayPrice: string;
  readonly selected: boolean;
  readonly selectable: boolean;
}

export class HomePageViewModel {
  readonly dataSource: HomePageDataSource;
  readonly canReserveServer = false;

  selectedBillingTermId: BillingTermId = 'monthly';
  selectedRegionId: RegionId = 'de-fra';
  selectedUseCaseId: UseCaseId = 'web-app';
  selectedPlanId: ServerPlanId = 'business-vm';

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

  get updates() {
    return this.dataSource.getUpdateItems();
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

  get hasExactPlanMatches() {
    return this.matchingPlans.length > 0;
  }

  get selectedPrice() {
    return this.getPlanPrice(this.selectedPlan);
  }

  get includedItems() {
    return this.dataSource.getIncludedItems();
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
