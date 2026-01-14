import React, { useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/ui/Sidebar";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/auth-callback";
import ProjectManagement from './pages/project-management';
import VideoCallInterface from './pages/video-call-interface';
// Import Supabase versions
import TaskManagementCenter from './pages/task-management-center/IndexSupabase';
import ExecutiveDashboard from './pages/executive-dashboard/IndexSupabase';
import InteractiveKanbanBoard from './pages/interactive-kanban-board/IndexSupabase';
import TeamCommunicationHub from './pages/team-communication-hub';
import UserSettingsProfile from './pages/user-settings-profile';
import AuditLogActivityTracking from './pages/audit-log-activity-tracking/IndexSupabase';
import MemberFocusedView from './pages/member-focused-view';
import MemberPersonalDashboard from './pages/member-personal-dashboard/IndexSupabase';
import UserManagement from './pages/user-management/IndexSupabase';
import AcceptInvitation from './pages/accept-invitation';
import AuthenticationLoginPortal from './pages/authentication-login-portal';
import { updateLastActivity } from './lib/supabase';

const MainLayout = ({ children, currentRole, onRoleChange }) => (
  <div className="flex">
    <Sidebar currentRole={currentRole} onRoleChange={onRoleChange} />
    <main className="flex-1">
      {children}
    </main>
  </div>
);

const Routes = ({ currentRole, onRoleChange }) => {
  useEffect(() => {
    // Track user activity for session management
    const handleActivity = () => updateLastActivity();
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public routes */}
          <Route path="/" element={<AuthenticationLoginPortal onRoleChange={onRoleChange} />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          
          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout currentRole={currentRole} onRoleChange={onRoleChange}>
                  <RouterRoutes>
                    <Route path="/projects" element={<ProjectManagement />} />
                    <Route path="/video-call-interface" element={<VideoCallInterface />} />
                    <Route path="/task-management-center" element={<TaskManagementCenter />} />
                    <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                    <Route path="/interactive-kanban-board" element={<InteractiveKanbanBoard />} />
                    <Route path="/team-communication-hub" element={<TeamCommunicationHub />} />
                    <Route path="/user-settings-profile" element={<UserSettingsProfile />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/audit-log-activity-tracking" element={<AuditLogActivityTracking />} />
                    <Route path="/member-focused-view" element={<MemberFocusedView />} />
                    <Route path="/member-personal-dashboard" element={<MemberPersonalDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </RouterRoutes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;