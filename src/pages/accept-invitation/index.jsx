import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, upsertUserProfile } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ActivityIndicator from '../../components/ui/ActivityIndicator';

/**
 * Accept Invitation Page
 * Handles user invitation acceptance and account creation
 */
const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      setLoading(true);

      // Fetch invitation details
      const { data, error } = await supabase
        .from('user_invitations')
        .select(`
          *,
          projects(id, name),
          invited_by_user:users!user_invitations_invited_by_fkey(full_name)
        `)
        .eq('token', token)
        .single();

      if (error) throw error;

      if (!data) {
        setError('Invitation not found');
        return;
      }

      if (data.status !== 'pending') {
        setError(`This invitation has been ${data.status}`);
        return;
      }

      const expiresAt = new Date(data.expires_at);
      if (expiresAt < new Date()) {
        setError('This invitation has expired');
        return;
      }

      setInvitation(data);
    } catch (error) {
      console.error('Failed to load invitation:', error);
      setError('Failed to load invitation. Please check the link and try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAccept = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: invitation.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create user profile
      await upsertUserProfile(authData.user.id, {
        email: invitation.email,
        full_name: formData.fullName,
        avatar_url: '',
      });

      // Add user to project with specified role
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: invitation.project_id,
          user_id: authData.user.id,
          role: invitation.role,
          joined_at: new Date().toISOString(),
        });

      if (memberError) throw memberError;

      // Mark invitation as accepted
      const { error: updateError } = await supabase
        .from('user_invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      // Redirect to login
      navigate('/', { 
        state: { 
          message: 'Account created successfully! Please log in with your credentials.' 
        } 
      });
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-elevation-3 p-8 text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertCircle" size={32} className="text-error" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Invalid Invitation
          </h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-elevation-3 p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            You're Invited!
          </h2>
          <p className="text-muted-foreground">
            {invitation?.invited_by_user?.full_name} has invited you to join{' '}
            <span className="font-semibold text-foreground">
              {invitation?.projects?.name}
            </span>
          </p>
        </div>

        <form onSubmit={handleAccept} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <Input
              type="email"
              value={invitation?.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Role
            </label>
            <Input
              type="text"
              value={invitation?.role}
              disabled
              className="bg-muted capitalize"
            />
          </div>

          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={validationErrors.fullName}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={validationErrors.password}
            placeholder="Create a password (min 8 characters)"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            error={validationErrors.confirmPassword}
            placeholder="Confirm your password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <ActivityIndicator size="sm" className="mr-2" />
                Creating Account...
              </>
            ) : (
              'Accept Invitation & Create Account'
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          By accepting, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AcceptInvitation;
