


# Dashboard API Documentation

## Overview
The Dashboard API provides comprehensive overview data for the AI Accelerator platform, aggregating information about courses, lessons, resources, AI tools, and user progress across all portals or specific portals.

## Base URLs
- **Admin Dashboard**: `/v1/api/aiaccelerator/admin/lambda/dashboard`
- **User Dashboard**: `/v1/api/aiaccelerator/user/lambda/dashboard`

## Authentication
All endpoints require authentication:
- **Admin endpoints**: Require admin JWT token
- **User endpoints**: Require user JWT token (admin or enduser)

Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Required Headers
All API requests must include the project identifier header:
```
x-project: aiaccelerator
```

## Endpoints

### 1. Get Complete Dashboard Overview (Admin Only)
**GET** `/v1/api/aiaccelerator/admin/lambda/dashboard`

Retrieves comprehensive dashboard data for all portals including statistics, content, and user progress.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "overview": {
      "total_portals": 2,
      "total_courses": 20,
      "total_lessons": 177,
      "total_resources": 45,
      "total_ai_tools": 3,
      "total_users": 150
    },
    "portals": [
      {
        "portal_id": "uuid",
        "portal_slug": "business-owner",
        "portal_title": "Business Owner Portal",
        "portal_description": "AI solutions for established businesses",
        "courses": {
          "total": 12,
          "published": 12,
          "unpublished": 0,
          "list": [
            {
              "id": "uuid",
              "title": "AI Fundamentals",
              "description": "Learn the basics of AI",
              "thumbnail_url": "https://...",
              "estimated_duration_minutes": 120,
              "display_order": 1,
              "create_at": "2025-01-01T00:00:00.000Z"
            }
          ]
        },
        "lessons": {
          "total": 105,
          "published": 105,
          "unpublished": 0
        },
        "resources": {
          "total": 25,
          "published": 25,
          "unpublished": 0,
          "by_category": {
            "tools": 8,
            "guides": 6,
            "websites": 7,
            "templates": 4
          },
          "list": [
            {
              "id": "uuid",
              "title": "AI Tools Collection",
              "description": "Collection of useful AI tools",
              "url": "https://example.com",
              "thumbnail_url": "https://...",
              "category": "tools",
              "display_order": 1,
              "create_at": "2025-01-01T00:00:00.000Z"
            }
          ]
        },
        "ai_tools": {
          "total": 2,
          "active": 2,
          "inactive": 0,
          "list": [
            {
              "id": "uuid",
              "name": "Profit Radar",
              "slug": "profit-radar",
              "description": "AI-powered profit analysis tool",
              "icon_url": "https://...",
              "display_order": 1,
              "create_at": "2025-01-01T00:00:00.000Z"
            }
          ]
        },
        "users": {
          "total": 75,
          "active": 70,
          "completed_onboarding": 65
        },
        "user_progress": {
          "total_enrollments": 150,
          "completed_courses": 45,
          "in_progress_courses": 60,
          "not_started": 45
        }
      }
    ]
  },
  "generated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### 2. Get Dashboard by Portal (Admin Only)
**GET** `/v1/api/aiaccelerator/admin/lambda/dashboard/:portal_slug`

Retrieves detailed dashboard data for a specific portal.

#### Parameters
- `portal_slug` (required): Portal slug - must be "founder" or "business-owner"

#### Response (200 OK)
```json
{
  "error": false,
  "message": "Dashboard data for Business Owner Portal retrieved successfully",
  "data": {
    "portal": {
      "id": "uuid",
      "slug": "business-owner",
      "title": "Business Owner Portal",
      "description": "AI solutions for established businesses",
      "welcome_message": "Welcome to the Business Owner Portal!",
      "is_active": true,
      "display_order": 2,
      "create_at": "2025-01-01T00:00:00.000Z"
    },
    "statistics": {
      "courses": {
        "total": 12,
        "published": 12,
        "unpublished": 0
      },
      "lessons": {
        "total": 105,
        "published": 105,
        "unpublished": 0
      },
      "resources": {
        "total": 25,
        "published": 25,
        "unpublished": 0,
        "by_category": {
          "tools": 8,
          "guides": 6,
          "websites": 7,
          "templates": 4
        }
      },
      "ai_tools": {
        "total": 2,
        "active": 2,
        "inactive": 0
      },
      "users": {
        "total": 75,
        "active": 70,
        "completed_onboarding": 65
      },
      "user_progress": {
        "total_enrollments": 150,
        "completed_courses": 45,
        "in_progress_courses": 60,
        "not_started": 45
      }
    },
    "content": {
      "courses": [
        {
          "id": "uuid",
          "title": "AI Fundamentals",
          "description": "Learn the basics of AI",
          "thumbnail_url": "https://...",
          "estimated_duration_minutes": 120,
          "display_order": 1,
          "lessons": [
            {
              "id": "uuid",
              "title": "Introduction to AI",
              "description": "First lesson in AI fundamentals",
              "video_url": "https://...",
              "video_provider": "youtube",
              "duration_seconds": 1800,
              "thumbnail_url": "https://...",
              "lesson_number": 1,
              "display_order": 1,
              "create_at": "2025-01-01T00:00:00.000Z"
            }
          ],
          "lessons_count": 8
        }
      ],
      "resources": [
        {
          "id": "uuid",
          "title": "AI Tools Collection",
          "description": "Collection of useful AI tools",
          "url": "https://example.com",
          "thumbnail_url": "https://...",
          "category": "tools",
          "display_order": 1,
          "create_at": "2025-01-01T00:00:00.000Z"
        }
      ],
      "ai_tools": [
        {
          "id": "uuid",
          "name": "Profit Radar",
          "slug": "profit-radar",
          "description": "AI-powered profit analysis tool",
          "icon_url": "https://...",
          "display_order": 1,
          "create_at": "2025-01-01T00:00:00.000Z"
        }
      ]
    }
  },
  "generated_at": "2025-01-01T12:00:00.000Z"
}
```

---

### 3. Get User Dashboard (User Accessible)
**GET** `/v1/api/aiaccelerator/user/lambda/dashboard`

Retrieves personalized dashboard data for the authenticated user, including their progress and available content.

#### Response (200 OK)
```json
{
  "error": false,
  "message": "User dashboard data retrieved successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "user_type": "business-owner",
      "company_name": "My Company Inc",
      "onboarding_completed": true,
      "last_login_at": "2025-01-01T10:00:00.000Z"
    },
    "portal": {
      "id": "uuid",
      "slug": "business-owner",
      "title": "Business Owner Portal",
      "description": "AI solutions for established businesses",
      "welcome_message": "Welcome to the Business Owner Portal!"
    },
    "statistics": {
      "courses": {
        "total": 12,
        "enrolled": 3,
        "completed": 1,
        "in_progress": 2
      },
      "lessons": {
        "total": 105,
        "completed": 8
      },
      "resources": {
        "total": 25,
        "by_category": {
          "tools": 8,
          "guides": 6,
          "websites": 7,
          "templates": 4
        }
      },
      "ai_tools": {
        "total": 2
      }
    },
    "content": {
      "courses": [
        {
          "id": "uuid",
          "title": "AI Fundamentals",
          "description": "Learn the basics of AI",
          "thumbnail_url": "https://...",
          "estimated_duration_minutes": 120,
          "display_order": 1,
          "lessons_count": 8,
          "lessons": [
            {
              "id": "uuid",
              "title": "Introduction to AI",
              "description": "First lesson in AI fundamentals",
              "video_url": "https://...",
              "video_provider": "youtube",
              "duration_seconds": 1800,
              "thumbnail_url": "https://...",
              "lesson_number": 1,
              "display_order": 1
            }
          ]
        }
      ],
      "resources": [
        {
          "id": "uuid",
          "title": "AI Tools Collection",
          "description": "Collection of useful AI tools",
          "url": "https://example.com",
          "thumbnail_url": "https://...",
          "category": "tools",
          "display_order": 1
        }
      ],
      "ai_tools": [
        {
          "id": "uuid",
          "name": "Profit Radar",
          "slug": "profit-radar",
          "description": "AI-powered profit analysis tool",
          "icon_url": "https://...",
          "display_order": 1
        }
      ]
    },
    "progress": [
      {
        "course_id": "uuid",
        "completion_percentage": 75,
        "completed_lessons": 6,
        "total_lessons": 8,
        "started_at": "2025-01-01T08:00:00.000Z",
        "completed_at": null,
        "last_accessed_at": "2025-01-01T10:00:00.000Z"
      }
    ]
  },
  "generated_at": "2025-01-01T12:00:00.000Z"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": true,
  "message": "Authorization token missing"
}
```

### 403 Forbidden
```json
{
  "error": true,
  "message": "Access denied: Admin role required"
}
```

### 404 Not Found
```json
{
  "error": true,
  "message": "Portal with slug 'invalid-portal' not found"
}
```

### 500 Internal Server Error
```json
{
  "error": true,
  "message": "Internal server error while retrieving dashboard data"
}
```

## Usage Examples

### Get Complete Dashboard Overview
```bash
curl -X GET "http://localhost:3048/v1/api/aiaccelerator/admin/lambda/dashboard" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "x-project: aiaccelerator"
```

### Get Business Owner Portal Dashboard
```bash
curl -X GET "http://localhost:3048/v1/api/aiaccelerator/admin/lambda/dashboard/business-owner" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "x-project: aiaccelerator"
```

### Get User Dashboard
```bash
curl -X GET "http://localhost:3048/v1/api/aiaccelerator/user/lambda/dashboard" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "x-project: aiaccelerator"
```

## Data Structure Notes

### Portal Statistics
- **Courses**: Total, published, and unpublished course counts
- **Lessons**: Total, published, and unpublished lesson counts (aggregated from all courses)
- **Resources**: Total, published, unpublished, and categorized resource counts
- **AI Tools**: Total, active, and inactive chatbot counts
- **Users**: Total, active, and onboarding completion statistics
- **User Progress**: Enrollment and completion statistics

### Content Lists
- **Courses**: Include lesson details and counts
- **Resources**: Categorized by type (tools, guides, websites, templates)
- **AI Tools**: Active chatbots with basic information

### User Progress
- Individual course progress with completion percentages
- Completed lesson tracking
- Access timestamps for analytics

## Performance Considerations
- Dashboard queries aggregate data from multiple tables
- Consider caching for frequently accessed dashboard data
- Large datasets may require pagination in future versions
- Database indexes on portal_id, is_published, and is_active fields improve performance


# Audit Logs API

## Overview
Retrieve audit logs with pagination and filtering capabilities. This endpoint provides access to all admin activities logged in the system with human-readable descriptions.

## Endpoint
```
GET /v1/api/aiaccelerator/admin/lambda/audit-logs
```

## Headers
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
x-project: aiaccelerator
```

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of logs per page (max 100) |
| `admin_user_id` | string | No | - | Filter by specific admin user ID |
| `action_type` | string | No | - | Filter by action type (CREATE, UPDATE, DELETE, UPLOAD, LOGIN) |
| `entity_type` | string | No | - | Filter by entity type (COURSE, LESSON, CHATBOT, RESOURCE, API_KEY, AI_SETTINGS) |
| `portal_id` | string | No | - | Filter by portal ID |
| `start_date` | string | No | - | Filter logs from this date (YYYY-MM-DD) |
| `end_date` | string | No | - | Filter logs until this date (YYYY-MM-DD) |

## Response Format

### Success Response (200)
```json
{
  "error": false,
  "message": "Audit logs retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "admin_user": {
        "id": "uuid",
        "email": "admin@example.com",
        "name": "John Smith"
      },
      "action": {
        "type": "CREATE",
        "entity_type": "COURSE",
        "entity_id": "uuid",
        "entity_name": "Advanced Marketing Course"
      },
      "portal": {
        "id": "uuid",
        "slug": "founder"
      },
      "description": "John Smith created course titled \"Advanced Marketing Course\"",
      "old_values": null,
      "new_values": {
        "id": "uuid",
        "title": "Advanced Marketing Course",
        "description": "Learn advanced marketing strategies",
        "portal_id": "uuid"
      },
      "metadata": {
        "portal_title": "Founder Portal"
      },
      "request_info": {
        "ip_address": "192.168.1.1",
        "user_agent": "Mozilla/5.0..."
      },
      "created_at": "2024-01-15 10:30:00"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 47,
    "limit": 10,
    "has_next": true,
    "has_prev": false
  },
  "filters_applied": {
    "admin_user_id": null,
    "action_type": null,
    "entity_type": null,
    "portal_id": null,
    "start_date": null,
    "end_date": null
  }
}
```

### Error Response (401)
```json
{
  "error": true,
  "message": "Authorization token missing"
}
```

### Error Response (403)
```json
{
  "error": true,
  "message": "Access denied: Admin role required"
}
```

### Error Response (500)
```json
{
  "error": true,
  "message": "Internal server error while retrieving audit logs"
}
```

## Usage Examples

### Get Latest 10 Audit Logs
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

### Get Audit Logs with Pagination
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs?page=2&limit=20" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

### Filter by Action Type
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs?action_type=CREATE" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

### Filter by Entity Type
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs?entity_type=COURSE" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

### Filter by Date Range
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs?start_date=2024-01-01&end_date=2024-01-31" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

### Filter by Admin User
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs?admin_user_id=uuid" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

### Combined Filters
```bash
curl -X GET "https://api.example.com/v1/api/aiaccelerator/admin/lambda/audit-logs?action_type=UPDATE&entity_type=COURSE&portal_id=uuid&page=1&limit=5" \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "x-project: aiaccelerator"
```

## Action Types
- `CREATE` - Entity was created
- `UPDATE` - Entity was updated
- `DELETE` - Entity was deleted
- `UPLOAD` - File was uploaded
- `LOGIN` - Admin user logged in
- `LOGOUT` - Admin user logged out
- `EXPORT` - Data was exported
- `IMPORT` - Data was imported

## Entity Types
- `COURSE` - Course entities
- `LESSON` - Lesson entities
- `CHATBOT` - Chatbot entities
- `RESOURCE` - Resource card entities
- `API_KEY` - API key entities
- `AI_SETTINGS` - AI settings entities
- `PORTAL` - Portal entities
- `USER` - User entities
- `FILE` - File entities

## Human-Readable Descriptions
The audit logs include human-readable descriptions that make it easy to understand what happened:

### Course Actions
- `"John Smith created course titled 'Advanced Marketing Course'"`
- `"Sarah Johnson updated course titled 'Advanced Marketing Course'"`
- `"Mike Wilson deleted course titled 'Advanced Marketing Course'"`

### Lesson Actions
- `"John Smith created lesson 'Intro to Marketing' in course 'Advanced Marketing Course'"`
- `"Sarah Johnson updated lesson 'Intro to Marketing' in course 'Advanced Marketing Course'"`
- `"Mike Wilson deleted lesson 'Intro to Marketing' from course 'Advanced Marketing Course'"`

### Chatbot Actions
- `"John Smith created chatbot 'AI Assistant' in Founder Portal"`
- `"Sarah Johnson updated chatbot 'AI Assistant' in Founder Portal"`
- `"Mike Wilson deleted chatbot 'AI Assistant' from Founder Portal"`

### File Upload Actions
- `"John Smith uploaded thumbnail 'course-image.jpg' for course"`
- `"Sarah Johnson uploaded video 'lesson-video.mp4' for lesson"`
- `"Mike Wilson uploaded icon 'chatbot-icon.png' for chatbot"`

### Resource Actions
- `"John Smith created resource 'Marketing Templates' in Founder Portal"`
- `"Sarah Johnson updated resource 'Marketing Templates' in Founder Portal"`
- `"Mike Wilson deleted resource 'Marketing Templates' from Founder Portal"`

### API Key Actions
- `"John Smith created API key 'OpenAI Key' (openai)"`
- `"Sarah Johnson updated API key 'OpenAI Key' (openai)"`
- `"Mike Wilson deleted API key 'OpenAI Key' (openai)"`

## Notes
- Results are ordered by `create_at` in descending order (newest first)
- Maximum limit per page is 100
- Date filters use `YYYY-MM-DD` format
- All filter parameters are optional
- The `old_values` and `new_values` fields contain JSON data for tracking changes
- The `metadata` field contains additional context information
- Request information includes IP address and User-Agent for security tracking
- Descriptions are automatically generated in human-readable format
- Admin user names are fetched and included in descriptions for better context
