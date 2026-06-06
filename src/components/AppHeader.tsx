'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/admin', label: 'Gestão' }
];

export function AppHeader() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(navigator.onLine);
    };

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return (
    <header className="app-header">
      <Link className="brand" href="/" aria-label="Vigia Maceió">
        <span className="brand-mark">V</span>
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
            className={pathname === item.href ? 'active' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <span className={`connection-status ${isOnline ? '' : 'offline'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </header>
  );
}
