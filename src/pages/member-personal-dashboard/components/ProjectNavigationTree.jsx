import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProjectNavigationTree = ({ projects, selectedProject, onProjectSelect }) => {
  const [expandedProjects, setExpandedProjects] = useState(new Set(['proj-1']));

  const toggleProject = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded?.has(projectId)) {
      newExpanded?.delete(projectId);
    } else {
      newExpanded?.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-full bg-card border-r border-border overflow-y-auto">
      <div className="p-4 md:p-5 lg:p-6 border-b border-border">
        <h2 className="text-base md:text-lg lg:text-xl font-heading font-semibold text-foreground">Projects</h2>
      </div>
      <div className="p-3 md:p-4 lg:p-5 space-y-2">
        {projects?.map((project) => {
          const isExpanded = expandedProjects?.has(project?.id);
          const isSelected = selectedProject === project?.id;

          return (
            <div key={project?.id} className="space-y-1">
              <button
                onClick={() => toggleProject(project?.id)}
                className={`w-full flex items-center justify-between p-2 md:p-2.5 lg:p-3 rounded-lg transition-smooth hover:bg-muted ${
                  isSelected ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <div className="flex items-center space-x-2 md:space-x-2.5 lg:space-x-3 flex-1 min-w-0">
                  <Icon
                    name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                    size={16}
                    color="var(--color-muted-foreground)"
                  />
                  <Icon name="Folder" size={18} color="var(--color-primary)" />
                  <span className="text-xs md:text-sm lg:text-base font-medium text-foreground truncate">
                    {project?.name}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-caption text-muted-foreground whitespace-nowrap ml-2">
                  {project?.taskCount}
                </span>
              </button>
              {isExpanded && (
                <div className="ml-6 md:ml-7 lg:ml-8 space-y-1">
                  {project?.categories?.map((category) => (
                    <button
                      key={category?.id}
                      onClick={() => onProjectSelect(project?.id, category?.id)}
                      className="w-full flex items-center justify-between p-2 md:p-2.5 lg:p-3 rounded-lg transition-smooth hover:bg-muted text-left"
                    >
                      <div className="flex items-center space-x-2 md:space-x-2.5 lg:space-x-3 flex-1 min-w-0">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(category?.priority)}`} />
                        <span className="text-xs md:text-sm lg:text-base text-foreground truncate">
                          {category?.name}
                        </span>
                      </div>
                      <span className="text-xs md:text-sm font-caption text-muted-foreground whitespace-nowrap ml-2">
                        {category?.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectNavigationTree;