import { 
  ApiResponse, 
  DashboardData, 
  AuditLog,
  Course,
  Lesson,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseListResponse,
  CourseResponse,
  CourseDeleteResponse,
  ThumbnailUploadResponse,
  ThumbnailUploadAndUpdateResponse,
  CreateLessonRequest,
  UpdateLessonRequest,
  LessonListResponse,
  LessonResponse,
  LessonDeleteResponse,
  VideoUploadResponse,
  VideoUploadAndUpdateResponse,
  LessonThumbnailUploadResponse,
  LessonThumbnailUploadAndUpdateResponse,
  AISettings,
  UpdateAISettingsRequest,
  AISettingsResponse,
  APIKey,
  CreateAPIKeyRequest,
  UpdateAPIKeyRequest,
  APIKeysListResponse,
  APIKeyResponse,
  APIKeyDeleteResponse,
  Chatbot,
  CreateChatbotRequest,
  UpdateChatbotRequest,
  ChatbotsListResponse,
  ChatbotResponse,
  ChatbotDeleteResponse,
  ChatbotIconUploadResponse,
  UserActivity,
  UserActivitiesResponse,
  UserActivityDetailResponse
} from '../types/api';
import { config } from '../config/env';

// Environment variables
const BACKEND_BASE_URL = config.backendBaseUrl;
const X_PROJECT_ID = config.xProjectId;

// Debug: Log the actual values being used
console.log('Backend URL:', BACKEND_BASE_URL);
console.log('Project ID:', X_PROJECT_ID);

// API Configuration
const API_CONFIG = {
  baseURL: BACKEND_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-project': X_PROJECT_ID,
  },
};

// Custom error class for API errors
export class ApiError extends Error {
  public status?: number;
  public response?: any;

  constructor(message: string, status?: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      0,
      error
    );
  }
}

// Dashboard API functions
export const dashboardApi = {
  /**
   * Get complete dashboard overview (Admin only)
   */
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<ApiResponse<DashboardData>>(
      '/v1/api/aiaccelerator/admin/lambda/dashboard',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },

  /**
   * Get dashboard data for a specific portal (Admin only)
   */
  async getDashboardByPortal(portalSlug: string): Promise<ApiResponse<DashboardData>> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<ApiResponse<DashboardData>>(
      `/v1/api/aiaccelerator/admin/lambda/dashboard/${portalSlug}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },

  /**
   * Get user dashboard (User accessible)
   */
  async getUserDashboard(): Promise<ApiResponse<DashboardData>> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<ApiResponse<DashboardData>>(
      '/v1/api/aiaccelerator/user/lambda/dashboard',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },
};

// Audit Logs API functions
export const auditLogsApi = {
  /**
   * Get audit logs with pagination and filtering
   */
  async getAuditLogs(params: {
    page?: number;
    limit?: number;
    admin_user_id?: string;
    action_type?: string;
    entity_type?: string;
    portal_id?: string;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<{ error: boolean; message: string; data: AuditLog[] }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/v1/api/aiaccelerator/admin/lambda/audit-logs${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest<{ error: boolean; message: string; data: AuditLog[] }>(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
      },
    });
  },
};

// Authentication API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  error: boolean;
  role?: string;
  token?: string;
  expire_at?: number;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  message?: string;
}

export const authApi = {
  /**
   * Admin login API
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiRequest<LoginResponse>(
      '/v1/api/aiaccelerator/admin/lambda/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  },

  /**
   * Get user data
   */
  getUser(): any | null {
    const userStr = localStorage.getItem('user_data');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Set authentication tokens and user data
   */
  setAuthData(data: LoginResponse): void {
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }
    if (data.expire_at) {
      localStorage.setItem('token_expire_at', data.expire_at.toString());
    }
    
    // Create user object from the response data
    const userData = {
      id: data.user_id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role
    };
    
    localStorage.setItem('user_data', JSON.stringify(userData));
  },

  /**
   * Remove all authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expire_at');
    localStorage.removeItem('user_data');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
  },
};

// Resources API functions
export interface ResourceCard {
  id: string;
  portal_id: string;
  title: string;
  description?: string;
  type: 'url' | 'text' | 'file';
  url?: string; // For url type
  text_content?: string; // For text type
  file_url?: string; // For file type
  thumbnail_url?: string;
  category_id?: string;
  display_order: number;
  is_published: boolean;
  create_at: string;
  update_at: string;
  created_by: string;
}

export interface CreateResourceRequest {
  portal_id: string;
  title: string;
  description?: string;
  type: 'url' | 'text' | 'file';
  url?: string; // Required for url type
  text_content?: string; // Required for text type
  file?: File; // Required for file type (multipart)
  thumbnail_url?: string;
  category_id?: string;
  display_order?: number;
  is_published?: boolean;
}

export interface UpdateResourceRequest {
  title?: string;
  description?: string;
  type?: 'url' | 'text' | 'file';
  url?: string;
  text_content?: string;
  file_url?: string;
  thumbnail_url?: string;
  category_id?: string;
  display_order?: number;
  is_published?: boolean;
}

export interface Portal {
  id: string;
  slug: string;
  title: string;
  description: string;
  welcome_message: string;
  is_active: number;
  display_order: number;
  create_at: string;
  update_at: string;
}

export const portalsApi = {
  /**
   * Get all active portals (Admin only)
   */
  async getPortals(): Promise<{ error: boolean; message: string; portals: Portal[]; total_count: number }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<{ error: boolean; message: string; portals: Portal[]; total_count: number }>(
      '/v1/api/aiaccelerator/admin/lambda/portals',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get portal by ID
   */
  async getPortalById(id: string): Promise<{ error: boolean; message: string; portal: any }> {
    return apiRequest<{ error: boolean; message: string; portal: any }>(
      `/v1/api/aiaccelerator/lambda/portals/${id}`,
      {
        method: 'GET',
        headers: {
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get portal by slug
   */
  async getPortalBySlug(slug: string): Promise<{ error: boolean; message: string; portal: any }> {
    return apiRequest<{ error: boolean; message: string; portal: any }>(
      `/v1/api/aiaccelerator/lambda/portals/slug/${slug}`,
      {
        method: 'GET',
        headers: {
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },
};

// Categories API interfaces
export interface Category {
  id: string;
  name: string;
  portal_id: string;
  create_at: string;
  update_at: string;
}

export interface CreateCategoryRequest {
  portal_id: string;
  name: string;
}

export interface UpdateCategoryRequest {
  portal_id: string;
  name: string;
}

export const categoriesApi = {
  /**
   * Get all categories for a specific portal
   */
  async getCategories(portal_id?: string): Promise<{ error: boolean; categories: Category[]; total_count: number }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    if (portal_id) {
      queryParams.append('portal_id', portal_id);
    }
    
    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/lambda/categories${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching categories with portal_id:', portal_id);
    console.log('API URL:', url);
    
    const result = await apiRequest<{ error: boolean; categories: Category[]; total_count: number }>(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
    
    console.log('Categories API response:', result);
    return result;
  },

  /**
   * Create a new category (Admin only)
   */
  async createCategory(data: CreateCategoryRequest): Promise<{ error: boolean; message: string; category: Category }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<{ error: boolean; message: string; category: Category }>(
      '/v1/api/aiaccelerator/admin/lambda/categories',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update an existing category (Admin only)
   */
  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<{ error: boolean; message: string; category: Category }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<{ error: boolean; message: string; category: Category }>(
      `/v1/api/aiaccelerator/admin/lambda/categories/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Delete a category (Admin only)
   */
  async deleteCategory(id: string): Promise<{ error: boolean; message: string }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    console.log('Deleting category with ID:', id);
    console.log('API URL:', `/v1/api/aiaccelerator/admin/lambda/categories/${id}`);

    const result = await apiRequest<{ error: boolean; message: string }>(
      `/v1/api/aiaccelerator/admin/lambda/categories/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
    
    console.log('Category deletion result:', result);
    return result;
  },
};

export const resourcesApi = {
  /**
   * Get resource cards with pagination and filtering
   */
  async getResources(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: string;
    portal_id?: string;
    is_published?: boolean;
  }): Promise<{ error: boolean; resources: ResourceCard[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category_id) queryParams.append('category_id', params.category_id);
    if (params?.portal_id) queryParams.append('portal_id', params.portal_id);
    if (params?.is_published !== undefined) queryParams.append('is_published', params.is_published.toString());

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/lambda/resources${queryString ? `?${queryString}` : ''}`;

    return apiRequest<{ error: boolean; resources: ResourceCard[]; pagination: any }>(
      url,
      {
        method: 'GET',
        headers: {
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get a single resource card by ID
   */
  async getResourceById(id: string): Promise<{ error: boolean; resource: ResourceCard }> {
    return apiRequest<{ error: boolean; resource: ResourceCard }>(
      `/v1/api/aiaccelerator/lambda/resources/${id}`,
      {
        method: 'GET',
        headers: {
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Search resource cards by title and category
   */
  async searchResources(params: {
    title?: string;
    category_id?: string;
    portal_id?: string;
  }): Promise<{ error: boolean; resources: ResourceCard[]; search_params: any; total_count: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.title) queryParams.append('title', params.title);
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.portal_id) queryParams.append('portal_id', params.portal_id);

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/lambda/resources/search?${queryString}`;

    return apiRequest<{ error: boolean; resources: ResourceCard[]; search_params: any; total_count: number }>(
      url,
      {
        method: 'GET',
        headers: {
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Upload a file for use in resource cards
   */
  async uploadFile(file: File): Promise<{ error: boolean; message: string; file_url: string; file_id: string; file_info: any }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/resources/upload-file`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  /**
   * Upload file and update an existing resource card
   */
  async uploadFileAndUpdateResource(resourceId: string, file: File): Promise<{ error: boolean; message: string; resource: ResourceCard; file_info: any }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/resources/${resourceId}/upload-file`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  /**
   * Create a new resource card
   */
  async createResource(data: CreateResourceRequest): Promise<{ error: boolean; message: string; resource: ResourceCard }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    console.log('createResource called with data:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data));

    // Handle file upload with multipart/form-data
    if (data.type === 'file' && data.file) {
      console.log('✅ ENTERING FILE UPLOAD BRANCH');
      console.log('Creating file resource with file:', data.file.name, 'size:', data.file.size);
      console.log('File type:', data.file.type);
      console.log('File lastModified:', data.file.lastModified);
      
      // Validate file
      if (!data.file || data.file.size === 0) {
        throw new ApiError('Invalid file: file is empty or missing', 400);
      }
      
      // WORKAROUND: Use two-step process since backend FormData parsing is broken
      console.log('🔄 Using two-step file upload process...');
      
      // Step 1: Upload the file
      console.log('Step 1: Uploading file...');
      
      // Call uploadFile directly to avoid circular reference
      const formData = new FormData();
      formData.append('file', data.file);
      
      const uploadUrl = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/resources/upload-file`;
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `File upload failed! status: ${uploadResponse.status}`,
          uploadResponse.status,
          errorData
        );
      }
      
      const uploadResult = await uploadResponse.json();
      console.log('File upload result:', uploadResult);
      
      // Step 2: Create resource with file_url
      console.log('Step 2: Creating resource with file_url...');
      const resourcePayload = {
        portal_id: data.portal_id,
        title: data.title,
        description: data.description,
        type: 'file',
        file_url: uploadResult.file_url,
        thumbnail_url: data.thumbnail_url,
        category_id: data.category_id,
        display_order: data.display_order,
        is_published: data.is_published,
      };
      
      console.log('Creating resource with payload:', resourcePayload);
      
      return apiRequest<{ error: boolean; message: string; resource: ResourceCard }>(
        '/v1/api/aiaccelerator/admin/lambda/resources',
        {
          method: 'POST',
          body: JSON.stringify(resourcePayload),
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-project': X_PROJECT_ID,
          },
        }
      );
    }

    // Handle url and text types with JSON
    console.log('⚠️ FALLING THROUGH TO JSON BRANCH - This should not happen for file uploads!');
    console.log('Data type was:', data.type);
    console.log('Data file was:', data.file);
    
    const payload: any = {
      portal_id: data.portal_id,
      title: data.title,
      type: data.type,
    };

    if (data.description) payload.description = data.description;
    if (data.thumbnail_url) payload.thumbnail_url = data.thumbnail_url;
    if (data.category_id) payload.category_id = data.category_id;
    if (data.display_order !== undefined) payload.display_order = data.display_order;
    if (data.is_published !== undefined) payload.is_published = data.is_published;

    // Add type-specific fields
    if (data.type === 'url' && data.url) {
      payload.url = data.url;
    } else if (data.type === 'text' && data.text_content) {
      payload.text_content = data.text_content;
    }

    console.log('Creating JSON resource with payload:', payload);

    return apiRequest<{ error: boolean; message: string; resource: ResourceCard }>(
      '/v1/api/aiaccelerator/admin/lambda/resources',
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update an existing resource card
   */
  async updateResource(id: string, data: UpdateResourceRequest): Promise<{ error: boolean; message: string; resource: ResourceCard }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const payload: any = {};

    // Add basic fields
    if (data.title) payload.title = data.title;
    if (data.description) payload.description = data.description;
    if (data.thumbnail_url) payload.thumbnail_url = data.thumbnail_url;
    if (data.category_id) payload.category_id = data.category_id;
    if (data.display_order !== undefined) payload.display_order = data.display_order;
    if (data.is_published !== undefined) payload.is_published = data.is_published;

    // Add type-specific fields
    if (data.type) payload.type = data.type;
    if (data.url !== undefined) payload.url = data.url;
    if (data.text_content !== undefined) payload.text_content = data.text_content;
    if (data.file_url !== undefined) payload.file_url = data.file_url;

    return apiRequest<{ error: boolean; message: string; resource: ResourceCard }>(
      `/v1/api/aiaccelerator/admin/lambda/resources/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Delete a resource card
   */
  async deleteResource(id: string): Promise<{ error: boolean; message: string }> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<{ error: boolean; message: string }>(
      `/v1/api/aiaccelerator/admin/lambda/resources/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },
};

// Courses API functions
export const coursesApi = {
  /**
   * Create a new course
   */
  async createCourse(data: CreateCourseRequest): Promise<CourseResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<CourseResponse>(
      '/v1/api/aiaccelerator/admin/lambda/courses',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get all courses with pagination and optional filtering
   */
  async getCourses(params?: {
    page?: number;
    limit?: number;
    portal_id?: string;
    include_lessons?: boolean;
  }): Promise<CourseListResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.portal_id) queryParams.append('portal_id', params.portal_id);
    if (params?.include_lessons !== undefined) queryParams.append('include_lessons', params.include_lessons.toString());

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/admin/lambda/courses${queryString ? `?${queryString}` : ''}`;

    return apiRequest<CourseListResponse>(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get a specific course by ID
   */
  async getCourseById(id: string, include_lessons?: boolean): Promise<CourseResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    if (include_lessons !== undefined) {
      queryParams.append('include_lessons', include_lessons.toString());
    }

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/admin/lambda/courses/${id}${queryString ? `?${queryString}` : ''}`;

    return apiRequest<CourseResponse>(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update an existing course
   */
  async updateCourse(id: string, data: UpdateCourseRequest): Promise<CourseResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<CourseResponse>(
      `/v1/api/aiaccelerator/admin/lambda/courses/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Delete a course and all its associated lessons
   */
  async deleteCourse(id: string): Promise<CourseDeleteResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<CourseDeleteResponse>(
      `/v1/api/aiaccelerator/admin/lambda/courses/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Upload a course thumbnail
   */
  async uploadThumbnail(file: File): Promise<ThumbnailUploadResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('thumbnail', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/courses/upload-thumbnail`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  /**
   * Upload thumbnail and update course
   */
  async uploadThumbnailAndUpdateCourse(courseId: string, file: File): Promise<ThumbnailUploadAndUpdateResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('thumbnail', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/courses/${courseId}/upload-thumbnail`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },
};

// Lessons API functions
export const lessonsApi = {
  /**
   * Create a new lesson
   */
  async createLesson(data: CreateLessonRequest): Promise<LessonResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<LessonResponse>(
      '/v1/api/aiaccelerator/admin/lambda/lessons',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get all lessons with pagination and optional filtering
   */
  async getLessons(params?: {
    page?: number;
    limit?: number;
    course_id?: string;
  }): Promise<LessonListResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.course_id) queryParams.append('course_id', params.course_id);

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/admin/lambda/lessons${queryString ? `?${queryString}` : ''}`;

    return apiRequest<LessonListResponse>(
      url,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get a specific lesson by ID
   */
  async getLessonById(id: string): Promise<LessonResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<LessonResponse>(
      `/v1/api/aiaccelerator/admin/lambda/lessons/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update an existing lesson
   */
  async updateLesson(id: string, data: UpdateLessonRequest): Promise<LessonResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<LessonResponse>(
      `/v1/api/aiaccelerator/admin/lambda/lessons/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Delete a lesson
   */
  async deleteLesson(id: string): Promise<LessonDeleteResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<LessonDeleteResponse>(
      `/v1/api/aiaccelerator/admin/lambda/lessons/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Upload a lesson video
   */
  async uploadVideo(file: File): Promise<VideoUploadResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('video', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/lessons/upload-video`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  /**
   * Upload video and update lesson
   */
  async uploadVideoAndUpdateLesson(lessonId: string, file: File): Promise<VideoUploadAndUpdateResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('video', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/lessons/${lessonId}/upload-video`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  /**
   * Upload a lesson thumbnail
   */
  async uploadThumbnail(file: File): Promise<LessonThumbnailUploadResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('thumbnail', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/lessons/upload-thumbnail`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },

  /**
   * Upload thumbnail and update lesson
   */
  async uploadThumbnailAndUpdateLesson(lessonId: string, file: File): Promise<LessonThumbnailUploadAndUpdateResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('thumbnail', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/lessons/${lessonId}/upload-thumbnail`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
        // Do NOT set Content-Type - let browser set it automatically for multipart/form-data
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },
};

// AI Settings API functions
export const aiSettingsApi = {
  /**
   * Get AI settings for a specific portal
   */
  async getAISettings(portalSlug: 'founder' | 'business-owner'): Promise<AISettingsResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<AISettingsResponse>(
      `/v1/api/aiaccelerator/admin/lambda/ai_settings/${portalSlug}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update AI settings for a specific portal
   */
  async updateAISettings(portalSlug: 'founder' | 'business-owner', data: UpdateAISettingsRequest): Promise<AISettingsResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<AISettingsResponse>(
      `/v1/api/aiaccelerator/admin/lambda/ai_settings/${portalSlug}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },
};

// API Keys API functions
export const apiKeysApi = {
  /**
   * Get all API keys
   */
  async getAPIKeys(): Promise<APIKeysListResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<APIKeysListResponse>(
      '/v1/api/aiaccelerator/admin/lambda/api_keys',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get API key by provider
   */
  async getAPIKeyByProvider(provider: 'openai' | 'gemini'): Promise<APIKeyResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<APIKeyResponse>(
      `/v1/api/aiaccelerator/admin/lambda/api_keys/provider/${provider}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Create a new API key
   */
  async createAPIKey(data: CreateAPIKeyRequest): Promise<APIKeyResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<APIKeyResponse>(
      '/v1/api/aiaccelerator/admin/lambda/api_keys',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update an existing API key by provider
   */
  async updateAPIKey(provider: 'openai' | 'gemini', data: UpdateAPIKeyRequest): Promise<APIKeyResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<APIKeyResponse>(
      `/v1/api/aiaccelerator/admin/lambda/api_keys/provider/${provider}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Delete an API key by provider
   */
  async deleteAPIKey(provider: 'openai' | 'gemini'): Promise<APIKeyDeleteResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<APIKeyDeleteResponse>(
      `/v1/api/aiaccelerator/admin/lambda/api_keys/provider/${provider}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Get active API key by provider
   */
  async getActiveAPIKey(provider: 'openai' | 'gemini'): Promise<APIKeyResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<APIKeyResponse>(
      `/v1/api/aiaccelerator/admin/lambda/api_keys/provider/${provider}/active`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },
};

// Chatbots API functions
export const chatbotsApi = {
  /**
   * Get all chatbots with optional filtering
   */
  async getChatbots(params?: {
    portal_id?: string;
    is_active?: boolean;
  }): Promise<ChatbotsListResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    if (params?.portal_id) queryParams.append('portal_id', params.portal_id);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/admin/lambda/chatbots${queryString ? `?${queryString}` : ''}`;

    return apiRequest<ChatbotsListResponse>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
      },
    });
  },

  /**
   * Get chatbots for a specific portal (recommended)
   */
  async getChatbotsByPortal(portalId: string, isActive?: boolean): Promise<ChatbotsListResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    if (isActive !== undefined) queryParams.append('is_active', isActive.toString());

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/admin/lambda/portals/${portalId}/chatbots${queryString ? `?${queryString}` : ''}`;

    console.log('📡 Calling getChatbotsByPortal with URL:', url);
    
    return apiRequest<ChatbotsListResponse>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
      },
    });
  },

  /**
   * Get a single chatbot by ID
   */
  async getChatbotById(id: string): Promise<ChatbotResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<ChatbotResponse>(
      `/v1/api/aiaccelerator/admin/lambda/chatbots/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Create a new chatbot
   */
  async createChatbot(data: CreateChatbotRequest): Promise<ChatbotResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    // Auto-generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    return apiRequest<ChatbotResponse>(
      '/v1/api/aiaccelerator/admin/lambda/chatbots',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Update an existing chatbot
   */
  async updateChatbot(id: string, data: UpdateChatbotRequest): Promise<ChatbotResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<ChatbotResponse>(
      `/v1/api/aiaccelerator/admin/lambda/chatbots/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Delete a chatbot
   */
  async deleteChatbot(id: string): Promise<ChatbotDeleteResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<ChatbotDeleteResponse>(
      `/v1/api/aiaccelerator/admin/lambda/chatbots/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },

  /**
   * Upload chatbot icon
   */
  async uploadIcon(id: string, file: File): Promise<ChatbotIconUploadResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const formData = new FormData();
    formData.append('icon', file);

    const url = `${API_CONFIG.baseURL}/v1/api/aiaccelerator/admin/lambda/chatbots/${id}/icon`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  },
};

// User Activities API functions
export const userActivitiesApi = {
  /**
   * Get user activities with pagination
   */
  async getUserActivities(params?: {
    page?: number;
    limit?: number;
  }): Promise<UserActivitiesResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/v1/api/aiaccelerator/admin/lambda/user-activities${queryString ? `?${queryString}` : ''}`;

    return apiRequest<UserActivitiesResponse>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
      },
    });
  },

  /**
   * Get activity messages (full conversation context)
   */
  async getActivityMessages(activityId: string): Promise<UserActivityDetailResponse> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<UserActivityDetailResponse>(
      `/v1/api/aiaccelerator/admin/lambda/user-activities/${activityId}/messages`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-project': X_PROJECT_ID,
        },
      }
    );
  },
};

// API client with authentication
export const apiClient = {
  ...dashboardApi,
  ...auditLogsApi,
  ...authApi,
  ...portalsApi,
  ...categoriesApi,
  ...resourcesApi,
  ...coursesApi,
  ...lessonsApi,
  ...aiSettingsApi,
  ...apiKeysApi,
  ...chatbotsApi,
  ...userActivitiesApi,
  
  /**
   * Make authenticated request
   */
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = authApi.getToken();
    
    if (!token) {
      throw new ApiError('Authentication token not found', 401);
    }

    return apiRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'x-project': X_PROJECT_ID,
      },
    });
  },
};

export default apiClient;
