import { SimpleGrid } from '@chakra-ui/react';

import { PrototypePage } from '../PrototypePage/PrototypePage';
import { PrototypeFeatureCard } from '../PrototypeFeatureCard/PrototypeFeatureCard';

interface PlaceholderPageProps {
  readonly title: string;
  readonly summary: string;
}

export function PlaceholderPage({ title, summary }: PlaceholderPageProps) {
  return (
    <PrototypePage
      asideSummary="The section is reserved in navigation and will receive typed mock data before backend integration."
      asideTitle="Prototype"
      eyebrow="Planned page"
      summary={summary}
      title={title}
    >
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="3">
        {['Typed mock data', 'Responsive layout', 'Backend contract'].map((item) => (
          <PrototypeFeatureCard key={item} label={item} />
        ))}
      </SimpleGrid>
    </PrototypePage>
  );
}
