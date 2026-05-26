import { supportedLocales, type LocaleCode } from './languages';

type LocaleTupleIndex = 0 | 1 | 2 | 3 | 4 | 5;
type TranslationTuple = readonly [string, string, string, string, string, string];

const localeIndexes = {
  en: 0,
  ar: 1,
  zh: 2,
  fr: 3,
  ru: 4,
  es: 5,
} as const satisfies Record<LocaleCode, LocaleTupleIndex>;

const messageEntries = {
  'app.console': ['Console', 'لوحة التحكم', '控制台', 'Console', 'Кабинет', 'Consola'],
  'app.getQuote': [
    'Get quote',
    'اطلب عرضا',
    '获取报价',
    'Demander un devis',
    'Запросить расчет',
    'Pedir oferta',
  ],
  'app.skipContent': [
    'Skip to content',
    'تخطي إلى المحتوى',
    '跳到内容',
    'Aller au contenu',
    'Перейти к содержимому',
    'Saltar al contenido',
  ],
  'footer.explore': ['Explore', 'استكشاف', '浏览', 'Explorer', 'Каталог', 'Explorar'],
  'footer.guides': ['Guides', 'الأدلة', '指南', 'Guides', 'Гайды', 'Guías'],
  'footer.requestQuote': [
    'Request quote',
    'طلب عرض سعر',
    '请求报价',
    'Demander un devis',
    'Запросить расчет',
    'Solicitar oferta',
  ],
  'footer.resources': ['Resources', 'الموارد', '资源', 'Ressources', 'Материалы', 'Recursos'],
  'footer.summary': [
    'Cloud and dedicated server catalog with regional prices, stock, docs, and customer quote workflows.',
    'كتالوج خوادم سحابية ومخصصة مع أسعار إقليمية، ومخزون، ومستندات، ومسارات طلب عروض للعملاء.',
    '云服务器和独立服务器目录，包含区域价格、库存、文档和客户报价流程。',
    'Catalogue de serveurs cloud et dédiés avec prix régionaux, stock, documents et parcours de devis client.',
    'Каталог облачных и выделенных серверов с региональными ценами, наличием, документами и клиентским сценарием запроса расчета.',
    'Catálogo de servidores cloud y dedicados con precios regionales, stock, documentos y flujos de cotización para clientes.',
  ],
  'footer.updates': ['Updates', 'التحديثات', '更新', 'Mises à jour', 'Обновления', 'Novedades'],
  'footer.workspace': [
    'Workspace',
    'مساحة العمل',
    '工作区',
    'Espace client',
    'Кабинет',
    'Espacio de trabajo',
  ],
  'language.selectLabel': [
    'Interface language',
    'لغة الواجهة',
    '界面语言',
    "Langue de l'interface",
    'Язык интерфейса',
    'Idioma de la interfaz',
  ],
  'language.selectTitle': [
    'Switch interface language',
    'تغيير لغة الواجهة',
    '切换界面语言',
    "Changer la langue de l'interface",
    'Переключить язык интерфейса',
    'Cambiar idioma de la interfaz',
  ],
  'nav.compare': ['Compare', 'مقارنة', '比较', 'Comparer', 'Сравнение', 'Comparar'],
  'nav.locations': ['Locations', 'المواقع', '位置', 'Sites', 'Локации', 'Ubicaciones'],
  'nav.pricing': ['Pricing', 'الأسعار', '价格', 'Tarifs', 'Цены', 'Precios'],
  'nav.resources': ['Resources', 'الموارد', '资源', 'Ressources', 'Материалы', 'Recursos'],
  'nav.servers': ['Servers', 'الخوادم', '服务器', 'Serveurs', 'Серверы', 'Servidores'],
  'nav.updates': ['Updates', 'التحديثات', '更新', 'Actualités', 'Обновления', 'Novedades'],
} as const satisfies Record<string, TranslationTuple>;

export type TranslationKey = keyof typeof messageEntries;

type TranslationMessages = Record<TranslationKey, string>;

const typedMessageEntries = Object.entries(messageEntries) as [TranslationKey, TranslationTuple][];

export const messages = Object.fromEntries(
  supportedLocales.map((locale) => [
    locale.code,
    Object.fromEntries(
      typedMessageEntries.map(([key, values]) => [key, values[localeIndexes[locale.code]]]),
    ),
  ]),
) as Record<LocaleCode, TranslationMessages>;

export function translate(locale: LocaleCode, key: TranslationKey): string {
  return messages[locale][key];
}
