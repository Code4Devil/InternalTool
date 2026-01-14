import React, { useState, useEffect } from 'react';
import { supabase, getSession } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ActivityIndicator from '../../../components/ui/ActivityIndicator';

const ProjectTeamPanel = ({ project, onClose, onUpdate }) => {
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('contributor');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [project.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      // Load project members
      const { data: membersData, error: membersError } = await supabase
        .from('project_members')
        .select(`
          *,
          users(id, full_name, email, avatar_url)
        `)
        .eq('project_id', project.id)
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;

      setMembers(membersData || []);

      // Load all users (for adding new members)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .order('full_name', { ascending: true });

      if (usersError) throw usersError;

      // Filter out users who are already members
      const memberIds = membersData.map(m => m.user_id);
      setAllUsers((usersData || []).filter(u => !memberIds.includes(u.id)));
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: project.id,
          user_id: selectedUserId,
          role: selectedRole,
          joined_at: new Date().toISOString(),
        });

      if (error) throw error;

      setShowAddMember(false);
      setSelectedUserId('');
      setSelectedRole('contributor');
      loadData();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to add member:', error);
      alert('Failed to add member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const { error } = await supabase
        .from('project_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      loadData();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update role. Please try again.');
    }
  };

  const handleRemoveMember = async (memberId, userId) => {
    if (userId === currentUserId) {
      if (!confirm('Are you sure you want to remove yourself from this project?')) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to remove this member?')) {
        return;
      }
    }

    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      if (userId === currentUserId) {
        // User removed themselves, close modal and refresh
        onClose();
        onUpdate?.();
      } else {
        loadData();
        onUpdate?.();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
      alert('Failed to remove member. Please try again.');
    }
  };

  const roleOptions = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'contributor', label: 'Contributor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  const getRoleBadgeColor = (role) => {
    const colors = {
      owner: 'bg-primary/10 text-primary border-primary/20',
      admin: 'bg-primary/10 text-primary border-primary/20',
      manager: 'bg-secondary/10 text-secondary border-secondary/20',
      contributor: 'bg-success/10 text-success border-success/20',
      viewer: 'bg-muted/10 text-muted-foreground border-muted/20',
    };
    return colors[role] || colors.viewer;
  };

  const currentUserRole = members.find(m => m.user_id === currentUserId)?.role;
  const canManage = ['owner', 'admin'].includes(currentUserRole);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elevation-3 max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">
              Team Members
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {project.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ActivityIndicator size="lg" />
            </div>
          ) : (
            <>
              {/* Add Member Section */}
              {canManage && (
                <div className="bg-muted/30 rounded-lg p-4">
                  {!showAddMember ? (
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => setShowAddMember(true)}
                      className="flex items-center justify-center gap-2"
                    >
                      <Icon name="UserPlus" size={16} />
                      Add Team Member
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Select
                        label="Select User"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        options={[
                          { value: '', label: 'Choose a user...' },
                          ...allUsers.map(u => ({
                            value: u.id,
                            label: `${u.full_name || u.email} (${u.email})`
                          }))
                        ]}
                      />
                      <Select
                        label="Role"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        options={roleOptions}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            setShowAddMember(false);
                            setSelectedUserId('');
                            setSelectedRole('contributor');
                          }}
                          disabled={submitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          fullWidth
                          onClick={handleAddMember}
                          loading={submitting}
                          disabled={!selectedUserId}
                        >
                          Add Member
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Members List */}
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {member.users?.avatar_url ? (
                        <img
                          src={member.users.avatar_url}
                          alt="Avatar"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Icon name="User" size={20} color="var(--color-primary)" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.users?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {member.users?.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {canManage && member.user_id !== currentUserId ? (
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                          className="text-xs px-2 py-1 bg-background border border-border rounded"
                        >
                          {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
                          {member.role}
                        </span>
                      )}
                      {canManage && member.role !== 'owner' && (
                        <button
                          onClick={() => handleRemoveMember(member.id, member.user_id)}
                          className="p-1.5 text-error hover:bg-error/10 rounded transition-smooth"
                        >
                          <Icon name="UserMinus" size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamPanel;
