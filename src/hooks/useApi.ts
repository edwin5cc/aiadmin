import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, auditLogsApi, portalsApi, categoriesApi, resourcesApi, ApiError } from '../services/api';
import { ApiResponse, DashboardData, AuditLogsResponse } from '../types/api';
import { useAuth } from '../contexts/AuthContext';

// Re-export APIs and types for convenience
export { categoriesApi, resourcesApi, ApiError };

// Query keys for React Query
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  dashboardByPortal: (portalSlug: string) => ['dashboard', portalSlug] as const,
  userDashboard: ['user-dashboard'] as const,
  auditLogs: (params: any) => ['audit-logs', params] as const,
  portals: ['portals'] as const,
  categories: (portal_id?: string) => ['categories', portal_id] as const,
  resources: (params: any) => ['resources', params] as const,
};

// Dashboard hooks
export const useDashboard = (): UseQueryResult<ApiResponse<DashboardData>, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => dashboardApi.getDashboard(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useDashboardByPortal = (
  portalSlug: string
): UseQueryResult<ApiResponse<DashboardData>, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.dashboardByPortal(portalSlug),
    queryFn: () => dashboardApi.getDashboardByPortal(portalSlug),
    enabled: isAuthenticated && !!portalSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useUserDashboard = (): UseQueryResult<ApiResponse<DashboardData>, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.userDashboard,
    queryFn: () => dashboardApi.getUserDashboard(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Audit logs hooks
export const useAuditLogs = (params: {
  page?: number;
  limit?: number;
  admin_user_id?: string;
  action_type?: string;
  entity_type?: string;
  portal_id?: string;
  start_date?: string;
  end_date?: string;
} = {}): UseQueryResult<ApiResponse<AuditLogsResponse>, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.auditLogs(params),
    queryFn: () => auditLogsApi.getAuditLogs(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Portals hooks
export const usePortals = (): UseQueryResult<{ error: boolean; message: string; portals: any[]; total_count: number }, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.portals,
    queryFn: async () => {
      console.log('Fetching portals...');
      const result = await portalsApi.getPortals();
      console.log('Portals API result:', result);
      return result;
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes - portals don't change often
    retry: (failureCount, error) => {
      console.log('Portals API error:', error);
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Categories hooks
export const useCategories = (portal_id?: string): UseQueryResult<{ error: boolean; categories: any[]; total_count: number }, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.categories(portal_id),
    queryFn: () => categoriesApi.getCategories(portal_id),
    enabled: isAuthenticated && !!portal_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Resources hooks
export const useResources = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  portal_id?: string;
  is_published?: boolean;
}): UseQueryResult<{ error: boolean; resources: any[]; pagination: any }, ApiError> => {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.resources(params),
    queryFn: () => resourcesApi.getResources(params),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Utility hooks for specific data extraction
export const useDashboardOverview = () => {
  const { data, ...rest } = useDashboard();
  return {
    data: data?.data?.overview,
    ...rest,
  };
};

export const usePortalsFromDashboard = () => {
  const { data, ...rest } = useDashboard();
  return {
    data: data?.data?.portals || [],
    ...rest,
  };
};

export const usePortalStats = (portalSlug: string) => {
  const { data, ...rest } = useDashboardByPortal(portalSlug);
  const portal = data?.data?.portals?.[0];
  return {
    data: portal,
    ...rest,
  };
};

// Error handling utilities
export const getErrorMessage = (error: ApiError | null): string => {
  if (!error) return '';
  
  switch (error.status) {
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'Access denied. You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};

export const isNetworkError = (error: ApiError | null): boolean => {
  return error?.status === 0 || error?.message.includes('fetch');
};
