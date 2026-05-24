import type {
  PortalApiKey,
  PortalAuditEvent,
  PortalFavorite,
  PortalOrganization,
  PortalQuote,
  PortalSavedPlan,
} from '../model/portalTypes';

export const portalOrganizations: readonly PortalOrganization[] = [
  {
    billingContact: 'finance@northwind.example',
    homeRegion: 'Frankfurt',
    id: 'northwind',
    memberCount: 8,
    name: 'Northwind Manufacturing',
    supportPlan: 'Enterprise',
  },
  {
    billingContact: 'ops@orbit.example',
    homeRegion: 'Singapore',
    id: 'orbit',
    memberCount: 5,
    name: 'Orbit Media Group',
    supportPlan: 'Business',
  },
];

export const portalQuotes: readonly PortalQuote[] = [
  {
    commentCount: 5,
    due: 'Today',
    id: 'quote-dedicated-r2-fra',
    monthlyUsd: 930,
    organizationId: 'northwind',
    plan: 'Dedicated R2',
    region: 'Frankfurt',
    status: 'Sales review',
    summary: 'Yearly term, private VLAN, backup, monitoring, and enterprise support.',
    updatedAt: '2 hours ago',
  },
  {
    commentCount: 2,
    due: 'Tomorrow',
    id: 'quote-db-d4-nyc',
    monthlyUsd: 420,
    organizationId: 'northwind',
    plan: 'Database D4',
    region: 'New York',
    status: 'Customer reply',
    summary: 'Waiting for final region approval and data-retention note.',
    updatedAt: 'Yesterday',
  },
  {
    commentCount: 1,
    due: 'This week',
    id: 'quote-business-vm-8-sin',
    monthlyUsd: 180,
    organizationId: 'orbit',
    plan: 'Business VM 8',
    region: 'Singapore',
    status: 'Submitted',
    summary: 'APAC launch bundle with backup and monitoring add-ons.',
    updatedAt: '3 hours ago',
  },
];

export const portalSavedPlans: readonly PortalSavedPlan[] = [
  {
    id: 'plan-dedicated-r2-fra',
    monthlyUsd: 310,
    name: 'Frankfurt production app',
    organizationId: 'northwind',
    plan: 'Dedicated R2',
    region: 'Frankfurt',
    status: 'Ready for quote',
  },
  {
    id: 'plan-db-d4-nyc',
    monthlyUsd: 420,
    name: 'Analytics database',
    organizationId: 'northwind',
    plan: 'Database D4',
    region: 'New York',
    status: 'Draft',
  },
  {
    id: 'plan-storage-s3-sin',
    monthlyUsd: 180,
    name: 'APAC backup target',
    organizationId: 'orbit',
    plan: 'Storage S3',
    region: 'Singapore',
    status: 'Shared',
  },
];

export const portalFavorites: readonly PortalFavorite[] = [
  {
    id: 'favorite-dedicated-r2',
    organizationId: 'northwind',
    summary: 'Pinned for the production app renewal.',
    title: 'Dedicated R2',
    type: 'Server',
  },
  {
    id: 'favorite-frankfurt',
    organizationId: 'northwind',
    summary: 'Preferred EU location for regulated workloads.',
    title: 'Frankfurt data center',
    type: 'Region',
  },
  {
    id: 'favorite-release-2026-05',
    organizationId: 'orbit',
    summary: 'APAC stock and pricing update.',
    title: 'May regional capacity update',
    type: 'Update',
  },
];

export const portalApiKeys: readonly PortalApiKey[] = [
  {
    createdBy: 'Mira Chen',
    id: 'key-partner-quote',
    lastUsed: '2 hours ago',
    name: 'Partner quoting API',
    organizationId: 'northwind',
    scopes: ['quotes:read', 'availability:read'],
    status: 'Active',
  },
  {
    createdBy: 'Noah Patel',
    id: 'key-finance-export',
    lastUsed: 'Yesterday',
    name: 'Finance export',
    organizationId: 'northwind',
    scopes: ['prices:read', 'invoices:read'],
    status: 'Review',
  },
  {
    createdBy: 'Kai Tan',
    id: 'key-apac-checkout',
    lastUsed: '4 hours ago',
    name: 'APAC checkout API',
    organizationId: 'orbit',
    scopes: ['quotes:write', 'availability:read'],
    status: 'Active',
  },
];

export const portalAuditEvents: readonly PortalAuditEvent[] = [
  {
    actor: 'Mira Chen',
    event: 'Added backup add-on to Dedicated R2 quote',
    id: 'audit-1',
    organizationId: 'northwind',
    scope: 'Quote',
    when: '2 hours ago',
  },
  {
    actor: 'Noah Patel',
    event: 'Requested finance export key review',
    id: 'audit-2',
    organizationId: 'northwind',
    scope: 'API',
    when: 'Yesterday',
  },
  {
    actor: 'Kai Tan',
    event: 'Shared APAC backup target with procurement',
    id: 'audit-3',
    organizationId: 'orbit',
    scope: 'Saved plan',
    when: '3 hours ago',
  },
];
