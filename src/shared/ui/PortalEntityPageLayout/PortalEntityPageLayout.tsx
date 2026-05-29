import { type ReactNode } from 'react';

import { PortalAppLayout } from '../PortalAppLayout/PortalAppLayout';

interface PortalEntityPageLayoutProps {
  readonly aside: ReactNode;
  readonly children: ReactNode;
  readonly heroPanel: ReactNode;
  readonly summaryPanel: ReactNode;
}

export function PortalEntityPageLayout({
  aside,
  children,
  heroPanel,
  summaryPanel,
}: PortalEntityPageLayoutProps) {
  return (
    <PortalAppLayout aside={aside} heroPanel={heroPanel} summaryPanel={summaryPanel}>
      {children}
    </PortalAppLayout>
  );
}
