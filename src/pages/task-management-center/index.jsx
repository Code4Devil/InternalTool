import React, { useState, useEffect } from 'react';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import Icon from '../../components/AppIcon';
import TaskFilters from './components/TaskFilters';
import ProjectTree from './components/ProjectTree';
import TaskGrid from './components/TaskGrid';
import TaskDetailsPanel from './components/TaskDetailsPanel';
import QuickActions from './components/QuickActions';

const TaskManagementCenter = () => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    assignee: 'all',
    search: '',
    dateRange: { start: '', end: '' },
    savedFilter: null
  });

  const mockTasks = [
  {
    id: 'TSK-1024',
    title: 'Implement user authentication flow with OAuth 2.0',
    description: 'Design and implement a secure authentication system using OAuth 2.0 protocol. Include social login options for Google, GitHub, and Microsoft accounts. Ensure proper token management and refresh mechanisms.',
    priority: 'critical',
    status: 'in-progress',
    deadline: '01/05/2026',
    deadlineRaw: '2026-01-05',
    isOverdue: false,
    progress: 65,
    hasAttachments: true,
    commentCount: 8,
    assignee: {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ffde516e-1763293580273.png",
      avatarAlt: 'Professional headshot of woman with shoulder-length brown hair wearing navy blazer in modern office setting'
    },
    comments: [
    {
      id: 1,
      author: {
        name: 'John Anderson',
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19fe69446-1763294812929.png",
        avatarAlt: 'Professional headshot of man with short dark hair wearing gray suit in corporate environment'
      },
      content: 'Great progress on the OAuth implementation. Make sure to test the token refresh flow thoroughly.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: {
        name: 'Emily Chen',
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png",
        avatarAlt: 'Professional headshot of Asian woman with long black hair wearing white blouse in bright office space'
      },
      content: 'I can help with the frontend integration once the API endpoints are ready.',
      timestamp: '4 hours ago'
    }],

    activity: [
    {
      id: 1,
      icon: 'Edit',
      description: 'Sarah Mitchell updated the task status to In Progress',
      timestamp: '1 hour ago'
    },
    {
      id: 2,
      icon: 'MessageSquare',
      description: 'John Anderson added a comment',
      timestamp: '2 hours ago'
    },
    {
      id: 3,
      icon: 'Paperclip',
      description: 'Sarah Mitchell attached OAuth_Flow_Diagram.pdf',
      timestamp: '3 hours ago'
    }],

    attachments: [
    { id: 1, name: 'OAuth_Flow_Diagram.pdf', size: '2.4 MB' },
    { id: 2, name: 'API_Documentation.docx', size: '1.8 MB' },
    { id: 3, name: 'Test_Cases.xlsx', size: '856 KB' }]

  },
  {
    id: 'TSK-1025',
    title: 'Design responsive dashboard layout for mobile devices',
    description: 'Create a mobile-first responsive design for the main dashboard. Focus on touch-friendly interactions and optimized data visualization for smaller screens.',
    priority: 'high',
    status: 'review',
    deadline: '01/08/2026',
    deadlineRaw: '2026-01-08',
    isOverdue: false,
    progress: 90,
    hasAttachments: true,
    commentCount: 5,
    assignee: {
      name: 'Emily Chen',
      email: 'emily.chen@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png",
      avatarAlt: 'Professional headshot of Asian woman with long black hair wearing white blouse in bright office space'
    },
    comments: [
    {
      id: 1,
      author: {
        name: 'Michael Rodriguez',
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ea7f3f4a-1763295654726.png",
        avatarAlt: 'Professional headshot of Hispanic man with short black hair wearing dark suit in modern office'
      },
      content: 'The mobile layout looks great! Just a few minor adjustments needed for tablet view.',
      timestamp: '30 minutes ago'
    }],

    activity: [
    {
      id: 1,
      icon: 'CheckCircle',
      description: 'Emily Chen moved task to Review',
      timestamp: '45 minutes ago'
    }],

    attachments: [
    { id: 1, name: 'Mobile_Mockups.fig', size: '5.2 MB' },
    { id: 2, name: 'Design_System.pdf', size: '3.1 MB' }]

  },
  {
    id: 'TSK-1026',
    title: 'Optimize database queries for performance improvement',
    description: 'Analyze and optimize slow-running database queries. Implement proper indexing strategies and query optimization techniques to reduce response times by at least 40%.',
    priority: 'high',
    status: 'todo',
    deadline: '01/10/2026',
    deadlineRaw: '2026-01-10',
    isOverdue: false,
    progress: 25,
    hasAttachments: false,
    commentCount: 3,
    assignee: {
      name: 'John Anderson',
      email: 'john.anderson@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19fe69446-1763294812929.png",
      avatarAlt: 'Professional headshot of man with short dark hair wearing gray suit in corporate environment'
    },
    comments: [],
    activity: [
    {
      id: 1,
      icon: 'User',
      description: 'Task assigned to John Anderson',
      timestamp: '1 day ago'
    }],

    attachments: []
  },
  {
    id: 'TSK-1027',
    title: 'Implement real-time notification system using WebSockets',
    description: 'Build a real-time notification system that pushes updates to users instantly. Include support for multiple notification types and user preferences.',
    priority: 'medium',
    status: 'in-progress',
    deadline: '01/15/2026',
    deadlineRaw: '2026-01-15',
    isOverdue: false,
    progress: 45,
    hasAttachments: true,
    commentCount: 6,
    assignee: {
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ea7f3f4a-1763295654726.png",
      avatarAlt: 'Professional headshot of Hispanic man with short black hair wearing dark suit in modern office'
    },
    comments: [],
    activity: [],
    attachments: [
    { id: 1, name: 'WebSocket_Architecture.pdf', size: '1.5 MB' }]

  },
  {
    id: 'TSK-1028',
    title: 'Write comprehensive unit tests for API endpoints',
    description: 'Create unit tests for all REST API endpoints with minimum 80% code coverage. Include edge cases and error handling scenarios.',
    priority: 'medium',
    status: 'backlog',
    deadline: '01/20/2026',
    deadlineRaw: '2026-01-20',
    isOverdue: false,
    progress: 10,
    hasAttachments: false,
    commentCount: 2,
    assignee: null,
    comments: [],
    activity: [],
    attachments: []
  },
  {
    id: 'TSK-1029',
    title: 'Update documentation for new API version 2.0',
    description: 'Comprehensive documentation update for API v2.0 including all new endpoints, authentication changes, and migration guide from v1.0.',
    priority: 'low',
    status: 'todo',
    deadline: '01/25/2026',
    deadlineRaw: '2026-01-25',
    isOverdue: false,
    progress: 5,
    hasAttachments: false,
    commentCount: 1,
    assignee: {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1ffde516e-1763293580273.png",
      avatarAlt: 'Professional headshot of woman with shoulder-length brown hair wearing navy blazer in modern office setting'
    },
    comments: [],
    activity: [],
    attachments: []
  },
  {
    id: 'TSK-1030',
    title: 'Fix critical security vulnerability in file upload module',
    description: 'Address reported security vulnerability that allows unauthorized file types to be uploaded. Implement proper file validation and sanitization.',
    priority: 'critical',
    status: 'in-progress',
    deadline: '01/03/2026',
    deadlineRaw: '2026-01-03',
    isOverdue: true,
    progress: 80,
    hasAttachments: true,
    commentCount: 12,
    assignee: {
      name: 'John Anderson',
      email: 'john.anderson@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19fe69446-1763294812929.png",
      avatarAlt: 'Professional headshot of man with short dark hair wearing gray suit in corporate environment'
    },
    comments: [],
    activity: [],
    attachments: [
    { id: 1, name: 'Security_Report.pdf', size: '980 KB' },
    { id: 2, name: 'Patch_Notes.txt', size: '45 KB' }]

  },
  {
    id: 'TSK-1031',
    title: 'Integrate third-party payment gateway for subscriptions',
    description: 'Implement Stripe payment gateway integration for handling subscription payments. Include webhook handlers for payment events.',
    priority: 'high',
    status: 'review',
    deadline: '01/12/2026',
    deadlineRaw: '2026-01-12',
    isOverdue: false,
    progress: 95,
    hasAttachments: true,
    commentCount: 7,
    assignee: {
      name: 'Emily Chen',
      email: 'emily.chen@teamsync.com',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png",
      avatarAlt: 'Professional headshot of Asian woman with long black hair wearing white blouse in bright office space'
    },
    comments: [],
    activity: [],
    attachments: []
  }];


  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    let result = [...mockTasks];

    if (filters?.search) {
      result = result?.filter((task) =>
      task?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      task?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.priority !== 'all') {
      result = result?.filter((task) => task?.priority === filters?.priority);
    }

    if (filters?.status !== 'all') {
      result = result?.filter((task) => task?.status === filters?.status);
    }

    if (filters?.assignee !== 'all') {
      if (filters?.assignee === 'unassigned') {
        result = result?.filter((task) => !task?.assignee);
      } else {
        result = result?.filter((task) =>
        task?.assignee?.email?.includes(filters?.assignee)
        );
      }
    }

    if (filters?.savedFilter === 'my-tasks') {
      result = result?.filter((task) =>
      task?.assignee?.email === 'sarah.mitchell@teamsync.com'
      );
    } else if (filters?.savedFilter === 'overdue') {
      result = result?.filter((task) => task?.isOverdue);
    } else if (filters?.savedFilter === 'high-priority') {
      result = result?.filter((task) =>
      task?.priority === 'critical' || task?.priority === 'high'
      );
    } else if (filters?.savedFilter === 'unassigned') {
      result = result?.filter((task) => !task?.assignee);
    }

    setFilteredTasks(result);
  }, [filters]);

  useEffect(() => {
    if (selectedTaskId) {
      const task = mockTasks?.find((t) => t?.id === selectedTaskId);
      setSelectedTask(task);
    }
  }, [selectedTaskId]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleBulkAction = (action, value) => {
    console.log('Bulk action:', action, value, 'on tasks:', selectedTasks);
    setSelectedTasks([]);
  };

  const handleTaskUpdate = (updates) => {
    console.log('Updating task:', selectedTask?.id, updates);
  };

  const handleQuickAction = (actionId) => {
    console.log('Quick action:', actionId);
    if (actionId === 'kanban-view') {
      window.location.href = '/interactive-kanban-board';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`transition-all duration-250`}>
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
                    Task Management Center
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Manage and track all your team tasks efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationCenter />
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="mb-6">
            <TaskFilters onFilterChange={handleFilterChange} activeFilters={filters} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <ProjectTree
                  onProjectSelect={handleProjectSelect}
                  selectedProject={selectedProject} />

                <div className="hidden lg:block">
                  <ActivityIndicator />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base md:text-lg font-heading font-semibold text-foreground">
                      Tasks
                    </h2>
                    <span className="px-2 py-1 text-xs font-bold bg-primary/10 text-primary rounded">
                      {filteredTasks?.length} tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
                      aria-label="Refresh tasks">

                      <Icon name="RefreshCw" size={18} className="text-muted-foreground" />
                    </button>
                    <button
                      className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
                      aria-label="View options">

                      <Icon name="MoreVertical" size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <TaskGrid
                  tasks={filteredTasks}
                  onTaskSelect={setSelectedTasks}
                  selectedTasks={selectedTasks}
                  onBulkAction={handleBulkAction}
                  onTaskClick={handleTaskClick} />

              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-6">
                <TaskDetailsPanel
                  task={selectedTask}
                  onClose={() => setSelectedTaskId(null)}
                  onUpdate={handleTaskUpdate} />

                <QuickActions onAction={handleQuickAction} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);

};

export default TaskManagementCenter;