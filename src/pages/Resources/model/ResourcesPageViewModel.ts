import { makeAutoObservable } from 'mobx';

interface ResourceArticle {
  readonly title: string;
  readonly category: string;
  readonly summary: string;
  readonly readTime: string;
  readonly tags: readonly string[];
}

const articles: readonly ResourceArticle[] = [
  {
    title: 'Choose a production server plan',
    category: 'Buying guide',
    summary: 'Map CPU, memory, storage, network, stock, and setup time to a practical shortlist.',
    readTime: '7 min',
    tags: ['planning', 'servers'],
  },
  {
    title: 'Network options by region',
    category: 'Networking',
    summary:
      'Understand public IPv4, private VLAN, bandwidth, firewall, and regional support rules.',
    readTime: '9 min',
    tags: ['network', 'regions'],
  },
  {
    title: 'Backup and restore policy',
    category: 'Operations',
    summary:
      'Retention windows, restore requests, monitoring add-ons, and customer responsibilities.',
    readTime: '6 min',
    tags: ['backup', 'sla'],
  },
  {
    title: 'Partner API overview',
    category: 'API',
    summary:
      'Quote lookup, plan availability, price rows, saved plans, and organization access scopes.',
    readTime: '8 min',
    tags: ['api', 'partners'],
  },
];

export class ResourcesPageViewModel {
  readonly articles = articles;

  constructor() {
    makeAutoObservable(this);
  }

  get featuredArticle() {
    return this.articles[0];
  }

  get categories() {
    return [...new Set(this.articles.map((article) => article.category))].map((category) => ({
      label: category,
      count: this.articles.filter((article) => article.category === category).length,
    }));
  }
}
