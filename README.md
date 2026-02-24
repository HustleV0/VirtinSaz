# Vofino Production Deployment Guide (Zero to 100)

This guide deploys Vofino on `vofino.ir` with wildcard subdomains (`*.vofino.ir`) behind Cloudflare, Docker, Nginx, Django, MySQL, Redis, and Celery.

## 1) Prerequisites
- A Linux server with public IP (Ubuntu 22.04+ recommended)
- Domain managed in Cloudflare (`vofino.ir`)
- Docker and Docker Compose installed
- Open ports: `80`, `443`

## 2) Cloudflare DNS Setup
In Cloudflare DNS for `vofino.ir`:
1. Add record: `A` / `@` / `<SERVER_IP>` / **Proxied ON** (orange cloud)
2. Add record: `A` / `*` / `<SERVER_IP>` / **Proxied ON** (orange cloud)

Important:
- Both `@` and `*` must be proxied.
- If gray cloud is used, origin protection rules may block traffic.

## 3) Cloudflare SSL/TLS Settings
In Cloudflare:
1. SSL/TLS mode: **Full (Strict)**
2. Create **Origin Certificate** for:
   - `vofino.ir`
   - `*.vofino.ir`
3. Save certificate and private key.

On server, put them in project:
- `nginx/ssl/cloudflare.crt`
- `nginx/ssl/cloudflare.key`

## 4) Server Bootstrap
Update system and install Docker:
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

Firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 5) Clone Project
```bash
git clone <YOUR_REPO_URL> vofino
cd vofino
```

## 6) Production Environment File
Create env from template:
```bash
cp .env.production.example .env.production
```

Edit `.env.production` and set strong secrets:
- `SECRET_KEY`
- `MYSQL_PASSWORD`
- `MYSQL_ROOT_PASSWORD`
- `DATABASE_URL`
- any payment keys

Required production values:
- `DEBUG=False`
- `DOMAIN_NAME=vofino.ir`
- `ALLOWED_HOSTS=vofino.ir,.vofino.ir`
- `CSRF_TRUSTED_ORIGINS=https://vofino.ir,https://*.vofino.ir`
- `SECURE_SSL_REDIRECT=True`

## 7) Nginx + Wildcard SSL + Cloudflare
This repo is already configured for:
- `server_name vofino.ir *.vofino.ir`
- HTTPS only (HTTP redirects to HTTPS)
- TLS 1.2/1.3
- Cloudflare origin cert
- Cloudflare IP allow-list on 443
- gzip + rate limit + security headers

Do not expose backend directly.
Only Nginx exposes:
- `80`
- `443`

## 8) Run Production Stack
```bash
APP_ENV_FILE=.env.production docker compose --env-file .env.production up -d --build
```

Check status:
```bash
APP_ENV_FILE=.env.production docker compose ps
```

Check logs:
```bash
APP_ENV_FILE=.env.production docker compose --env-file .env.production logs -f nginx django frontend celery
```

## 9) Post-Deploy Validation
Test main domain:
- `https://vofino.ir`

Test wildcard subdomains:
- `https://user1.vofino.ir`
- `https://user2.vofino.ir`

Verify:
1. Valid HTTPS certificate in browser
2. No redirect loop
3. No mixed-content warnings
4. API and admin reachable through same host

Optional CLI checks:
```bash
curl -I https://vofino.ir
curl -I https://user1.vofino.ir
```

## 10) Common Issues
- 525/526 Cloudflare errors:
  - check cert/key files and Full (Strict)
- Subdomain not resolving:
  - check wildcard `*` DNS record is proxied
- Wrong host / CSRF issues:
  - verify `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`
- Static/media not loading:
  - check nginx volumes and container logs

## 11) Update / Restart
Update code:
```bash
git pull
APP_ENV_FILE=.env.production docker compose --env-file .env.production up -d --build
```

Restart:
```bash
APP_ENV_FILE=.env.production docker compose restart
```

Stop:
```bash
APP_ENV_FILE=.env.production docker compose down
```

## 12) DNS Records Summary
Required Cloudflare records:
- `A @ -> <SERVER_IP> (Proxied ON)`
- `A * -> <SERVER_IP> (Proxied ON)`

That is enough for wildcard routing, provided SSL and server config are correct.
