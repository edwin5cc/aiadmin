# Resource Cards API - Admin Operations

This document describes the admin-only operations for managing resource cards in the AI Accelerator backend.

## Authentication

All admin operations require a valid admin JWT token in the Authorization header:

```
Authorization: Bearer <admin_jwt_token>
```

## Required Headers
All API requests must include the project identifier header:
```
x-project: aiaccelerator
```

## Endpoints

### 1. Create Resource Card

**Endpoint:** `POST /v1/api/aiaccelerator/admin/lambda/resources`

**Description:** Create a new resource card (Admin only)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "portal_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "AI Tools Collection",
  "description": "A comprehensive collection of AI tools and resources",
  "url": "https://aitools.example.com",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "category": "tools",
  "display_order": 1,
  "is_published": true
}
```

**Required Fields:**
- `portal_id` (string): UUID of the portal this resource belongs to
- `title` (string): Title of the resource card
- `url` (string): Valid HTTP/HTTPS URL

**Optional Fields:**
- `description` (string): Description of the resource
- `thumbnail_url` (string): URL to thumbnail image
- `category` (string): One of: `tools`, `guides`, `websites`, `templates`
- `display_order` (number): Display order (default: 0)
- `is_published` (boolean): Whether the resource is published (default: false)

**Success Response (201):**
```json
{
  "error": false,
  "message": "Resource card created successfully",
  "resource": {
    "id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "portal_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AI Tools Collection",
    "description": "A comprehensive collection of AI tools and resources",
    "url": "https://aitools.example.com",
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "category": "tools",
    "display_order": 1,
    "is_published": true,
    "create_at": "2025-01-15T10:30:00.000Z",
    "update_at": "2025-01-15T10:30:00.000Z",
    "created_by": "be1a24a9-cd2d-45c0-b25c-6496caf20efd"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `401` - Invalid or missing token
- `403` - Admin access required

### 2. Update Resource Card

**Endpoint:** `PUT /v1/api/aiaccelerator/admin/lambda/resources/:id`

**Description:** Update an existing resource card (Admin only)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "title": "Updated AI Tools Collection",
  "description": "Updated description",
  "url": "https://updated-aitools.example.com",
  "category": "tools",
  "is_published": false
}
```

**Success Response (200):**
```json
{
  "error": false,
  "message": "Resource card updated successfully",
  "resource": {
    "id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "title": "Updated AI Tools Collection",
    "description": "Updated description",
    "url": "https://updated-aitools.example.com",
    "category": "tools",
    "is_published": false,
    "update_at": "2025-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation failed
- `401` - Invalid or missing token
- `403` - Admin access required
- `404` - Resource card not found

### 3. Delete Resource Card

**Endpoint:** `DELETE /v1/api/aiaccelerator/admin/lambda/resources/:id`

**Description:** Delete a resource card (Admin only)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Success Response (200):**
```json
{
  "error": false,
  "message": "Resource card deleted successfully"
}
```

**Error Responses:**
- `401` - Invalid or missing token
- `403` - Admin access required
- `404` - Resource card not found

## Validation Rules

### Required Fields
- `portal_id`: Must be a valid UUID
- `title`: Must not be empty
- `url`: Must be a valid HTTP/HTTPS URL

### Optional Fields
- `category`: Must be one of: `tools`, `guides`, `websites`, `templates`
- `display_order`: Must be a non-negative number
- `is_published`: Must be a boolean value

### Validation Error Response
```json
{
  "error": true,
  "message": "Validation failed",
  "validation": [
    {
      "field": "url",
      "message": "URL must be a valid HTTP/HTTPS URL"
    },
    {
      "field": "category",
      "message": "Category must be one of: tools, guides, websites, templates"
    }
  ]
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Validation failed |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Admin access required |
| 404 | Not Found - Resource card not found |
| 500 | Internal Server Error |

## Example Usage

### Create a Resource Card
```bash
curl -X POST http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "portal_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AI Tools Collection",
    "description": "A comprehensive collection of AI tools",
    "url": "https://aitools.example.com",
    "category": "tools",
    "display_order": 1,
    "is_published": true
  }'
```

### Update a Resource Card
```bash
curl -X PUT http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources/fa896936-140d-49c9-9564-83e4fb388ab4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Updated AI Tools Collection",
    "is_published": false
  }'
```

### Delete a Resource Card
```bash
curl -X DELETE http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources/fa896936-140d-49c9-9564-83e4fb388ab4 \
  -H "Authorization: Bearer <admin_token>"
```
