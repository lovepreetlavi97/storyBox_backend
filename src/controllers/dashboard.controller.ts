import { dashboardService } from '../services/index.js';

export const dashboardController = {
  async getStats() {
    const stats = await dashboardService.getStats();
    return {
      success: true,
      data: stats
    };
  }
};
