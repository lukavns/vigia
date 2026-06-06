import type {
  AdminCommunityReport,
  AdminDashboard,
  AdminUser,
  IncidentPoint,
  MappingPriority,
  Neighborhood,
  Overview,
  PublicCommunityReport
} from './types';

const publicBaseUrl = '/api';
const adminBaseUrl = '/api/admin';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const publicApi = {
  overview: () => request<Overview>(`${publicBaseUrl}/overview`),
  neighborhoods: () => request<Neighborhood[]>(`${publicBaseUrl}/neighborhoods`),
  incidentPoints: () => request<IncidentPoint[]>(`${publicBaseUrl}/incidents`),
  pointReports: (pointId: string) =>
    request<PublicCommunityReport[]>(`${publicBaseUrl}/incidents/${pointId}/reports`),
  mappingPriorities: () => request<MappingPriority[]>(`${publicBaseUrl}/mapping-priorities`)
};

export const adminApi = {
  me: (token: string) =>
    request<AdminUser>(`${adminBaseUrl}/auth/me`, {
      headers: authHeaders(token)
    }),
  dashboard: (token: string) =>
    request<AdminDashboard>(`${adminBaseUrl}/dashboard`, {
      headers: authHeaders(token)
    }),
  reports: (token: string, status = 'pending_review') =>
    request<AdminCommunityReport[]>(`${adminBaseUrl}/reports?status=${status}`, {
      headers: authHeaders(token)
    }),
  reviewReport: (token: string, reportId: string, status: 'approved' | 'rejected', notes = '') =>
    request<void>(`${adminBaseUrl}/reports/${reportId}/review`, {
      method: 'POST',
      headers: {
        ...authHeaders(token),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    })
};

function authHeaders(token: string) {
  return {
    Authorization: `Basic ${token}`
  };
}
