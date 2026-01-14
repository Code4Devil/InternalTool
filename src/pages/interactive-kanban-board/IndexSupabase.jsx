import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { supabase, getSession, logTaskActivity } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import CreateTaskModal from '../../components/CreateTaskModal';
import EditTaskModal from '../../components/EditTaskModal';
import KanbanColumn from './components/KanbanColumn';
import KanbanCard from './components/KanbanCard';
import BulkOperationsBar from './components/BulkoperationBar';
import CollaborationCursors from './components/CollaborationCursors';

const InteractiveKanbanBoardSupabase = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [wipLimits, setWipLimits] = useState({
    backlog: 999,
    todo: 10,
    in_progress: 5,
    review: 8,
    done: 999,
  });

  const columns = [
    { id: 'backlog', name: 'Backlog', color: '#6B7280' },
    { id: 'todo', name: 'To Do', color: '#3B82F6' },
    { id: 'in_progress', name: 'In Progress', color: '#EAB308' },
    { id: 'review', name: 'Review', color: '#8B5CF6' },
    { id: 'done', name: 'Done', color: '#10B981' },
  ];

  useEffect(() => {
    initializeBoard();
    subscribeToTasks();

    return () => {
      // Cleanup subscriptions
    };
  }, [selectedProject]);

  const initializeBoard = async () => {
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

      // Load tasks
      await loadTasks();
    } catch (error) {
      console.error('Failed to initialize board:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setSyncing(true);
      const session = await getSession();
      if (!session) return;

      let query = supabase
        .from('tasks')
        .select(`
          *,
          projects(id, name),
          assignee:users!tasks_assignee_id_fkey(id, full_name, avatar_url)
        `)
        .order('position', { ascending: true });

      // Filter by project if not "all"
      if (selectedProject !== 'all') {
        query = query.eq('project_id', selectedProject);
      } else {
        // Only show tasks from user's projects
        const projectIds = projects.map(p => p.id);
        if (projectIds.length > 0) {
          query = query.in('project_id', projectIds);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setSyncing(false);
    }
  };

  const subscribeToTasks = () => {
    const channel = supabase
      .channel('kanban-tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          loadTasks();
        } else if (payload.eventType === 'UPDATE') {
          setTasks(prev => prev.map(task =>
            task.id === payload.new.id ? { ...task, ...payload.new } : task
          ));
        } else if (payload.eventType === 'DELETE') {
          setTasks(prev => prev.filter(task => task.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleDragEnd = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Check WIP limit
    const tasksInNewStatus = tasks.filter(t => t.status === newStatus);
    if (tasksInNewStatus.length >= wipLimits[newStatus]) {
      alert(`WIP limit reached for ${newStatus} (${wipLimits[newStatus]})`);
      return;
    }

    // Optimistic update
    const originalStatus = task.status;
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));

    try {
      // Persist to database
      const { error } = await supabase
        .from('tasks')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (error) throw error;

      // Log activity
      await logTaskActivity({
        taskId,
        activityType: 'updated',
        userId: currentUserId,
        details: {
          field: 'status',
          from: originalStatus,
          to: newStatus,
        },
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Revert on error
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: originalStatus } : t
      ));
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  const handleBulkUpdate = async (updates) => {
    try {
      setSyncing(true);
      
      for (const taskId of selectedTasks) {
        const { error } = await supabase
          .from('tasks')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId);

        if (error) throw error;

        // Log each update
        for (const [field, value] of Object.entries(updates)) {
          await logTaskActivity({
            taskId,
            activityType: 'updated',
            userId: currentUserId,
            details: { field, to: value, bulk: true },
          });
        }
      }

      await loadTasks();
      setSelectedTasks([]);
    } catch (error) {
      console.error('Bulk update failed:', error);
      alert('Failed to update tasks. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedTasks.length} tasks? This cannot be undone.`)) return;

    try {
      setSyncing(true);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', selectedTasks);

      if (error) throw error;

      await loadTasks();
      setSelectedTasks([]);
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Failed to delete tasks. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Kanban Board</h1>
            {syncing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ActivityIndicator size="sm" />
                <span>Syncing...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Icon name="Plus" size={18} />}
            >
              New Task
            </Button>
          </div>
        </div>

        {selectedTasks.length > 0 && (
          <BulkOperationsBar
            selectedCount={selectedTasks.length}
            onUpdate={handleBulkUpdate}
            onDelete={handleBulkDelete}
            onCancel={() => setSelectedTasks([])}
          />
        )}

        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full">
            {columns.map(column => {
              const columnTasks = tasks.filter(t => t.status === column.id);
              const wipCount = columnTasks.length;
              const wipLimit = wipLimits[column.id];
              const isOverLimit = wipCount > wipLimit && wipLimit < 999;

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  wipCount={wipCount}
                  wipLimit={wipLimit}
                  isOverLimit={isOverLimit}
                  onDragEnd={handleDragEnd}
                >
                  {columnTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      isSelected={selectedTasks.includes(task.id)}
                      onSelect={() => handleTaskSelect(task.id)}
                      onClick={() => setEditingTask(task.id)}
                    />
                  ))}
                </KanbanColumn>
              );
            })}
          </div>
        </div>

        <CollaborationCursors projectId={selectedProject !== 'all' ? selectedProject : null} />

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
      </div>
    </DndProvider>
  );
};

export default InteractiveKanbanBoardSupabase;
