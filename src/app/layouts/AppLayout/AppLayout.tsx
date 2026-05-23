import { NavLink } from 'react-router';

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

const navItems = [
  { label: 'Catalog', to: '/catalog' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Compare', to: '/compare' },
  { label: 'Resources', to: '/resources' },
  { label: 'Releases', to: '/releases' },
  { label: 'Quote', to: '/quote' },
] as const;

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-frame">
      <a className="skip-link" href="#app-content">
        Skip to content
      </a>
      <header className="site-header">
        <NavLink className="brand-link" to="/">
          <span className="brand-mark">NX</span>
          <span>Nexora Systems</span>
        </NavLink>
        <nav className="site-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <div id="app-content">{children}</div>
    </div>
  );
}
