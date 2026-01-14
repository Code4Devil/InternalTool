import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getSession, logTaskActivity } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import CreateProjectModal from './components/CreateProjectModal';
import ProjectCard from './components/ProjectCard';
import ProjectSettingsModal from './components/ProjectSettingsModal';
import ProjectTeamPanel from './components/ProjectTeamPanel';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [statusFilter]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      // Get projects where user is a member
      let query = supabase
        .from('projects')
        .select(`
          *,
          project_members!inner(user_id, role),
          tasks(count)
        `)
        .eq('project_members.user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get member counts for each project
      const projectsWithCounts = await Promise.all(
        data.map(async (project) => {
          const { count: memberCount } = await supabase
            .from('project_members')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);

          return {
            ...project,
            memberCount: memberCount || 0,
            taskCount: project.tasks?.[0]?.count || 0,
          };
        })
      );

      setProjects(projectsWithCounts);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const session = await getSession();
      if (!session) return;

      // Create project
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          status: projectData.status || 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Add creator as owner
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: newProject.id,
          user_id: session.user.id,
          role: 'owner',
          joined_at: new Date().toISOString(),
        });

      if (memberError) throw memberError;

      setShowCreateModal(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) throw error;

      setShowSettingsModal(false);
      loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your projects and team collaboration
            </p>
          </div>
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Icon name="Plus" size={20} />
            Create Project
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 shadow-elevation-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'on_hold', label: 'On Hold' },
                { value: 'completed', label: 'Completed' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <ActivityIndicator size="lg" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-card rounded-xl p-12 text-center">
            <Icon name="FolderOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'Create your first project to get started'}
            </p>
            {!searchTerm && (
              <Button
                variant="default"
                onClick={() => setShowCreateModal(true)}
              >
                Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                currentUserId={currentUserId}
                onEdit={(proj) => {
                  setSelectedProject(proj);
                  setShowSettingsModal(true);
                }}
                onManageTeam={(proj) => {
                  setSelectedProject(proj);
                  setShowTeamPanel(true);
                }}
                onDelete={handleDeleteProject}
                onClick={() => navigate(`/project/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateProject}
        />
      )}

      {showSettingsModal && selectedProject && (
        <ProjectSettingsModal
          project={selectedProject}
          onClose={() => {
            setShowSettingsModal(false);
            setSelectedProject(null);
          }}
          onSave={handleUpdateProject}
        />
      )}

      {showTeamPanel && selectedProject && (
        <ProjectTeamPanel
          project={selectedProject}
          onClose={() => {
            setShowTeamPanel(false);
            setSelectedProject(null);
          }}
          onUpdate={loadProjects}
        />
      )}
    </div>
  );
};

export default ProjectManagement;
