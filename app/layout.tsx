import type { Metadata } from 'next';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { AppHeader } from '../components/AppHeader';

export const metadata: Metadata = {
  title: 'Vigia Maceió',
  description: 'MVP de índice de criminalidade por região em Maceió.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
