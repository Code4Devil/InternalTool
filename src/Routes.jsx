import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import Sidebar from "./components/ui/Sidebar";
import NotFound from "./pages/NotFound";
import VideoCallInterface from './pages/video-call-interface';
import TaskManagementCenter from './pages/task-management-center';
import ExecutiveDashboard from './pages/executive-dashboard';
import InteractiveKanbanBoard from './pages/interactive-kanban-board';
import TeamCommunicationHub from './pages/team-communication-hub';
import UserSettingsProfile from './pages/user-settings-profile';
import AuditLogActivityTracking from './pages/audit-log-activity-tracking';
import MemberFocusedView from './pages/member-focused-view';
import AuthenticationLoginPortal from './pages/authentication-login-portal';

const MainLayout = ({ children, currentRole, onRoleChange }) => (
  <div className="flex">
    <Sidebar currentRole={currentRole} onRoleChange={onRoleChange} />
    <main className="flex-1">
      {children}
    </main>
  </div>
);

const Routes = ({ currentRole, onRoleChange }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<AuthenticationLoginPortal onRoleChange={onRoleChange} />} />
          <Route
            path="/*"
            element={
              <MainLayout currentRole={currentRole} onRoleChange={onRoleChange}>
                <RouterRoutes>
                  <Route path="/video-call-interface" element={<VideoCallInterface />} />
                  <Route path="/task-management-center" element={<TaskManagementCenter />} />
                  <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                  <Route path="/interactive-kanban-board" element={<InteractiveKanbanBoard />} />
                  <Route path="/team-communication-hub" element={<TeamCommunicationHub />} />
                  <Route path="/user-settings-profile" element={<UserSettingsProfile />} />
                  <Route path="/audit-log-activity-tracking" element={<AuditLogActivityTracking />} />
                  <Route path="/member-focused-view" element={<MemberFocusedView />} />
                  <Route path="*" element={<NotFound />} />
                </RouterRoutes>
              </MainLayout>
            }
          />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;