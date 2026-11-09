# CampusMart Backend

Phase 1 of the CampusMart backend provides a solid foundation built with **Java 21**, **Spring Boot 3.2**, and **PostgreSQL**. It includes:

- A minimal Spring Boot application with health endpoint (`GET /api/v1/health`).
- Centralized error handling and basic security configuration.
- OpenAPI documentation via Springdoc.
- Environment‑based configuration for development, testing, and production.
- Flyway migrations setup.
- Automated unit and integration tests (including Testcontainers support).

The backend is located under `CampusMart/Backend/` and can be built and run independently of the existing React Native frontend.

## Prerequisites

- **Java 21** (JDK). Install from OpenJDK or your preferred distribution.
- **Maven 3.9+**. Ensure `mvn` is on your `PATH`.
- **Docker** (optional, for PostgreSQL and Testcontainers). If Docker is not installed, you can run PostgreSQL locally.

## Local Database Setup

### Using Docker Compose (recommended)
```bash
mkdir -p docker && cat > docker/docker-compose.yml <<'EOF'
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: campusmart_dev
      POSTGRES_USER: campusmart
      POSTGRES_PASSWORD: campusmart
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "campusmart"]
      interval: 5s
      timeout: 5s
      retries: 5
EOF

docker-compose -f docker/docker-compose.yml up -d
```
This starts a PostgreSQL instance listening on `localhost:5432`.

### Without Docker
Create a PostgreSQL database named `campusmart_dev` and a user `campusmart` with password `campusmart`. Adjust the values in `application-dev.yml` if you use different credentials.

## Configuration

Environment variables (provide via `.env` or your shell):

- `POSTGRES_USER` – database username (default: `campusmart`)
- `POSTGRES_PASSWORD` – database password (default: `campusmart`)
- `POSTGRES_DB` – database name (default: `campusmart_dev`)
- `SPRING_PROFILES_ACTIVE` – set to `dev` (default) or `test`/`prod`.

### Profile Files
- `src/main/resources/application.yml` – common settings.
- `src/main/resources/application-dev.yml` – development defaults.
- `src/main/resources/application-test.yml` – Testcontainers configuration.
- `src/main/resources/application-prod.yml` – placeholder for production (no secrets committed).

## Building and Running
```bash
# Build
mvn clean package

# Run with dev profile (default)
mvn spring-boot:run
```
The application starts on port **8080**. Access:
- Health: `http://localhost:8080/api/v1/health`
- OpenAPI UI: `http://localhost:8080/swagger-ui.html`

## Testing
```bash
# Unit + integration tests (Testcontainers will spin up a temporary PostgreSQL container)
mvn test
```
Test output will indicate whether the PostgreSQL integration test ran (requires Docker).

## Project Structure
```
Backend/
├─ src/
│  ├─ main/
│  │  ├─ java/com/campusmart/
│  │  │  ├─ CampusMartApplication.java
│  │  │  ├─ api/                # REST controllers & DTOs
│  │  │  ├─ config/             # Spring Security & other configs
│  │  │  └─ common/error/       # API error model & handler
│  │  └─ resources/
│  │     ├─ application.yml
│  │     ├─ application-dev.yml
│  │     ├─ application-test.yml
│  │     └─ db/migration/       # Flyway scripts
│  └─ test/
│     └─ java/com/campusmart/   # Test classes
├─ docs/                         # Design & integration docs
├─ .gitignore
├─ pom.xml
└─ README.md
```

## Documentation (see `Backend/docs/`)
- **frontend-integration-matrix.md** – maps existing React Native screens to the API endpoints that will be needed.
- **security-architecture.md** – outlines the planned authentication and authorization strategy.
- **authentication-design.md** – details the future email‑OTP flow and its security requirements.
- **database-setup.md** – explains Flyway migrations and how to add future schema changes.
- **phase-1-architecture.md** – high‑level overview of the backend architecture for Phase 1.

## Next Steps (Phase 2)
- Implement the onboarding APIs (institution selection, email verification, profile creation).
- Add domain entities and repositories.
- Expand security to include JWT issuance and validation.
- Build marketplace CRUD endpoints.

---
*All secrets are omitted from version control. Use the `.env.example` file as a template.*
