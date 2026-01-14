import React, { useState, useEffect } from 'react';
import { supabase, getSession, getUserPrimaryRole } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ActivityIndicator from '../../components/ui/ActivityIndicator';

const UserManagementSupabase = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'contributor',
    projectId: '',
  });
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      const role = await getUserPrimaryRole(session.user.id);
      setIsAdmin(role === 'owner' || role === 'admin');

      if (role !== 'owner' && role !== 'admin') {
        return;
      }

      // Load all users in organization
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (userError) throw userError;
      setUsers(userData || []);

      // Load projects for invitation
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_members')
        .select('projects(id, name)')
        .eq('user_id', session.user.id);

      if (projectsError) throw projectsError;
      setProjects(projectsData?.map(pm => pm.projects).filter(Boolean) || []);

      // Load pending invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('user_invitations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!invitationsError) {
        setInvitations(invitationsData || []);
      }
    } catch (error) {
      console.error('Failed to initialize page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();

    if (!inviteForm.email || !inviteForm.projectId) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const session = await getSession();
      if (!session) return;

      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Insert invitation
      const { data: invitation, error } = await supabase
        .from('user_invitations')
        .insert({
          email: inviteForm.email,
          role: inviteForm.role,
          project_id: inviteForm.projectId,
          invited_by: session.user.id,
          token,
          expires_at: expiresAt.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // TODO: Send email invitation (integrate with email service)
      const invitationLink = `${window.location.origin}/accept-invitation?token=${token}`;
      console.log('Invitation link:', invitationLink);

      alert(`Invitation sent to ${inviteForm.email}!\n\nInvitation Link:\n${invitationLink}`);

      setShowInviteModal(false);
      setInviteForm({ email: '', role: 'contributor', projectId: '' });
      initializePage();
    } catch (error) {
      console.error('Failed to send invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleRevokeInvitation = async (invitationId) => {
    if (!confirm('Revoke this invitation?')) return;

    try {
      const { error } = await supabase
        .from('user_invitations')
        .update({ status: 'revoked' })
        .eq('id', invitationId);

      if (error) throw error;

      initializePage();
    } catch (error) {
      console.error('Failed to revoke invitation:', error);
      alert('Failed to revoke invitation');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    if (userId === currentUserId) {
      alert('You cannot change your own role');
      return;
    }

    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      // Get user's project memberships
      const { data: memberships, error: fetchError } = await supabase
        .from('project_members')
        .select('*')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      // Update all project memberships
      for (const membership of memberships) {
        const { error: updateError } = await supabase
          .from('project_members')
          .update({ role: newRole })
          .eq('id', membership.id);

        if (updateError) throw updateError;
      }

      alert('User role updated successfully');
      initializePage();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update user role');
    }
  };

  const handleRemoveUser = async (userId) => {
    if (userId === currentUserId) {
      alert('You cannot remove yourself');
      return;
    }

    if (!confirm('Remove this user? Their tasks will be unassigned.')) return;

    try {
      // Unassign all tasks
      const { error: unassignError } = await supabase
        .from('tasks')
        .update({ assignee_id: null })
        .eq('assignee_id', userId);

      if (unassignError) throw unassignError;

      // Remove from all projects
      const { error: removeError } = await supabase
        .from('project_members')
        .delete()
        .eq('user_id', userId);

      if (removeError) throw removeError;

      // Note: We don't delete the user record itself
      // Just remove their project memberships

      alert('User removed successfully');
      initializePage();
    } catch (error) {
      console.error('Failed to remove user:', error);
      alert('Failed to remove user');
    }
  };

  if (!isAdmin && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Lock" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You need admin privileges to manage users
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, roles, and invitations
            </p>
          </div>
          <Button
            onClick={() => setShowInviteModal(true)}
            leftIcon={<Icon name="UserPlus" size={18} />}
          >
            Invite User
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Pending Invitations
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Expires
                    </th>
                    <th className="text-left p-4 text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invitations.map((inv) => (
                    <tr key={inv.id}>
                      <td className="p-4 text-sm text-foreground">{inv.email}</td>
                      <td className="p-4 text-sm text-foreground">{inv.role}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(inv.expires_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRevokeInvitation(inv.id)}
                        >
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            All Users ({users.length})
          </h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    User
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Role
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Last Active
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="User" size={20} />
                          </div>
                        )}
                        <span className="font-medium text-foreground">
                          {user.full_name || 'Unnamed User'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-foreground">{user.email}</td>
                    <td className="p-4">
                      <select
                        className="px-2 py-1 bg-background border border-border rounded text-sm"
                        defaultValue="contributor"
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        disabled={user.id === currentUserId}
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="contributor">Contributor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.last_active_at
                        ? new Date(user.last_active_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveUser(user.id)}
                        disabled={user.id === currentUserId}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-elevation-3 max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-heading font-bold text-foreground">
                Invite User
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="p-6 space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                required
              />

              <Select
                label="Role"
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'contributor', label: 'Contributor' },
                  { value: 'viewer', label: 'Viewer' },
                ]}
              />

              <Select
                label="Project"
                value={inviteForm.projectId}
                onChange={(e) => setInviteForm({ ...inviteForm, projectId: e.target.value })}
                options={[
                  { value: '', label: 'Select a project' },
                  ...projects.map(p => ({ value: p.id, label: p.name }))
                ]}
                required
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" fullWidth>
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementSupabase;
