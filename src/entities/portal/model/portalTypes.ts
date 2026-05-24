export interface PortalMetric {
  readonly label: string;
  readonly summary: string;
  readonly value: string;
}

export interface PortalOrganization {
  readonly billingContact: string;
  readonly homeRegion: string;
  readonly id: string;
  readonly memberCount: number;
  readonly name: string;
  readonly supportPlan: string;
}

export interface PortalQuote {
  readonly commentCount: number;
  readonly due: string;
  readonly id: string;
  readonly monthlyUsd: number;
  readonly organizationId: string;
  readonly plan: string;
  readonly region: string;
  readonly status: 'Customer reply' | 'Draft' | 'Sales review' | 'Submitted';
  readonly summary: string;
  readonly updatedAt: string;
}

export interface PortalSavedPlan {
  readonly id: string;
  readonly monthlyUsd: number;
  readonly name: string;
  readonly organizationId: string;
  readonly plan: string;
  readonly region: string;
  readonly status: 'Draft' | 'Ready for quote' | 'Shared';
}

export interface PortalFavorite {
  readonly id: string;
  readonly organizationId: string;
  readonly summary: string;
  readonly title: string;
  readonly type: 'Docs' | 'Region' | 'Server' | 'Update';
}

export interface PortalAuditEvent {
  readonly actor: string;
  readonly event: string;
  readonly id: string;
  readonly organizationId: string;
  readonly scope: string;
  readonly when: string;
}
