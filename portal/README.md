# Thrive Client Portal — local development

Java 25 + Spring Boot backend, React/Vite frontend, PostgreSQL via Docker Compose.

## Quick start

```powershell
cd portal
copy .env.example .env
.\scripts\build.ps1
docker compose up -d
```

- **Portal UI:** http://localhost:8081  
- **API:** http://localhost:8080/api/health  
- **Actuator:** http://localhost:8080/actuator/health  

## Dev mode (hot reload)

```powershell
docker compose up -d postgres
cd backend && mvn spring-boot:run
cd frontend && npm run dev   # http://localhost:5173
```

## Tests

```powershell
cd backend && mvn verify
cd frontend && npm test
.\scripts\test-stack.ps1
```

## Specs

- [`../docs/MVP_APPLICATION_SPEC.md`](../docs/MVP_APPLICATION_SPEC.md) — MVP scope & Oracle hosting
- [`../docs/CLIENT_PORTAL_SPEC.md`](../docs/CLIENT_PORTAL_SPEC.md) — full product spec

## Production

Images publish to `ghcr.io` on push to `main`. Deploy to Oracle Always Free VM via `deploy.yml` — see [`../infrastructure/oracle-always-free-runbook.md`](../infrastructure/oracle-always-free-runbook.md).
