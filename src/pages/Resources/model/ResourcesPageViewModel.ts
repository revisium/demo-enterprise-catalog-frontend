import { makeAutoObservable } from 'mobx';

import { resourceArticles, type ResourceArticle } from 'src/entities/content';

type ResourceSortId = 'helpful' | 'recently-updated' | 'recommended' | 'shortest-read';

interface FilterOption {
  readonly id: string;
  readonly label: string;
}

const sortOptions: readonly FilterOption[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'recently-updated', label: 'Recently updated' },
  { id: 'helpful', label: 'Most helpful' },
  { id: 'shortest-read', label: 'Shortest read' },
];

export class ResourcesPageViewModel {
  readonly articles = resourceArticles;
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

  get hasUserFilters() {
    return (
      this.selectedCategory !== 'All' ||
      this.selectedRole !== 'All' ||
      this.selectedTag !== 'All' ||
      this.sortId !== 'recommended'
    );
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

  getArticle(articleId: string | undefined) {
    const article = this.articles.find((item) => item.id === articleId) ?? this.articles[0];

    if (!article) {
      throw new Error('Resource article mocks are empty');
    }

    return article;
  }

  getRelatedArticles(articleId: string | undefined) {
    const article = this.getArticle(articleId);

    return this.articles
      .filter((candidate) => candidate.id !== article.id)
      .map((candidate) => ({
        article: candidate,
        score:
          this.getSharedTagCount(article, candidate) +
          Number(candidate.category === article.category),
      }))
      .sort(
        (left, right) =>
          right.score - left.score || left.article.title.localeCompare(right.article.title),
      )
      .slice(0, 3)
      .map((candidate) => candidate.article);
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

  private getSharedTagCount(left: ResourceArticle, right: ResourceArticle) {
    const rightTags = new Set(right.tags);

    return left.tags.filter((tag) => rightTags.has(tag)).length;
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
