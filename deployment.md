# Manual Deployment Guide for VirtinSaz

This guide provides instructions for manually deploying the VirtinSaz project on a Linux server (Ubuntu/Debian recommended).

## Prerequisites

Ensure the following are installed on your server:
- **Python 3.10+**
- **Node.js 18+** & **npm** (or pnpm/yarn)
- **MySQL Server 8.0+**
- **Redis Server** (for Celery)
- **Caddy** or **Nginx** (Reverse Proxy)
- **Systemd** (for process management)

---

## 1. Database Setup

1. Log in to MySQL:
   ```bash
   mysql -u root -p
   ```
2. Create the database and user:
   ```sql
   CREATE DATABASE vofino_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'vofino_user'@'localhost' IDENTIFIED BY 'your_strong_password';
   GRANT ALL PRIVILEGES ON vofino_db.* TO 'vofino_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## 2. Backend Setup (Django)

1. Clone the repository and navigate to the backend:
   ```bash
   cd VirtinSaz/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Create a `.env` file in the root directory (parent of backend/) if not already present, or edit the existing one:
   ```ini
   DEBUG=False
   SECRET_KEY=your-secret-key
   ALLOWED_HOSTS=vofino.ir,.vofino.ir
   CSRF_TRUSTED_ORIGINS=https://vofino.ir,https://*.vofino.ir
   
   MYSQL_DATABASE=vofino_db
   MYSQL_USER=vofino_user
   MYSQL_PASSWORD=your_strong_password
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   
   CELERY_BROKER_URL=redis://localhost:6379/0
   CELERY_RESULT_BACKEND=redis://localhost:6379/0
   ```
5. Run migrations and collect static files:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

---

## 3. Frontend Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Build the application:
   ```bash
   npm run build
   ```

---

## 4. Process Management (Systemd)

Create systemd service files for Gunicorn, Celery, and Next.js.

### Gunicorn (Backend)
`/etc/systemd/system/vofino-backend.service`:
```ini
[Unit]
Description=Gunicorn instance to serve Vofino Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/VirtinSaz/backend
Environment="PATH=/path/to/VirtinSaz/backend/venv/bin"
ExecStart=/path/to/VirtinSaz/backend/venv/bin/gunicorn --workers 3 --bind unix:/path/to/VirtinSaz/backend/vofino.sock core.wsgi:application

[Install]
WantedBy=multi-user.target
```

### Celery Worker
`/etc/systemd/system/vofino-worker.service`:
```ini
[Unit]
Description=Celery Worker for Vofino
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/VirtinSaz/backend
Environment="PATH=/path/to/VirtinSaz/backend/venv/bin"
ExecStart=/path/to/VirtinSaz/backend/venv/bin/celery -A core worker --loglevel=info

[Install]
WantedBy=multi-user.target
```

### Next.js (Frontend)
`/etc/systemd/system/vofino-frontend.service`:
```ini
[Unit]
Description=Next.js Frontend for Vofino
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/VirtinSaz/frontend
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 5. Reverse Proxy (Caddy)

If using Caddy, your `Caddyfile` should look like this:

```caddy
{
    email admin@vofino.ir
}

# Main Domain and Subdomains (Wildcard)
*.vofino.ir, vofino.ir {
    # Frontend (Next.js)
    reverse_proxy localhost:3000

    # Backend API and Admin
    handle_path /api/* {
        reverse_proxy unix//path/to/VirtinSaz/backend/vofino.sock
    }
    
    handle_path /admin/* {
        reverse_proxy unix//path/to/VirtinSaz/backend/vofino.sock
    }

    # Static and Media files (served by Caddy)
    handle_path /static/* {
        root * /path/to/VirtinSaz/backend/static
        file_server
    }

    handle_path /media/* {
        root * /path/to/VirtinSaz/backend/media
        file_server
    }
}
```

---

## 6. Final Steps

1. Enable and start services:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable vofino-backend vofino-worker vofino-frontend
   sudo systemctl start vofino-backend vofino-worker vofino-frontend
   ```
2. Restart Caddy:
   ```bash
   sudo systemctl restart caddy
   ```
