import { type ActionFunctionArgs } from 'react-router';

import { handlePortalContentFeedbackAction } from 'src/features/portalRuntime';
import { runPortalAction } from './portalActionRoute';

export async function action({ request }: ActionFunctionArgs) {
  return runPortalAction(request, handlePortalContentFeedbackAction);
}
