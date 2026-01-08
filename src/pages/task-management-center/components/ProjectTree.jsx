import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProjectTree = ({ onProjectSelect, selectedProject }) => {
  const [expandedProjects, setExpandedProjects] = useState(['project-alpha']);

  const projects = [
    {
      id: 'project-alpha',
      name: 'Project Alpha',
      icon: 'Folder',
      color: 'text-primary',
      taskCount: 24,
      children: [
        { id: 'alpha-frontend', name: 'Frontend Development', taskCount: 12 },
        { id: 'alpha-backend', name: 'Backend API', taskCount: 8 },
        { id: 'alpha-design', name: 'UI/UX Design', taskCount: 4 }
      ]
    },
    {
      id: 'project-beta',
      name: 'Project Beta',
      icon: 'Folder',
      color: 'text-secondary',
      taskCount: 18,
      children: [
        { id: 'beta-mobile', name: 'Mobile App', taskCount: 10 },
        { id: 'beta-testing', name: 'QA Testing', taskCount: 8 }
      ]
    },
    {
      id: 'project-gamma',
      name: 'Project Gamma',
      icon: 'Folder',
      color: 'text-accent',
      taskCount: 15,
      children: [
        { id: 'gamma-research', name: 'Research Phase', taskCount: 6 },
        { id: 'gamma-prototype', name: 'Prototyping', taskCount: 9 }
      ]
    },
    {
      id: 'maintenance',
      name: 'Maintenance Tasks',
      icon: 'Wrench',
      color: 'text-warning',
      taskCount: 7,
      children: []
    }
  ];

  const toggleProject = (projectId) => {
    setExpandedProjects(prev =>
      prev?.includes(projectId)
        ? prev?.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleProjectClick = (projectId) => {
    onProjectSelect(projectId);
  };

  return (
    <div className="bg-card border border-border rounded-xl h-full">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="FolderTree" size={20} />
          Projects
        </h3>
      </div>
      <div className="p-3 md:p-4 space-y-1 custom-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <button
          onClick={() => handleProjectClick('all')}
          className={`
            w-full flex items-center justify-between px-3 py-2 rounded-lg
            transition-all duration-250 ease-smooth
            ${selectedProject === 'all' ?'bg-primary text-primary-foreground' :'text-foreground hover:bg-muted'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <Icon name="LayoutGrid" size={18} />
            <span className="text-sm font-medium">All Tasks</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted-foreground/20">
            64
          </span>
        </button>

        {projects?.map((project) => (
          <div key={project?.id}>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleProject(project?.id)}
                className="p-1 hover:bg-muted rounded transition-colors duration-250"
                aria-label={expandedProjects?.includes(project?.id) ? 'Collapse' : 'Expand'}
              >
                <Icon
                  name={expandedProjects?.includes(project?.id) ? 'ChevronDown' : 'ChevronRight'}
                  size={16}
                  className="text-muted-foreground"
                />
              </button>

              <button
                onClick={() => handleProjectClick(project?.id)}
                className={`
                  flex-1 flex items-center justify-between px-3 py-2 rounded-lg
                  transition-all duration-250 ease-smooth
                  ${selectedProject === project?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon name={project?.icon} size={18} className={project?.color} />
                  <span className="text-sm font-medium">{project?.name}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted-foreground/20">
                  {project?.taskCount}
                </span>
              </button>
            </div>

            {expandedProjects?.includes(project?.id) && project?.children?.length > 0 && (
              <div className="ml-6 mt-1 space-y-1">
                {project?.children?.map((child) => (
                  <button
                    key={child?.id}
                    onClick={() => handleProjectClick(child?.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg
                      transition-all duration-250 ease-smooth
                      ${selectedProject === child?.id
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <span className="text-sm">{child?.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted-foreground/20">
                      {child?.taskCount}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTree;