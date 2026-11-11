'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/admin', label: 'Gestão' }
];

export function AppHeader() {
  const pathname = usePathname().replace(/\/$/, '') || '/';

  return (
    <header className="app-header">
      <Link className="brand" href="/" aria-label="Vigia Maceió, página inicial">
        <span className="brand-mark" aria-hidden="true">V</span>
        <span>
          <strong>Vigia Maceió</strong>
          <small>Maceió, Alagoas</small>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Navegação principal">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
