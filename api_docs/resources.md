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

## Content-Type Headers

**Important:** The Content-Type header depends on the request type:

- **For URL/Text resources:** Use `Content-Type: application/json`
- **For File resources:** Use `Content-Type: multipart/form-data` (this is set automatically by most HTTP clients when sending files)

## Frontend Implementation Notes

### For URL/Text Type Resources:
- Use regular JSON POST/PUT requests
- Set `Content-Type: application/json`
- Include all required fields in the JSON body

### For File Type Resources:
- Use `FormData` in JavaScript/TypeScript
- Do NOT manually set `Content-Type` header (let the browser set it automatically)
- Append all fields including the file to the FormData object

### JavaScript Example for File Upload:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]); // The actual file
formData.append('portal_id', '550e8400-e29b-41d4-a716-446655440000');
formData.append('title', 'My Document');
formData.append('type', 'file');
// ... other fields

fetch('/v1/api/aiaccelerator/admin/lambda/resources', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <admin_token>',
    'x-project': 'aiaccelerator'
    // Do NOT set Content-Type - let browser set it
  },
  body: formData
});
```

### Common Frontend Issues:
- **400 Error**: Usually means missing required fields or wrong Content-Type
- **File Upload Fails**: Check that you're using FormData and not setting Content-Type manually
- **Validation Errors**: Ensure all required fields are included based on the resource type

## Endpoints

### 1. Create Resource Card

**Endpoint:** `POST /v1/api/aiaccelerator/admin/lambda/resources`

**Description:** Create a new resource card (Admin only)

**Headers:**
```
Content-Type: application/json (for url/text types) or multipart/form-data (for file type)
Authorization: Bearer <admin_jwt_token>
```

#### URL Type Resource Card

**Request Body (JSON):**
```json
{
  "portal_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "AI Tools Collection",
  "description": "A comprehensive collection of AI tools and resources",
  "type": "url",
  "url": "https://aitools.example.com",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
  "display_order": 1,
  "is_published": true
}
```

#### Text Type Resource Card

**Request Body (JSON):**
```json
{
  "portal_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "AI Guide Document",
  "description": "Complete guide to AI implementation",
  "type": "text",
  "text_content": "This is the full text content of the AI guide...",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
  "display_order": 2,
  "is_published": true
}
```

#### File Type Resource Card

**Request Body (multipart/form-data):**
- `file`: [uploaded file] (required)
- `portal_id`: "550e8400-e29b-41d4-a716-446655440000"
- `title`: "AI Research Paper"
- `description`: "Latest research on AI algorithms"
- `type`: "file"
- `thumbnail_url`: "https://example.com/thumbnail.jpg"
- `category_id`: "fa896936-140d-49c9-9564-83e4fb388ab4"
- `display_order`: 3
- `is_published`: true

**Required Fields:**
- `portal_id` (string): UUID of the portal this resource belongs to
- `title` (string): Title of the resource card
- `type` (string): Resource type - must be one of: "url", "text", "file"

**Type-Specific Required Fields:**
- For `type: "url"`: `url` (string): Valid HTTP/HTTPS URL
- For `type: "text"`: `text_content` (string): Text content of the resource
- For `type: "file"`: `file` (multipart): File to upload

**Optional Fields:**
- `description` (string): Description of the resource
- `thumbnail_url` (string): URL to thumbnail image
- `category_id` (string): UUID of the category this resource belongs to (must exist)
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
    "type": "url",
    "url": "https://aitools.example.com",
    "thumbnail_url": "https://example.com/thumbnail.jpg",
    "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
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
x-project: aiaccelerator
```

**Request Body:**
```json
{
  "title": "Updated AI Tools Collection",
  "description": "Updated description",
  "type": "url",
  "url": "https://updated-aitools.example.com",
  "text_content": null,
  "file_url": null,
  "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
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
    "type": "url",
    "url": "https://updated-aitools.example.com",
    "text_content": null,
    "file_url": null,
    "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
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

### 3. Upload Resource File

**Endpoint:** `POST /v1/api/aiaccelerator/admin/lambda/resources/upload-file`

**Description:** Upload a file for use in resource cards (Admin only)

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <admin_jwt_token>
x-project: aiaccelerator
```

**Request Body (multipart/form-data):**
- `file`: [uploaded file] (required)

**Supported File Types:**
- Documents: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), Plain Text (.txt), CSV (.csv)
- Images: JPEG, JPG, PNG, GIF, WebP, BMP, SVG
- Archives: ZIP, RAR
- Other: JSON, XML

**Success Response (200):**
```json
{
  "error": false,
  "message": "File uploaded successfully",
  "file_url": "https://s3.amazonaws.com/bucket/aiaccelerator/resources/files/uuid/filename.pdf",
  "file_id": "uuid/filename.pdf",
  "file_info": {
    "originalname": "research_paper.pdf",
    "mimetype": "application/pdf",
    "size": 2048576,
    "key": "uuid/filename.pdf"
  }
}
```

**Error Responses:**
- `400` - File upload failed or invalid file type
- `401` - Invalid or missing token
- `403` - Admin access required

### 4. Upload File and Update Resource

**Endpoint:** `POST /v1/api/aiaccelerator/admin/lambda/resources/:resource_id/upload-file`

**Description:** Upload a file and update an existing resource card to use it (Admin only)

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <admin_jwt_token>
x-project: aiaccelerator
```

**Request Body (multipart/form-data):**
- `file`: [uploaded file] (required)

**Success Response (200):**
```json
{
  "error": false,
  "message": "File uploaded and resource updated successfully",
  "resource": {
    "id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "type": "file",
    "file_url": "https://s3.amazonaws.com/bucket/aiaccelerator/resources/files/uuid/filename.pdf",
    "title": "Research Paper",
    "description": "Latest AI research",
    "update_at": "2025-01-15T10:35:00.000Z"
  },
  "file_info": {
    "file_url": "https://s3.amazonaws.com/bucket/aiaccelerator/resources/files/uuid/filename.pdf",
    "file_id": "uuid/filename.pdf",
    "file_info": {
      "originalname": "research_paper.pdf",
      "mimetype": "application/pdf",
      "size": 2048576,
      "key": "uuid/filename.pdf"
    }
  }
}
```

**Error Responses:**
- `400` - File upload failed or invalid file type
- `401` - Invalid or missing token
- `403` - Admin access required
- `404` - Resource card not found

### 5. Delete Resource Card

**Endpoint:** `DELETE /v1/api/aiaccelerator/admin/lambda/resources/:id`

**Description:** Delete a resource card (Admin only)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
x-project: aiaccelerator
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
- `type`: Must be one of: "url", "text", "file"

### Type-Specific Required Fields
- For `type: "url"`: `url` must be a valid HTTP/HTTPS URL
- For `type: "text"`: `text_content` must not be empty
- For `type: "file"`: `file` must be provided (multipart) or `file_url` must be provided

### Optional Fields
- `description`: Description of the resource
- `thumbnail_url`: URL to thumbnail image
- `category_id`: Must be a valid UUID of an existing category
- `display_order`: Must be a non-negative number
- `is_published`: Must be a boolean value

### Validation Error Response
```json
{
  "error": true,
  "message": "Validation failed",
  "validation": [
    {
      "field": "type",
      "message": "Type must be one of: url,text,file"
    },
    {
      "field": "url",
      "message": "URL must be a valid HTTP/HTTPS URL"
    },
    {
      "field": "text_content",
      "message": "Text content is required for type 'text'"
    },
    {
      "field": "file_url",
      "message": "File URL is required for type 'file'"
    },
    {
      "field": "category_id",
      "message": "Category with ID 'fa896936-140d-49c9-9564-83e4fb388ab4' does not exist"
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

### Create a URL Type Resource Card
```bash
curl -X POST http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -H "x-project: aiaccelerator" \
  -d '{
    "portal_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AI Tools Collection",
    "description": "A comprehensive collection of AI tools",
    "type": "url",
    "url": "https://aitools.example.com",
    "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "display_order": 1,
    "is_published": true
  }'
```

### Create a Text Type Resource Card
```bash
curl -X POST http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -H "x-project: aiaccelerator" \
  -d '{
    "portal_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "AI Guide",
    "description": "Complete guide to AI implementation",
    "type": "text",
    "text_content": "This is the full text content of the AI guide...",
    "category_id": "fa896936-140d-49c9-9564-83e4fb388ab4",
    "display_order": 2,
    "is_published": true
  }'
```

### Create a File Type Resource Card
```bash
curl -X POST http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources \
  -H "Authorization: Bearer <admin_token>" \
  -H "x-project: aiaccelerator" \
  -F "file=@research_paper.pdf" \
  -F "portal_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "title=AI Research Paper" \
  -F "description=Latest research on AI algorithms" \
  -F "type=file" \
  -F "category_id=fa896936-140d-49c9-9564-83e4fb388ab4" \
  -F "display_order=3" \
  -F "is_published=true"
```

### Upload File and Update Resource
```bash
curl -X POST http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources/fa896936-140d-49c9-9564-83e4fb388ab4/upload-file \
  -H "Authorization: Bearer <admin_token>" \
  -H "x-project: aiaccelerator" \
  -F "file=@updated_document.pdf"
```

### Update a Resource Card
```bash
curl -X PUT http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources/fa896936-140d-49c9-9564-83e4fb388ab4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -H "x-project: aiaccelerator" \
  -d '{
    "title": "Updated AI Tools Collection",
    "is_published": false
  }'
```

### Delete a Resource Card
```bash
curl -X DELETE http://localhost:3048/v1/api/aiaccelerator/admin/lambda/resources/fa896936-140d-49c9-9564-83e4fb388ab4 \
  -H "Authorization: Bearer <admin_token>" \
  -H "x-project: aiaccelerator"
```
