import { makeAutoObservable } from 'mobx';

type ResourceCategory = 'API' | 'Buying guide' | 'Networking' | 'Operations' | 'Security';
type ResourceRole = 'Developers' | 'Finance' | 'Operations' | 'Procurement';
type ResourceSortId = 'helpful' | 'recently-updated' | 'recommended' | 'shortest-read';

interface ResourceArticle {
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

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

const articles: readonly ResourceArticle[] = [
  {
    author: 'Maya Voss',
    category: 'Buying guide',
    helpfulCount: 42,
    id: 'choose-production-server-plan',
    readTimeMinutes: 7,
    relatedTopic: 'Server plans',
    role: 'Procurement',
    summary: 'Map CPU, memory, storage, network, stock, and setup time to a practical shortlist.',
    tags: ['planning', 'servers', 'quote'],
    title: 'Choose a production server plan',
    updatedAt: '2026-05-21',
  },
  {
    author: 'Tomas Riedel',
    category: 'Networking',
    helpfulCount: 31,
    id: 'network-options-by-region',
    readTimeMinutes: 9,
    relatedTopic: 'Regions',
    role: 'Operations',
    summary:
      'Understand public IPv4, private VLAN, bandwidth, firewall, and regional support rules.',
    tags: ['network', 'regions', 'security'],
    title: 'Network options by region',
    updatedAt: '2026-05-18',
  },
  {
    author: 'Nora Chen',
    category: 'Operations',
    helpfulCount: 26,
    id: 'backup-and-restore-policy',
    readTimeMinutes: 6,
    relatedTopic: 'Backups',
    role: 'Operations',
    summary:
      'Retention windows, restore requests, monitoring add-ons, and customer responsibilities.',
    tags: ['backup', 'sla', 'monitoring'],
    title: 'Backup and restore policy',
    updatedAt: '2026-05-14',
  },
  {
    author: 'Eli Hart',
    category: 'API',
    helpfulCount: 19,
    id: 'partner-api-overview',
    readTimeMinutes: 8,
    relatedTopic: 'Partner API',
    role: 'Developers',
    summary:
      'Quote lookup, plan availability, price rows, saved plans, and organization access scopes.',
    tags: ['api', 'partners', 'quotes'],
    title: 'Partner API overview',
    updatedAt: '2026-05-10',
  },
  {
    author: 'Iris Novak',
    category: 'Security',
    helpfulCount: 23,
    id: 'access-review-checklist',
    readTimeMinutes: 5,
    relatedTopic: 'Account access',
    role: 'Finance',
    summary: 'Review members, API key scopes, billing contacts, and audit history before renewal.',
    tags: ['security', 'billing', 'audit'],
    title: 'Access review checklist',
    updatedAt: '2026-05-22',
  },
];

const sortOptions: readonly FilterOption[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'helpful', label: 'Most helpful' },
  { id: 'shortest-read', label: 'Shortest read' },
];

export class ResourcesPageViewModel {
  readonly articles = articles;
  helpfulArticleIds: readonly string[] = [];
  savedArticleIds: readonly string[] = ['choose-production-server-plan'];
  selectedCategory = 'All';
  selectedRole = 'All';
  selectedTag = 'All';
  sortId: ResourceSortId = 'recommended';

  constructor() {
    makeAutoObservable(this);
  }

  get categoryOptions(): readonly FilterOption[] {
    return this.toOptions(['All', ...new Set(this.articles.map((article) => article.category))]);
  }

  get categorySummaries() {
    return [...new Set(this.articles.map((article) => article.category))]
      .sort((left, right) => left.localeCompare(right))
      .map((category) => ({
        count: this.articles.filter((article) => article.category === category).length,
        label: category,
      }));
  }

  get featuredArticle() {
    return this.filteredArticles[0];
  }

  get filteredArticles() {
    return [...this.articles.filter((article) => this.matchesArticle(article))].sort(
      (left, right) => this.compareArticles(left, right),
    );
  }

  get hasNoMatches() {
    return this.filteredArticles.length === 0;
  }

  get popularTags() {
    const counts = new Map<string, number>();

    for (const article of this.articles) {
      for (const tag of article.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([label, count]) => ({ count, label }));
  }

  get queryRows() {
    return [
      { label: 'Category', value: this.selectedCategory },
      { label: 'Role', value: this.selectedRole },
      { label: 'Topic', value: this.selectedTag },
      { label: 'Sort', value: this.getOptionLabel(sortOptions, this.sortId) },
    ];
  }

  get roleOptions(): readonly FilterOption[] {
    return this.toOptions(['All', ...new Set(this.articles.map((article) => article.role))]);
  }

  get savedArticles() {
    return this.articles.filter((article) => this.savedArticleIds.includes(article.id));
  }

  get sortOptions() {
    return sortOptions;
  }

  get summaryMetrics() {
    return [
      { label: 'Articles', value: String(this.articles.length) },
      { label: 'Categories', value: String(this.categorySummaries.length) },
      { label: 'Helpful votes', value: String(this.totalHelpfulCount) },
      { label: 'Saved', value: String(this.savedArticles.length) },
    ];
  }

  get tagOptions(): readonly FilterOption[] {
    return this.toOptions(['All', ...this.popularTags.map((tag) => tag.label)]);
  }

  get totalHelpfulCount() {
    return (
      this.articles.reduce((total, article) => total + article.helpfulCount, 0) +
      this.helpfulArticleIds.length
    );
  }

  getHelpfulCount(article: ResourceArticle) {
    return article.helpfulCount + (this.isHelpful(article.id) ? 1 : 0);
  }

  isHelpful(articleId: string) {
    return this.helpfulArticleIds.includes(articleId);
  }

  isSaved(articleId: string) {
    return this.savedArticleIds.includes(articleId);
  }

  resetFilters() {
    this.selectedCategory = 'All';
    this.selectedRole = 'All';
    this.selectedTag = 'All';
    this.sortId = 'recommended';
  }

  selectCategory(category: string) {
    this.selectedCategory = this.hasOption(this.categoryOptions, category) ? category : 'All';
  }

  selectRole(role: string) {
    this.selectedRole = this.hasOption(this.roleOptions, role) ? role : 'All';
  }

  selectSort(sortId: string) {
    this.sortId = this.hasOption(sortOptions, sortId) ? (sortId as ResourceSortId) : 'recommended';
  }

  selectTag(tag: string) {
    this.selectedTag = this.hasOption(this.tagOptions, tag) ? tag : 'All';
  }

  toggleHelpful(articleId: string) {
    this.helpfulArticleIds = this.toggleValue(this.helpfulArticleIds, articleId);
  }

  toggleSaved(articleId: string) {
    this.savedArticleIds = this.toggleValue(this.savedArticleIds, articleId);
  }

  private compareArticles(left: ResourceArticle, right: ResourceArticle) {
    if (this.sortId === 'recently-updated') {
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    }

    if (this.sortId === 'helpful') {
      return this.getHelpfulCount(right) - this.getHelpfulCount(left);
    }

    if (this.sortId === 'shortest-read') {
      return left.readTimeMinutes - right.readTimeMinutes;
    }

    const savedDelta = Number(this.isSaved(right.id)) - Number(this.isSaved(left.id));

    return savedDelta || this.getHelpfulCount(right) - this.getHelpfulCount(left);
  }

  private getOptionLabel(options: readonly FilterOption[], id: string) {
    return options.find((option) => option.id === id)?.label ?? id;
  }

  private hasOption(options: readonly FilterOption[], id: string) {
    return options.some((option) => option.id === id);
  }

  private matchesArticle(article: ResourceArticle) {
    const matchesCategory =
      this.selectedCategory === 'All' || article.category === this.selectedCategory;
    const matchesRole = this.selectedRole === 'All' || article.role === this.selectedRole;
    const matchesTag = this.selectedTag === 'All' || article.tags.includes(this.selectedTag);

    return matchesCategory && matchesRole && matchesTag;
  }

  private toOptions(values: readonly string[]): readonly FilterOption[] {
    return values.map((value) => ({ id: value, label: value }));
  }

  private toggleValue(values: readonly string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }
}
