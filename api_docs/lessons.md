# Admin Lessons API Documentation

## Overview
This document provides comprehensive API documentation for lesson management operations available to admin users in the AI Accelerator backend.

## Base URL
```
https://mkdlabs.com/v1/api/aiaccelerator/admin/lambda
```

## Authentication
All admin endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <admin_jwt_token>
```

## Required Headers
All API requests must include the project identifier header:
```
x-project: aiaccelerator
```

## Lesson Management

### 1. Create Lesson
Creates a new lesson in the system.

**Endpoint:** `POST /lessons`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "course_id": "uuid-string",
  "title": "Lesson Title",
  "description": "Lesson description (optional)",
  "video_id": "youtube-video-id (optional)",
  "video_url": "https://example.com/video.mp4",
  "video_provider": "s3",
  "duration_seconds": 3600,
  "thumbnail_url": "https://example.com/thumbnail.jpg (optional)",
  "transcript": "Lesson transcript (optional)",
  "lesson_number": 1,
  "display_order": 1,
  "is_published": false
}
```

**Video Providers:**
- `s3`: AWS S3 hosted videos
- `youtube`: YouTube videos
- `vimeo`: Vimeo videos
- `wistia`: Wistia videos
- `custom`: Custom video URLs

**Response (201 Created):**
```json
{
  "error": false,
  "message": "Lesson created successfully",
  "lesson": {
    "id": "uuid-string",
    "course_id": "uuid-string",
    "title": "Lesson Title",
    "description": "Lesson description",
    "video_id": "youtube-video-id",
    "video_url": "https://example.com/video.mp4",
    "video_provider": "s3",
    "duration_seconds": 3600,
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "transcript": "Lesson transcript",
    "lesson_number": 1,
    "display_order": 1,
    "is_published": false,
    "create_at": "2025-01-15T10:30:00.000Z",
    "update_at": "2025-01-15T10:30:00.000Z",
    "created_by": "admin-user-uuid"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data or course not found
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Insufficient permissions

### 2. Get All Lessons
Retrieves all lessons with pagination and optional filtering.

**Endpoint:** `GET /lessons`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `course_id` (optional): Filter by course ID

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Lessons retrieved successfully",
  "lessons": [
    {
      "id": "uuid-string",
      "course_id": "uuid-string",
      "title": "Lesson Title",
      "description": "Lesson description",
      "video_id": "youtube-video-id",
      "video_url": "https://example.com/video.mp4",
      "video_provider": "s3",
      "duration_seconds": 3600,
      "thumbnail_url": "https://example.com/thumbnail.jpg",
      "transcript": "Lesson transcript",
      "lesson_number": 1,
      "display_order": 1,
      "is_published": true,
      "create_at": "2025-01-15T10:30:00.000Z",
      "update_at": "2025-01-15T10:30:00.000Z",
      "created_by": "admin-user-uuid"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 50,
    "per_page": 10,
    "has_next_page": true,
    "has_prev_page": false
  }
}
```

### 3. Get Lesson by ID
Retrieves a specific lesson by its ID.

**Endpoint:** `GET /lessons/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Lesson retrieved successfully",
  "lesson": {
    "id": "uuid-string",
    "course_id": "uuid-string",
    "title": "Lesson Title",
    "description": "Lesson description",
    "video_id": "youtube-video-id",
    "video_url": "https://example.com/video.mp4",
    "video_provider": "s3",
    "duration_seconds": 3600,
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "transcript": "Lesson transcript",
    "lesson_number": 1,
    "display_order": 1,
    "is_published": true,
    "create_at": "2025-01-15T10:30:00.000Z",
    "update_at": "2025-01-15T10:30:00.000Z",
    "created_by": "admin-user-uuid"
  }
}
```

**Error Responses:**
- `404 Not Found`: Lesson not found
- `401 Unauthorized`: Invalid or missing token

### 4. Update Lesson
Updates an existing lesson.

**Endpoint:** `PUT /lessons/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated Lesson Title",
  "description": "Updated description",
  "video_url": "https://example.com/new-video.mp4",
  "video_provider": "youtube",
  "duration_seconds": 4200,
  "thumbnail_url": "https://example.com/new-thumbnail.jpg",
  "transcript": "Updated transcript",
  "lesson_number": 2,
  "display_order": 2,
  "is_published": true
}
```

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Lesson updated successfully",
  "lesson": {
    "id": "uuid-string",
    "course_id": "uuid-string",
    "title": "Updated Lesson Title",
    "description": "Updated description",
    "video_id": "youtube-video-id",
    "video_url": "https://example.com/new-video.mp4",
    "video_provider": "youtube",
    "duration_seconds": 4200,
    "thumbnail_url": "https://example.com/new-thumbnail.jpg",
    "transcript": "Updated transcript",
    "lesson_number": 2,
    "display_order": 2,
    "is_published": true,
    "create_at": "2025-01-15T10:30:00.000Z",
    "update_at": "2025-01-15T11:45:00.000Z",
    "created_by": "admin-user-uuid"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data or course not found
- `404 Not Found`: Lesson not found
- `401 Unauthorized`: Invalid or missing token

### 5. Delete Lesson
Deletes a lesson.

**Endpoint:** `DELETE /lessons/:id`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Lesson deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Lesson not found
- `401 Unauthorized`: Invalid or missing token

## File Upload Operations

### 6. Upload Lesson Video
Uploads a video file for a lesson.

**Endpoint:** `POST /lessons/upload-video`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body (multipart/form-data):**
```
video: [video file]
```

**Supported Video Types:**
- MP4 (.mp4)
- AVI (.avi)
- MOV (.mov)
- WMV (.wmv)
- FLV (.flv)
- WebM (.webm)
- MKV (.mkv)
- M4V (.m4v)
- 3GP (.3gp)
- OGV (.ogv)

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Video uploaded successfully",
  "video_url": "https://mkdlabs.com/uploads/1234567890-video.mp4",
  "video_id": "1234567890-video.mp4",
  "video_provider": "s3",
  "file_info": {
    "originalname": "lesson-video.mp4",
    "mimetype": "video/mp4",
    "size": 52428800,
    "key": "aiaccelerator/lessons/videos/1234567890-video.mp4"
  }
}
```

**Error Responses:**
- `400 Bad Request`: No file uploaded or invalid file type
- `401 Unauthorized`: Invalid or missing token

### 7. Upload Video and Update Lesson
Uploads a video file and automatically updates the lesson with the new video information.

**Endpoint:** `POST /lessons/:lesson_id/upload-video`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body (multipart/form-data):**
```
video: [video file]
```

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Video uploaded and lesson updated successfully",
  "lesson": {
    "id": "uuid-string",
    "course_id": "uuid-string",
    "title": "Lesson Title",
    "video_url": "https://mkdlabs.com/uploads/1234567890-video.mp4",
    "video_id": "1234567890-video.mp4",
    "video_provider": "s3",
    // ... other lesson fields
  },
  "video_info": {
    "video_url": "https://mkdlabs.com/uploads/1234567890-video.mp4",
    "video_id": "1234567890-video.mp4",
    "video_provider": "s3",
    "file_info": {
      "originalname": "lesson-video.mp4",
      "mimetype": "video/mp4",
      "size": 52428800,
      "key": "aiaccelerator/lessons/videos/1234567890-video.mp4"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: No file uploaded, invalid file type, or lesson not found
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Lesson not found

### 8. Upload Lesson Thumbnail
Uploads a thumbnail image for a lesson.

**Endpoint:** `POST /lessons/upload-thumbnail`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body (multipart/form-data):**
```
thumbnail: [image file]
```

**Supported Image Types:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)
- SVG (.svg)

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Thumbnail uploaded successfully",
  "thumbnail_url": "https://mkdlabs.com/uploads/1234567890-thumbnail.jpg",
  "file_info": {
    "originalname": "thumbnail.jpg",
    "mimetype": "image/jpeg",
    "size": 245760
  }
}
```

**Error Responses:**
- `400 Bad Request`: No file uploaded or invalid file type
- `401 Unauthorized`: Invalid or missing token

### 9. Upload Thumbnail and Update Lesson
Uploads a thumbnail image and automatically updates the lesson with the new thumbnail URL.

**Endpoint:** `POST /lessons/:lesson_id/upload-thumbnail`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body (multipart/form-data):**
```
thumbnail: [image file]
```

**Response (200 OK):**
```json
{
  "error": false,
  "message": "Thumbnail uploaded and lesson updated successfully",
  "lesson": {
    "id": "uuid-string",
    "course_id": "uuid-string",
    "title": "Lesson Title",
    "thumbnail_url": "https://mkdlabs.com/uploads/1234567890-thumbnail.jpg",
    // ... other lesson fields
  },
  "thumbnail_info": {
    "thumbnail_url": "https://mkdlabs.com/uploads/1234567890-thumbnail.jpg",
    "file_info": {
      "originalname": "thumbnail.jpg",
      "mimetype": "image/jpeg",
      "size": 245760
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: No file uploaded, invalid file type, or lesson not found
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Lesson not found

## Data Models

### Lesson Object
```json
{
  "id": "string (UUID)",
  "course_id": "string (UUID, required)",
  "title": "string (required)",
  "description": "string (optional)",
  "video_id": "string (optional)",
  "video_url": "string (required)",
  "video_provider": "string (required, enum: s3,youtube,vimeo,wistia,custom)",
  "duration_seconds": "integer (optional)",
  "thumbnail_url": "string (optional)",
  "transcript": "string (optional)",
  "lesson_number": "integer (required, default: 0)",
  "display_order": "integer (required, default: 0)",
  "is_published": "boolean (default: false)",
  "create_at": "string (ISO 8601 timestamp)",
  "update_at": "string (ISO 8601 timestamp)",
  "created_by": "string (UUID, admin user ID)"
}
```

## Validation Rules

### Lesson Creation/Update
- `course_id`: Must be a valid UUID and reference an existing course
- `title`: Required, maximum 255 characters
- `description`: Optional, text field
- `video_id`: Optional, used for external video providers (YouTube, Vimeo, etc.)
- `video_url`: Required, valid URL format, maximum 500 characters
- `video_provider`: Required, must be one of: s3, youtube, vimeo, wistia, custom
- `duration_seconds`: Optional, positive integer
- `thumbnail_url`: Optional, valid URL format, maximum 500 characters
- `transcript`: Optional, text field
- `lesson_number`: Required, integer (sequential number shown to users)
- `display_order`: Required, integer (used for admin reordering)
- `is_published`: Boolean, determines if lesson is visible to end users

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Notes

1. **Course Validation**: All lessons must be associated with a valid course
2. **Video Providers**: Support for multiple video hosting platforms
3. **File Uploads**: Video and thumbnail uploads are stored locally and accessible via the base URL
4. **Pagination**: All list endpoints support pagination with configurable page size
5. **Ordering**: Lessons are ordered by `lesson_number` in ascending order
6. **Publishing**: Only published lessons are visible to end users through public endpoints
7. **Auto-Update Endpoints**: Special endpoints that upload files and automatically update lesson records
8. **File Type Validation**: Strict validation ensures only appropriate file types are uploaded
