import React, { useState, useEffect } from 'react';
import { supabase, getSession } from '../../lib/supabase';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';
import ActivityIndicator from './ActivityIndicator';

const BulkOperationsBarSupabase = ({ selectedCount, onUpdate, onDelete, onCancel }) => {
  const [operation, setOperation] = useState('');
  const [operationValue, setOperationValue] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleApply = async () => {
    if (!operation) return;

    setLoading(true);

    try {
      let updates = {};

      switch (operation) {
        case 'status':
          updates = { status: operationValue };
          break;
        case 'priority':
          updates = { priority: operationValue };
          break;
        case 'assignee':
          updates = { assignee_id: operationValue || null };
          break;
        default:
          return;
      }

      await onUpdate(updates);
      setOperation('');
      setOperationValue('');
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary/10 border-y border-primary/20 p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
          <span className="text-sm font-medium text-primary">
            {selectedCount} task{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <select
            value={operation}
            onChange={(e) => {
              setOperation(e.target.value);
              setOperationValue('');
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
          >
            <option value="">Select operation...</option>
            <option value="status">Change Status</option>
            <option value="priority">Change Priority</option>
            <option value="assignee">Change Assignee</option>
          </select>

          {operation === 'status' && (
            <select
              value={operationValue}
              onChange={(e) => setOperationValue(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Select status...</option>
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          )}

          {operation === 'priority' && (
            <select
              value={operationValue}
              onChange={(e) => setOperationValue(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Select priority...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          )}

          {operation === 'assignee' && (
            <select
              value={operationValue}
              onChange={(e) => setOperationValue(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </option>
              ))}
            </select>
          )}

          {operation && (
            <Button
              size="sm"
              onClick={handleApply}
              loading={loading}
              disabled={!operationValue && operation !== 'assignee'}
            >
              Apply
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            leftIcon={<Icon name="Trash" size={16} />}
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsBarSupabase;
