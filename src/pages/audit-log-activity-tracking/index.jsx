import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Icon from '../../components/AppIcon';
import AuditLogFilters from './components/AuditLogFilters';
import AuditLogEntry from './components/AuditLogEntry';
import ExportModal from './components/ExportModal';
import Button from '../../components/ui/Button';

const AuditLogActivityTracking = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: '30days',
    user: 'all',
    actionType: 'all',
    severity: 'all',
    searchQuery: ''
  });

  const auditLogs = [
    {
      id: 1,
      timestamp: '2026-01-02 12:15:34',
      timeAgo: '27 mins ago',
      user: {
        name: 'Sarah Mitchell',
        avatar: 'SM',
        role: 'Project Manager'
      },
      actionType: 'task_change',
      action: 'Updated Task Status',
      description: 'Changed task "API Integration" from In Progress to Completed',
      severity: 'info',
      resource: 'Task #1247',
      project: 'Enterprise CRM Migration',
      details: {
        before: { status: 'In Progress', assignee: 'John Davis' },
        after: { status: 'Completed', assignee: 'John Davis' }
      },
      ipAddress: '192.168.1.45',
      device: 'Chrome on Windows'
    },
    {
      id: 2,
      timestamp: '2026-01-02 11:42:18',
      timeAgo: '1 hour ago',
      user: {
        name: 'Michael Chen',
        avatar: 'MC',
        role: 'Administrator'
      },
      actionType: 'role_modification',
      action: 'Role Permission Updated',
      description: 'Modified permissions for Team Lead role - added budget approval rights',
      severity: 'warning',
      resource: 'Role: Team Lead',
      project: 'System Administration',
      details: {
        before: { permissions: ['view_projects', 'edit_tasks', 'manage_team'] },
        after: { permissions: ['view_projects', 'edit_tasks', 'manage_team', 'approve_budget'] }
      },
      ipAddress: '192.168.1.12',
      device: 'Firefox on macOS'
    },
    {
      id: 3,
      timestamp: '2026-01-02 11:28:55',
      timeAgo: '1 hour ago',
      user: {
        name: 'Emily Roberts',
        avatar: 'ER',
        role: 'Designer'
      },
      actionType: 'chat_message',
      action: 'Sent Team Message',
      description: 'Posted message in #design-team channel regarding mobile app mockups',
      severity: 'info',
      resource: 'Channel: #design-team',
      project: 'Mobile App Redesign',
      details: {
        channel: '#design-team',
        messageLength: 156,
        attachments: ['mockup_v3.fig', 'design_specs.pdf']
      },
      ipAddress: '192.168.1.89',
      device: 'Safari on macOS'
    },
    {
      id: 4,
      timestamp: '2026-01-02 10:55:12',
      timeAgo: '2 hours ago',
      user: {
        name: 'John Davis',
        avatar: 'JD',
        role: 'Senior Developer'
      },
      actionType: 'video_call',
      action: 'Started Video Call',
      description: 'Initiated team standup meeting with 8 participants',
      severity: 'info',
      resource: 'Meeting: Daily Standup',
      project: 'API Infrastructure Upgrade',
      details: {
        duration: '32 minutes',
        participants: 8,
        recordingEnabled: true
      },
      ipAddress: '192.168.1.67',
      device: 'Chrome on Windows'
    },
    {
      id: 5,
      timestamp: '2026-01-02 10:15:47',
      timeAgo: '2 hours ago',
      user: {
        name: 'Lisa Anderson',
        avatar: 'LA',
        role: 'Administrator'
      },
      actionType: 'role_modification',
      action: 'User Role Changed',
      description: 'Promoted David Park from Developer to Senior Developer',
      severity: 'warning',
      resource: 'User: David Park',
      project: 'Team Management',
      details: {
        before: { role: 'Developer', accessLevel: 'Standard' },
        after: { role: 'Senior Developer', accessLevel: 'Advanced' }
      },
      ipAddress: '192.168.1.23',
      device: 'Edge on Windows'
    },
    {
      id: 6,
      timestamp: '2026-01-02 09:42:33',
      timeAgo: '3 hours ago',
      user: {
        name: 'Robert Taylor',
        avatar: 'RT',
        role: 'Security Admin'
      },
      actionType: 'system_event',
      action: 'Security Policy Updated',
      description: 'Modified password requirements - increased minimum length to 12 characters',
      severity: 'critical',
      resource: 'Security Policy',
      project: 'Security Compliance',
      details: {
        before: { minLength: 8, requireSpecialChars: true, requireNumbers: true },
        after: { minLength: 12, requireSpecialChars: true, requireNumbers: true, require2FA: true }
      },
      ipAddress: '192.168.1.5',
      device: 'Chrome on Linux'
    },
    {
      id: 7,
      timestamp: '2026-01-02 09:18:21',
      timeAgo: '3 hours ago',
      user: {
        name: 'Jennifer Lee',
        avatar: 'JL',
        role: 'Team Lead'
      },
      actionType: 'task_change',
      action: 'Task Reassigned',
      description: 'Reassigned task "Database Optimization" from Mark Wilson to Alex Brown',
      severity: 'info',
      resource: 'Task #1189',
      project: 'Data Analytics Platform',
      details: {
        before: { assignee: 'Mark Wilson', priority: 'Medium' },
        after: { assignee: 'Alex Brown', priority: 'High' }
      },
      ipAddress: '192.168.1.78',
      device: 'Chrome on macOS'
    },
    {
      id: 8,
      timestamp: '2026-01-02 08:55:09',
      timeAgo: '4 hours ago',
      user: {
        name: 'Daniel Martinez',
        avatar: 'DM',
        role: 'Developer'
      },
      actionType: 'chat_message',
      action: 'Sent Direct Message',
      description: 'Sent private message to Sarah Mitchell regarding code review feedback',
      severity: 'info',
      resource: 'Direct Message',
      project: 'Enterprise CRM Migration',
      details: {
        recipient: 'Sarah Mitchell',
        messageLength: 243,
        attachments: []
      },
      ipAddress: '192.168.1.92',
      device: 'Firefox on Windows'
    },
    {
      id: 9,
      timestamp: '2026-01-02 08:30:44',
      timeAgo: '4 hours ago',
      user: {
        name: 'Amanda White',
        avatar: 'AW',
        role: 'Project Manager'
      },
      actionType: 'video_call',
      action: 'Ended Video Call',
      description: 'Concluded client presentation meeting - 45 minutes duration',
      severity: 'info',
      resource: 'Meeting: Client Demo',
      project: 'Customer Portal Enhancement',
      details: {
        duration: '45 minutes',
        participants: 6,
        recordingEnabled: true
      },
      ipAddress: '192.168.1.34',
      device: 'Safari on macOS'
    },
    {
      id: 10,
      timestamp: '2026-01-02 08:12:15',
      timeAgo: '4 hours ago',
      user: {
        name: 'System',
        avatar: 'SYS',
        role: 'Automated Process'
      },
      actionType: 'system_event',
      action: 'Automated Backup Completed',
      description: 'Daily database backup completed successfully - 2.4GB archived',
      severity: 'info',
      resource: 'Database Backup',
      project: 'System Maintenance',
      details: {
        backupSize: '2.4GB',
        duration: '12 minutes',
        status: 'Success'
      },
      ipAddress: 'Internal',
      device: 'Automated Service'
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleSelectEntry = (entryId) => {
    setSelectedEntries(prev => 
      prev?.includes(entryId) 
        ? prev?.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEntries?.length === auditLogs?.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(auditLogs?.map(log => log?.id));
    }
  };

  const handleExpandEntry = (entryId) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey && e?.key === 'f') {
        e?.preventDefault();
        document?.getElementById('audit-search')?.focus();
      }
      if (e?.key === 'Escape') {
        setShowExportModal(false);
        setExpandedEntry(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <Helmet>
        <title>Audit Log & Activity Tracking - TeamSync Pro</title>
        <meta name="description" content="Comprehensive audit log displaying all team actions including task changes, chat messages, video calls, and role modifications with timestamps" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar isCollapsed={sidebarCollapsed} />

        <div className={`transition-all duration-250 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
          <header className="sticky top-0 z-50 bg-card border-b border-border px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:flex p-2 hover:bg-muted rounded-lg transition-colors duration-250"
                  aria-label="Toggle sidebar"
                >
                  <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
                </button>
                <div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-foreground">
                    Audit Log & Activity Tracking
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    Complete visibility into all system activities and user actions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
                  <Icon name="Shield" size={16} />
                  <span className="text-xs font-medium">Admin Access</span>
                </div>
                <NotificationCenter />
                <UserProfileDropdown />
              </div>
            </div>
          </header>

          <main className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
            <AuditLogFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
              onExport={handleExport}
            />

            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                  <Icon name="FileText" size={20} className="text-primary" />
                  <div>
                    <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                      Activity Feed
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {auditLogs?.length} entries found
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedEntries?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {selectedEntries?.length} selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Archive"
                        iconPosition="left"
                        onClick={() => console.log('Archive selected')}
                      >
                        Archive
                      </Button>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={selectedEntries?.length === auditLogs?.length ? 'CheckSquare' : 'Square'}
                    onClick={handleSelectAll}
                    className="hidden md:flex"
                  >
                    {selectedEntries?.length === auditLogs?.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
                {auditLogs?.map((log) => (
                  <AuditLogEntry
                    key={log?.id}
                    log={log}
                    isSelected={selectedEntries?.includes(log?.id)}
                    isExpanded={expandedEntry === log?.id}
                    onSelect={handleSelectEntry}
                    onExpand={handleExpandEntry}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Info" size={14} />
                <span>Real-time updates enabled • Last sync: Just now</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconName="RefreshCw">
                  Refresh
                </Button>
                <Button variant="outline" size="sm" iconName="Settings">
                  Configure
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          selectedCount={selectedEntries?.length}
          totalCount={auditLogs?.length}
        />
      )}
    </>
  );
};

export default AuditLogActivityTracking;