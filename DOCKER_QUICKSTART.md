# Docker Quick Start

## 1) Run (Production)
```bash
cp .env.production.example .env.production
# edit secrets in .env.production
APP_ENV_FILE=.env.production docker compose --env-file .env.production up -d --build
```

Before first run, place Cloudflare Origin SSL files:
- `nginx/ssl/cloudflare.crt`
- `nginx/ssl/cloudflare.key`

## Development Mode (Hot Reload)
```bash
docker compose -f docker-compose.dev.yml up -d --build
```

## 2) Open
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

## 3) Logs
```bash
APP_ENV_FILE=.env.production docker compose --env-file .env.production logs -f nginx django frontend celery
```

```bash
docker compose -f docker-compose.dev.yml logs -f django frontend celery
```

## 4) Stop
```bash
APP_ENV_FILE=.env.production docker compose --env-file .env.production down
```

```bash
docker compose -f docker-compose.dev.yml down
```

## 5) Reset everything (including DB volume)
```bash
docker compose down -v
```
