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
cursor.execute("""Insert Into accounts(member_id, email, password)
               VALUES
               (190492, 'jmoore3@gmail.com', '1234pass'),
               (180333, 'bgreen@yahoo.com', 'zYgg&65')
               """)
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (1823467, 'The Outsider', 'Horror', 2018),
               (2901231, 'Divergent', 'Action', 2011)
               """)
cursor.execute("""Insert Into authors(author_id, author_name)
               VALUES
               (23, "Stephen King"),
               (12, "Veronica Roth")
               """)
cursor.execute("""Insert Into book_authors(book_id, author_id)
               VALUES
               (1823467, 23),
               (2901231, 12)
               """)
cursor.execute("""Insert Into book_copies(copy_id, book_id, condition)
               VALUES
               (14232, 1823467, "Good"),
               (21343, 2901231, "Bad"),
               (34621, 1823467, "Excellent"),
               (18291, 2901231, "Worst")    
               """)
cursor.execute("""Insert Into loans(loan_id, member_id, copy_id, due_date)
               VALUES
               (31, 190492, 14232, '2025-12-10'),
               (12, 180333, 34621, '2026-01-18'),
               (8, 190492, 18291, '2026-02-18'),
               (45, 180333, 21343, '2025-12-10')    
               """)
cursor.execute("""Insert Into holds(hold_id, member_id, book_id)
               VALUES
               (17, 190492, 1823467),
               (23, 180333, 2901231),
               (10, 190492, 2901231),
               (13, 180333, 1823467)    
               """)
connection.commit()
connection.close()