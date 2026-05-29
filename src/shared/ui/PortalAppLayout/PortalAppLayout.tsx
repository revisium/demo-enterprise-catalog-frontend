import { type ReactNode } from 'react';

import { PortalDetailPageLayout } from '../PortalDetailPageLayout/PortalDetailPageLayout';

interface PortalAppLayoutProps {
  readonly aside: ReactNode;
  readonly children: ReactNode;
  readonly heroPanel: ReactNode;
  readonly summaryPanel: ReactNode;
}

export function PortalAppLayout({ aside, children, heroPanel, summaryPanel }: PortalAppLayoutProps) {
  return (
    <PortalDetailPageLayout
      aside={aside}
      backFallback="/app"
      heroPanel={heroPanel}
      summaryPanel={summaryPanel}
    >
      {children}
    </PortalDetailPageLayout>
  );
}
