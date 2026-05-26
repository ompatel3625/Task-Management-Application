import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../layouts/DashboardLayout';
import dashboardService from '../services/dashboardService';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        dashboardService.getStats(),
        taskService.getTasks({ limit: 5, sortBy: 'updatedAt', order: 'desc' })
      ]);

      setStats(statsResponse.data);
      setRecentTasks(tasksResponse.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const PriorityBadge = ({ priority }) => {
    const colors = {
      low: 'badge badge-success',
      medium: 'badge badge-warning',
      high: 'badge badge-danger'
    };
    return <span className={colors[priority]}>{priority}</span>;
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      in_progress: 'badge badge-primary',
      completed: 'badge badge-success'
    };
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed'
    };
    return <span className={colors[status]}>{labels[status]}</span>;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="card skeleton h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card skeleton h-80"></div>
            <div className="card skeleton h-80"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pieData = [
    { name: 'Completed', value: stats?.overview?.completedTasks || 0, color: '#10b981' },
    { name: 'In Progress', value: stats?.overview?.inProgressTasks || 0, color: '#3b82f6' },
    { name: 'Pending', value: stats?.overview?.pendingTasks || 0, color: '#6b7280' }
  ];

  const priorityData = [
    { name: 'Low', value: stats?.priorityBreakdown?.low || 0 },
    { name: 'Medium', value: stats?.priorityBreakdown?.medium || 0 },
    { name: 'High', value: stats?.priorityBreakdown?.high || 0 }
  ];

  const weeklyData = stats?.weeklyActivity?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    tasks: parseInt(item.count)
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's your task overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value={stats?.overview?.totalTasks || 0}
            icon={ChartBarIcon}
            color="bg-primary-500"
            trend="+12% from last week"
          />
          <StatCard
            title="Completed"
            value={stats?.overview?.completedTasks || 0}
            icon={CheckCircleIcon}
            color="bg-green-500"
          />
          <StatCard
            title="In Progress"
            value={stats?.overview?.inProgressTasks || 0}
            icon={ClockIcon}
            color="bg-blue-500"
          />
          <StatCard
            title="Overdue"
            value={stats?.overview?.overdueTasks || 0}
            icon={ExclamationTriangleIcon}
            color="bg-red-500"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Priority Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Priority Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
            <a href="/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </a>
          </div>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-hover rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{task.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {task.description?.substring(0, 60)}{task.description?.length > 60 ? '...' : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tasks yet. Create your first task!
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
