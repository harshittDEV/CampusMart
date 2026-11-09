# CampusMart Backend — Listing Moderation and Administration

## 1. Overview
The Listing Moderation subsystem provides administrative oversight over marketplace listings. It allows authenticated administrators (`ROLE_ADMIN`) to search all listings across institutions (including soft-deleted and draft listings), inspect details, transition listing status (deactivate / reactivate), and audit all administrative actions.

---

## 2. Security & Role Model
- **User Role**: `UserRole` enum (`USER`, `ADMIN`).
- **Database Column**: `users.role` (VARCHAR(20), default `'USER'`).
- **Spring Security Authority**: Mapped in `JwtUserDetailsService` as `ROLE_ADMIN` or `ROLE_USER`.
- **Enforcement**:
  - Class-level `@PreAuthorize("hasAuthority('ROLE_ADMIN')")` on `ListingModerationController`.
  - Non-admin requests receive HTTP `403 Forbidden`.
  - Unauthenticated requests receive HTTP `401 Unauthorized`.

---

## 3. Allowed Status Transitions
Administrative moderation enforces valid lifecycle transitions:
- `ACTIVE` -> `DEACTIVATED`: Administrative deactivation (e.g. policy violation, illegal item, counterfeit).
- `DRAFT` -> `DEACTIVATED`: Proactive removal before publication.
- `DEACTIVATED` -> `ACTIVE`: Listing reinstatement after appeal or seller correction.

All other direct transitions (e.g., `ACTIVE` -> `SOLD` or `SOLD` -> `ACTIVE`) cannot be performed by moderation and are rejected with HTTP `409 Conflict`.

---

## 4. Audit Trail (`listing_moderation_history`)
Every moderation action creates an immutable audit record in the `listing_moderation_history` table:
- `id`: UUID primary key.
- `listing_id`: Foreign key to `listings.id`.
- `admin_user_id`: Foreign key to `users.id` (moderator who executed the action).
- `previous_status`: State before moderation (`ACTIVE`, `DRAFT`, etc.).
- `new_status`: Resulting state (`DEACTIVATED`, `ACTIVE`).
- `reason`: Mandatory text description explaining the moderation action.
- `action_at`: Timestamp (UTC) when the action occurred.

---

## 5. REST API Endpoints

### 5.1 Search Listings (Admin View)
- **Method**: `GET`
- **Path**: `/api/v1/admin/listings`
- **Query Parameters**:
  - `status` (optional): Filter by `ListingStatus` (`DRAFT`, `ACTIVE`, `SOLD`, `DEACTIVATED`).
  - `deleted` (optional): Filter by soft-delete flag (`true` or `false`).
  - `page` (optional, default `0`): Page index.
  - `size` (optional, default `20`): Page size.
- **Response**: `200 OK` with Spring Data `Page<AdminListingSummary>`.

### 5.2 Get Listing by ID
- **Method**: `GET`
- **Path**: `/api/v1/admin/listings/{id}`
- **Response**: `200 OK` with `AdminListingSummary`.
- **Errors**: `404 Not Found` if the listing does not exist.

### 5.3 Moderate Listing
- **Method**: `PATCH`
- **Path**: `/api/v1/admin/listings/{id}/moderate`
- **Request Body**:
```json
{
  "newStatus": "DEACTIVATED",
  "reason": "Item violates campus safety policy regarding prohibited electronics"
}
```
- **Response**: `200 OK`
```json
{
  "listingId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "oldStatus": "ACTIVE",
  "newStatus": "DEACTIVATED",
  "adminId": "7cb85f64-5717-4562-b3fc-2c963f66afa1",
  "reason": "Item violates campus safety policy regarding prohibited electronics",
  "timestamp": "2026-11-09T16:25:30.123456Z"
}
```
- **Errors**:
  - `400 Bad Request`: Validation failure (blank reason, missing status, invalid UUID).
  - `403 Forbidden`: Caller lacks `ROLE_ADMIN`.
  - `409 Conflict`: Disallowed status transition.

### 5.4 Get Moderation History
- **Method**: `GET`
- **Path**: `/api/v1/admin/listings/{id}/history`
- **Query Parameters**: `page`, `size`
- **Response**: `200 OK` with `Page<ModerationHistoryEntry>` in descending order of `actionAt`.

---

## 6. Database Migrations
- `V7__add_user_role.sql`: Adds `role` column to `users` with default `'USER'`.
- `V8__listing_moderation_history.sql`: Creates `listing_moderation_history` table and indexes.

