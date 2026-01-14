import React, { useState, useEffect } from 'react';
import { supabase, getSession, getUserPrimaryRole } from '../../lib/supabase';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActivityIndicator from '../../components/ui/ActivityIndicator';
import AuditLogEntry from './components/AuditLogEntry';
import AuditLogFilters from './components/AuditLogFilters';
import ExportModal from './components/ExportModal';

const AuditLogActivityTrackingSupabase = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    activityType: 'all',
    userId: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    checkPermissions();
    loadAuditLogs();
  }, [currentPage, filters]);

  const checkPermissions = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const role = await getUserPrimaryRole(session.user.id);
      setIsAdmin(role === 'owner' || role === 'admin');
    } catch (error) {
      console.error('Failed to check permissions:', error);
    }
  };

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      const role = await getUserPrimaryRole(session.user.id);
      if (role !== 'owner' && role !== 'admin') {
        alert('Access Denied: Admin privileges required');
        return;
      }

      // Build query
      let query = supabase
        .from('task_activity')
        .select(`
          *,
          users(id, full_name, email, avatar_url),
          tasks(id, title, project_id, projects(name))
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      // Apply filters
      if (filters.activityType !== 'all') {
        query = query.eq('activity_type', filters.activityType);
      }

      if (filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', new Date(filters.dateFrom).toISOString());
      }

      if (filters.dateTo) {
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59);
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setLogs(data || []);
      setHasMore(count > currentPage * ITEMS_PER_PAGE);

      // Apply search filter locally
      applySearchFilter(data || []);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = (data) => {
    if (!filters.search) {
      setFilteredLogs(data);
      return;
    }

    const searchLower = filters.search.toLowerCase();
    const filtered = data.filter(log => 
      log.users?.full_name?.toLowerCase().includes(searchLower) ||
      log.users?.email?.toLowerCase().includes(searchLower) ||
      log.tasks?.title?.toLowerCase().includes(searchLower) ||
      log.activity_type?.toLowerCase().includes(searchLower) ||
      JSON.stringify(log.details).toLowerCase().includes(searchLower)
    );
    setFilteredLogs(filtered);
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      created: 'text-green-600 bg-green-50',
      updated: 'text-blue-600 bg-blue-50',
      deleted: 'text-red-600 bg-red-50',
      status_changed: 'text-purple-600 bg-purple-50',
      assigned: 'text-yellow-600 bg-yellow-50',
      commented: 'text-gray-600 bg-gray-50',
      time_logged: 'text-orange-600 bg-orange-50',
    };
    return colors[type] || 'text-gray-600 bg-gray-50';
  };

  const getActivityIcon = (type) => {
    const icons = {
      created: 'Plus',
      updated: 'Edit',
      deleted: 'Trash',
      status_changed: 'ArrowRight',
      assigned: 'User',
      commented: 'MessageSquare',
      time_logged: 'Clock',
    };
    return icons[type] || 'Activity';
  };

  const handleExport = async (format) => {
    try {
      // Get all logs for export (without pagination)
      let query = supabase
        .from('task_activity')
        .select(`
          *,
          users(full_name, email),
          tasks(title, projects(name))
        `)
        .order('created_at', { ascending: false });

      // Apply same filters
      if (filters.activityType !== 'all') {
        query = query.eq('activity_type', filters.activityType);
      }
      if (filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', new Date(filters.dateFrom).toISOString());
      }
      if (filters.dateTo) {
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59);
        query = query.lte('created_at', endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      if (format === 'csv') {
        const csv = convertToCSV(data);
        downloadFile(csv, 'audit-log.csv', 'text/csv');
      } else if (format === 'json') {
        const json = JSON.stringify(data, null, 2);
        downloadFile(json, 'audit-log.json', 'application/json');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export audit log');
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Timestamp', 'User', 'Activity Type', 'Task', 'Project', 'Details'];
    const rows = data.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.users?.full_name || log.users?.email || 'Unknown',
      log.activity_type,
      log.tasks?.title || 'N/A',
      log.tasks?.projects?.name || 'N/A',
      JSON.stringify(log.details),
    ]);

    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Lock" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You need admin privileges to view the audit log
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Audit Log
            </h1>
            <p className="text-muted-foreground">
              Complete activity tracking for all system actions
            </p>
          </div>
          <Button
            onClick={() => setShowExport(true)}
            leftIcon={<Icon name="Download" size={18} />}
            variant="outline"
          >
            Export
          </Button>
        </div>
      </div>

      <AuditLogFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({
          activityType: 'all',
          userId: 'all',
          dateFrom: '',
          dateTo: '',
          search: '',
        })}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Timestamp
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Activity
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Task
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Project
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 text-sm text-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {log.users?.avatar_url ? (
                        <img
                          src={log.users.avatar_url}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon name="User" size={12} />
                        </div>
                      )}
                      <span className="text-sm text-foreground">
                        {log.users?.full_name || log.users?.email || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Icon name={getActivityIcon(log.activity_type)} size={16} />
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getActivityTypeColor(log.activity_type)}`}>
                        {log.activity_type}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">
                    {log.tasks?.title || 'N/A'}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {log.tasks?.projects?.name || 'N/A'}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                    {log.details?.field && (
                      <span>
                        {log.details.field}: {log.details.from} → {log.details.to}
                      </span>
                    )}
                    {!log.details?.field && JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit logs found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Page {currentPage}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default AuditLogActivityTrackingSupabase;
