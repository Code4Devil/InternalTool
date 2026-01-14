import React, { useState } from 'react';
import { supabase, getSession, logTaskActivity } from '../lib/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';
import Input from './ui/Input';

const TimeTrackingModal = ({ taskId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    hours: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.hours || formData.hours <= 0) {
      setError('Please enter valid hours');
      return;
    }

    try {
      setSubmitting(true);
      const session = await getSession();
      if (!session) return;

      // Insert time entry
      const { data: timeEntry, error: timeError } = await supabase
        .from('time_entries')
        .insert({
          task_id: taskId,
          user_id: session.user.id,
          hours: parseFloat(formData.hours),
          description: formData.description || null,
          logged_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (timeError) throw timeError;

      // Get current task total hours
      const { data: allEntries, error: fetchError } = await supabase
        .from('time_entries')
        .select('hours')
        .eq('task_id', taskId);

      if (fetchError) throw fetchError;

      const totalHours = allEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);

      // Update task actual_hours
      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          actual_hours: totalHours,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (updateError) throw updateError;

      // Log activity
      await logTaskActivity({
        taskId,
        activityType: 'time_logged',
        userId: session.user.id,
        details: {
          hours: formData.hours,
          description: formData.description,
          total_hours: totalHours,
        },
      });

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Failed to log time:', error);
      setError(error.message || 'Failed to log time');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elevation-3 max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Log Time
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
            label="Hours"
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What did you work on?"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
            />
          </div>

          {error && (
            <div className="flex items-start space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg">
              <Icon name="AlertCircle" size={18} color="var(--color-error)" />
              <p className="text-sm text-error flex-1">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
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
              Log Time
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeTrackingModal;
