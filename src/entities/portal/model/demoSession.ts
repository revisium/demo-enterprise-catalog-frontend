import { portalUsers } from '../mocks/portalSnapshot';
import type { PortalDemoSession, PortalUser } from './portalTypes';

const fingerprintCookieName = 'helio_demo_fingerprint';
const sessionCookieName = 'helio_session';
const defaultSessionToken = 'demo-session-mira';
const defaultFingerprintId = 'demo-fingerprint-mira';
const sessionMaxAgeSeconds = 60 * 60 * 8;

const sessionUsers: Record<string, string> = {
  'demo-session-kai': 'kai-tan',
  'demo-session-mira': 'mira-chen',
  'demo-session-noah': 'noah-patel',
};

interface RefreshPortalDemoSessionInput {
  readonly cookieHeader: string | null;
  readonly requestUrl: string;
}

interface RefreshPortalDemoSessionResult {
  readonly headers: Headers;
}

export function refreshPortalDemoSessionCookies({
  cookieHeader,
  requestUrl,
}: RefreshPortalDemoSessionInput): RefreshPortalDemoSessionResult {
  const cookies = parseCookieHeader(cookieHeader);
  const sessionToken = normalizeSessionToken(cookies[sessionCookieName]);
  const headers = new Headers();

  headers.append(
    'Set-Cookie',
    serializeHttpOnlyCookie({
      maxAgeSeconds: sessionMaxAgeSeconds,
      name: fingerprintCookieName,
      requestUrl,
      value: cookies[fingerprintCookieName] ?? defaultFingerprintId,
    }),
  );
  headers.append(
    'Set-Cookie',
    serializeHttpOnlyCookie({
      maxAgeSeconds: sessionMaxAgeSeconds,
      name: sessionCookieName,
      requestUrl,
      value: sessionToken,
    }),
  );

  return {
    headers,
  };
}

export function resolvePortalDemoSession(cookieHeader: string | null): PortalDemoSession {
  const cookies = parseCookieHeader(cookieHeader);
  const sessionToken = normalizeSessionToken(cookies[sessionCookieName]);

  return {
    cookieMode: 'httpOnly',
    expiresAt: new Date(Date.now() + sessionMaxAgeSeconds * 1000).toISOString(),
    fingerprintStatus: cookies[fingerprintCookieName] ? 'recognized' : 'created',
    refreshedAt: new Date().toISOString(),
    user: getUserForSession(sessionToken),
  };
}

function getUserForSession(sessionToken: string): PortalUser {
  const userId = sessionUsers[sessionToken];
  const user = portalUsers.find((item) => item.id === userId) ?? portalUsers[0];

  if (!user) {
    throw new Error('Portal demo users are empty');
  }

  return user;
}

function normalizeSessionToken(sessionToken: string | undefined): string {
  return sessionToken && sessionToken in sessionUsers ? sessionToken : defaultSessionToken;
}

function parseCookieHeader(cookieHeader: string | null): Readonly<Record<string, string>> {
  if (!cookieHeader) {
    return {};
  }

  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .map((cookie) => {
        const separatorIndex = cookie.indexOf('=');

        return separatorIndex === -1
          ? null
          : [cookie.slice(0, separatorIndex), cookie.slice(separatorIndex + 1)];
      })
      .filter((parts): parts is [string, string] => Boolean(parts?.[0]))
      .map(([name, value]) => [name, decodeURIComponent(value)]),
  );
}

function serializeHttpOnlyCookie({
  maxAgeSeconds,
  name,
  requestUrl,
  value,
}: {
  readonly maxAgeSeconds: number;
  readonly name: string;
  readonly requestUrl: string;
  readonly value: string;
}) {
  const secure = new URL(requestUrl).protocol === 'https:' ? '; Secure' : '';

  return `${name}=${encodeURIComponent(
    value,
  )}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${secure}`;
}
