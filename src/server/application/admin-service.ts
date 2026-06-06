import { neighborhoods } from '@/lib/fixtures';
import { reportService } from './report-service';

const adminEmail = 'admin@asal.local';
const adminPassword = 'admin123';

export const adminService = {
  authenticate(authorization?: string | null) {
    if (!authorization?.startsWith('Basic ')) {
      throw new Error('unauthorized');
    }

    const token = authorization.replace('Basic ', '');
    const [email, password] = Buffer.from(token, 'base64').toString('utf8').split(':');

    if (email !== adminEmail || password !== adminPassword) {
      throw new Error('unauthorized');
    }

    return {
      email,
      role: 'admin'
    };
  },

  dashboard() {
    const metrics = reportService.metrics();

    return {
      ...metrics,
      totalNeighborhoods: neighborhoods.length,
      totalFoodPoints: 12
    };
  }
};
