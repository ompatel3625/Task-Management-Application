import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get productivity metrics
  getProductivity: async () => {
    const response = await api.get('/dashboard/productivity');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit = 10) => {
    const response = await api.get(`/dashboard/activity?limit=${limit}`);
    return response.data;
  },

  // Get upcoming deadlines
  getUpcomingDeadlines: async () => {
    const response = await api.get('/dashboard/deadlines');
    return response.data;
  },
};

export default dashboardService;
