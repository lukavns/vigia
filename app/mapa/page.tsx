import type { Metadata } from 'next';
import { MapExperience } from './MapExperience';
import './mapa.css';

export const metadata: Metadata = {
  title: 'Mapa'
};

export default function MapaPage() {
  return <MapExperience />;
}
