# Deployment Guide (vofino.ir + Multi-Tenant)

This setup is production-ready with one command and keeps SQLite as the active database.

## 1) Prerequisites
- Linux server with Docker + Docker Compose plugin
- Ports 80 and 443 open
- DNS access for `vofino.ir`

## 2) Required DNS records
Replace `SERVER_IP` with your server IP.

- `A` record
  - Host: `@`
  - Value: `SERVER_IP`
- `A` record
  - Host: `dash`
  - Value: `SERVER_IP`
- Wildcard `A` record
  - Host: `*`
  - Value: `SERVER_IP`

This enables:
- `vofino.ir`
- `dash.vofino.ir`
- `customer1.vofino.ir`, `customer2.vofino.ir`, ...

## 3) Custom domain for tenants
For a tenant domain like `example.com`:

Option A (recommended):
- `A` record: `@ -> SERVER_IP`
- `CNAME` record: `www -> example.com`

Option B:
- `CNAME` to `vofino.ir` (if your DNS provider supports it)

Then set `custom_domain` for that tenant in DB/admin.

## 4) Environment variables (`.env`)
Set at least:
- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS=vofino.ir,.vofino.ir,dash.vofino.ir`
- `CSRF_TRUSTED_ORIGINS=https://vofino.ir,https://*.vofino.ir,https://dash.vofino.ir`
- `CADDY_EMAIL=admin@vofino.ir`
- `PLATFORM_DOMAIN=vofino.ir`
- `USE_REDIS_CACHE=True`

## 5) One-command deploy
From project root:

```bash
docker compose up -d --build
```

This command:
- builds and starts all services
- runs migrations automatically
- collects static files
- enables Caddy on-demand TLS

## 6) Health checks
```bash
docker compose ps
docker compose logs -f django caddy
```

## 7) Create admin user
```bash
docker compose exec django python manage.py createsuperuser
```

## 8) Example tenant sync
```bash
docker compose exec django python manage.py shell
```

```python
from sites.models import Site
from tenants.services import ensure_tenant_for_site

site = Site.objects.get(subdomain="customer1")
tenant = ensure_tenant_for_site(site)
tenant.custom_domain = "example.com"
tenant.save()
```

## 9) Update deployment
```bash
git pull
docker compose up -d --build
```

## 10) SQLite backup
Database path in containers:
- `/app/data/db.sqlite3`

Backup example:
```bash
docker compose exec django sh -c 'cp /app/data/db.sqlite3 /app/media/db-backup.sqlite3'
```