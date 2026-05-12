import sqlite3

conn = sqlite3.connect('medai.db')
cursor = conn.cursor()

# Check for admin users
cursor.execute('SELECT id, email, role, is_active, is_validated FROM users WHERE role = "admin"')
admins = cursor.fetchall()

print(f"Found {len(admins)} admin users:")
for admin in admins:
    print(f"  ID: {admin[0]}, Email: {admin[1]}, Role: {admin[2]}, Active: {admin[3]}, Validated: {admin[4]}")

# Check total users
cursor.execute('SELECT COUNT(*) FROM users')
total = cursor.fetchone()[0]
print(f"Total users in database: {total}")

conn.close()