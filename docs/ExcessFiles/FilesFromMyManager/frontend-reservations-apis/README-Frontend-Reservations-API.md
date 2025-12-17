## Frontend Reservations API - HTTP Client Collection

This folder contains ready-to-run `.http` requests for the Reservations feature, covering both the public Tenant Website endpoint and the authenticated Dashboard endpoints.

### How to use

- Open these `.http` files with an HTTP client that supports the `.http` format (VS Code REST Client, IntelliJ HTTP Client, etc.).
- Define the variables at the top of any `.http` file or in your client settings:
  - `baseUrl`: e.g., `https://your-app.test`
  - `tenantId`: the tenant username (public endpoints)
  - `token`: Bearer token for authenticated Dashboard endpoints

### Files

- Public (no auth):
  - `tenant-website-reservation-create.http`
- Dashboard (auth required):
  - `dashboard-reservations-list.http`
  - `dashboard-reservations-show.http`
  - `dashboard-reservations-accept.http`
  - `dashboard-reservations-reject.http`
  - `dashboard-reservations-bulk-action.http`
  - `dashboard-reservations-stats.http`
  - `dashboard-reservations-export.http`

### Notes

- Public endpoint is rate-limited (throttle: 5 requests per minute per client).
- Dashboard endpoints require `Authorization: Bearer {{token}}`.
- Query params and bodies mirror the backend spec in `ai/Tenant-Website-Reservations-API.md`.
