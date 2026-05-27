import { Box, type BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

type PageSectionTone =
  | 'servers'
  | 'pricing'
  | 'locations'
  | 'compare'
  | 'resources'
  | 'releases'
  | 'app'
  | 'default';

interface SectionSurface {
  readonly background: string;
  readonly before?: {
    readonly backgroundImage: string;
    readonly backgroundSize: string;
    readonly backgroundPosition?: string;
    readonly backgroundRepeat?: string;
    readonly opacity: number;
  };
  readonly after?: {
    readonly backgroundImage: string;
    readonly backgroundSize: string;
    readonly backgroundPosition?: string;
    readonly backgroundRepeat?: string;
    readonly opacity: number;
  };
}

interface PageSectionSurfaceProps extends Omit<BoxProps, 'children' | 'bg' | 'background'> {
  readonly children: ReactNode;
  readonly tone?: PageSectionTone;
}

const sectionSurface: SectionSurface = {
  background:
    'linear-gradient(135deg, #eff1f5 0%, #eff1f5 42%, #d9b77c 68%, #0b5bd3 100%)',
};

const pageSectionSurfaces: Record<PageSectionTone, SectionSurface> = {
  app: sectionSurface,
  compare: sectionSurface,
  default: sectionSurface,
  locations: sectionSurface,
  pricing: sectionSurface,
  releases: sectionSurface,
  resources: sectionSurface,
  servers: sectionSurface,
};

export function PageSectionSurface({
  children,
  tone = 'default',
  className,
  ...props
}: Readonly<PageSectionSurfaceProps>) {
  const surface = pageSectionSurfaces[tone];

  return (
    <Box
      className={className}
      overflow="hidden"
      pos="relative"
      bg={surface.background}
      _before={
        surface.before
          ? {
              content: '""',
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              opacity: surface.before.opacity,
              backgroundImage: surface.before.backgroundImage,
              backgroundSize: surface.before.backgroundSize,
              backgroundPosition: surface.before.backgroundPosition,
              backgroundRepeat: surface.before.backgroundRepeat ?? 'repeat',
            }
          : undefined
      }
      _after={
        surface.after
          ? {
              content: '""',
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              opacity: surface.after.opacity,
              backgroundImage: surface.after.backgroundImage,
              backgroundSize: surface.after.backgroundSize,
              backgroundPosition: surface.after.backgroundPosition,
              backgroundRepeat: surface.after.backgroundRepeat ?? 'repeat',
            }
          : undefined
      }
      {...props}
    >
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
}
