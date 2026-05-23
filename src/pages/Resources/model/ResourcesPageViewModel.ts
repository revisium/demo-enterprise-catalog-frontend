import { makeAutoObservable } from 'mobx';

interface ResourceArticle {
  readonly author: string;
  readonly title: string;
  readonly category: string;
  readonly helpfulCount: number;
  readonly publishedAt: string;
  readonly summary: string;
  readonly readTime: string;
  readonly tags: readonly string[];
}

const articles: readonly ResourceArticle[] = [
  {
    author: 'Maya Voss',
    title: 'Choose a production server plan',
    category: 'Buying guide',
    helpfulCount: 42,
    publishedAt: '2026-05-21',
    summary: 'Map CPU, memory, storage, network, stock, and setup time to a practical shortlist.',
    readTime: '7 min',
    tags: ['planning', 'servers'],
  },
  {
    author: 'Tomas Riedel',
    title: 'Network options by region',
    category: 'Networking',
    helpfulCount: 31,
    publishedAt: '2026-05-18',
    summary:
      'Understand public IPv4, private VLAN, bandwidth, firewall, and regional support rules.',
    readTime: '9 min',
    tags: ['network', 'regions'],
  },
  {
    author: 'Nora Chen',
    title: 'Backup and restore policy',
    category: 'Operations',
    helpfulCount: 26,
    publishedAt: '2026-05-14',
    summary:
      'Retention windows, restore requests, monitoring add-ons, and customer responsibilities.',
    readTime: '6 min',
    tags: ['backup', 'sla'],
  },
  {
    author: 'Eli Hart',
    title: 'Partner API overview',
    category: 'API',
    helpfulCount: 19,
    publishedAt: '2026-05-10',
    summary:
      'Quote lookup, plan availability, price rows, saved plans, and organization access scopes.',
    readTime: '8 min',
    tags: ['api', 'partners'],
  },
];

export class ResourcesPageViewModel {
  readonly articles = articles;
  helpfulArticleTitles: readonly string[] = [];
  selectedCategory = 'All';

  constructor() {
    makeAutoObservable(this);
  }

  get featuredArticle() {
    return this.filteredArticles[0];
  }

  get categoryOptions() {
    return ['All', ...new Set(this.articles.map((article) => article.category))];
  }

  get categories() {
    return [...new Set(this.articles.map((article) => article.category))].map((category) => ({
      label: category,
      count: this.articles.filter((article) => article.category === category).length,
    }));
  }

  get filteredArticles() {
    if (this.selectedCategory === 'All') {
      return this.articles;
    }

    return this.articles.filter((article) => article.category === this.selectedCategory);
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
      .slice(0, 6)
      .map(([label, count]) => ({ count, label }));
  }

  get summaryMetrics() {
    return [
      { label: 'Articles', value: String(this.articles.length) },
      { label: 'Categories', value: String(this.categories.length) },
      { label: 'Helpful votes', value: String(this.totalHelpfulCount) },
    ];
  }

  selectCategory(category: string) {
    this.selectedCategory = this.categoryOptions.includes(category) ? category : 'All';
  }

  toggleHelpful(title: string) {
    this.helpfulArticleTitles = this.helpfulArticleTitles.includes(title)
      ? this.helpfulArticleTitles.filter((item) => item !== title)
      : [...this.helpfulArticleTitles, title];
  }

  isHelpful(title: string) {
    return this.helpfulArticleTitles.includes(title);
  }

  getHelpfulCount(article: ResourceArticle) {
    return article.helpfulCount + (this.isHelpful(article.title) ? 1 : 0);
  }

  private get totalHelpfulCount() {
    return (
      this.articles.reduce((total, article) => total + article.helpfulCount, 0) +
      this.helpfulArticleTitles.length
    );
  }
}
