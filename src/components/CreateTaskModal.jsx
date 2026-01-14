import React, { useState, useEffect } from 'react';
import { supabase, getSession, logTaskActivity, createNotification } from '../lib/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import ActivityIndicator from './ui/ActivityIndicator';

const CreateTaskModal = ({ onClose, onCreate, projectId = null }) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projectId || '',
    assignee_id: '',
    priority: 'medium',
    status: 'todo',
    due_date: '',
    estimated_hours: '',
    tags: [],
  });
  const [errors, setErrors] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      // Load user's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          project_members!inner(user_id)
        `)
        .eq('project_members.user_id', session.user.id)
        .eq('status', 'active')
        .order('name');

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // If projectId is provided, load project members
      if (projectId || formData.project_id) {
        loadProjectMembers(projectId || formData.project_id);
      }

      // Load available tags (could be from a tags table or predefined)
      setTags([
        'Frontend',
        'Backend',
        'Design',
        'Bug',
        'Feature',
        'Documentation',
        'Testing',
        'Security',
        'Performance',
        'API',
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectMembers = async (selectedProjectId) => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          user_id,
          users(id, full_name, email, avatar_url)
        `)
        .eq('project_id', selectedProjectId);

      if (error) throw error;

      const membersList = data?.map(m => m.users).filter(Boolean) || [];
      setUsers(membersList);
    } catch (error) {
      console.error('Failed to load project members:', error);
    }
  };

  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    setFormData({ ...formData, project_id: selectedProjectId, assignee_id: '' });
    if (selectedProjectId) {
      loadProjectMembers(selectedProjectId);
    } else {
      setUsers([]);
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

    if (!formData.project_id) {
      newErrors.project_id = 'Please select a project';
    }

    if (formData.estimated_hours && (isNaN(formData.estimated_hours) || formData.estimated_hours < 0)) {
      newErrors.estimated_hours = 'Enter a valid number of hours';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      // Create task
      const { data: newTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: formData.title,
          description: formData.description || null,
          project_id: formData.project_id,
          creator_id: currentUserId,
          assignee_id: formData.assignee_id || null,
          priority: formData.priority,
          status: formData.status,
          due_date: formData.due_date || null,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (taskError) throw taskError;

      // Add tags if any
      if (formData.tags && formData.tags.length > 0) {
        const tagInserts = formData.tags.map(tag => ({
          task_id: newTask.id,
          tag_name: tag,
        }));

        await supabase.from('task_tags').insert(tagInserts);
      }

      // Log activity
      await logTaskActivity({
        taskId: newTask.id,
        activityType: 'created',
        userId: currentUserId,
        details: {
          title: formData.title,
          project_id: formData.project_id,
        },
      });

      // Send notification to assignee if assigned
      if (formData.assignee_id && formData.assignee_id !== currentUserId) {
        await createNotification({
          userId: formData.assignee_id,
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: `You have been assigned to: ${formData.title}`,
          relatedTaskId: newTask.id,
          relatedProjectId: formData.project_id,
        });
      }

      onCreate?.(newTask);
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      setErrors({ submit: error.message || 'Failed to create task' });
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elevation-3 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Create New Task
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
            placeholder="Enter task title"
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description (optional)"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Project"
              value={formData.project_id}
              onChange={handleProjectChange}
              error={errors.project_id}
              options={[
                { value: '', label: 'Select a project' },
                ...projects.map(p => ({ value: p.id, label: p.name }))
              ]}
              required
            />

            <Select
              label="Assignee"
              value={formData.assignee_id}
              onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
              options={[
                { value: '', label: 'Unassigned' },
                ...users.map(u => ({ value: u.id, label: u.full_name || u.email }))
              ]}
              disabled={!formData.project_id}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              error={errors.estimated_hours}
              placeholder="0"
            />
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />

          {/* Tags */}
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
                    formData.tags.includes(tag)
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
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
