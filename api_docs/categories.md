# Categories API - Admin Operations

This document describes the admin-only operations for managing categories in the AI Accelerator backend.

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

### 1. Create Category

**Endpoint:** `POST /v1/api/aiaccelerator/admin/lambda/categories`

**Description:** Create a new category (Admin only)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "name": "Tools"
}
```

**Required Fields:**
- `name` (string): Name of the category (must be unique)

**Success Response (201):**
```json
{
  "error": false,
  "message": "Category created successfully",
  "category": {
    "id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "name": "Tools",
    "create_at": "2025-01-15T10:30:00.000Z",
    "update_at": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation failed (duplicate name)
- `401` - Invalid or missing token
- `403` - Admin access required

### 2. Update Category

**Endpoint:** `PUT /v1/api/aiaccelerator/admin/lambda/categories/:id`

**Description:** Update an existing category (Admin only)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "name": "Updated Tools"
}
```

**Success Response (200):**
```json
{
  "error": false,
  "message": "Category updated successfully",
  "category": {
    "id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "name": "Updated Tools",
    "create_at": "2025-01-15T10:30:00.000Z",
    "update_at": "2025-01-15T10:35:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation failed (duplicate name)
- `401` - Invalid or missing token
- `403` - Admin access required
- `404` - Category not found

### 3. Delete Category

**Endpoint:** `DELETE /v1/api/aiaccelerator/admin/lambda/categories/:id`

**Description:** Delete a category (Admin only). Cannot delete categories that are being used by resources.

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Success Response (200):**
```json
{
  "error": false,
  "message": "Category deleted successfully"
}
```

**Error Responses:**
- `400` - Category is being used by resources
- `401` - Invalid or missing token
- `403` - Admin access required
- `404` - Category not found

## Validation Rules

### Required Fields
- `name`: Must not be empty and must be unique across all categories

### Validation Error Response
```json
{
  "error": true,
  "message": "Validation failed",
  "validation": [
    {
      "field": "name",
      "message": "Category with name 'Tools' already exists"
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
| 404 | Not Found - Category not found |
| 500 | Internal Server Error |

## Example Usage

### Create a Category
```bash
curl -X POST http://localhost:3048/v1/api/aiaccelerator/admin/lambda/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Tools"
  }'
```

### Update a Category
```bash
curl -X PUT http://localhost:3048/v1/api/aiaccelerator/admin/lambda/categories/fa896936-140d-49c9-9564-83e4fb388ab4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Updated Tools"
  }'
```

### Delete a Category
```bash
curl -X DELETE http://localhost:3048/v1/api/aiaccelerator/admin/lambda/categories/fa896936-140d-49c9-9564-83e4fb388ab4 \
  -H "Authorization: Bearer <admin_token>"