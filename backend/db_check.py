import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print(f"Database file {db_path} not found")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print("Tables:", [t[0] for t in tables])
        
        if ('sites_template',) in tables:
            cursor.execute("SELECT * FROM sites_template;")
            rows = cursor.fetchall()
            print(f"Found {len(rows)} templates in sites_template")
            for row in rows:
                print(row)
        else:
            print("Table sites_template not found")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
