const VALID_MATCH = new Set(['all', 'any']);
const VALID_SORT = new Set(['order', 'updated', 'price', 'ram', 'stock']);

function parseStringList(raw: string | null): readonly string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function parseEnum<T extends string>(
  raw: string | null,
  allowed: Set<string>,
  fallback: T,
): T {
  if (raw && allowed.has(raw)) return raw as T;
  return fallback;
}

function parsePositiveInt(raw: string | null, fallback: number): number {
  if (!raw) return fallback;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export interface CatalogFilterParams {
  readonly family: readonly string[];
  readonly region: readonly string[];
  readonly cap: readonly string[];
  readonly match: 'all' | 'any';
  readonly ram: number;
  readonly price: number;
  readonly stock: boolean;
  readonly sort: string;
}

export function parseCatalogParams(search: string): CatalogFilterParams {
  const p = new URLSearchParams(search);
  return {
    family: parseStringList(p.get('family')),
    region: parseStringList(p.get('region')),
    cap: parseStringList(p.get('cap')),
    match: parseEnum(p.get('match'), VALID_MATCH, 'all'),
    ram: parsePositiveInt(p.get('ram'), 0),
    price: parsePositiveInt(p.get('price'), 0),
    stock: p.get('stock') === '1',
    sort: parseEnum(p.get('sort'), VALID_SORT, 'order'),
  };
}

export const CATALOG_SORT_URL_TO_VM: Record<string, string> = {
  order: 'display-order',
  updated: 'recently-updated',
  price: 'monthly-price',
  ram: 'ram',
  stock: 'stock',
};

export const CATALOG_SORT_VM_TO_URL: Record<string, string> = Object.fromEntries(
  Object.entries(CATALOG_SORT_URL_TO_VM).map(([k, v]) => [v, k]),
);

export function buildCatalogSearch(params: CatalogFilterParams): string {
  const p = new URLSearchParams();
  if (params.family.length) p.set('family', params.family.join(','));
  if (params.region.length) p.set('region', params.region.join(','));
  if (params.cap.length) p.set('cap', params.cap.join(','));
  if (params.match !== 'all') p.set('match', params.match);
  if (params.ram > 0) p.set('ram', String(params.ram));
  if (params.price > 0) p.set('price', String(params.price));
  if (params.stock) p.set('stock', '1');
  if (params.sort !== 'order') p.set('sort', params.sort);
  const s = p.toString();
  return s ? `?${s}` : '';
}
