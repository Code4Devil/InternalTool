import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import ProjectNavigationTree from './components/ProjectNavigationTree';
import TasksOverviewTable from './components/TasksOverviewTable';
import ProductivityStatsCard from './components/ProductivityStatsCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import TaskDetailModal from './components/TaskDetailModal';

const MemberPersonalDashboard = () => {
  const [selectedProject, setSelectedProject] = useState('proj-1');
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const projects = [
    {
      id: 'proj-1',
      name: 'Website Redesign',
      taskCount: 12,
      categories: [
        { id: 'cat-1', name: 'Frontend Development', count: 5, priority: 'high' },
        { id: 'cat-2', name: 'Backend Integration', count: 4, priority: 'medium' },
        { id: 'cat-3', name: 'Testing & QA', count: 3, priority: 'low' }
      ]
    },
    {
      id: 'proj-2',
      name: 'Mobile App Launch',
      taskCount: 8,
      categories: [
        { id: 'cat-4', name: 'UI/UX Design', count: 3, priority: 'high' },
        { id: 'cat-5', name: 'API Development', count: 5, priority: 'medium' }
      ]
    },
    {
      id: 'proj-3',
      name: 'Marketing Campaign',
      taskCount: 6,
      categories: [
        { id: 'cat-6', name: 'Content Creation', count: 4, priority: 'medium' },
        { id: 'cat-7', name: 'Social Media', count: 2, priority: 'low' }
      ]
    }
  ];

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Implement responsive navigation menu with mobile hamburger functionality',
      description: 'Create a fully responsive navigation component that adapts to mobile, tablet, and desktop viewports with smooth animations and accessibility features.',
      priority: 'high',
      deadline: '2026-01-10',
      status: 'in-progress',
      assignedBy: 'Sarah Johnson',
      attachments: ['navigation-mockup.fig', 'requirements.pdf']
    },
    {
      id: 'task-2',
      title: 'Design and develop user authentication flow with JWT token management',
      description: 'Build secure login and registration system with password validation, session management, and token refresh mechanisms.',
      priority: 'high',
      deadline: '2026-01-08',
      status: 'review',
      assignedBy: 'Michael Chen',
      attachments: ['auth-flow-diagram.png']
    },
    {
      id: 'task-3',
      title: 'Optimize database queries for improved performance on dashboard analytics',
      description: 'Analyze and refactor slow-running queries, implement proper indexing, and add caching layer for frequently accessed data.',
      priority: 'medium',
      deadline: '2026-01-15',
      status: 'todo',
      assignedBy: 'Sarah Johnson',
      attachments: []
    },
    {
      id: 'task-4',
      title: 'Create comprehensive unit tests for payment processing module',
      description: 'Write test cases covering all payment scenarios including success, failure, refunds, and edge cases with 90% code coverage target.',
      priority: 'high',
      deadline: '2026-01-12',
      status: 'in-progress',
      assignedBy: 'David Martinez',
      attachments: ['test-plan.docx']
    },
    {
      id: 'task-5',
      title: 'Update API documentation with new endpoint specifications and examples',
      description: 'Document all recently added API endpoints with request/response examples, authentication requirements, and error handling details.',
      priority: 'low',
      deadline: '2026-01-20',
      status: 'backlog',
      assignedBy: 'Emily Rodriguez',
      attachments: ['api-template.md']
    },
    {
      id: 'task-6',
      title: 'Fix critical bug in file upload functionality causing data corruption',
      description: 'Investigate and resolve issue where large file uploads are getting corrupted during transmission, implement proper validation and error handling.',
      priority: 'high',
      deadline: '2026-01-05',
      status: 'done',
      assignedBy: 'Michael Chen',
      attachments: ['bug-report.pdf', 'error-logs.txt']
    },
    {
      id: 'task-7',
      title: 'Implement real-time notification system using WebSocket connections',
      description: 'Build notification infrastructure with WebSocket support for instant updates, including connection management and fallback mechanisms.',
      priority: 'medium',
      deadline: '2026-01-18',
      status: 'todo',
      assignedBy: 'Sarah Johnson',
      attachments: []
    },
    {
      id: 'task-8',
      title: 'Conduct security audit and implement recommended fixes for authentication',
      description: 'Review authentication system for vulnerabilities, implement security best practices, and address findings from penetration testing.',
      priority: 'high',
      deadline: '2026-01-14',
      status: 'review',
      assignedBy: 'David Martinez',
      attachments: ['security-report.pdf', 'recommendations.docx']
    }
  ];

  const mockActivities = [
    {
      id: 'act-1',
      type: 'task-assigned',
      message: 'You were assigned to "Implement responsive navigation menu"',
      timestamp: new Date(Date.now() - 300000),
      taskTitle: 'Website Redesign'
    },
    {
      id: 'act-2',
      type: 'task-completed',
      message: 'You completed "Fix critical bug in file upload functionality"',
      timestamp: new Date(Date.now() - 3600000),
      taskTitle: 'Bug Fixes'
    },
    {
      id: 'act-3',
      type: 'comment-added',
      message: 'Sarah Johnson commented on your task',
      timestamp: new Date(Date.now() - 7200000),
      taskTitle: 'User Authentication'
    },
    {
      id: 'act-4',
      type: 'deadline-changed',
      message: 'Deadline updated for "Optimize database queries"',
      timestamp: new Date(Date.now() - 10800000),
      taskTitle: 'Performance Optimization'
    },
    {
      id: 'act-5',
      type: 'file-uploaded',
      message: 'You uploaded "test-plan.docx" to payment processing task',
      timestamp: new Date(Date.now() - 14400000),
      taskTitle: 'Payment Module'
    },
    {
      id: 'act-6',
      type: 'task-updated',
      message: 'You updated the status of "Design authentication flow"',
      timestamp: new Date(Date.now() - 18000000),
      taskTitle: 'User Authentication'
    },
    {
      id: 'act-7',
      type: 'task-assigned',
      message: 'You were assigned to "Conduct security audit"',
      timestamp: new Date(Date.now() - 86400000),
      taskTitle: 'Security Review'
    },
    {
      id: 'act-8',
      type: 'comment-added',
      message: 'Michael Chen mentioned you in a comment',
      timestamp: new Date(Date.now() - 172800000),
      taskTitle: 'API Documentation'
    }
  ];

  useEffect(() => {
    setTasks(mockTasks);
    setActivities(mockActivities);
  }, []);

  const handleProjectSelect = (projectId, categoryId) => {
    setSelectedProject(projectId);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks?.map((task) => (task?.id === taskId ? { ...task, status: newStatus } : task))
    );

    const updatedTask = tasks?.find((t) => t?.id === taskId);
    if (updatedTask) {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'task-updated',
        message: `You updated the status of "${updatedTask?.title}" to ${newStatus?.replace('-', ' ')}`,
        timestamp: new Date(),
        taskTitle: updatedTask?.title
      };
      setActivities((prev) => [newActivity, ...prev]);
    }
  };

  const handlePriorityChange = (taskId, newPriority) => {
    setTasks((prevTasks) =>
      prevTasks?.map((task) => (task?.id === taskId ? { ...task, priority: newPriority } : task))
    );
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const completedTasks = tasks?.filter((t) => t?.status === 'done')?.length;
  const inProgressTasks = tasks?.filter((t) => t?.status === 'in-progress')?.length;
  const overdueTasks = tasks?.filter((t) => new Date(t.deadline) < new Date() && t?.status !== 'done')?.length;
  const completionRate = tasks?.length > 0 ? Math.round((completedTasks / tasks?.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar userRole="member" />

      <div className="lg:ml-60 transition-smooth">
        <div className="h-screen flex flex-col">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-3 h-full overflow-hidden">
              <ProjectNavigationTree
                projects={projects}
                selectedProject={selectedProject}
                onProjectSelect={handleProjectSelect}
              />
            </div>

            <div className="lg:col-span-6 h-full overflow-hidden flex flex-col">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 p-4 md:p-5 lg:p-6 bg-muted/30">
                <ProductivityStatsCard
                  icon="CheckCircle2"
                  label="Completed"
                  value={completedTasks}
                  trend="up"
                  trendValue="+12%"
                  color="bg-success"
                />
                <ProductivityStatsCard
                  icon="Clock"
                  label="In Progress"
                  value={inProgressTasks}
                  trend="neutral"
                  trendValue="0%"
                  color="bg-primary"
                />
                <ProductivityStatsCard
                  icon="AlertCircle"
                  label="Overdue"
                  value={overdueTasks}
                  trend="down"
                  trendValue="-5%"
                  color="bg-error"
                />
                <ProductivityStatsCard
                  icon="TrendingUp"
                  label="Completion"
                  value={`${completionRate}%`}
                  trend="up"
                  trendValue="+8%"
                  color="bg-accent"
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <TasksOverviewTable
                  tasks={tasks}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </div>

            <div className="lg:col-span-3 h-full overflow-hidden">
              <RecentActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </div>

      {selectedTask && <TaskDetailModal task={selectedTask} onClose={handleCloseModal} />}
    </div>
  );
};

export default MemberPersonalDashboard;