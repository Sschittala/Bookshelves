# importing sqlite3
# This file creates an SQLITE database file named database.db

import sqlite3

connection = sqlite3.connect('database.db')

# To set up the sqlite database
with open('schema.sql') as f:
    connection.executescript(f.read())

cursor = connection.cursor()

cursor.execute("""Insert Into books(title, genre, publication_year)
               VALUES
               ('The Outsider', 'Horror', 2018)
               """)
book_id_outsider = cursor.lastrowid
cursor.execute("""Insert Into books(title, genre, publication_year)
               VALUES
               ('Divergent', 'Action', 2011)
               """)
book_id_divergent = cursor.lastrowid
cursor.execute("""Insert Into authors(author_id, author_name)
               VALUES (23, 'Stephen King')""")
author_id_king = 23
cursor.execute("""Insert Into authors(author_id, author_name)
               VALUES (12, 'Veronica Roth')""")
author_id_roth = 12
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_outsider, author_id_king)
               )
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_divergent, author_id_roth)
               )
connection.commit()
connection.close()
