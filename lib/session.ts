// Login apenas ilustrativo: o site é estático, então a checagem acontece no
// navegador e não protege nada de verdade.
export const DEMO_EMAIL = 'admin@vigia.local';
export const DEMO_PASSWORD = 'admin123';

const SESSION_KEY = 'vigia:session';

export function signIn(email: string, password: string) {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return false;
  }

  try {
    sessionStorage.setItem(SESSION_KEY, DEMO_EMAIL);
  } catch {
    // sem sessionStorage o login vale só até recarregar
  }

  return true;
}

export function signOut() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // nada a limpar
  }
}

export function currentSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
