import { data, type LoaderFunctionArgs, useLoaderData } from 'react-router';

import { refreshPortalDemoSessionCookies, resolvePortalDemoSession } from 'src/entities/portal';
import { PortalQuoteDetailPage } from 'src/pages/PortalQuoteDetail';

export function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const { headers } = refreshPortalDemoSessionCookies({
    cookieHeader,
    requestUrl: request.url,
  });

  return data(
    {
      session: resolvePortalDemoSession(cookieHeader),
    },
    { headers },
  );
}

export default function PortalQuoteDetailRoute() {
  const { session } = useLoaderData<typeof loader>();

  return <PortalQuoteDetailPage key={session.user.id} session={session} />;
}
