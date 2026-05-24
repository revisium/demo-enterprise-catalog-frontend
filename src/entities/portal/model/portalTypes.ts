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

export interface PortalUserPreference {
  readonly currencyId: string;
  readonly languageId: string;
  readonly preferredRegionId: string;
}

export interface PortalUser {
  readonly email: string;
  readonly id: string;
  readonly name: string;
  readonly organizationIds: readonly string[];
  readonly preferences: PortalUserPreference;
  readonly primaryOrganizationId: string;
  readonly role: 'Admin' | 'Buyer' | 'Finance' | 'Operations';
}

export interface PortalDemoSession {
  readonly cookieMode: 'httpOnly';
  readonly expiresAt: string;
  readonly fingerprintStatus: 'created' | 'recognized';
  readonly refreshedAt: string;
  readonly user: PortalUser;
}

export interface PortalQuote {
  readonly commentCount: number;
  readonly due: string;
  readonly id: string;
  readonly monthlyUsd: number;
  readonly organizationId: string;
  readonly plan: string;
  readonly region: string;
  readonly requesterUserId: string;
  readonly status: 'Customer reply' | 'Draft' | 'Sales review' | 'Submitted';
  readonly summary: string;
  readonly updatedAt: string;
}

export interface PortalSavedPlan {
  readonly id: string;
  readonly monthlyUsd: number;
  readonly name: string;
  readonly organizationId: string;
  readonly ownerUserId: string;
  readonly plan: string;
  readonly region: string;
  readonly status: 'Draft' | 'Ready for quote' | 'Shared';
}

export interface PortalFavorite {
  readonly id: string;
  readonly organizationId: string;
  readonly ownerUserId: string;
  readonly summary: string;
  readonly title: string;
  readonly type: 'Docs' | 'Region' | 'Server' | 'Update';
}

export interface PortalAuditEvent {
  readonly actor: string;
  readonly event: string;
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly scope: string;
  readonly when: string;
}

export interface PortalReferenceCheck {
  readonly id: string;
  readonly label: string;
  readonly organizationId: string;
  readonly scope: string;
  readonly status: 'Active' | 'Allowed' | 'Available' | 'Published';
  readonly userId: string;
  readonly value: string;
}
