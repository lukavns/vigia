'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import type { AdminCommunityReport, AdminDashboard, AdminUser } from '@/lib/types';
import './admin.css';

export default function AdminPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [authToken, setAuthToken] = useState('');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [reports, setReports] = useState<AdminCommunityReport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('pending_review');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedToken = sessionStorage.getItem('vigia-admin-token') ?? '';
    if (storedToken) {
      setAuthToken(storedToken);
      void loadAdminArea(storedToken);
    }
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');
    const token = btoa(`${credentials.email}:${credentials.password}`);
    sessionStorage.setItem('vigia-admin-token', token);
    setAuthToken(token);
    void loadAdminArea(token);
  };

  const logout = () => {
    sessionStorage.removeItem('vigia-admin-token');
    setAuthToken('');
    setCurrentUser(null);
    setDashboard(null);
    setReports([]);
    setMessage('');
  };

  const loadAdminArea = async (token = authToken) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [user, dashboardData, reportData] = await Promise.all([
        adminApi.me(token),
        adminApi.dashboard(token),
        adminApi.reports(token, selectedStatus)
      ]);
      setCurrentUser(user);
      setDashboard(dashboardData);
      setReports(reportData);
    } catch {
      setErrorMessage('Não foi possível autenticar. Confira e-mail e senha.');
      sessionStorage.removeItem('vigia-admin-token');
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReports = async (status = selectedStatus) => {
    if (!authToken) {
      return;
    }

    setSelectedStatus(status);
    setErrorMessage('');

    try {
      setReports(await adminApi.reports(authToken, status));
    } catch {
      setErrorMessage('Não foi possível carregar as ocorrências.');
    }
  };

  const review = async (report: AdminCommunityReport, status: 'approved' | 'rejected') => {
    setErrorMessage('');
    setMessage('');

    try {
      await adminApi.reviewReport(authToken, report.id, status);
      setMessage(status === 'approved' ? 'Ocorrência aprovada.' : 'Ocorrência rejeitada.');
      await loadReports();
    } catch {
      setErrorMessage('Não foi possível revisar a ocorrência.');
    }
  };

  if (!currentUser) {
    return (
      <main className="admin-page">
        <section className="login-panel">
          <div className="copy">
            <p className="kicker">Gestão operacional</p>
            <h1>Painel Vigia</h1>
            <p>Área para acompanhar ocorrências simuladas, revisar índices e validar o cenário demonstrativo do MVP.</p>
            <small>Usuário inicial: admin@asal.local · senha: admin123</small>
          </div>

          <form onSubmit={submit} className="login-form">
            <label>
              E-mail institucional
              <input
                name="email"
                type="email"
                value={credentials.email}
                onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@asal.local"
                autoComplete="username"
                required
              />
            </label>
            <label>
              Senha
              <input
                name="password"
                type="password"
                value={credentials.password}
                onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" disabled={isLoading}>{isLoading ? 'Entrando...' : 'Entrar'}</button>

            {errorMessage ? <p className="form-message error">{errorMessage}</p> : null}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="dashboard-heading">
        <div>
          <p className="kicker">Gestão operacional</p>
          <h1>Painel de ocorrências</h1>
          <p>{currentUser.email} · perfil {currentUser.role}</p>
        </div>
        <div className="dashboard-actions">
          <button type="button" className="publish-button" onClick={() => loadAdminArea()}>Atualizar painel</button>
          <button type="button" className="secondary-button" onClick={logout}>Sair</button>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Indicadores administrativos">
        <article>
          <strong>{dashboard?.pendingReports ?? 0}</strong>
          <span>ocorrências pendentes</span>
        </article>
        <article>
          <strong>{dashboard?.approvedReports ?? 0}</strong>
          <span>aprovados</span>
        </article>
        <article>
          <strong>{dashboard?.rejectedReports ?? 0}</strong>
          <span>rejeitados</span>
        </article>
        <article>
          <strong>{dashboard?.totalNeighborhoods ?? 0}</strong>
          <span>bairros</span>
        </article>
      </section>

      {message ? <p className="form-message success global-message">{message}</p> : null}
      {errorMessage ? <p className="form-message error global-message">{errorMessage}</p> : null}

      <section className="review-board">
        <header>
          <div>
            <p className="kicker">Ocorrências</p>
            <h2>Fila de validação</h2>
          </div>
          <label>
            Status
            <select value={selectedStatus} onChange={(event) => loadReports(event.target.value)}>
              <option value="pending_review">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
            </select>
          </label>
        </header>

        <div className="report-list">
          {reports.map((report) => (
            <article key={report.id}>
              <div>
                <strong>{reportTypeLabel(report.reportType)}</strong>
                <span>{report.neighborhood ?? 'Bairro não informado'} · {new Date(report.createdAt).toLocaleString('pt-BR')}</span>
                <p>{report.description || 'Ocorrência sem descrição.'}</p>
              </div>
              {report.status === 'pending_review' ? (
                <div className="report-actions">
                  <button type="button" onClick={() => review(report, 'approved')}>Aprovar</button>
                  <button type="button" className="danger-button" onClick={() => review(report, 'rejected')}>Rejeitar</button>
                </div>
              ) : (
                <mark>{report.status}</mark>
              )}
            </article>
          ))}
          {reports.length === 0 ? <p className="empty-state">Nenhuma ocorrência encontrada para este filtro.</p> : null}
        </div>
      </section>
    </main>
  );
}

function reportTypeLabel(reportType: string) {
  return {
    preco_alto: 'Roubo registrado',
    falta_alimento: 'Furto registrado',
    feira_fechada: 'Patrulhamento reduzido',
    baixa_qualidade: 'Conflito urbano',
    ponto_saudavel: 'Ação preventiva'
  }[reportType] ?? reportType;
}
