import React, { useState, useEffect } from 'react';
import { supabase, getSession, logTaskActivity, createNotification, canEditTask } from '../lib/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import ActivityIndicator from './ui/ActivityIndicator';

const EditTaskModal = ({ taskId, onClose, onSave }) => {
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    loadTaskData();
  }, [taskId]);

  const loadTaskData = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      // Check edit permission
      const hasPermission = await canEditTask(session.user.id, taskId);
      setCanEdit(hasPermission);

      // Load task
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`
          *,
          projects(id, name),
          creator:users!tasks_creator_id_fkey(id, full_name),
          assignee:users!tasks_assignee_id_fkey(id, full_name, email)
        `)
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      setTask(taskData);
      setFormData({
        title: taskData.title,
        description: taskData.description || '',
        assignee_id: taskData.assignee_id || '',
        priority: taskData.priority,
        status: taskData.status,
        due_date: taskData.due_date || '',
        estimated_hours: taskData.estimated_hours || '',
        progress: taskData.progress || 0,
      });

      // Load project members
      const { data: membersData, error: membersError } = await supabase
        .from('project_members')
        .select(`
          user_id,
          users(id, full_name, email)
        `)
        .eq('project_id', taskData.project_id);

      if (membersError) throw membersError;

      const membersList = membersData?.map(m => m.users).filter(Boolean) || [];
      setUsers(membersList);

      // Load task tags
      const { data: tagsData, error: tagsError } = await supabase
        .from('task_tags')
        .select('tag_name')
        .eq('task_id', taskId);

      if (tagsError) throw tagsError;

      setFormData(prev => ({
        ...prev,
        tags: tagsData?.map(t => t.tag_name) || []
      }));

      // Available tags
      setTags([
        'Frontend', 'Backend', 'Design', 'Bug', 'Feature',
        'Documentation', 'Testing', 'Security', 'Performance', 'API'
      ]);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag) => {
    const currentTags = formData.tags || [];
    if (currentTags.includes(tag)) {
      setFormData({ ...formData, tags: currentTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...currentTags, tag] });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getChanges = () => {
    const changes = {};
    const originalTags = task.tags || [];
    
    if (formData.title !== task.title) changes.title = { from: task.title, to: formData.title };
    if (formData.description !== (task.description || '')) changes.description = { from: task.description, to: formData.description };
    if (formData.assignee_id !== (task.assignee_id || '')) changes.assignee_id = { from: task.assignee_id, to: formData.assignee_id };
    if (formData.priority !== task.priority) changes.priority = { from: task.priority, to: formData.priority };
    if (formData.status !== task.status) changes.status = { from: task.status, to: formData.status };
    if (formData.due_date !== (task.due_date || '')) changes.due_date = { from: task.due_date, to: formData.due_date };
    if (formData.estimated_hours !== (task.estimated_hours || '')) changes.estimated_hours = { from: task.estimated_hours, to: formData.estimated_hours };
    if (formData.progress !== (task.progress || 0)) changes.progress = { from: task.progress, to: formData.progress };

    return changes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || !canEdit) return;

    try {
      setSubmitting(true);

      const changes = getChanges();

      // Update task
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          title: formData.title,
          description: formData.description || null,
          assignee_id: formData.assignee_id || null,
          priority: formData.priority,
          status: formData.status,
          due_date: formData.due_date || null,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          progress: parseInt(formData.progress),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Update tags
      await supabase.from('task_tags').delete().eq('task_id', taskId);
      if (formData.tags && formData.tags.length > 0) {
        const tagInserts = formData.tags.map(tag => ({
          task_id: taskId,
          tag_name: tag,
        }));
        await supabase.from('task_tags').insert(tagInserts);
      }

      // Log changes
      for (const [field, change] of Object.entries(changes)) {
        await logTaskActivity({
          taskId,
          activityType: 'updated',
          userId: currentUserId,
          details: { field, ...change },
        });
      }

      // Send notification if assignee changed
      if (changes.assignee_id && formData.assignee_id && formData.assignee_id !== currentUserId) {
        await createNotification({
          userId: formData.assignee_id,
          type: 'task_assigned',
          title: 'Task Reassigned',
          message: `You have been assigned to: ${formData.title}`,
          relatedTaskId: taskId,
          relatedProjectId: task.project_id,
        });
      }

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
      setErrors({ submit: error.message || 'Failed to update task' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-elevation-3 p-6 max-w-md">
          <div className="text-center">
            <Icon name="Lock" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Permission Denied</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You don't have permission to edit this task.
            </p>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elevation-3 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Task Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Assignee"
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
              options={[
                { value: '', label: 'Unassigned' },
                ...users.map(u => ({ value: u.id, label: u.full_name || u.email }))
              ]}
            />

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'backlog', label: 'Backlog' },
                { value: 'todo', label: 'To Do' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'review', label: 'Review' },
                { value: 'done', label: 'Done' },
              ]}
            />

            <Input
              label="Estimated Hours"
              type="number"
              step="0.5"
              min="0"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
            />

            <Input
              label="Progress %"
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              error={errors.progress}
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth ${
                    formData.tags?.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="flex items-start space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
              <Icon name="AlertCircle" size={18} color="var(--color-error)" />
              <p className="text-sm text-error flex-1">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              loading={submitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
