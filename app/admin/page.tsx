import type { Metadata } from 'next';
import { AdminPanel } from './AdminPanel';
import './admin.css';

export const metadata: Metadata = {
  title: 'Gestão'
};

export default function AdminPage() {
  return <AdminPanel />;
}
