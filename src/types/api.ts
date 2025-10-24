// API Response Types
export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
  generated_at?: string;
}

// Dashboard Types
export interface DashboardOverview {
  total_portals: number;
  total_courses: number;
  total_lessons: number;
  total_resources: number;
  total_ai_tools: number;
  total_users: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  estimated_duration_minutes: number;
  display_order: number;
  create_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url?: string;
  category: string;
  display_order: number;
  create_at: string;
}

export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url?: string;
  display_order: number;
  create_at: string;
}

export interface PortalStats {
  courses: {
    total: number;
    published: number;
    unpublished: number;
    list: Course[];
  };
  lessons: {
    total: number;
    published: number;
    unpublished: number;
  };
  resources: {
    total: number;
    published: number;
    unpublished: number;
    by_category: {
      tools: number;
      guides: number;
      websites: number;
      templates: number;
    };
    list: Resource[];
  };
  ai_tools: {
    total: number;
    active: number;
    inactive: number;
    list: AITool[];
  };
  users: {
    total: number;
    active: number;
    completed_onboarding: number;
  };
  user_progress: {
    total_enrollments: number;
    completed_courses: number;
    in_progress_courses: number;
    not_started: number;
  };
}

export interface Portal {
  portal_id: string;
  portal_slug: string;
  portal_title: string;
  portal_description: string;
  courses: PortalStats['courses'];
  lessons: PortalStats['lessons'];
  resources: PortalStats['resources'];
  ai_tools: PortalStats['ai_tools'];
  users: PortalStats['users'];
  user_progress: PortalStats['user_progress'];
}

export interface DashboardData {
  overview: DashboardOverview;
  portals: Portal[];
}

// Audit Log Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface Action {
  type: string;
  entity_type: string;
  entity_id: string;
  entity_name: string;
}

export interface PortalInfo {
  id: string;
  slug: string;
}

export interface RequestInfo {
  ip_address: string;
  user_agent: string;
}

export interface AuditLog {
  id: string;
  admin_user: AdminUser;
  action: Action;
  portal: PortalInfo;
  description: string;
  old_values: any;
  new_values: any;
  metadata: {
    portal_title: string;
  };
  request_info: RequestInfo;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_count: number;
  limit: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface FiltersApplied {
  admin_user_id: string | null;
  action_type: string | null;
  entity_type: string | null;
  portal_id: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: Pagination;
  filters_applied: FiltersApplied;
}

// API Error Types
export interface ApiError {
  error: boolean;
  message: string;
  status?: number;
}
