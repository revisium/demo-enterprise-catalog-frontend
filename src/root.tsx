import {
  data,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from 'react-router';

import { AppLayout } from './app/layouts/AppLayout/AppLayout';
import { AppProvider } from './app/providers/AppProvider';
import { refreshPortalDemoSessionCookies } from './entities/portal';
import { defaultLocale, isLocaleCode, type LocaleCode } from './shared/i18n';
import './shared/ui/global.css';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>HelioStack - Cloud Server Catalog</title>
        <I18nBootScript />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function loader({ request }: LoaderFunctionArgs) {
  const { headers } = refreshPortalDemoSessionCookies({
    cookieHeader: request.headers.get('Cookie'),
    requestUrl: request.url,
  });
  const initialLocale = getLocaleFromCookie(request.headers.get('Cookie'));

  return data({ initialLocale }, { headers });
}

export default function Root() {
  const { initialLocale } = useLoaderData<typeof loader>();

  return (
    <AppProvider initialLocale={initialLocale}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProvider>
  );
}

function I18nBootScript() {
  const script = `
(() => {
  const storageKey = 'heliostack.locale';
  const cookieKey = 'heliostack_locale=';
  const rtlLocales = new Set(['ar']);
  const supportedLocales = new Set(['ar', 'en', 'es', 'fr', 'ru', 'zh']);
  const cookieLocale = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(cookieKey))
    ?.slice(cookieKey.length);
  const storedLocale = window.localStorage?.getItem(storageKey);
  const locale = supportedLocales.has(storedLocale) ? storedLocale : cookieLocale;

  if (!supportedLocales.has(locale)) {
    return;
  }

  document.documentElement.lang = locale;
  document.documentElement.dir = rtlLocales.has(locale) ? 'rtl' : 'ltr';

  if (locale !== 'en') {
    document.documentElement.setAttribute('data-i18n-pending', '');
  }
})();
`;

  return (
    <>
      <style>{'html[data-i18n-pending] #app-content { visibility: hidden; }'}</style>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

function getLocaleFromCookie(cookieHeader: string | null): LocaleCode {
  const localeCookie = cookieHeader
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('heliostack_locale='));
  const locale = localeCookie?.split('=')[1];

  return locale && isLocaleCode(locale) ? locale : defaultLocale;
}
