import { refreshPortalDemoSessionCookies, resolvePortalDemoSession } from 'src/entities/portal';
import type { PortalDemoSession } from 'src/entities/portal';

interface PortalActionResult {
  readonly status: 'accepted' | 'rejected';
}

export async function runPortalAction(
  request: Request,
  handler: (input: { formData: FormData; session: PortalDemoSession }) => PortalActionResult,
) {
  const cookieHeader = request.headers.get('Cookie');
  const { headers } = refreshPortalDemoSessionCookies({
    cookieHeader,
    requestUrl: request.url,
  });
  const result = handler({
    formData: await request.formData(),
    session: resolvePortalDemoSession(cookieHeader),
  });
  headers.set('Content-Type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(result), {
    headers,
    status: result.status === 'accepted' ? 202 : 422,
  });
}
