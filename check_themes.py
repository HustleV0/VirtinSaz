import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from sites.models import Theme
with open('themes_output.txt', 'w', encoding='utf-8') as f:
    for t in Theme.objects.all():
        f.write(f"{t.name} | {t.slug} | {t.source_identifier}\n")
