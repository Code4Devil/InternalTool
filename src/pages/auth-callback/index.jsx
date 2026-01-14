import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, upsertUserProfile, getUserPrimaryRole } from '../../lib/supabase';
import ActivityIndicator from '../../components/ui/ActivityIndicator';

/**
 * OAuth callback handler page
 * Processes OAuth authentication and redirects based on user role
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Get the session from the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        // Create or update user profile
        await upsertUserProfile(session.user.id, {
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          avatar_url: session.user.user_metadata?.avatar_url || '',
        });

        // Get user's primary role
        const primaryRole = await getUserPrimaryRole(session.user.id);

        // Redirect based on role
        if (primaryRole === 'owner' || primaryRole === 'admin') {
          navigate('/executive-dashboard', { replace: true });
        } else {
          navigate('/member-focused-view', { replace: true });
        }
      } else {
        // No session, redirect to login
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <ActivityIndicator size="lg" />
      <p className="mt-4 text-muted-foreground">Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;
