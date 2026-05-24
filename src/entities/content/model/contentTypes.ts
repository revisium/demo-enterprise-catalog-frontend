export type ResourceCategory = 'API' | 'Buying guide' | 'Networking' | 'Operations' | 'Security';
export type ResourceRole = 'Developers' | 'Finance' | 'Operations' | 'Procurement';

export interface ResourceArticle {
  readonly author: string;
  readonly category: ResourceCategory;
  readonly helpfulCount: number;
  readonly id: string;
  readonly readTimeMinutes: number;
  readonly relatedTopic: string;
  readonly role: ResourceRole;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly title: string;
  readonly updatedAt: string;
}

export type UpdateAudience = 'Developers' | 'Finance' | 'Operations' | 'Procurement' | 'Sales';
export type UpdatePriority = 'Advisory' | 'Important' | 'Routine';
export type UpdateType = 'Catalog' | 'Docs' | 'Pricing' | 'Region';

export interface ReleaseUpdate {
  readonly audience: UpdateAudience;
  readonly date: string;
  readonly id: string;
  readonly impact: string;
  readonly likedCount: number;
  readonly priority: UpdatePriority;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly title: string;
  readonly type: UpdateType;
}
