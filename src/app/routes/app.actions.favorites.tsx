import { type ActionFunctionArgs } from 'react-router';

import { handlePortalFavoriteAction } from 'src/features/portalRuntime';
import { runPortalAction } from './portalActionRoute';

export async function action({ request }: ActionFunctionArgs) {
  return runPortalAction(request, handlePortalFavoriteAction);
}
