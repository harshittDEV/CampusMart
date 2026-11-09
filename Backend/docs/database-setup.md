# Database Setup

## Flyway Migration Overview

The project uses **Flyway** to manage database schema changes. All migration scripts are stored under:
```
src/main/resources/db/migration/
```
Flyway runs automatically on application startup (enabled in `application.yml`). It scans the `classpath:db/migration` location for files matching the pattern `V<version>__<description>.sql`.

### Current Migration
- **V1__init.sql** – Creates a placeholder table `placeholder` with an `id` primary key and a `created_at` timestamp. This demonstrates that the migration mechanism works and provides a safe starting point without any business tables.

### Adding New Migrations
1. Create a new file following the naming convention, e.g., `V2__create_users_table.sql`.
2. Write the SQL statements needed for the schema change.
3. Commit the file to the repository.
4. On the next application startup, Flyway will detect the new version, apply it, and record it in the Flyway metadata table (`flyway_schema_history`).

### Configuration
- Development: `application-dev.yml` configures the datasource to connect to a local PostgreSQL instance.
- Test: `application-test.yml` uses Testcontainers' JDBC URL (`jdbc:tc:postgresql://...`) with the `ContainerDatabaseDriver`.
- Production: `application.yml` (or a separate `application-prod.yml`) should provide the production datasource via environment variables. **Never** hard‑code credentials.

## Running Migrations Manually
If you need to trigger migrations without starting the application, you can run:
```bash
mvn flyway:migrate -Dflyway.configFiles=src/main/resources/application.yml
```
This uses the Maven Flyway plugin (implicitly available via the Spring Boot dependency management).

## Local Development with Docker
You can spin up a PostgreSQL container using the provided Docker Compose file (located in `Backend/docker/docker-compose.yml`). After starting it, the application will connect using the defaults defined in `application-dev.yml`.

```bash
cd Backend/docker
docker-compose up -d
```
Now run the application:
```bash
cd ..
mvn spring-boot:run
```
Flyway will automatically apply any pending migrations.

---
*All migration scripts are version‑controlled. Do not modify already‑executed migrations; instead, create a new versioned script.*
