import type { Metadata, Viewport } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AppHeader } from '../components/AppHeader';

export const metadata: Metadata = {
  title: {
    default: 'Vigia Maceió',
    template: '%s · Vigia Maceió'
  },
  description: 'Índice simulado de criminalidade por bairro em Maceió. Projeto acadêmico com dados fictícios.'
};

export const viewport: Viewport = {
  themeColor: '#b91c1c'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppHeader />
        {children}
        <footer className="app-footer">
          <p>Projeto acadêmico. Os dados exibidos são fictícios e não representam estatística oficial.</p>
          <a href="https://github.com/lukavns/vigia" target="_blank" rel="noopener noreferrer">Código no GitHub</a>
        </footer>
      </body>
    </html>
  );
}
