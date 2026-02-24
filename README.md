# VirtinSaz

این README فقط پیش‌نیازهای اجرای پروژه را (به‌جز فرانت‌اند، بک‌اند، PostgreSQL و فایل‌های `.env` در فرانت و بک) لیست می‌کند.

## پیش‌نیازهای لازم

- Node.js نسخه 20 یا بالاتر
- npm یا pnpm
- Python نسخه 3.11 یا بالاتر
- `pip` و `venv`
- Redis (برای صف و نتیجه‌ی Celery)
- Celery Worker در حال اجرا (پروسس جدا از Django)
- ابزار Build برای پکیج‌های پایتون (روی لینوکس: `build-essential`, `python3-dev`)
- کتابخانه‌های سیستمی موردنیاز `mysqlclient` و `weasyprint` (در صورت استفاده از آن‌ها)

## نکته

- طبق تنظیمات فعلی بک‌اند، `CELERY_BROKER_URL` و `CELERY_RESULT_BACKEND` باید به Redis معتبر اشاره کنند.
- اگر واقعاً PostgreSQL استفاده می‌کنی، `DATABASE_URL` را روی PostgreSQL تنظیم کن و در صورت نیاز درایور مربوطه را نصب کن.
