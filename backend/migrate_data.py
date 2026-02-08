import os
import django
import sys
from django.core.management import call_command

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django
try:
    django.setup()
except Exception as e:
    print(f"Error initializing Django: {e}")
    sys.exit(1)

def migrate_and_load():
    """
    Runs migrations and loads data from the backup file.
    """
    try:
        print("--- Starting Database Migration ---")
        
        # 1. Run migrations to create table structures
        print("Step 1: Running migrations...")
        call_command('migrate')
        
        # 2. Load data from the JSON backup
        print("\nStep 2: Loading data from db_backup.json...")
        # Note: loaddata handles the mapping from model names in JSON to DB tables
        call_command('loaddata', 'db_backup.json')
        
        print("\n--- Data migration completed successfully! ---")
        
    except Exception as e:
        print(f"\nAn error occurred during migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    migrate_and_load()
