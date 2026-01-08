import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import KanbanColumn from './components/KanbanColumn';

import FilterToolbar from './components/FilterToolbar';
import BulkOperationsBar from './components/BulkoperationBar';
import CollaborationCursors from './components/CollaborationCursors';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import ExportModal from './components/ExportModal';

const InteractiveKanbanBoard = () => {
  const [userRole, setUserRole] = useState('executive');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');

  const [columns, setColumns] = useState([
  { id: 'backlog', name: 'Backlog', wipLimit: null, locked: false },
  { id: 'todo', name: 'To Do', wipLimit: 5, locked: false },
  { id: 'inprogress', name: 'In Progress', wipLimit: 3, locked: false },
  { id: 'review', name: 'Review', wipLimit: 2, locked: false },
  { id: 'done', name: 'Done', wipLimit: null, locked: true }]
  );

  const [tasks, setTasks] = useState([
  {
    id: 'task-1',
    title: 'Implement user authentication system',
    description: 'Set up JWT-based authentication with refresh tokens and secure session management',
    priority: 'critical',
    dueDate: '2026-01-03',
    columnId: 'inprogress',
    assignees: [
    {
      id: 'user-1',
      name: 'Sarah Mitchell',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
      avatarAlt: 'Professional woman with brown hair in business attire smiling at camera'
    }],

    attachments: 3,
    comments: 8,
    tags: ['Backend', 'Security']
  },
  {
    id: 'task-2',
    title: 'Design dashboard UI mockups',
    description: 'Create high-fidelity mockups for executive dashboard with data visualization components',
    priority: 'high',
    dueDate: '2026-01-04',
    columnId: 'inprogress',
    assignees: [
    {
      id: 'user-2',
      name: 'Michael Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_182711c5a-1763295572693.png",
      avatarAlt: 'Asian man with glasses wearing casual blue shirt in office setting'
    }],

    attachments: 5,
    comments: 12,
    tags: ['Design', 'UI/UX']
  },
  {
    id: 'task-3',
    title: 'API integration for task management',
    description: 'Connect frontend with backend REST API endpoints for CRUD operations',
    priority: 'high',
    dueDate: '2026-01-05',
    columnId: 'todo',
    assignees: [
    {
      id: 'user-3',
      name: 'Emily Rodriguez',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14c5b6918-1763294965734.png",
      avatarAlt: 'Hispanic woman with long dark hair in professional blazer smiling confidently'
    }],

    attachments: 2,
    comments: 5,
    tags: ['Frontend', 'API']
  },
  {
    id: 'task-4',
    title: 'Database schema optimization',
    description: 'Optimize PostgreSQL queries and add proper indexing for performance improvement',
    priority: 'medium',
    dueDate: '2026-01-08',
    columnId: 'todo',
    assignees: [
    {
      id: 'user-4',
      name: 'David Thompson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b75fb979-1763300887401.png",
      avatarAlt: 'Caucasian man with short blonde hair wearing black turtleneck in modern office'
    }],

    attachments: 1,
    comments: 3,
    tags: ['Database', 'Performance']
  },
  {
    id: 'task-5',
    title: 'Write unit tests for authentication',
    description: 'Comprehensive test coverage for login, logout, and token refresh functionality',
    priority: 'medium',
    dueDate: '2026-01-10',
    columnId: 'backlog',
    assignees: [
    {
      id: 'user-5',
      name: 'Jessica Park',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_130cd898a-1763295270127.png",
      avatarAlt: 'Asian woman with shoulder-length black hair in white blouse working at desk'
    }],

    attachments: 0,
    comments: 2,
    tags: ['Testing', 'QA']
  },
  {
    id: 'task-6',
    title: 'Implement real-time notifications',
    description: 'WebSocket integration for live task updates and team collaboration features',
    priority: 'high',
    dueDate: '2026-01-06',
    columnId: 'review',
    assignees: [
    {
      id: 'user-1',
      name: 'Sarah Mitchell',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
      avatarAlt: 'Professional woman with brown hair in business attire smiling at camera'
    },
    {
      id: 'user-3',
      name: 'Emily Rodriguez',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_14c5b6918-1763294965734.png",
      avatarAlt: 'Hispanic woman with long dark hair in professional blazer smiling confidently'
    }],

    attachments: 4,
    comments: 15,
    tags: ['Backend', 'Real-time']
  },
  {
    id: 'task-7',
    title: 'Mobile responsive design implementation',
    description: 'Ensure all pages work seamlessly on mobile devices with touch-friendly interactions',
    priority: 'low',
    dueDate: '2026-01-15',
    columnId: 'backlog',
    assignees: [
    {
      id: 'user-2',
      name: 'Michael Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_182711c5a-1763295572693.png",
      avatarAlt: 'Asian man with glasses wearing casual blue shirt in office setting'
    }],

    attachments: 0,
    comments: 1,
    tags: ['Frontend', 'Mobile']
  },
  {
    id: 'task-8',
    title: 'Security audit and penetration testing',
    description: 'Comprehensive security review of authentication, authorization, and data handling',
    priority: 'critical',
    dueDate: '2026-01-07',
    columnId: 'review',
    assignees: [
    {
      id: 'user-4',
      name: 'David Thompson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b75fb979-1763300887401.png",
      avatarAlt: 'Caucasian man with short blonde hair wearing black turtleneck in modern office'
    }],

    attachments: 6,
    comments: 20,
    tags: ['Security', 'Audit']
  },
  {
    id: 'task-9',
    title: 'Performance monitoring setup',
    description: 'Integrate application performance monitoring tools and set up alerting system',
    priority: 'medium',
    dueDate: '2026-01-12',
    columnId: 'done',
    assignees: [
    {
      id: 'user-5',
      name: 'Jessica Park',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_130cd898a-1763295270127.png",
      avatarAlt: 'Asian woman with shoulder-length black hair in white blouse working at desk'
    }],

    attachments: 2,
    comments: 7,
    tags: ['DevOps', 'Monitoring']
  },
  {
    id: 'task-10',
    title: 'Documentation and API reference',
    description: 'Complete technical documentation for all API endpoints and integration guides',
    priority: 'low',
    dueDate: '2026-01-20',
    columnId: 'done',
    assignees: [
    {
      id: 'user-1',
      name: 'Sarah Mitchell',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
      avatarAlt: 'Professional woman with brown hair in business attire smiling at camera'
    }],

    attachments: 8,
    comments: 4,
    tags: ['Documentation']
  }]
  );

  const [filters, setFilters] = useState({
    priority: 'all',
    assignee: 'all',
    dueDate: 'all'
  });

  const [savedPresets, setSavedPresets] = useState([
  { id: 'preset-1', name: 'Critical Tasks', filters: { priority: 'critical', assignee: 'all', dueDate: 'all' } },
  { id: 'preset-2', name: 'My Tasks', filters: { priority: 'all', assignee: 'user-1', dueDate: 'all' } }]
  );

  const [activeUsers, setActiveUsers] = useState([
  {
    id: 'collab-1',
    name: 'Michael Chen',
    color: '#3B82F6',
    cursorX: 450,
    cursorY: 300
  },
  {
    id: 'collab-2',
    name: 'Emily Rodriguez',
    color: '#8B5CF6',
    cursorX: 850,
    cursorY: 450
  }]
  );

  const teamMembers = [
  { id: 'user-1', name: 'Sarah Mitchell' },
  { id: 'user-2', name: 'Michael Chen' },
  { id: 'user-3', name: 'Emily Rodriguez' },
  { id: 'user-4', name: 'David Thompson' },
  { id: 'user-5', name: 'Jessica Park' }];


  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setActiveUsers((prev) => prev?.map((user) => ({
        ...user,
        cursorX: Math.max(0, Math.min(window.innerWidth - 100, user?.cursorX + (Math.random() - 0.5) * 50)),
        cursorY: Math.max(0, Math.min(window.innerHeight - 100, user?.cursorY + (Math.random() - 0.5) * 50))
      })));
    }, 2000);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.key === '?' && !e?.ctrlKey && !e?.metaKey) {
        setShowShortcuts(true);
      }
      if (e?.key === 'Escape') {
        setSelectedTasks([]);
      }
      if ((e?.ctrlKey || e?.metaKey) && e?.key === 'e') {
        e?.preventDefault();
        setShowExport(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTaskMove = useCallback((taskId, fromColumnId, toColumnId) => {
    setSyncStatus('syncing');
    setTasks((prev) => prev?.map((task) =>
    task?.id === taskId ? { ...task, columnId: toColumnId } : task
    ));
    setTimeout(() => setSyncStatus('synced'), 1000);
  }, []);

  const handleTaskEdit = useCallback((taskId, updates) => {
    setTasks((prev) => prev?.map((task) =>
    task?.id === taskId ? { ...task, ...updates } : task
    ));
  }, []);

  const handleTaskDelete = useCallback((taskId) => {
    setTasks((prev) => prev?.filter((task) => task?.id !== taskId));
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  }, []);

  const handleSavePreset = useCallback((name, filterValues) => {
    const newPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters: filterValues
    };
    setSavedPresets((prev) => [...prev, newPreset]);
  }, []);

  const handleLoadPreset = useCallback((preset) => {
    setFilters(preset?.filters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ priority: 'all', assignee: 'all', dueDate: 'all' });
  }, []);

  const handleMoveSelected = useCallback((columnId) => {
    setTasks((prev) => prev?.map((task) =>
    selectedTasks?.includes(task?.id) ? { ...task, columnId } : task
    ));
    setSelectedTasks([]);
  }, [selectedTasks]);

  const handleDeleteSelected = useCallback(() => {
    setTasks((prev) => prev?.filter((task) => !selectedTasks?.includes(task?.id)));
    setSelectedTasks([]);
  }, [selectedTasks]);

  const handleExport = useCallback((exportOptions) => {
    console.log('Exporting board with options:', exportOptions);
  }, []);

  const getFilteredTasks = useCallback(() => {
    return tasks?.filter((task) => {
      if (filters?.priority !== 'all' && task?.priority !== filters?.priority) return false;
      if (filters?.assignee !== 'all' && !task?.assignees?.some((a) => a?.id === filters?.assignee)) return false;

      if (filters?.dueDate !== 'all') {
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (filters?.dueDate === 'overdue' && diffDays >= 0) return false;
        if (filters?.dueDate === 'today' && diffDays !== 0) return false;
        if (filters?.dueDate === 'week' && (diffDays < 0 || diffDays > 7)) return false;
        if (filters?.dueDate === 'month' && (diffDays < 0 || diffDays > 30)) return false;
      }

      return true;
    });
  }, [tasks, filters]);

  const getColumnTasks = useCallback((columnId) => {
    return getFilteredTasks()?.filter((task) => task?.columnId === columnId);
  }, [getFilteredTasks]);

  const isColumnOverLimit = useCallback((columnId) => {
    const column = columns?.find((c) => c?.id === columnId);
    if (!column?.wipLimit) return false;
    return getColumnTasks(columnId)?.length > column?.wipLimit;
  }, [columns, getColumnTasks]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-background overflow-hidden">
        <div className={`flex-1 flex flex-col transition-all duration-250`}>
          <header className="bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3 md:gap-4">
              <div>
                <h1 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                  Interactive Kanban Board
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Visual workflow management with real-time collaboration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-success' : 'bg-warning animate-pulse'}`} />
                <span className="text-xs font-medium text-foreground">
                  {syncStatus === 'synced' ? 'Synced' : 'Syncing...'}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                iconName="HelpCircle"
                onClick={() => setShowShortcuts(true)}
                className="hidden md:flex">

                Shortcuts
              </Button>

              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={() => setShowExport(true)}>

                Export
              </Button>

              <NotificationCenter />
              <UserProfileDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-hidden p-4 md:p-6">
            <FilterToolbar
              filters={filters}
              onFilterChange={handleFilterChange}
              onSavePreset={handleSavePreset}
              savedPresets={savedPresets}
              onLoadPreset={handleLoadPreset}
              onClearFilters={handleClearFilters}
              teamMembers={teamMembers} />


            <div className="h-[calc(100vh-280px)] md:h-[calc(100vh-240px)] overflow-x-auto custom-scrollbar">
              <div className="flex gap-3 md:gap-4 h-full min-w-max pb-4">
                {columns?.map((column) =>
                <div key={column?.id} className="w-72 md:w-80 flex-shrink-0">
                    <KanbanColumn
                    column={column}
                    tasks={getColumnTasks(column?.id)}
                    onTaskMove={handleTaskMove}
                    onTaskEdit={handleTaskEdit}
                    onTaskDelete={handleTaskDelete}
                    userRole={userRole}
                    isOverLimit={isColumnOverLimit(column?.id)} />

                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        <BulkOperationsBar
          selectedTasks={selectedTasks}
          onMoveSelected={handleMoveSelected}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={() => setSelectedTasks([])}
          columns={columns} />


        <CollaborationCursors activeUsers={activeUsers} />

        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)} />


        <ExportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          onExport={handleExport}
          columns={columns} />

      </div>
    </DndProvider>);

};

export default InteractiveKanbanBoard;