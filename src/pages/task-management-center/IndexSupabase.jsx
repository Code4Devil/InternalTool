import React, { useState, useEffect } from 'react';
import { supabase, getSession, canEditTask, canDeleteTask } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import CreateTaskModal from '../../components/CreateTaskModal';
import EditTaskModal from '../../components/EditTaskModal';
import CommentsSection from '../../components/CommentsSection';
import FileUploadComponent from '../../components/FileUploadComponent';
import TimeTrackingModal from '../../components/TimeTrackingModal';

const TaskManagementCenterSupabase = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(null);
  const [filters, setFilters] = useState({
    project: 'all',
    status: 'all',
    priority: 'all',
    assignee: 'all',
  });

  useEffect(() => {
    initializePage();
    subscribeToTasks();

    return () => {
      // Cleanup subscriptions
    };
  }, [filters]);

  const initializePage = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      // Load user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_members')
        .select('project_id, projects(id, name)')
        .eq('user_id', session.user.id);

      if (projectsError) throw projectsError;

      const userProjects = projectsData?.map(pm => pm.projects).filter(Boolean) || [];
      setProjects(userProjects);

      // Load all users in user's projects
      const projectIds = userProjects.map(p => p.id);
      if (projectIds.length > 0) {
        const { data: membersData, error: membersError } = await supabase
          .from('project_members')
          .select('users(id, full_name, email, avatar_url)')
          .in('project_id', projectIds);

        if (membersError) throw membersError;

        const allUsers = membersData
          ?.map(m => m.users)
          .filter((user, index, self) => 
            user && self.findIndex(u => u?.id === user.id) === index
          ) || [];
        setUsers(allUsers);
      }

      // Load tasks
      await loadTasks();
    } catch (error) {
      console.error('Failed to initialize page:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects(id, name),
          assignee:users!tasks_assignee_id_fkey(id, full_name, email, avatar_url),
          creator:users!tasks_creator_id_fkey(id, full_name)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.project !== 'all') {
        query = query.eq('project_id', filters.project);
      } else {
        const projectIds = projects.map(p => p.id);
        if (projectIds.length > 0) {
          query = query.in('project_id', projectIds);
        }
      }

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      if (filters.assignee === 'unassigned') {
        query = query.is('assignee_id', null);
      } else if (filters.assignee !== 'all') {
        query = query.eq('assignee_id', filters.assignee);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const subscribeToTasks = () => {
    const channel = supabase
      .channel('task-management-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, (payload) => {
        loadTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task? This cannot be undone.')) return;

    try {
      const hasPermission = await canDeleteTask(currentUserId, taskId);
      if (!hasPermission) {
        alert('You do not have permission to delete this task');
        return;
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-blue-600 bg-blue-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-orange-600 bg-orange-50',
      critical: 'text-red-600 bg-red-50',
    };
    return colors[priority] || colors.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      backlog: 'text-gray-600 bg-gray-50',
      todo: 'text-blue-600 bg-blue-50',
      in_progress: 'text-yellow-600 bg-yellow-50',
      review: 'text-purple-600 bg-purple-50',
      done: 'text-green-600 bg-green-50',
    };
    return colors[status] || colors.todo;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          leftIcon={<Icon name="Plus" size={18} />}
        >
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="border-b border-border p-4 flex gap-3">
        <select
          value={filters.project}
          onChange={(e) => setFilters({ ...filters, project: e.target.value })}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="backlog">Backlog</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={filters.assignee}
          onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
          className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
        >
          <option value="all">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
          ))}
        </select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ project: 'all', status: 'all', priority: 'all', assignee: 'all' })}
        >
          Clear Filters
        </Button>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-smooth ${
                  selectedTask?.id === task.id ? 'border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      {task.projects && (
                        <span className="text-xs text-muted-foreground">
                          {task.projects.name}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-xs text-muted-foreground">
                          Assigned to: {task.assignee.full_name}
                        </span>
                      )}
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Package" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tasks found</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Details Panel */}
        {selectedTask && (
          <div className="w-96 border-l border-border overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
              <h2 className="font-semibold text-foreground">Task Details</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingTask(selectedTask.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="Edit" size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTask(selectedTask.id)}
                  className="text-muted-foreground hover:text-error"
                >
                  <Icon name="Trash" size={18} />
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {selectedTask.title}
                </h3>
                {selectedTask.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedTask.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
                {selectedTask.assignee && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assignee</span>
                    <span className="text-sm text-foreground">{selectedTask.assignee.full_name}</span>
                  </div>
                )}
                {selectedTask.due_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span className="text-sm text-foreground">
                      {new Date(selectedTask.due_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {selectedTask.estimated_hours && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated</span>
                    <span className="text-sm text-foreground">{selectedTask.estimated_hours}h</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground">Time Tracking</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowTimeModal(selectedTask.id)}
                  >
                    Log Time
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Logged: {selectedTask.actual_hours || 0}h
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Attachments</h4>
                <FileUploadComponent
                  taskId={selectedTask.id}
                  projectId={selectedTask.project_id}
                  onUploadComplete={loadTasks}
                />
              </div>

              <CommentsSection
                taskId={selectedTask.id}
                projectId={selectedTask.project_id}
              />
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadTasks();
          }}
        />
      )}

      {editingTask && (
        <EditTaskModal
          taskId={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={() => {
            setEditingTask(null);
            loadTasks();
          }}
        />
      )}

      {showTimeModal && (
        <TimeTrackingModal
          taskId={showTimeModal}
          onClose={() => setShowTimeModal(null)}
          onSave={() => {
            setShowTimeModal(null);
            loadTasks();
          }}
        />
      )}
    </div>
  );
};

export default TaskManagementCenterSupabase;
