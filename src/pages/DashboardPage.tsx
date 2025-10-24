import React from 'react';
import { useDashboard, useAuditLogs, getErrorMessage, isNetworkError } from '../hooks/useApi';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const DashboardPage = () => {
  const { 
    data: dashboardData, 
    isLoading: dashboardLoading, 
    error: dashboardError, 
    refetch: refetchDashboard 
  } = useDashboard();

  const { 
    data: auditLogsData, 
    isLoading: auditLogsLoading, 
    error: auditLogsError, 
    refetch: refetchAuditLogs 
  } = useAuditLogs({ limit: 5 });

  const handleRetry = () => {
    refetchDashboard();
    refetchAuditLogs();
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const renderError = (error: any, title: string) => {
    const errorMessage = getErrorMessage(error);
    const isNetwork = isNetworkError(error);
    
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>{title}:</strong> {errorMessage}
            {isNetwork && (
              <div className="flex items-center mt-1 text-sm">
                <WifiOff className="h-3 w-3 mr-1" />
                Network connection issue
              </div>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );

  const renderPortalCards = () => {
    if (!dashboardData?.data?.portals) return null;

    return dashboardData.data.portals.map((portal) => (
      <div key={portal.portal_id} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-slate-500">{portal.portal_title}</h3>
        <p className="text-3xl font-bold mt-2">{portal.courses.total} Courses</p>
        <p className="text-sm text-slate-400 mt-1">{portal.lessons.total} Lessons</p>
        <div className="mt-2 text-xs text-slate-500">
          <div>Resources: {portal.resources.total}</div>
          <div>AI Tools: {portal.ai_tools.active}</div>
          <div>Users: {portal.users.active}</div>
        </div>
      </div>
    ));
  };

  const renderOverviewCards = () => {
    if (!dashboardData?.data?.overview) return null;

    const overview = dashboardData.data.overview;
    
    return (
      <>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Total Courses</h3>
          <p className="text-3xl font-bold mt-2">{overview.total_courses}</p>
          <p className="text-sm text-slate-400 mt-1">Across all portals</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Total Lessons</h3>
          <p className="text-3xl font-bold mt-2">{overview.total_lessons}</p>
          <p className="text-sm text-slate-400 mt-1">Learning content</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Total Resources</h3>
          <p className="text-3xl font-bold mt-2">{overview.total_resources}</p>
          <p className="text-sm text-slate-400 mt-1">Links & Files</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-slate-500">Active AI Tools</h3>
          <p className="text-3xl font-bold mt-2">{overview.total_ai_tools}</p>
          <p className="text-sm text-slate-400 mt-1">AI-powered features</p>
        </div>
      </>
    );
  };

  return (
    <section id="dashboard-view">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Button 
          variant="outline" 
          onClick={handleRetry}
          disabled={dashboardLoading || auditLogsLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${(dashboardLoading || auditLogsLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Messages */}
      {dashboardError && renderError(dashboardError, 'Dashboard Error')}
      {auditLogsError && renderError(auditLogsError, 'Audit Logs Error')}

      {/* Overview Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Overview</h3>
        {dashboardLoading ? (
          renderLoadingSkeleton()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {renderOverviewCards()}
          </div>
        )}
      </div>

      {/* Portal-specific Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Portal Statistics</h3>
        {dashboardLoading ? (
          renderLoadingSkeleton()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderPortalCards()}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity (Audit Log)</h3>
          {auditLogsLoading && (
            <div className="flex items-center text-sm text-slate-500">
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Loading...
            </div>
          )}
        </div>
        
        {auditLogsLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : auditLogsData?.data?.data?.length ? (
          <ul className="space-y-3">
            {auditLogsData.data.data.map((log) => (
              <li key={log.id} className="flex items-center justify-between text-sm">
                <p>
                  <span className="font-medium">{log.admin_user.name}</span> {log.description}
                </p>
                <span className="text-slate-400">{formatTimeAgo(log.created_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">No recent activity found.</p>
        )}
      </div>
    </section>
  );
};

export default DashboardPage;