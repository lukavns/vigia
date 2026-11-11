'use client';

import { useEffect, useState } from 'react';
import { neighborhoodName, neighborhoods } from '../../lib/data';
import { reportStatusLabels, reportTypeLabels } from '../../lib/labels';
import { useReports } from '../../lib/reports';
import { currentSession, DEMO_EMAIL, DEMO_PASSWORD, signIn, signOut } from '../../lib/session';
import type { ReportStatus } from '../../lib/types';

const statusTabs: { status: ReportStatus; label: string }[] = [
  { status: 'pending', label: 'Pendentes' },
  { status: 'approved', label: 'Aprovadas' },
  { status: 'rejected', label: 'Rejeitadas' }
];

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Maceio'
});

export function AdminPanel() {
  const { reports, setStatus, reset } = useReports();
  // undefined enquanto a sessão ainda não foi lida do sessionStorage
  const [user, setUser] = useState<string | null | undefined>(undefined);
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<ReportStatus>('pending');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setUser(currentSession());
  }, []);

  const count = (status: ReportStatus) => reports.filter((report) => report.status === status).length;
  const visibleReports = reports.filter((report) => report.status === tab);

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signIn(email, password)) {
      setLoginError('E-mail ou senha incorretos.');
      return;
    }

    setLoginError('');
    setUser(DEMO_EMAIL);
  };

  const logout = () => {
    signOut();
    setUser(null);
    setNotice('');
  };

  const review = (id: string, status: ReportStatus) => {
    setStatus(id, status);
    setNotice({
      approved: 'Ocorrência aprovada.',
      rejected: 'Ocorrência rejeitada.',
      pending: 'Ocorrência devolvida para a fila.'
    }[status]);
  };

  const restore = () => {
    reset();
    setTab('pending');
    setNotice('Dados de exemplo restaurados.');
  };

  if (user === undefined) {
    return <main className="page admin-page" />;
  }

  if (!user) {
    return (
      <main className="page admin-page">
        <section className="panel login-panel">
          <div className="login-copy">
            <p className="kicker">Gestão operacional</p>
            <h1>Painel Vigia</h1>
            <p>Área para acompanhar ocorrências simuladas e validar o cenário demonstrativo.</p>
            <p className="demo-hint">
              Acesso de demonstração: <code>{DEMO_EMAIL}</code> · senha <code>{DEMO_PASSWORD}</code>
            </p>
          </div>

          <form onSubmit={login} className="login-form">
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={DEMO_EMAIL}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            <button type="submit" className="button">Entrar</button>

            {loginError ? <p className="message error" role="alert">{loginError}</p> : null}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page admin-page">
      <section className="page-heading">
        <div>
          <p className="kicker">Gestão operacional</p>
          <h1>Painel de ocorrências</h1>
          <p>Conectado como {user}. As revisões ficam salvas apenas neste navegador.</p>
        </div>
        <div className="heading-actions">
          <button type="button" className="button secondary" onClick={restore}>Restaurar exemplo</button>
          <button type="button" className="button secondary" onClick={logout}>Sair</button>
        </div>
      </section>

      <section className="summary-grid" aria-label="Indicadores da fila">
        <article>
          <strong>{count('pending')}</strong>
          <span>pendentes</span>
        </article>
        <article>
          <strong>{count('approved')}</strong>
          <span>aprovadas</span>
        </article>
        <article>
          <strong>{count('rejected')}</strong>
          <span>rejeitadas</span>
        </article>
        <article>
          <strong>{neighborhoods.length}</strong>
          <span>bairros monitorados</span>
        </article>
      </section>

      <section className="panel review-board">
        <header>
          <div>
            <p className="kicker">Ocorrências</p>
            <h2>Fila de validação</h2>
          </div>

          <div className="tabs" role="tablist" aria-label="Status das ocorrências">
            {statusTabs.map((item) => (
              <button
                key={item.status}
                type="button"
                role="tab"
                aria-selected={tab === item.status}
                onClick={() => setTab(item.status)}
              >
                {item.label} <span>{count(item.status)}</span>
              </button>
            ))}
          </div>
        </header>

        {notice ? <p className="message success" role="status">{notice}</p> : null}

        {visibleReports.length === 0 ? (
          <p className="empty-state">Nenhuma ocorrência com esse status.</p>
        ) : (
          <ul className="report-list">
            {visibleReports.map((report) => (
              <li key={report.id}>
                <div>
                  <strong>{reportTypeLabels[report.type]}</strong>
                  <span>
                    {neighborhoodName(report.neighborhoodId)} · {dateFormat.format(new Date(report.createdAt))}
                  </span>
                  <p>{report.description}</p>
                </div>

                {report.status === 'pending' ? (
                  <div className="report-actions">
                    <button type="button" className="button" onClick={() => review(report.id, 'approved')}>Aprovar</button>
                    <button type="button" className="button danger" onClick={() => review(report.id, 'rejected')}>Rejeitar</button>
                  </div>
                ) : (
                  <div className="report-actions">
                    <span className={`status-badge ${report.status}`}>{reportStatusLabels[report.status]}</span>
                    <button type="button" className="button secondary" onClick={() => review(report.id, 'pending')}>Reabrir</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
