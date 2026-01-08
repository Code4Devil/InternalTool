import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProjectTree from '../task-management-center/components/ProjectTree';
import KanbanColumn from '../interactive-kanban-board/components/KanbanColumn';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const MemberFocusedView = () => {
  const [userRole] = useState('member');

  // Mock data for a specific member
  const memberId = 'user-1';
  const memberName = 'Sarah Mitchell';

  const [projects] = useState([
    {
      id: 'proj-1',
      name: 'Project Alpha',
      tasks: ['task-1', 'task-6'],
    },
    {
      id: 'proj-2',
      name: 'Project Gamma',
      tasks: ['task-10'],
    },
  ]);

  const [columns, setColumns] = useState([
    { id: 'todo', name: 'To Do', wipLimit: 5, locked: false },
    { id: 'inprogress', name: 'In Progress', wipLimit: 3, locked: false },
    { id: 'review', name: 'Review', wipLimit: 2, locked: false },
    { id: 'done', name: 'Done', wipLimit: null, locked: true },
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 'task-1',
      title: 'Implement user authentication system',
      priority: 'critical',
      dueDate: '2026-01-03',
      columnId: 'inprogress',
      assignees: [{ id: 'user-1', name: 'Sarah Mitchell' }],
      tags: ['Backend', 'Security'],
    },
    {
      id: 'task-6',
      title: 'Implement real-time notifications',
      priority: 'high',
      dueDate: '2026-01-06',
      columnId: 'review',
      assignees: [{ id: 'user-1', name: 'Sarah Mitchell' }],
      tags: ['Backend', 'Real-time'],
    },
    {
      id: 'task-10',
      title: 'Documentation and API reference',
      priority: 'low',
      dueDate: '2026-01-20',
      columnId: 'done',
      assignees: [{ id: 'user-1', name: 'Sarah Mitchell' }],
      tags: ['Documentation'],
    },
  ]);

  const handleTaskMove = useCallback((taskId, fromColumnId, toColumnId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, columnId: toColumnId } : task
      )
    );
  }, []);

  const getColumnTasks = useCallback(
    (columnId) => {
      return tasks.filter((task) => task.columnId === columnId);
    },
    [tasks]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-background overflow-hidden">
        <div className="flex-1 flex flex-col">
          <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  My Focused View
                </h1>
                <p className="text-sm text-muted-foreground">
                  Projects and tasks assigned to {memberName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <UserProfileDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              <div className="lg:col-span-1 bg-card border rounded-lg p-4 h-full">
                <h2 className="text-lg font-semibold mb-4">My Projects</h2>
                <ProjectTree
                  projects={projects}
                  tasks={tasks.reduce((acc, task) => {
                    acc[task.id] = task;
                    return acc;
                  }, {})}
                  onSelectTask={() => {}}
                />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full overflow-x-auto">
                {columns.map((column) => (
                  <div key={column.id} className="flex-shrink-0">
                    <KanbanColumn
                      column={column}
                      tasks={getColumnTasks(column.id)}
                      onTaskMove={handleTaskMove}
                      onTaskEdit={() => {}}
                      onTaskDelete={() => {}}
                      userRole={userRole}
                      isOverLimit={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </DndProvider>
  );
};

export default MemberFocusedView;