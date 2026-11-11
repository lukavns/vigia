import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page not-found">
      <p className="kicker">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p>O endereço pode ter mudado ou nunca existiu.</p>
      <Link className="button" href="/">Voltar para o início</Link>
    </main>
  );
}
