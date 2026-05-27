import { defaultLocale, type LocaleCode } from './languages';
import { messages } from './messages';
import visualTextEntriesJson from './visualTranslations.data.json';

type LocaleTupleIndex = 0 | 1 | 2 | 3 | 4 | 5;
type TranslationTuple = readonly [string, string, string, string, string, string];

const resourceDetailTextEntries = buildRussianTranslationEntries({
  'Use organization-scoped keys for availability checks, quote lookup, and finance export jobs. Keep write scopes separate from read-only integrations.':
    'Используйте ключи уровня организации для проверки наличия, поиска расчетов и финансового экспорта. Отделяйте права записи от интеграций только для чтения.',
  'Recommended integration shape': 'Рекомендуемая схема интеграции',
  'Start with availability and price reads, then add quote writes only after the buying workflow is approved by the account owner.':
    'Начните с чтения наличия и цен, затем добавляйте запись расчетов только после согласования процесса покупки владельцем аккаунта.',
  'Rollout sequence': 'Порядок запуска',
  'Confirm public IPv4, private VLAN, bandwidth, firewall ownership, and support coverage before a server plan is shared with operations.':
    'Подтвердите публичный IPv4, приватный VLAN, пропускную способность, владельца фаервола и поддержку до передачи плана серверов в эксплуатацию.',
  'Prefer a nearby alternative region when the primary location has longer setup windows or lower stock for the same server family.':
    'Выбирайте ближайший запасной регион, если в основной локации дольше подготовка или меньше запас по тому же семейству серверов.',
  'Understand public IPv4, private VLAN, bandwidth, firewall, and regional support rules.':
    'Разберите публичный IPv4, приватный VLAN, пропускную способность, фаервол и правила региональной поддержки.',
  'Retention windows, restore requests, monitoring add-ons, and customer responsibilities.':
    'Сроки хранения, запросы на восстановление, мониторинг и ответственность клиента.',
  'Review members, quote approvers, billing contacts, and audit history before renewal.':
    'Проверьте участников, согласующих расчет, платежные контакты и историю аудита перед продлением.',
  'Define restore ownership, monitoring alerts, retention windows, and escalation contacts before the plan reaches production.':
    'Определите ответственного за восстановление, алерты мониторинга, сроки хранения и контакты эскалации до выхода плана в боевую среду.',
  'Operating model': 'Операционная модель',
  'Attach backup policy and support terms to quote approvals so finance and operations review the same operating assumptions.':
    'Прикладывайте политику бэкапов и условия поддержки к согласованию расчета, чтобы финансы и операции проверяли одинаковые предположения.',
  'Approval packet': 'Пакет согласования',
  'Review account members, billing recipients, and quote approvers before every renewal or regional expansion.':
    'Проверяйте участников аккаунта, получателей счетов и согласующих расчет перед каждым продлением или расширением региона.',
  'Use audit history and saved account notes to explain who changed quotes, favorites, and organization settings.':
    'Используйте историю аудита и сохраненные заметки аккаунта, чтобы объяснить, кто менял расчеты, избранное и настройки организации.',
  'Limit quote writes to trusted systems': 'Разрешайте запись расчетов только доверенным системам',
  'Check bandwidth expectations': 'Проверьте требования к пропускной способности',
  'Validate regional setup time': 'Проверьте срок подготовки в регионе',
  'Choose backup retention': 'Выберите срок хранения бэкапов',
  'Assign restore owner': 'Назначьте ответственного за восстановление',
  'Review members': 'Проверьте участников',
  'Check quote approvers': 'Проверьте согласующих расчет',
});

const ruOnlyVisualTextEntries = {
  '/mo': '/мес',
  '/yr': '/год',
  '1U dedicated server': 'выделенный сервер 1U',
  '2026 Q2 regional server price book': 'Региональный прайсбук серверов Q2 2026',
  '1 Gbps public network': '1 Gbps публичная сеть',
  '2 Gbps public network': '2 Gbps публичная сеть',
  '10 Gbps public network': '10 Gbps публичная сеть',
  '10 Gbps public and private network': '10 Gbps публичная и приватная сеть',
  '45 minutes ago': '45 минут назад',
  '6 hours ago': '6 часов назад',
  '2 hours ago': '2 часа назад',
  'Account manager': 'Менеджер аккаунта',
  'Add company and email': 'Добавьте компанию и почту',
  'Added backup add-on to Dedicated R2 quote': 'Добавлен бэкап к расчету Dedicated R2',
  'APAC launch date is confirmed. Please keep monitoring and backup in the first offer.':
    'Дата запуска APAC подтверждена. Оставьте мониторинг и бэкап в первом предложении.',
  'Alternatives are ranked by shared server families, readiness, and stock.':
    'Альтернативы ранжируются по общим семействам серверов, готовности и наличию.',
  any: 'любой',
  'any add-on': 'любое дополнение',
  'any family': 'любое семейство',
  'any memory': 'любая память',
  'any memory · any setup time': 'любая память · любой срок подготовки',
  'any region': 'любой регион',
  'any score': 'любой балл',
  'any tier': 'любой уровень',
  'any window': 'любое окно',
  apac: 'APAC',
  API: 'API',
  api: 'API',
  audit: 'аудит',
  availability: 'наличие',
  'available only': 'только доступные',
  backup: 'бэкап',
  'Backup policy': 'Политика бэкапов',
  'Balanced virtual server for production apps, admin panels, APIs, and SaaS backends.':
    'Сбалансированный виртуальный сервер для рабочих приложений, админок, API и SaaS-бэкендов.',
  'Balanced virtual server for production apps and medium traffic APIs.':
    'Сбалансированный виртуальный сервер для рабочих приложений и API со средним трафиком.',
  'balanced fit': 'сбалансированное соответствие',
  billing: 'биллинг',
  by: 'автор',
  'Bucket policy controls': 'настройки политики бакета',
  'Check whether the update changes a shortlist.':
    'Проверьте, меняет ли обновление короткий список.',
  'Choose a production server plan': 'Выбор рабочего сервера',
  'Cloud servers': 'Облачные серверы',
  'Commercial operations': 'Коммерческие операции',
  'Commercial review': 'Коммерческая проверка',
  'Commercial rows are ready for review with clear contract terms, regional context, and renewal impact.':
    'Коммерческие строки готовы к проверке: условия контракта, региональный контекст и влияние на продление понятны.',
  'Company is required': 'Укажите компанию',
  'Compact GPU server for rendering, inference experiments, and short-lived acceleration.':
    'Компактный GPU-сервер для рендера, экспериментов с инференсом и короткого ускорения.',
  'Compare regional stock and setup windows.': 'Сравните региональное наличие и сроки подготовки.',
  'Compare the price-book view with active quotes before sending a final monthly total to finance.':
    'Сравните прайсбук с активными расчетами перед отправкой итоговой месячной суммы в финансы.',
  'Customer-facing catalog pages now surface the changed availability so sales and procurement can discuss the same plan set.':
    'Клиентские страницы каталога показывают измененное наличие, чтобы продажи и закупки обсуждали один набор планов.',
  'Customer owner': 'Владелец со стороны клиента',
  'Customer needs to confirm the remaining approval note.':
    'Клиенту нужно подтвердить оставшуюся заметку согласования.',
  'Current monthly and yearly server terms for active regions.':
    'Текущие месячные и годовые условия серверов для активных регионов.',
  'Database sizing guide': 'Гайд по размеру базы данных',
  dedicated: 'выделенные серверы',
  docs: 'документы',
  done: 'готово',
  'Driver matrix': 'Матрица драйверов',
  effective: 'актуально с',
  efficiency: 'эффективность',
  Email: 'Почта',
  'Engineering teams that need reliable production capacity without managing hardware.':
    'Инженерные команды, которым нужна надежная рабочая емкость без управления железом.',
  English: 'Английский',
  Enterprise: 'Enterprise',
  'Fastest setup': 'Самая быстрая подготовка',
  'fastest setup': 'самая быстрая подготовка',
  '1h fastest setup': '1ч самая быстрая подготовка',
  '2h fastest setup': '2ч самая быстрая подготовка',
  '4h fastest setup': '4ч самая быстрая подготовка',
  '8h fastest setup': '8ч самая быстрая подготовка',
  '12h fastest setup': '12ч самая быстрая подготовка',
  'Filter by family, region, stock, and efficiency score; then sort the active rows.':
    'Фильтруйте по семейству, региону, наличию и баллу эффективности, затем сортируйте активные строки.',
  'Find plans available in the updated market.': 'Найдите планы, доступные в обновленном регионе.',
  'Firewall rules included': 'правила фаервола включены',
  'Frankfurt production app': 'Рабочее приложение во Франкфурте',
  'GPU stock changes often, so updatedAt and availability filters are important.':
    'Запас GPU часто меняется, поэтому дата обновления и фильтры наличия важны.',
  gpu: 'GPU',
  'GPU Edge A2 preview stock published': 'Опубликовано предварительное наличие GPU Edge A2',
  'GPU setup guide': 'Гайд по подготовке GPU',
  'GPU acceleration node': 'Узел ускорения GPU',
  'Hardware and setup': 'Железо и подготовка',
  'Hardware profile': 'Профиль железа',
  'High-memory compute node': 'вычислительный узел с большой памятью',
  'High-memory server for Postgres, analytics, and critical stateful systems.':
    'Сервер с большой памятью для Postgres, аналитики и критичных систем с состоянием.',
  'Home region': 'Домашний регион',
  in: 'в',
  'in stock only': 'только в наличии',
  ipv4: 'IPv4',
  'Inspect current and upcoming commercial rows.':
    'Проверьте текущие и будущие коммерческие строки.',
  Language: 'Язык',
  'lifecycle-rules': 'правила жизненного цикла',
  'Managed firewall available': 'управляемый фаервол доступен',
  'Mark updates as useful or keep them saved for the account planning thread.':
    'Отмечайте обновления полезными или сохраняйте их в рабочий поток аккаунта.',
  'Matching stock': 'Подходящее наличие',
  'matching regions': 'подходящих регионов',
  'May 2': '2 мая',
  'May 15': '15 мая',
  'May 18': '18 мая',
  'May 21': '21 мая',
  'May 22': '22 мая',
  'May 23': '23 мая',
  'min read': 'мин чтения',
  monitoring: 'мониторинг',
  'Monthly total': 'Итого в месяц',
  'monthly rate': 'месячная ставка',
  'New backup and media workloads can be quoted in APAC.':
    'Новые бэкап- и media-нагрузки можно рассчитывать в APAC.',
  'New quote': 'Новый расчет',
  network: 'сеть',
  'Network guide': 'Гайд по сети',
  next: 'следующий',
  'Open affected server plans, compare nearby alternatives, and decide whether the update should be carried into an active quote.':
    'Откройте затронутые серверные планы, сравните ближайшие альтернативы и решите, нужно ли переносить обновление в активный расчет.',
  'Open one price book to inspect regional rows, computed fields, and contract status.':
    'Откройте прайсбук, чтобы проверить региональные строки, расчетные поля и статус контракта.',
  'Open the customer documentation library.': 'Откройте клиентскую библиотеку документации.',
  'Partner API': 'Партнерский API',
  'Partner API guide refreshed': 'Обновлен гайд по партнерскому API',
  'Partner API overview': 'Обзор партнерского API',
  'Partner integration teams get a clearer onboarding path.':
    'Партнерские команды интеграции получают более понятный путь подключения.',
  partners: 'партнеры',
  'Physical server for steady production workloads and predictable performance.':
    'Физический сервер для стабильных рабочих нагрузок и предсказуемой производительности.',
  'Plan guide': 'Гайд по плану',
  'Plan is required': 'Выберите план',
  'Plan, region, and add-ons are selected.': 'План, регион и дополнения выбраны.',
  'Plan, region, and monthly estimate are ready.': 'План, регион и месячная оценка готовы.',
  planning: 'планирование',
  'Please keep the yearly term and enterprise support. Private VLAN is required for production.':
    'Оставьте годовой срок и поддержку Enterprise. Приватный VLAN нужен для рабочей среды.',
  'Pinned for the production app renewal.': 'Закреплено для продления рабочего приложения.',
  preview: 'предпросмотр',
  pricing: 'цены',
  'Procurement teams can attach clearer support terms to quote approvals.':
    'Команды закупок могут прикладывать более понятные условия поддержки к согласованию расчетов.',
  'Prepare a quote with the refreshed terms.': 'Подготовьте расчет с обновленными условиями.',
  'Price efficiency': 'Ценовая эффективность',
  Efficiency: 'Эффективность',
  'Private VLAN and firewall controls': 'приватный VLAN и настройки фаервола',
  'Private VLAN optional': 'приватный VLAN опционально',
  'private-vlan': 'приватный VLAN',
  Published: 'Опубликовано',
  'Q3 contract draft price book': 'Черновик контрактного прайсбука Q3',
  quote: 'расчет',
  quotes: 'расчеты',
  'Quick start': 'Быстрый старт',
  'Request preview': 'Предпросмотр запроса',
  'Recommended follow-up': 'Рекомендуемое действие',
  'Region sort': 'Сортировка регионов',
  'Region is required': 'Выберите регион',
  'Regional availability, setup windows, or market support changed for customers planning capacity in that location.':
    'Для клиентов, планирующих емкость в этой локации, изменились наличие, сроки подготовки или региональная поддержка.',
  'Remote hands guide': 'Гайд по удаленным работам',
  renewal: 'продление',
  'Request quote': 'Запросить расчет',
  'Review available server plans and stock.': 'Проверьте доступные серверные планы и наличие.',
  'Review location detail and catalog rows before promising a setup date or moving a quote to review.':
    'Проверьте детали локации и строки каталога перед обещанием даты подготовки или передачей расчета на проверку.',
  'Sales can compare current and upcoming commercial terms before renewal calls.':
    'Продажи могут сравнить текущие и будущие коммерческие условия перед звонками о продлении.',
  'Sales review is checking backup retention and final setup date for Frankfurt.':
    'Проверка продаж уточняет срок хранения бэкапов и финальную дату подготовки во Франкфурте.',
  'Sales validates terms, support, and setup date.':
    'Продажи проверяют условия, поддержку и дату подготовки.',
  'Sales will validate the final bundle after reply.':
    'Продажи проверят финальный пакет после ответа.',
  'Save the update for an account workspace.': 'Сохраните обновление в рабочей области аккаунта.',
  score: 'балл',
  security: 'безопасность',
  'Secure cookie': 'Защищенная куки',
  'Select regional rows to prepare the server list that will move into the quote flow.':
    'Выберите региональные строки, чтобы подготовить список серверов для расчета.',
  'Selected rows': 'Выбрано строк',
  servers: 'серверы',
  'Setup total': 'Итого за подготовку',
  setup: 'подготовка',
  'Share the updated guide with the account owner when the topic appears in a renewal, API rollout, or approval packet.':
    'Передайте обновленный гайд владельцу аккаунта, когда тема появится в продлении, запуске API или пакете согласования.',
  'shared families': 'общие семейства',
  Shortlist: 'Короткий список',
  'Similar capacity in matching regions': 'Похожая емкость в подходящих регионах',
  sla: 'SLA',
  'SLA exhibit': 'Приложение SLA',
  'SLA note': 'Заметка SLA',
  'standard terms': 'стандартные условия',
  storage: 'хранилище',
  'Storage guide': 'Гайд по хранилищу',
  'Storage server pool': 'пул серверов хранения',
  support: 'поддержка',
  'Terms were checked by sales.': 'Условия проверены продажами.',
  'The card changes as filters change.': 'Карточка меняется вместе с фильтрами.',
  'The quote is waiting for final approval.': 'Расчет ожидает финального согласования.',
  'Track customer and sales replies, quote status, monthly totals, and follow-up timing.':
    'Отслеживайте ответы клиента и продаж, статус расчета, месячные суммы и сроки follow-up.',
  update: 'обновление',
  updated: 'обновлено',
  'vCPU ·': 'vCPU ·',
  waiting: 'ожидание',
  'What changed': 'Что изменилось',
  'Work email': 'Рабочая почта',
  'Valid email is required': 'Укажите корректную почту',
  Yesterday: 'Вчера',
  'Yearly savings': 'Годовая экономия',
  'Yearly term, private VLAN, backup, monitoring, and enterprise support.':
    'Годовой срок, приватный VLAN, бэкап, мониторинг и поддержка Enterprise.',
  'yearly monthly rate': 'месячная ставка при годовом сроке',
  'save $': 'экономия $',
  contracts: 'контракты',
  '· effective': '· актуально с',
  '· setup': '· подготовка',
} as const satisfies Record<string, string>;

const baseVisualTextEntries: Record<string, TranslationTuple> = {
  ...(visualTextEntriesJson as unknown as Record<string, TranslationTuple>),
  ...resourceDetailTextEntries,
};

const ruOnlyTranslationEntries = Object.fromEntries(
  Object.entries(ruOnlyVisualTextEntries).map(([source, russian]) => [
    source,
    buildRussianOverrideTuple(source, russian),
  ]),
) as Record<string, TranslationTuple>;

const visualTextEntries = {
  ...baseVisualTextEntries,
  ...ruOnlyTranslationEntries,
};

const localeIndexes = {
  en: 0,
  ar: 1,
  zh: 2,
  fr: 3,
  ru: 4,
  es: 5,
} as const satisfies Record<LocaleCode, LocaleTupleIndex>;

const exactTextTranslations = new Map<string, TranslationTuple>();
type MessageKey = keyof typeof messages.en;

const messageTextEntries = (Object.keys(messages.en) as MessageKey[]).map(
  (key) =>
    [
      messages.en[key],
      messages.ar[key],
      messages.zh[key],
      messages.fr[key],
      messages.ru[key],
      messages.es[key],
    ] as const satisfies TranslationTuple,
);

const exactTranslationTuples = [...messageTextEntries, ...Object.values(visualTextEntries)];
const phraseTextEntries = Object.values(visualTextEntries).sort(
  (left, right) => right[0].length - left[0].length,
);

for (const tuple of exactTranslationTuples) {
  exactTextTranslations.set(normalizeText(tuple[0]), tuple);
}

export function localizeVisualText(locale: LocaleCode, source: string): string {
  if (locale === defaultLocale || !shouldTranslate(source)) {
    return source;
  }

  const normalizedSource = normalizeText(source);
  const exactTranslation = exactTextTranslations.get(normalizedSource);

  if (exactTranslation) {
    return preserveOuterWhitespace(source, getTupleValue(exactTranslation, locale));
  }

  const terminalPeriodTranslation = exactTextTranslations.get(`${normalizedSource}.`);

  if (terminalPeriodTranslation) {
    return preserveOuterWhitespace(
      source,
      removeTerminalPeriod(getTupleValue(terminalPeriodTranslation, locale)),
    );
  }

  return phraseTextEntries.reduce((text, tuple) => {
    const target = getTupleValue(tuple, locale);

    return tuple[0] === target ? text : replacePhrase(text, tuple[0], target);
  }, source);
}

function getTupleValue(tuple: TranslationTuple, locale: LocaleCode) {
  return tuple[localeIndexes[locale]];
}

function buildRussianTranslationEntries(entries: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(entries).map(([source, russian]) => [
      source,
      [source, source, source, source, russian, source] as TranslationTuple,
    ]),
  ) as Record<string, TranslationTuple>;
}

function buildRussianOverrideTuple(source: string, russian: string): TranslationTuple {
  const existingTuple = baseVisualTextEntries[source];

  return existingTuple
    ? [
        existingTuple[0],
        existingTuple[1],
        existingTuple[2],
        existingTuple[3],
        russian,
        existingTuple[5],
      ]
    : [source, source, source, source, russian, source];
}

function shouldTranslate(source: string) {
  const trimmed = source.trim();

  return (
    trimmed.length > 1 &&
    /[A-Za-z]/.test(trimmed) &&
    !trimmed.includes('@') &&
    (!trimmed.startsWith('/') || /^\/(?:mo|yr)\b/.test(trimmed)) &&
    !trimmed.startsWith('http') &&
    !/^[A-Z0-9._/-]+$/.test(trimmed)
  );
}

function normalizeText(source: string) {
  return source.replace(/\s+/g, ' ').trim();
}

function preserveOuterWhitespace(source: string, translated: string) {
  const leading = getLeadingWhitespace(source);
  const trailing = getTrailingWhitespace(source);

  return `${leading}${translated}${trailing}`;
}

function removeTerminalPeriod(source: string) {
  let endIndex = source.length;

  while (endIndex > 0) {
    const codePoint = source.codePointAt(endIndex - 1) ?? 0;

    if (!isTerminalPeriod(codePoint)) {
      break;
    }

    endIndex -= codePoint > 0xffff ? 2 : 1;
  }

  return endIndex === source.length ? source : source.slice(0, endIndex);
}

function isTerminalPeriod(characterCode: number) {
  return (
    characterCode === 46 ||
    characterCode === 0x3002 ||
    characterCode === 0xff0e ||
    characterCode === 0xff61
  );
}

function getLeadingWhitespace(source: string) {
  let index = 0;

  while (index < source.length && /\s/.exec(source[index] ?? '')) {
    index += 1;
  }

  return source.slice(0, index);
}

function getTrailingWhitespace(source: string) {
  let index = source.length - 1;

  while (index >= 0 && /\s/.exec(source[index] ?? '')) {
    index -= 1;
  }

  return source.slice(index + 1);
}

function replacePhrase(source: string, phrase: string, translated: string) {
  const escapedPhrase = escapeRegExp(phrase);
  const hasWordEdges = /^[A-Za-z0-9]/.test(phrase) && /[A-Za-z0-9]$/.test(phrase);
  const pattern = hasWordEdges
    ? new RegExp(`(?<![A-Za-z0-9])${escapedPhrase}(?![A-Za-z0-9])`, 'g')
    : new RegExp(escapedPhrase, 'g');

  return source.replace(pattern, translated);
}

function escapeRegExp(source: string) {
  return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
