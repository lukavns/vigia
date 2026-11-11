import { useCallback, useEffect, useState } from 'react';
import { seedReports } from './data';
import type { Report, ReportStatus } from './types';

const STORAGE_KEY = 'vigia:reports';

function read(): Report[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Report[];
    }
  } catch {
    // navegação privada ou JSON inválido: cai para os dados de exemplo
  }

  return seedReports;
}

function write(reports: Report[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // sem storage as revisões valem só até recarregar a página
  }
}

/**
 * Fila de ocorrências da demonstração. Não existe backend: as revisões ficam
 * no localStorage do navegador.
 */
export function useReports() {
  const [reports, setReports] = useState<Report[]>(seedReports);

  useEffect(() => {
    setReports(read());
  }, []);

  const setStatus = useCallback((id: string, status: ReportStatus) => {
    setReports((current) => {
      const next = current.map((report) => (report.id === id ? { ...report, status } : report));
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // nada a limpar
    }
    setReports(seedReports);
  }, []);

  return { reports, setStatus, reset };
}
