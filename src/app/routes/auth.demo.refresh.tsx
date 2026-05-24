import { type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';

import { refreshPortalDemoSessionCookies } from 'src/entities/portal';

export function action({ request }: ActionFunctionArgs) {
  return refresh(request);
}

export function loader({ request }: LoaderFunctionArgs) {
  return refresh(request);
}

export default function DemoRefreshRoute() {
  return null;
}

function refresh(request: Request) {
  const { headers } = refreshPortalDemoSessionCookies({
    cookieHeader: request.headers.get('Cookie'),
    requestUrl: request.url,
  });

  return new Response(null, { headers, status: 204 });
}
