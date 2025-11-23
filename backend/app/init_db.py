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
               (180333, 'Bob Green', 'bgreen@yahoo.com')
               """)
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (1823467, 'The Outsider', 'Horror', 2018),
               (2901231, 'Divergent', 'Action', 2011 )
               """)
connection.commit()
connection.close()