# Security Architecture

## Overview

The backend will enforce **authentication** (who a user is) and **authorization** (what a user can do) using a layered approach that can be extended in later phases.

| Layer | Responsibility | Current Implementation (Phase 1) | Future Extension |
|-------|----------------|-----------------------------------|------------------|
| **Transport** | Enforce HTTPS in production. | Not configured yet – to be handled by deployment platform (e.g., EAS, cloud load balancer). | Enforce `requiresChannel().anyRequest().requiresSecure()` in Spring Security for production profiles. |
| **Network** | Restrict access to internal services. | No network restrictions – assumed to be behind a firewall/VPC. | Add IP‑based access controls if required. |
| **Authentication** | Verify identity, issue tokens. | Only a placeholder allowing unauthenticated access to health and OpenAPI endpoints. All other endpoints are blocked (`anyRequest().authenticated()`). | Implement **email‑OTP** verification (Phase 3) returning a short‑lived access token and a refresh token. Later replace with JWT or session‑based tokens. |
| **Authorization** | Authorize actions based on roles/permissions. | No roles defined yet. All authenticated requests will be denied until a real authentication mechanism is in place. | Use Spring Security's `@PreAuthorize` with role checks (`ROLE_USER`, `ROLE_SELLER`, etc.). |
| **Session Management** | Store token metadata, revocation lists. | Not applicable – no stateful session. | Store issued refresh tokens in a database with revocation support; implement token rotation. |
| **Audit & Logging** | Record security‑relevant events. | Logging configured via Spring Boot default logger. No security‑specific audit events yet. | Add audit log entries for login, OTP verification, password changes, and privileged operations. |

## Key Decisions & Open Items
- **Password vs OTP** – Phase 3 will introduce email‑OTP for onboarding. Password authentication may be added later for users who set a password after verification.
- **Token Type** – Initially a simple opaque token may be used; eventually replace with JWT signed with a secret stored in environment (`JWT_SECRET`).
- **Rate Limiting** – OTP endpoints will need rate limiting to prevent abuse. This will be implemented using a bucket‑algorithm service or Spring Cloud RateLimiter.
- **Secret Management** – All secrets (DB passwords, email provider credentials, JWT secret) will be supplied via environment variables and never checked into source control.
- **HTTPS** – Enforced at the edge (cloud provider or reverse proxy). Application will trust `X‑Forwarded‑Proto` header when behind a proxy.
- **CSRF** – Disabled for stateless API (`csrf().disable()`). If forms are added later, enable CSRF protection.

The current configuration (`SecurityConfig`) permits health and OpenAPI endpoints while protecting everything else. This provides a secure default posture while allowing development of public onboarding APIs in later phases.
