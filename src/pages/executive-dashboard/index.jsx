import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import MetricsCard from './components/MetricsCard';
import ProjectStatusCard from './components/ProjectStatusCard';
import WorkloadChart from './components/WorkloadChart';
import ActivityFeed from './components/ActivityFeed';
import FilterPanel from './components/FilterPanel';
import Icon from '../../components/AppIcon';

const ExecutiveDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: '30days',
    department: 'all',
    projectStatus: 'all',
    priority: 'all'
  });

  const keyMetrics = [
    {
      title: 'Task Completion Rate',
      value: '87.3%',
      change: '+5.2%',
      changeType: 'positive',
      icon: 'CheckCircle',
      iconColor: 'bg-success/10 text-success',
      trend: 'vs last month'
    },
    {
      title: 'Team Productivity Score',
      value: '92/100',
      change: '+3 points',
      changeType: 'positive',
      icon: 'TrendingUp',
      iconColor: 'bg-primary/10 text-primary',
      trend: 'vs last quarter'
    },
    {
      title: 'Timeline Adherence',
      value: '78.5%',
      change: '-2.1%',
      changeType: 'negative',
      icon: 'Calendar',
      iconColor: 'bg-warning/10 text-warning',
      trend: 'vs target 85%'
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+4',
      changeType: 'positive',
      icon: 'Folder',
      iconColor: 'bg-secondary/10 text-secondary',
      trend: 'new this month'
    }
  ];

  const activeProjects = [
    {
      id: 1,
      name: 'Enterprise CRM Migration',
      description: 'Complete migration of customer data to new CRM platform with enhanced analytics capabilities',
      health: 'healthy',
      progress: 78,
      deadline: 'Jan 15, 2026',
      teamSize: 12,
      risks: []
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      description: 'Complete UI/UX overhaul of mobile application with focus on user engagement and retention',
      health: 'at-risk',
      progress: 45,
      deadline: 'Jan 20, 2026',
      teamSize: 8,
      risks: ['Design approval delays affecting development timeline']
    },
    {
      id: 3,
      name: 'API Infrastructure Upgrade',
      description: 'Modernize backend API architecture for improved scalability and performance',
      health: 'healthy',
      progress: 92,
      deadline: 'Jan 08, 2026',
      teamSize: 6,
      risks: []
    },
    {
      id: 4,
      name: 'Security Compliance Audit',
      description: 'Comprehensive security review and implementation of SOC 2 compliance requirements',
      health: 'critical',
      progress: 34,
      deadline: 'Jan 10, 2026',
      teamSize: 5,
      risks: ['Critical vulnerabilities identified requiring immediate attention']
    },
    {
      id: 5,
      name: 'Data Analytics Platform',
      description: 'Build internal analytics dashboard for real-time business intelligence and reporting',
      health: 'healthy',
      progress: 67,
      deadline: 'Jan 25, 2026',
      teamSize: 10,
      risks: []
    },
    {
      id: 6,
      name: 'Customer Portal Enhancement',
      description: 'Add self-service features and improve customer experience in web portal',
      health: 'at-risk',
      progress: 52,
      deadline: 'Jan 18, 2026',
      teamSize: 7,
      risks: ['Resource allocation conflicts with other priority projects']
    }
  ];

  const workloadData = [
    { name: 'Sarah M.', assigned: 18, completed: 14, capacity: 20 },
    { name: 'John D.', assigned: 22, completed: 19, capacity: 25 },
    { name: 'Emily R.', assigned: 15, completed: 13, capacity: 20 },
    { name: 'Michael C.', assigned: 20, completed: 16, capacity: 22 },
    { name: 'Lisa K.', assigned: 17, completed: 15, capacity: 20 },
    { name: 'David P.', assigned: 24, completed: 20, capacity: 25 }
  ];

  const criticalActivities = [
    {
      id: 1,
      type: 'escalation',
      title: 'Budget Approval Required',
      description: 'Enterprise CRM Migration project requires additional $50K budget allocation for cloud infrastructure costs',
      priority: 'critical',
      timestamp: '15 mins ago',
      assignee: 'Sarah Mitchell',
      project: 'CRM Migration'
    },
    {
      id: 2,
      type: 'risk',
      title: 'Security Vulnerability Detected',
      description: 'Critical security issue identified in customer portal requiring immediate patch deployment',
      priority: 'critical',
      timestamp: '1 hour ago',
      assignee: 'Security Team',
      project: 'Customer Portal'
    },
    {
      id: 3,
      type: 'milestone',
      title: 'API Upgrade Milestone Achieved',
      description: 'Successfully completed Phase 2 of API infrastructure upgrade ahead of schedule',
      priority: 'high',
      timestamp: '3 hours ago',
      assignee: 'John Davis',
      project: 'API Infrastructure'
    },
    {
      id: 4,
      type: 'approval',
      title: 'Design Review Pending',
      description: 'Mobile app redesign mockups ready for executive approval before development phase',
      priority: 'high',
      timestamp: '5 hours ago',
      assignee: 'Emily Roberts',
      project: 'Mobile App Redesign'
    },
    {
      id: 5,
      type: 'resource',
      title: 'Resource Reallocation Needed',
      description: 'Two senior developers required for security compliance audit to meet deadline',
      priority: 'medium',
      timestamp: '8 hours ago',
      assignee: 'Michael Chen',
      project: 'Security Audit'
    }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key === 'Escape') {
        console.log('Escape pressed - closing modals');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <Helmet>
        <title>Executive Dashboard - TeamSync Pro</title>
        <meta name="description" content="Comprehensive organizational oversight and strategic decision-making data for C-level executives" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="flex-1">
          <header className="sticky top-0 z-50 bg-card border-b border-border px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-foreground">
                    Executive Dashboard
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    Strategic command center for organizational oversight
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
                  <Icon name="Shield" size={16} />
                  <span className="text-xs font-medium">Executive Access</span>
                </div>
                <NotificationCenter />
                <UserProfileDropdown />
              </div>
            </div>
          </header>

          <main className="px-4 md:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
            <FilterPanel onFilterChange={handleFilterChange} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {keyMetrics?.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base md:text-lg font-heading font-semibold text-foreground">
                    Active Project Status
                  </h2>
                  <button className="text-xs md:text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-250">
                    View All Projects
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {activeProjects?.map((project) => (
                    <ProjectStatusCard key={project?.id} project={project} />
                  ))}
                </div>
              </div>

              <div className="w-full h-full min-h-[300px] aspect-video">
                <WorkloadChart data={workloadData} />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <ActivityFeed activities={criticalActivities} />
            </div>

            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Icon name="Zap" size={20} className="text-primary" />
                  <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
                    Quick Actions
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <button className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-250">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Icon name="FileText" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Generate Report</p>
                    <p className="text-xs text-muted-foreground">Export analytics</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-250">
                  <div className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center">
                    <Icon name="UserPlus" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Add Team Member</p>
                    <p className="text-xs text-muted-foreground">Manage users</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-250">
                  <div className="w-10 h-10 bg-warning/10 text-warning rounded-lg flex items-center justify-center">
                    <Icon name="Settings" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">System Settings</p>
                    <p className="text-xs text-muted-foreground">Configure platform</p>
                  </div>
                </button>

                <button className="flex items-center gap-3 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-all duration-250">
                  <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center">
                    <Icon name="BarChart3" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">View Analytics</p>
                    <p className="text-xs text-muted-foreground">Deep insights</p>
                  </div>
                </button>
              </div>
            </div>
          </main>

          <footer className="border-t border-border px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
                © {new Date()?.getFullYear()} TeamSync Pro. All rights reserved.
              </p>
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
                <button className="hover:text-foreground transition-colors duration-250">Privacy Policy</button>
                <button className="hover:text-foreground transition-colors duration-250">Terms of Service</button>
                <button className="hover:text-foreground transition-colors duration-250">Support</button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ExecutiveDashboard;