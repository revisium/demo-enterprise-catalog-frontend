import { data, type LoaderFunctionArgs, useLoaderData } from 'react-router';

import { refreshPortalDemoSessionCookies, resolvePortalDemoSession } from 'src/entities/portal';
import { CustomerPortalPage } from 'src/pages/CustomerPortal';

export function loader({ request }: LoaderFunctionArgs) {
  const { headers } = refreshPortalDemoSessionCookies({
    cookieHeader: request.headers.get('Cookie'),
    requestUrl: request.url,
  });

  return data(
    {
      session: resolvePortalDemoSession(request.headers.get('Cookie')),
    },
    { headers },
  );
}

export default function CustomerPortalRoute() {
  const { session } = useLoaderData<typeof loader>();

  return <CustomerPortalPage session={session} />;
}
