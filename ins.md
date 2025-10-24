Base instruction for AI coding assistant — Backend integration (step-by-step)
General rules (must follow)

Follow the user’s step-by-step workflow.
Only perform the exact task the user requests. If the user does not ask you to do something next, do not do it.

Always use environment variables X_PROJECT_ID and BACKEND_BASE_URL from the .env file when making backend requests. Do not hardcode project IDs or base URLs.

Every backend request must include the header x-project with the value from X_PROJECT_ID.

Log and surface errors: when a request fails, return a short, clear error message and the HTTP status code. Do not retry automatically unless explicitly instructed.

Environment / setup

Confirm .env contains:

BACKEND_BASE_URL (e.g. https://api.example.com)

X_PROJECT_ID (string)

Use a config module to read env vars once and export them for the app (e.g. config.js or settings.ts).

Validate at runtime that both env vars are present. If missing, return a clear error that identifies which var is missing.

HTTP conventions

Every request:

Base URL: BACKEND_BASE_URL

Header: x-project: <X_PROJECT_ID>

Content-Type: application/json unless otherwise specified

Timeout: set a reasonable request timeout (e.g., 10s). If timeout occurs, return timeout error.

Error handling:

If 4xx or 5xx, return structured error: { ok: false, status: <code>, message: <backend message or short fallback> }

When backend returns validation errors, forward them unchanged where useful.

Security & privacy

Never print secret values (full X_PROJECT_ID or other secrets) into logs. Log only that the header was set (e.g., x-project header attached).

If any credential appears invalid, surface that as a config error (don’t attempt automatic fixes).


DO NOT RUN THE APP WHEN YOU AFRE DONE TELL ME TO RUN IT


NOTE: DO NOT EVER AND EVER CHANGE THE UI DESIGN, ONLY INTEGRATE THE REQUIRED APIS.
ALSO, FOR EVERY OPERATION (E.G., CREATING, DELETING, UPLOADING, ETC), ADD RELEVANT LOADING/STATE HANDLERS TO IMPROVE UX AND INDICATE THAT AN ACTION IS IN PROGRESS (SHOW STATES SUCH AS isCreating, isDeleting, isUploading, ETC. TO SURFACE PROGRESS TO THE USER).

