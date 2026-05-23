import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { AppLayout } from './app/layouts/AppLayout/AppLayout';
import { AppProvider } from './app/providers/AppProvider';
import './shared/ui/global.css';

interface LayoutProps {
  readonly children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Nexora Systems - Enterprise Catalog</title>
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

export default function Root() {
  return (
    <AppProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppProvider>
  );
}
