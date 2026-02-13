import os
import subprocess
import json

def run_command(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    return result.returncode == 0

def migrate_data():
    # 1. Dump data from SQLite
    print("Dumping data from SQLite...")
    # We use --exclude to avoid issues with content types and permissions which are auto-created
    dump_cmd = "python manage.py dumpdata --exclude contenttypes --exclude auth.Permission --indent 2 > data_dump.json"
    if not run_command(dump_cmd):
        return

    print("Data dumped to data_dump.json")
    print("\nNext steps:")
    print("1. Ensure your .env file is configured for MySQL.")
    print("2. Run your Docker containers: docker-compose up -d")
    print("3. Run migrations on MySQL: docker-compose exec django python manage.py migrate")
    print("4. Load the data: docker-compose exec -T django python manage.py loaddata data_dump.json")
    print("\nNOTE: You might need to manually install 'mysqlclient' or 'pymysql' in your local environment if you want to run this outside of Docker.")

if __name__ == "__main__":
    migrate_data()
