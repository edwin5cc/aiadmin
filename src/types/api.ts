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

// Course Types
export interface Course {
  id: string;
  portal_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  estimated_duration_minutes?: number;
  display_order: number;
  is_published: boolean;
  create_at: string;
  update_at: string;
  created_by: string;
  lessons?: Lesson[];
  lessons_count?: number;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_id?: string;
  video_url?: string;
  video_provider?: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  transcript?: string;
  lesson_number: number;
  display_order: number;
  is_published: boolean;
  create_at: string;
  update_at: string;
  created_by: string;
}

export interface CreateCourseRequest {
  portal_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  estimated_duration_minutes?: number;
  display_order?: number;
  is_published?: boolean;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  estimated_duration_minutes?: number;
  display_order?: number;
  is_published?: boolean;
}

export interface CourseListResponse {
  error: boolean;
  message: string;
  courses: Course[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface CourseResponse {
  error: boolean;
  message: string;
  course: Course;
}

export interface CourseDeleteResponse {
  error: boolean;
  message: string;
  deleted_lessons_count: number;
}

export interface ThumbnailUploadResponse {
  error: boolean;
  message: string;
  thumbnail_url: string;
  file_info: {
    originalname: string;
    mimetype: string;
    size: number;
  };
}

export interface ThumbnailUploadAndUpdateResponse {
  error: boolean;
  message: string;
  course: Course;
  thumbnail_info: {
    thumbnail_url: string;
    file_info: {
      originalname: string;
      mimetype: string;
      size: number;
    };
  };
}

// Lesson Types
export interface CreateLessonRequest {
  course_id: string;
  title: string;
  description?: string;
  video_id?: string;
  video_url?: string;
  video_provider?: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  transcript?: string;
  lesson_number?: number;
  display_order?: number;
  is_published?: boolean;
}

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  video_id?: string;
  video_url?: string;
  video_provider?: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  transcript?: string;
  lesson_number?: number;
  display_order?: number;
  is_published?: boolean;
}

export interface LessonListResponse {
  error: boolean;
  message: string;
  lessons: Lesson[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}

export interface LessonResponse {
  error: boolean;
  message: string;
  lesson: Lesson;
}

export interface LessonDeleteResponse {
  error: boolean;
  message: string;
}

export interface VideoUploadResponse {
  error: boolean;
  message: string;
  video_url: string;
  video_id: string;
  video_provider: string;
  file_info: {
    originalname: string;
    mimetype: string;
    size: number;
    key?: string;
  };
}

export interface VideoUploadAndUpdateResponse {
  error: boolean;
  message: string;
  lesson: Lesson;
  video_info: {
    video_url: string;
    video_id: string;
    video_provider: string;
    file_info: {
      originalname: string;
      mimetype: string;
      size: number;
      key?: string;
    };
  };
}

export interface LessonThumbnailUploadResponse {
  error: boolean;
  message: string;
  thumbnail_url: string;
  file_info: {
    originalname: string;
    mimetype: string;
    size: number;
  };
}

export interface LessonThumbnailUploadAndUpdateResponse {
  error: boolean;
  message: string;
  lesson: Lesson;
  thumbnail_info: {
    thumbnail_url: string;
    file_info: {
      originalname: string;
      mimetype: string;
      size: number;
    };
  };
}

// API Error Types
export interface ApiError {
  error: boolean;
  message: string;
  status?: number;
}

// AI Settings Types
export interface ProviderSettings {
  ai_model: string;
  temperature: number;
  max_tokens: number;
  allow_file_upload: boolean;
  allowed_file_types: string[];
  max_file_size_mb: number;
}

export interface AISettings {
  portal_slug: string;
  provider_to_use: 'openai' | 'gemini';
  openai: ProviderSettings;
  gemini: ProviderSettings;
  is_active: boolean;
  updated_at?: string;
  updated_by?: string;
}

export interface UpdateAISettingsRequest {
  provider_to_use?: 'openai' | 'gemini';
  openai?: Partial<ProviderSettings>;
  gemini?: Partial<ProviderSettings>;
  is_active?: boolean;
}

export interface AISettingsResponse {
  error: boolean;
  message: string;
  data: AISettings;
}

// API Keys Types
export interface APIKey {
  id: string;
  provider: 'openai' | 'gemini';
  key_name: string;
  api_key: string; // This will be masked in responses
  is_active: boolean;
  last_used_at?: string;
  create_at: string;
  update_at: string;
  created_by: string;
}

export interface CreateAPIKeyRequest {
  provider: 'openai' | 'gemini';
  key_name: string;
  api_key: string;
  is_active?: boolean;
}

export interface UpdateAPIKeyRequest {
  key_name?: string;
  api_key?: string;
  is_active?: boolean;
}

export interface APIKeysListResponse {
  error: boolean;
  message: string;
  data: APIKey[];
}

export interface APIKeyResponse {
  error: boolean;
  message: string;
  data: APIKey;
}

export interface APIKeyDeleteResponse {
  error: boolean;
  message: string;
}

// Chatbots Types
export interface Chatbot {
  id: string;
  portal_id: string;
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  system_prompt: string;
  is_active: boolean;
  display_order: number;
  created_by: string;
  create_at: string;
  update_at: string;
}

export interface CreateChatbotRequest {
  portal_id: string;
  name: string;
  slug?: string; // Optional, will be auto-generated if not provided
  description?: string;
  icon_url?: string;
  system_prompt: string;
  is_active?: boolean;
  display_order?: number;
}

export interface UpdateChatbotRequest {
  name?: string;
  description?: string;
  system_prompt?: string;
  icon_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface ChatbotsListResponse {
  error: boolean;
  message: string;
  data: Chatbot[];
  count?: number;
}

export interface ChatbotResponse {
  error: boolean;
  message: string;
  data: Chatbot;
}

export interface ChatbotDeleteResponse {
  error: boolean;
  message: string;
}

export interface ChatbotIconUploadResponse {
  error: boolean;
  message: string;
  data: {
    chatbot: Chatbot;
    icon_url: string;
  };
}

// User Activity Types
export interface UserActivity {
  id: string;
  user_name: string;
  action_summary: string;
  create_at: string;
}

export interface UserActivityPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface UserActivitiesResponse {
  error: boolean;
  message: string;
  data: UserActivity[];
  pagination: UserActivityPagination;
}

export interface UserActivityMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  message_order: number;
  tokens_used: number;
  create_at: string;
}

export interface UserActivityDetailData {
  activity: {
    id: string;
    action_summary: string;
    create_at: string;
  };
  user: {
    id: string;
    full_name: string;
    email: string;
    user_type: string;
  };
  chatbot: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
  session: {
    id: string;
    session_title: string;
    status: string;
    started_at: string;
    last_activity_at: string;
  };
  messages: UserActivityMessage[];
}

export interface UserActivityDetailResponse {
  error: boolean;
  message: string;
  data: UserActivityDetailData;
}
