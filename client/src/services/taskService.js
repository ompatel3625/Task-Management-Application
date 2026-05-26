import api from './api';

const taskService = {
  // Get all tasks with filters
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get overdue tasks
  getOverdueTasks: async () => {
    const response = await api.get('/tasks/overdue/list');
    return response.data;
  },

  // Get tasks due this week
  getTasksDueThisWeek: async () => {
    const response = await api.get('/tasks/due-week/list');
    return response.data;
  },

  // Bulk update task status
  bulkUpdateStatus: async (taskIds, status) => {
    const response = await api.patch('/tasks/bulk/status', {
      taskIds,
      status,
    });
    return response.data;
  },

  // Bulk delete tasks
  bulkDelete: async (taskIds) => {
    const response = await api.delete('/tasks/bulk/delete', {
      data: { taskIds },
    });
    return response.data;
  },
};

export default taskService;
