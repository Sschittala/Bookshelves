# importing sqlite3
# This file creates an SQLITE database file named database.db

import sqlite3
import random
connection = sqlite3.connect('database.db')

# To set up the sqlite database
with open('schema.sql') as f:
    connection.executescript(f.read())

cursor = connection.cursor()
def generate_random_id():
    return random.randint(100000, 999999)

# Horror
book_id_outsider = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (?, 'The Outsider', 'Horror', 2018)
               """, (book_id_outsider,))
cursor.execute("""Insert Into authors(author_name)
               VALUES ('Stephen King')""")

author_id_king = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_outsider, author_id_king)
               )
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_outsider, "Good"))
copy_id_outsider = cursor.lastrowid

book_id_it = generate_random_id()

cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'It', 'Horror', 1986)
               """, (book_id_it,))

cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_it, author_id_king) # <-- Uses the captured author_id_king
               )

cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_it, "Poor"))
copy_id_it = cursor.lastrowid

book_id_exorcist = generate_random_id()

cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Exorcist', 'Horror', 1971)
               """, (book_id_exorcist,))
cursor.execute("""Insert Into authors(author_name)
               VALUES ('William Peter Blatty')""")
author_id_blatty = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_exorcist, author_id_blatty) 
               )

cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_exorcist, "Good"))
copy_id_exorcist = cursor.lastrowid

book_id_villa = generate_random_id()

cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Villa, Once Beloved', 'Horror', 2025)
               """, (book_id_villa,))
cursor.execute("""Insert Into authors(author_name)
               VALUES ('Victor Manibo')""")
author_id_manibo = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_villa, author_id_manibo) 
               )

cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_villa, "Fair"))
copy_id_villa = cursor.lastrowid

book_id_shining = generate_random_id()

cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Shining', 'Horror', 1977)
               """, (book_id_shining,))

cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_shining, author_id_king) # <-- Uses the captured author_id_king
               )

cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_shining, "New"))
copy_id_shining = cursor.lastrowid

# Action
book_id_divergent = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (?, 'Divergent', 'Action', 2011)
               """, (book_id_divergent,))
cursor.execute("""Insert Into authors(author_name)
               VALUES ('Veronica Roth')""")
author_id_roth = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_divergent, author_id_roth)
               )
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_divergent, "Fair"))
copy_id_divergent = cursor.lastrowid

book_id_queen = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (?, 'Red Queen', 'Action', 2015)
               """, (book_id_queen,))
cursor.execute("""Insert Into authors(author_name)
               VALUES ('Victoria Aveyard')""")
author_id_aveyard = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_queen, author_id_aveyard)
               )
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_queen, "New"))
copy_id_queen = cursor.lastrowid

# 3 more



# Mystery
book_id_mystery = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Silent Patient', 'Mystery', 2019)
               """, (book_id_mystery,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Alex Michaelides')""")
author_id_michaelides = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_mystery, author_id_michaelides))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_mystery, "New"))
copy_id_mystery_1 = cursor.lastrowid

book_id_tattoo = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Girl with the Dragon Tattoo', 'Mystery', 2005)
               """, (book_id_tattoo,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Stieg Larsson')""")
author_id_larsson = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_tattoo, author_id_larsson))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_tattoo, "Fair"))
copy_id_tattoo = cursor.lastrowid

book_id_lies = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Big Little Lies', 'Mystery', 2014)
               """, (book_id_lies,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Liane Moriarty')""")
author_id_liane = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_lies, author_id_liane))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_lies, "Poor"))
copy_id_lies = cursor.lastrowid

book_id_sing = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Where the Crawdads Sing', 'Mystery', 2018)
               """, (book_id_sing,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Delia Owens')""")
author_id_owens = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_sing, author_id_owens))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_sing, "Fair"))
copy_id_sing = cursor.lastrowid

# 4 more

# Science Fiction
book_id_scifi = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Dune', 'Science Fiction', 1965)
               """, (book_id_scifi,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Frank Herbert')""")
author_id_herbert = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_scifi, author_id_herbert))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_scifi, "Good"))
copy_id_scifi_1 = cursor.lastrowid

book_id_chosen_ones = generate_random_id()

cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Chosen Ones', 'Science Fiction', 2020)
               """, (book_id_chosen_ones,))

cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_chosen_ones, author_id_roth) 
               )

cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_chosen_ones, "New"))
copy_id_chosen_ones = cursor.lastrowid

book_id_allegiante = generate_random_id()

cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Allegiant', 'Science Fiction', 2013)
               """, (book_id_allegiante,))

cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_allegiante, author_id_roth) 
               )

cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_allegiante, "Good"))
copy_id_allegiante = cursor.lastrowid

book_id_insurgent_sf = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (?, 'Insurgent', 'Science Fiction', 2012)
               """, (book_id_insurgent_sf,))
book_id_insurgent_sf = cursor.lastrowid

cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_insurgent_sf, author_id_roth)
               )
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_insurgent_sf, "Good"))
copy_id_insurgent_sf = cursor.lastrowid

# 1 more

# Fantasy
book_id_fantasy = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'A Game of Thrones', 'Fantasy', 1996)
               """, (book_id_fantasy,))
cursor.execute("""Insert Into authors(author_name) VALUES ('George R.R. Martin')""")
author_id_martin = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_fantasy, author_id_martin))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_fantasy, "Fair"))
copy_id_fantasy_1 = cursor.lastrowid

book_id_hobbit = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Hobbit', 'Fantasy', 1937)
               """, (book_id_hobbit,))
cursor.execute("""Insert Into authors(author_name) VALUES ('J.R.R. Tolkien')""")
author_id_tolkien = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_hobbit, author_id_tolkien))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_hobbit, "Poor"))
copy_id_hobbit = cursor.lastrowid

book_id_mistborn = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Mistborn: The Final Empire', 'Fantasy', 2006)
               """, (book_id_mistborn,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Brandon Sanderson')""")
author_id_sanderson = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_mistborn, author_id_sanderson))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_mistborn, "New"))
copy_id_mistborn = cursor.lastrowid

book_id_wind = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Name of the Wind', 'Fantasy', 2007)
               """, (book_id_wind,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Patrick Rothfuss')""")
author_id_rothfuss = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_wind, author_id_rothfuss))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_wind, "Good"))
copy_id_wind = cursor.lastrowid
# 4 more

# Romance
book_id_romance = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Love Hypothesis', 'Romance', 2021)
               """, (book_id_romance,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Ali Hazelwood')""")
author_id_hazelwood = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_romance, author_id_hazelwood))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_romance, "New"))
copy_id_romance_1 = cursor.lastrowid

book_id_lovers = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Book Lovers', 'Romance', 2022)
               """, (book_id_lovers,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Emily Henry')""")
author_id_henry = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_lovers, author_id_henry))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_lovers, "New"))
copy_id_lovers = cursor.lastrowid

book_id_blue = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Red, White & Royal Blue', 'Romance', 2019)
               """, (book_id_blue,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Casey McQuiston')""")
author_id_mcquiston = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_blue, author_id_mcquiston))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_blue, "New"))
copy_id_blue= cursor.lastrowid

book_id_roses = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'A Court of Thorns and Roses', 'Romance', 2015)
               """, (book_id_roses,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Sarah J. Maas')""")
author_id_mass = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_roses, author_id_mass))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_roses, "New"))
copy_id_roses = cursor.lastrowid
# 4 more

# Thriller
book_id_thriller = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Gone Girl', 'Thriller', 2012)
               """, (book_id_thriller,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Gillian Flynn')""")
author_id_flynn = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_thriller, author_id_flynn))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_thriller, "Good"))
copy_id_thriller_1 = cursor.lastrowid

book_id_ward = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Ward D', 'Thriller', 2023)
               """, (book_id_ward,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Freida McFadden')""")
author_id_mcf = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_ward, author_id_mcf))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_ward, "Poor"))
copy_id_ward = cursor.lastrowid

book_id_twenty = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Twenty Years Late', 'Thriller', 2021)
               """, (book_id_twenty,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Charlie Donlea')""")
author_id_charlie = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_twenty, author_id_charlie))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_twenty, "New"))
copy_id_twenty = cursor.lastrowid

# 2 more

# Biography
book_id_biography = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Steve Jobs', 'Biography', 2011)
               """, (book_id_biography,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Walter Isaacson')""")
author_id_isaacson = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_biography, author_id_isaacson))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_biography, "Good"))
copy_id_biography_1 = cursor.lastrowid

book_id_hamilton = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Alexander Hamilton', 'Biography', 2004)
               """, (book_id_hamilton,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Ron Chernow')""")
author_id_ron = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_hamilton, author_id_ron))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_hamilton, "Fair"))
copy_id_hamilton = cursor.lastrowid

book_id_musk = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future', 'Biography', 2015)
               """, (book_id_musk,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Ashlee Vance')""")
author_id_ashlee = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_musk, author_id_ashlee))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_musk, "New"))
copy_id_musk = cursor.lastrowid

book_id_becoming= generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Becoming', 'Biography', 2018)
               """, (book_id_becoming,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Michelle Obama')""")
author_id_obama= cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_becoming, author_id_obama))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_becoming, "Poor"))
copy_id_becoming = cursor.lastrowid
# 4 more

# History
book_id_history = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Sapiens: A Brief History of Humankind', 'History', 2011)
               """, (book_id_history,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Yuval Noah Harari')""")
author_id_harari = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_history, author_id_harari))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_history, "Poor"))
copy_id_history_1 = cursor.lastrowid

book_id_steel = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Guns, Germs, and Steel', 'History', 1997)
               """, (book_id_steel,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Jared Diamond')""")
author_id_diamond = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_steel, author_id_diamond))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_steel, "Poor"))
copy_id_steel = cursor.lastrowid
# 4 more

# Non-Fiction/Self-help
book_id_selfhelp = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Atomic Habits', 'Self-Help', 2018)
               """, (book_id_selfhelp,))
cursor.execute("""Insert Into authors(author_name) VALUES ('James Clear')""")
author_id_clear = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_selfhelp, author_id_clear))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_selfhelp, "New"))
copy_id_selfhelp_1 = cursor.lastrowid

book_id_greatlt = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Daring Greatly', 'Self-Help', 2012)
               """, (book_id_greatlt,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Brene Brown')""")
author_id_brown = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_greatlt, author_id_brown))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_greatlt, "Good"))
copy_id_greatly = cursor.lastrowid
# 3 more

# Young Adult
book_id_ya = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Hate U Give', 'Young Adult', 2017)
               """, (book_id_ya,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Angie Thomas')""")
author_id_thomas = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_ya, author_id_thomas))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_ya, "Fair"))
copy_id_ya_1 = cursor.lastrowid

book_id_insurgent = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES
               (?, 'Insurgent', 'Young Adult', 2012)
               """, (book_id_insurgent,))
book_id_insurgent = cursor.lastrowid

cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_insurgent, author_id_roth)
               )
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_insurgent, "New"))
copy_id_insurgent = cursor.lastrowid

# 3 more

# Children
book_id_children = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'Where the Wild Things Are', 'Children', 1963)
               """, (book_id_children,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Maurice Sendak')""")
author_id_sendak = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_children, author_id_sendak))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_children, "Fair"))
copy_id_children_1 = cursor.lastrowid

book_id_hat = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Cat in the Hat', 'Children', 1957)
               """, (book_id_hat,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Dr. Seuss')""")
author_id_seuss = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_hat, author_id_seuss))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_hat, "Fair"))
copy_id_hat = cursor.lastrowid

book_id_tree = generate_random_id()
cursor.execute("""Insert Into books(book_id, title, genre, publication_year)
               VALUES (?, 'The Giving Tree', 'Children', 1964)
               """, (book_id_tree,))
cursor.execute("""Insert Into authors(author_name) VALUES ('Shel Silverstein')""")
author_id_silverstein = cursor.lastrowid
cursor.execute("""Insert Into book_authors(book_id, author_id) VALUES (?, ?)""",
               (book_id_tree, author_id_silverstein))
cursor.execute("""Insert Into book_copies(book_id, condition) VALUES (?, ?)""",
               (book_id_tree, "Poor"))
copy_id_tree = cursor.lastrowid

# 4 more
connection.commit()
connection.close()
