# Authentication Design

## Overview

Phase 3 will introduce email‑based OTP authentication. This document outlines the **contract** and **security requirements** that the backend must satisfy when the functionality is implemented.

### API Contract (future)
| HTTP Method | Endpoint | Request Body | Response | Auth Required |
|-------------|----------|--------------|----------|---------------|
| `POST` | `/api/v1/auth/email/send-code` | `{ "email": "user@institution.edu.in" }` | `202 Accepted` with `{ "message": "OTP sent if email is registered" }` (generic) | No |
| `POST` | `/api/v1/auth/email/verify-code` | `{ "email": "user@institution.edu.in", "code": "123456" }` | `200 OK` with `{ "accessToken": "...", "refreshToken": "..." }` | No |
| `POST` | `/api/v1/auth/refresh` | `{ "refreshToken": "..." }` | `200 OK` with new access token | Yes |

### Security Requirements
- **OTP Generation**: Use a cryptographically secure random 6‑digit number (`SecureRandom`).
- **OTP Storage**: Store a **hash** of the OTP (e.g., SHA‑256 with per‑OTP salt). Do **not** store plain OTP values.
- **Expiry**: OTP is valid for **5 minutes** after generation.
- **Attempt Limit**: Maximum **5** failed verification attempts per OTP. After exceeding, the OTP is invalidated.
- **Resend Cool‑down**: Enforce a **60‑second** cooldown between `send-code` requests for the same email.
- **Rate Limiting**: Global rate limiting (e.g., 10 requests per minute per IP) to mitigate abuse.
- **Idempotency**: `send-code` should be **idempotent** for the same email within the cooldown window – it returns the same generic response without indicating whether an OTP was sent.
- **Generic Responses**: Always return the same success message regardless of whether the email exists in the system to avoid user enumeration.
- **Logging**: Do **not** log OTP values or the hashed representation. Log only metadata such as request ID, timestamp, and outcome (success/failure).
- **Email Provider**: Credentials injected via environment variables (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`). Use a **development mock** transport (e.g., a file‑based sink) when `SPRING_PROFILES_ACTIVE=dev`.
- **Token Issuance**: After successful verification, issue a short‑lived **access token** (e.g., JWT with 15‑minute expiry) and a **refresh token** (longer‑lived, stored server‑side for revocation). Tokens are signed with a secret (`JWT_SECRET`) supplied via environment.
- **Token Revocation**: Store refresh tokens in a table with a `revoked` flag. When a user logs out or a token is compromised, mark it revoked.
- **Transport Security**: All API calls must be made over HTTPS in production. The backend trusts the `X-Forwarded-Proto` header when behind a reverse proxy.

### Future Extension Points
- **Password Login**: Optional password‑based login after email verification.
- **Social Login**: Potential integration with Google/Apple ID.
- **Multi‑Factor Authentication**: Adding TOTP or push‑based MFA.
- **Device Management**: Track device IDs for refresh token revocation per device.

The above contract ensures that when Phase 3 is implemented, the system will be secure, privacy‑preserving, and resistant to common abuse vectors.
