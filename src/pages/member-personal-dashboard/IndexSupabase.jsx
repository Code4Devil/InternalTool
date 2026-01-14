import React, { useState, useEffect } from 'react';
import { supabase, getSession } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import ProductivityStatsCard from './components/ProductivityStatsCard';
import TasksOverviewTable from './components/TasksOverviewTable';
import RecentActivityFeed from './components/RecentActivityFeed';
import ProjectNavigationTree from './components/ProjectNavigationTree';
import CreateTaskModal from '../../components/CreateTaskModal';
import EditTaskModal from '../../components/EditTaskModal';

const MemberPersonalDashboardSupabase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadDashboard();
    subscribeToRealtime();

    return () => {
      // Cleanup subscriptions
    };
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      // Load current user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userError) throw userError;
      setCurrentUser(userData || null);

      // Load user's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          projects(id, name),
          creator:users!tasks_creator_id_fkey(full_name)
        `)
        .eq('assignee_id', session.user.id)
        .order('due_date', { ascending: true, nullsFirst: false });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const statsData = {
        totalTasks: tasksData?.length || 0,
        completedTasks: tasksData?.filter(t => t.status === 'done').length || 0,
        inProgressTasks: tasksData?.filter(t => t.status === 'in_progress').length || 0,
        overdueTasks: tasksData?.filter(t => 
          t.due_date && new Date(t.due_date) < now && t.status !== 'done'
        ).length || 0,
        dueTodayTasks: tasksData?.filter(t => 
          t.due_date && new Date(t.due_date).toDateString() === today.toDateString()
        ).length || 0,
        completedThisWeek: tasksData?.filter(t => 
          t.status === 'done' && 
          t.updated_at && 
          new Date(t.updated_at) >= weekAgo
        ).length || 0,
      };

      setStats(statsData);

      // Load user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_members')
        .select(`
          project_id,
          role,
          projects(id, name, description, status)
        `)
        .eq('user_id', session.user.id);

      if (projectsError) throw projectsError;

      const userProjects = projectsData?.map(pm => ({
        ...pm.projects,
        role: pm.role,
      })).filter(Boolean) || [];
      setProjects(userProjects);

      // Load recent activity
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('task_activity')
        .select(`
          *,
          tasks(title, project_id),
          users(full_name)
        `)
        .or(`user_id.eq.${session.user.id},tasks.assignee_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!activitiesError) {
        setActivities(activitiesData || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel('member-dashboard')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, () => {
        loadDashboard();
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
              Welcome back, {currentUser?.full_name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Here's your personal task overview
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            leftIcon={<Icon name="Plus" size={18} />}
          >
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductivityStatsCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon="Package"
            color="blue"
          />
          <ProductivityStatsCard
            title="In Progress"
            value={stats.inProgressTasks}
            subtitle={`${stats.dueTodayTasks} due today`}
            icon="Clock"
            color="yellow"
          />
          <ProductivityStatsCard
            title="Completed This Week"
            value={stats.completedThisWeek}
            subtitle={`${stats.completedTasks} total completed`}
            icon="CheckCircle"
            color="green"
          />
        </div>

        {/* Overdue Alert */}
        {stats.overdueTasks > 0 && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start gap-3">
            <Icon name="AlertCircle" size={24} color="var(--color-error)" />
            <div>
              <h3 className="font-semibold text-error mb-1">
                {stats.overdueTasks} Overdue Task{stats.overdueTasks > 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-error/80">
                You have overdue tasks that need attention
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Table */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  My Tasks
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/task-management-center')}
                >
                  View All
                </Button>
              </div>
              <TasksOverviewTable 
                tasks={tasks} 
                onTaskClick={(task) => setEditingTask(task.id)}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Navigation */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                My Projects
              </h2>
              <ProjectNavigationTree projects={projects} />
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Recent Activity
              </h2>
              <RecentActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadDashboard();
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={() => {
            setEditingTask(null);
            loadDashboard();
          }}
        />
      )}
    </div>
  );
};

export default MemberPersonalDashboardSupabase;
