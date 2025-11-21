# importing sqlite3
# This file creates an SQLITE database file named database.db

import sqlite3

connection = sqlite3.connect('database.db')

# To set up the sqlite database
with open('schema.sql') as f:
    connection.executescript(f.read())
cursor = connection.cursor()
cursor.execute("""Insert Into members(member_id, name, email)
               VALUES
               (190492, 'John Moore', 'jmoore3@gmail.com'),
               (180333, 'Bob Green', 'bgreen@yahoo.com')""")
connection.commit()
connection.close()