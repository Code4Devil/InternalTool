import React, { useState, useEffect } from 'react';
import { supabase, getSession } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import MetricsCard from './components/MetricsCard';
import ProjectStatusCard from './components/ProjectStatusCard';
import ActivityFeed from './components/ActivityFeed';
import WorkloadChart from './components/WorkloadChart';
import FilterPanel from './components/FilterPanel';

const ExecutiveDashboardSupabase = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);

  useEffect(() => {
    loadDashboardData();
    subscribeToRealtime();

    return () => {
      // Cleanup subscriptions
    };
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      // Get user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_members')
        .select('project_id, projects(id, name)')
        .eq('user_id', session.user.id);

      if (projectsError) throw projectsError;

      const userProjects = projectsData?.map(pm => pm.projects).filter(Boolean) || [];
      const projectIds = userProjects.map(p => p.id);

      if (projectIds.length === 0) {
        setLoading(false);
        return;
      }

      // Load tasks for metrics
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .in('project_id', projectIds);

      if (tasksError) throw tasksError;

      const allTasks = tasksData || [];
      const now = new Date();
      
      const metricsData = {
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === 'done').length,
        inProgressTasks: allTasks.filter(t => t.status === 'in_progress').length,
        overdueTasks: allTasks.filter(t => 
          t.due_date && new Date(t.due_date) < now && t.status !== 'done'
        ).length,
      };
      metricsData.completionRate = metricsData.totalTasks > 0
        ? Math.round((metricsData.completedTasks / metricsData.totalTasks) * 100)
        : 0;

      setMetrics(metricsData);

      // Load project status
      const projectsWithStats = await Promise.all(
        userProjects.map(async (project) => {
          const { data: projectTasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', project.id);

          const tasks = projectTasks || [];
          const completed = tasks.filter(t => t.status === 'done').length;
          const total = tasks.length;

          return {
            ...project,
            totalTasks: total,
            completedTasks: completed,
            progress: total > 0 ? Math.round((completed / total) * 100) : 0,
            status: completed === total ? 'completed' : total > 0 ? 'active' : 'planning',
          };
        })
      );

      setProjects(projectsWithStats);

      // Load recent activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('task_activity')
        .select(`
          *,
          users(full_name, avatar_url),
          tasks(title, project_id)
        `)
        .in('tasks.project_id', projectIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!activitiesError) {
        setActivities(activitiesData || []);
      }

      // Generate workload data
      const dateLimit = new Date();
      if (dateRange === '7d') dateLimit.setDate(dateLimit.getDate() - 7);
      else if (dateRange === '30d') dateLimit.setDate(dateLimit.getDate() - 30);
      else if (dateRange === '90d') dateLimit.setDate(dateLimit.getDate() - 90);

      const workload = {};
      allTasks.forEach(task => {
        const date = new Date(task.created_at).toLocaleDateString();
        if (!workload[date]) {
          workload[date] = { date, created: 0, completed: 0 };
        }
        workload[date].created++;
        if (task.status === 'done' && task.updated_at) {
          const completedDate = new Date(task.updated_at).toLocaleDateString();
          if (!workload[completedDate]) {
            workload[completedDate] = { date: completedDate, created: 0, completed: 0 };
          }
          workload[completedDate].completed++;
        }
      });

      setWorkloadData(Object.values(workload).slice(-14));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, () => {
        loadDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-y-auto">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Executive Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of all projects and team performance
            </p>
          </div>
          <FilterPanel dateRange={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Tasks"
            value={metrics.totalTasks}
            icon="Package"
            color="blue"
          />
          <MetricsCard
            title="Completed"
            value={metrics.completedTasks}
            subtitle={`${metrics.completionRate}% completion rate`}
            icon="CheckCircle"
            color="green"
          />
          <MetricsCard
            title="In Progress"
            value={metrics.inProgressTasks}
            icon="Clock"
            color="yellow"
          />
          <MetricsCard
            title="Overdue"
            value={metrics.overdueTasks}
            icon="AlertCircle"
            color="red"
          />
        </div>

        {/* Workload Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Workload Trend
          </h2>
          <WorkloadChart data={workloadData} />
        </div>

        {/* Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Project Status
            </h2>
            <div className="space-y-4">
              {projects.map(project => (
                <ProjectStatusCard key={project.id} project={project} />
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8">
                  <Icon name="Folder" size={48} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No projects found</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboardSupabase;
