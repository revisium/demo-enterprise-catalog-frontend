import { data, type LoaderFunctionArgs, useLoaderData } from 'react-router';

import { refreshPortalDemoSessionCookies, resolvePortalDemoSession } from 'src/entities/portal';
import { PortalSavedPlanDetailPage } from 'src/pages/PortalSavedPlanDetail';

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

export default function PortalSavedPlanDetailRoute() {
  const { session } = useLoaderData<typeof loader>();

  return <PortalSavedPlanDetailPage key={session.user.id} session={session} />;
}
