interface LocationLike {
  readonly hash: string;
  readonly pathname: string;
  readonly search: string;
}

interface ReturnStateLike {
  readonly from?: unknown;
}

export function createReturnState(location: LocationLike) {
  return {
    from: `${location.pathname}${location.search}${location.hash}`,
  };
}

export function resolveReturnPath(state: unknown): string | null {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const from = (state as ReturnStateLike).from;

  return typeof from === 'string' && from.startsWith('/') ? from : null;
}

export function canGoBack() {
  return typeof globalThis.window !== 'undefined' && globalThis.window.history.length > 1;
}
