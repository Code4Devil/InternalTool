import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getSession, getUserPrimaryRole, hasProjectRole, updateLastActivity } from '../lib/supabase';
import ActivityIndicator from './ui/ActivityIndicator';

/**
 * ProtectedRoute wrapper component to check authentication status
 * Redirects to login if user is not authenticated
 * Optionally checks for required roles
 */
const ProtectedRoute = ({ children, requiredRoles = [], projectId = null }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    
    // Track user activity for session management
    updateLastActivity();
  }, []);

  const checkAuth = async () => {
    try {
      const currentSession = await getSession();
      setSession(currentSession);

      if (currentSession && requiredRoles.length > 0) {
        // Check if user has required roles
        let userHasAccess = false;

        if (projectId) {
          // Check project-specific role
          userHasAccess = await hasProjectRole(currentSession.user.id, projectId, requiredRoles);
        } else {
          // Check global role
          const primaryRole = await getUserPrimaryRole(currentSession.user.id);
          userHasAccess = requiredRoles.includes(primaryRole);
        }

        setHasAccess(userHasAccess);
      } else {
        // No role requirements, allow authenticated users
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setSession(null);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  if (!session) {
    // Redirect to login while preserving the intended destination
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && !hasAccess) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/member-focused-view" state={{ error: 'Insufficient permissions' }} replace />;
  }

  return children;
};

export default ProtectedRoute;
