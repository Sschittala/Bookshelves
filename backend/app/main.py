from flask import Flask, request, jsonify, session
from datatier import *
from random import randint
import sqlite3
import os

''' Database methods '''

# Establishes db connection
def get_db_connection():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    # optionally enable row access by name:
    # conn.row_factory = sqlite3.Row
    return conn

# Adds user to accounts and members tables
def register_user(dbConn, username, password):
    sql = """
        SELECT COUNT(*)
        FROM accounts
        WHERE email = ?
        """
    res = select_one_row(dbConn, sql, parameters=(username,))
    if not res:
        return (False, 'Could not fetch data')

    if res[0] != 0: # email is unavailable in accounts
        return (False, "Email is already present in accounts!")

    # TODO: handle collisions properly
    member_id = randint(1, 999999)

    sql = """
        Insert Into accounts(member_id, email, password)
        VALUES (?, ?, ?)
        """
    perform_action(dbConn, sql, parameters=(int(member_id), str(username), str(password)))

    name = username.split('@')[0]
    sql = """
        Insert Into members(member_id, name, email)
        VALUES (?, ?, ?)
        """
    perform_action(dbConn, sql, parameters=(int(member_id), str(name), str(username)))

    dbConn.commit()
    return (True, "")

# Confirm whether the account exists
def confirm_user(dbConn, username, password):
    sql = """
        SELECT member_id
        FROM accounts
        WHERE email = ? AND password = ?
        """
    res = select_one_row(dbConn, sql, parameters=(username, password))
    if not res:
        return None
    return res[0]

# Returns holds for the given member
def get_holds_for_mem(dbConn, member_id):
    sql = """
        SELECT *
        FROM holds
        WHERE member_id = ?
    """
    res = select_n_rows(dbConn, sql, (str(member_id),))
    return res

# Puts book on hold for a given member
def hold_book_for_mem(dbConn, book_id, member_id):
    sql = """
        Insert Into holds(hold_id, member_id, book_id)
        VALUES
        (?, ?, ?)
    """
    hold_id = randint(0, 999999)
    perform_action(dbConn, sql, (str(hold_id), str(member_id), str(book_id)))
    dbConn.commit()
    return hold_id

# Removes hold for a given book copy (fulfills it)
def remove_hold(dbConn, hold_id):
    sql = """
        UPDATE holds
        SET fulfilled_at = CURRENT_TIMESTAMP
        WHERE hold_id = ?
    """
    perform_action(dbConn, sql, (str(hold_id),))
    dbConn.commit()

def search_books(dbConn, search_term):
    sql = """
        SELECT b.book_id, b.title, b.genre, b.publication_year,
               a.author_id, a.author_name AS author_name
        FROM books b
        LEFT JOIN book_authors ba ON b.book_id = ba.book_id
        LEFT JOIN authors a ON ba.author_id = a.author_id
        WHERE b.title LIKE ? OR b.genre LIKE ? OR a.author_name LIKE ?
    """
    search_term2 = f"%{search_term}%"
    res = select_n_rows(dbConn, sql, (search_term2, search_term2, search_term2))
    books_list = []
    if not res:
        return
    for row in res:
        books_list.append({
            "book_id": row[0],
            "title": row[1],
            "genre": row[2],
            "publication_year": row[3],
            "author_id": row[4],
            "author_name": row[5]
        })
    return books_list

# --- Book Management Database Methods ---
# NOTE: these functions use the normalized schema:
#   books(book_id, title, genre, publication_year)
#   authors(author_id, name)
#   book_authors(book_id, author_id)  -- one-to-one in your design (one author per book)

# Returns a list of all books with author info
def get_all_books(dbConn):
    sql = """
        SELECT b.book_id, b.title, b.genre, b.publication_year,
               a.author_id, a.author_name AS author_name
        FROM books b
        LEFT JOIN book_authors ba ON b.book_id = ba.book_id
        LEFT JOIN authors a ON ba.author_id = a.author_id
        ORDER BY b.title
    """
    res = select_n_rows(dbConn, sql)
    books_list = []
    if not res:
        return
    for row in res:
        # row is a tuple in same order as SELECT
        books_list.append({
            "book_id": row[0],
            "title": row[1],
            "genre": row[2],
            "publication_year": row[3],
            "author_id": row[4],
            "author_name": row[5]
        })
    return books_list


def get_book(dbConn, book_id):
    sql_book = """
        SELECT b.book_id, b.title, b.genre, b.publication_year,
               a.author_id, a.author_name AS author_name
        FROM books b
        LEFT JOIN book_authors ba ON b.book_id = ba.book_id
        LEFT JOIN authors a ON ba.author_id = a.author_id
        WHERE b.book_id = ?
    """
    res = select_n_rows(dbConn, sql_book, (book_id,))
    if not res:
        return None

    row = res[0]
    sql_copies = """
        SELECT bc.copy_id, bc.condition, 
                l.loan_id, l.member_id, l.due_date, l.start_date, l.end_date, l.returned_at
        FROM book_copies bc
        LEFT JOIN loans l ON bc.copy_id = l.copy_id AND l.returned_at IS NULL
        WHERE bc.book_id = ?
    """
    res_copies = select_n_rows(dbConn, sql_copies, (book_id,))

    copies_list = []
    if res_copies:
        for copy in res_copies:
            loan_data = None
            if copy[2] is not None:
                loan_data = {
                   "loan_id": copy[2],
                    "member_id": copy[3],
                    "due_date": copy[4],
                    "start_date": copy[5],
                    "end_date": copy[6],
                    "returned_at": copy[7]
                }

            copies_list.append({
                "copy_id": copy[0],
                "condition": copy[1],
                "loan": loan_data
            })

    return {
        "book_id": row[0],
        "title": row[1],
        "genre": row[2],
        "publication_year": row[3],
        "author_id": row[4],
        "author_name": row[5],
        "copies": copies_list
    }

def create_book(dbConn, title, genre, publication_year, authors, copies):
        cursor = dbConn.cursor()
        cursor.execute(
            "INSERT INTO books (title, genre, publication_year) VALUES (?, ?, ?)",
            (title, genre, publication_year),
        )
        book_id = cursor.lastrowid
        for author_name in authors:
            cursor.execute("SELECT author_id FROM authors WHERE author_name = ?", (author_name,))
            result = cursor.fetchone()
            if result:
                    author_id = result[0]
            else:
                cursor.execute("INSERT INTO authors (author_name) VALUES (?)", (author_name,))
                author_id = cursor.lastrowid
                cursor.execute(
                    "INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)",
                    (book_id, author_id),
                )
            for copy in copies:
                cursor.execute(
                            "INSERT INTO book_copies (book_id, condition) VALUES (?, ?)",
                            (book_id, copy['condition']),
                        )
            dbConn.commit()
            return book_id

# Update book and its mapping to author
def update_book(dbConn, book_id, title, genre, author_id, publication_year):
    cursor = dbConn.cursor()
    cursor.execute(
        "UPDATE books SET title=?, genre=?, publication_year=? WHERE book_id=?",
        (title, genre, publication_year, book_id),
    )

    # Try updating existing book_authors row
    cursor.execute(
        "SELECT COUNT(*) FROM book_authors WHERE book_id=?",
        (book_id,),
    )
    exists = cursor.fetchone()[0]
    if exists:
        cursor.execute(
            "UPDATE book_authors SET author_id=? WHERE book_id=?",
            (author_id, book_id),
        )
    else:
        cursor.execute(
            "INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)",
            (book_id, author_id),
        )
    dbConn.commit()
    return True

# Deletes a book and its mapping
def delete_book(dbConn, book_id):
    cursor = dbConn.cursor()
    # delete mapping first (foreign keys without cascade)
    cursor.execute("DELETE FROM book_authors WHERE book_id=?", (book_id,))
    cursor.execute("DELETE FROM books WHERE book_id=?", (book_id,))
    dbConn.commit()
    return True

def add_loans(dbConn, member_id, copy_id):
    sql = """
        INSERT INTO loans(member_id, copy_id)
        VALUES (?, ?)
    """
    cursor = dbConn.cursor()
    cursor.execute(sql, (member_id, copy_id))
    dbConn.commit()
    
    return cursor.lastrowid

# Removes a loan once a user returns a book
def remove_loans(dbConn, loan_id):
    sql = """
        DELETE FROM loans WHERE loan_id = ?
    """
    perform_action(dbConn, sql, (loan_id,))
    dbConn.commit()
    return loan_id

# Returns list of loans for a given member
def get_loans_for_mem(dbConn, member_id):
    sql = """
        SELECT *
        FROM loans
        WHERE member_id = ?
    """
    res = select_n_rows(dbConn, sql, (member_id,))
    return res

# Returns list of authors
def get_all_authors(dbConn):
    sql = """
        SELECT author_id, author_name
        FROM authors
        ORDER BY name
    """
    res = select_n_rows(dbConn, sql)
    authors_list = []
    if not res:
        return
    for row in res:
        authors_list.append({
            "author_id": row[0],
            "author_name": row[1]
        })
    return authors_list

''' Initializing the app '''
app = Flask(__name__)
dbConn = get_db_connection() # Connection to the database

app.secret_key = os.urandom(32).hex()

''' Request handlers '''

@app.route('/api/auth/register', methods=['POST'])
def register_handler():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    conf_password = data.get('confirm password')

    if not username or not password or not conf_password:
        return jsonify({'success': False}), 400

    if password == conf_password:
        success, err = register_user(dbConn, username, password)
        if success:
            return jsonify({'success': True}), 200
        else:
            return jsonify({'success': False, 'error': err}), 403
    else:
        return jsonify({'success': False, 'error': 'Passwords do not match'}), 403

@app.route('/api/auth/login', methods=['POST'])
def login_handler():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    member_id = confirm_user(dbConn, username, password)

    if member_id is None:
        return jsonify({"member_id": None}), 403

    session.permanent = True
    session['username'] = username
    session['member_id'] = member_id

    return jsonify({"member_id": member_id}), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout_handler():
    session.clear()
    return jsonify({"ok": True}), 200

@app.route('/api/auth/me', methods=['GET'])
def me_handler():
    if 'member_id' not in session:
        return jsonify({"authenticated": False}), 200
    return jsonify({
        "authenticated": True,
        "username": session.get('username'),
        "member_id": session['member_id']
    }), 200

# Returning holds for a user
@app.route('/api/holds/get_holds', methods=['GET'])
def get_holds_handler():
    member_id = request.args.get('member_id')

    if not member_id:
        return jsonify({"error": "member_id required"}), 400

    hold_list = get_holds_for_mem(dbConn, member_id)
    if hold_list is None:
        return jsonify([]), 200

    return_list = []
    for hold in hold_list:
        return_list.append({
            "hold_id": hold[0],
            "member_id": hold[1],
            "book_id": hold[2],
            "placed_at": hold[3],
            "notified_at": hold[4],
            "fulfilled_at": hold[5]
        })
    return jsonify(return_list), 200

# holding a book for a member
@app.route('/api/holds/set_hold', methods=['POST'])
def book_hold_handler():
    data = request.get_json() or {}
    book_id = data.get('book_id')
    member_id = data.get('member_id')
    if not book_id or not member_id:
        return jsonify({"error": "book_id and member_id required"}), 400

    hold_id = hold_book_for_mem(dbConn, book_id, member_id)
    return jsonify({"hold_id": hold_id}), 201

# Remove holds for a user
@app.route('/api/holds/remove_hold', methods=['POST'])
def remove_hold_handler():
    data = request.get_json() or {}
    hold_id = data.get('hold_id')
    if not hold_id:
        return jsonify({"error": "hold_id required"}), 400

    remove_hold(dbConn, hold_id)
    return jsonify({"ok": True}), 200

# --- Book Management Routes (CRUD) ---

@app.route('/api/books', methods=['GET'])
def books_get_all_handler():
    """Read: Fetch all books with author info."""
    try:
        if 'book_id' not in request.args:
            books = get_all_books(dbConn)
            if books is None:
                return jsonify({"error": "Database error while fetching books."}), 500
            return jsonify(books), 200
        else:
            book_id = request.args.get('book_id')
            book = get_book(dbConn, book_id)
            if book is None:
                return jsonify({"error": "Database error while fetching book."}), 500
            return jsonify(book), 200

    except Exception as e:
        print(f"Error fetching books: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@app.route('/api/books', methods=['POST'])
def books_create_handler():
    data = request.get_json() or {}
    required_fields = ['title', 'genre', 'publication_year', 'authors', 'copies']
    if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required book data fields."}), 400
    
    if not isinstance(data['authors'], list) or len(data['authors']) == 0:
            return jsonify({"error": "Authors must be a non-empty array."}), 400
    
    if not isinstance(data['copies'], list) or len(data['copies']) == 0:
            return jsonify({"error": "Copies must be a non-empty array."}), 400
    
    try:
        pub_year = int(data['publication_year'])
        book_id = create_book(
            dbConn, 
                data['title'], 
                data['genre'], 
                pub_year,
                data['authors'],
                data['copies']
                )
        return jsonify({"success": True, "book_id": book_id}), 201
    except ValueError:
        return jsonify({"error": "Publication year must be a valid number."}), 400
    except Exception as e:
        print(f"Error creating book: {e}")
        return jsonify({"error": "Failed to create book."}), 500

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def books_update_handler(book_id):
    """Update: Modify an existing book by ID. Expects JSON: title, genre, publication_year, author_id"""
    data = request.get_json() or {}
    required_fields = ['title', 'genre', 'publication_year', 'author_id']

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required book data fields."}), 400

    try:
        pub_year = int(data['publication_year'])
        author_id = int(data['author_id'])
        update_book(dbConn, book_id, data['title'], data['genre'], author_id, pub_year)
        return jsonify({"success": True}), 200
    except ValueError:
        return jsonify({"error": "Publication year and author_id must be valid numbers."}), 400
    except Exception as e:
        print(f"Error updating book ID {book_id}: {e}")
        return jsonify({"error": "Failed to update book."}), 500

@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def books_delete_handler(book_id):
    """Delete: Remove a book by ID."""
    try:
        delete_book(dbConn, book_id)
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"Error deleting book ID {book_id}: {e}")
        return jsonify({"error": "Failed to delete book."}), 500

@app.route('/api/authors', methods=['GET'])
def authors_get_all_handler():
    sql = "SELECT author_id, author_name FROM authors ORDER BY name"
    res = select_n_rows(dbConn, sql)

    if not res:
        return jsonify([]), 500

    authors_list = [{"author_id": row[0], "name": row[1]} for row in res]
    return jsonify(authors_list), 200

@app.route('/api/books/search', methods=['GET'])
def books_search_handler():
    search_term = request.args.get('q')
    if not search_term:
        books = get_all_books(dbConn)
        if books is None:
            return jsonify({"error": "Database error while fetching books."}), 500
        return jsonify(books), 200
    else:
        books = search_books(dbConn, search_term)
        if books is None:
            return jsonify({"error": "Database error while searching books."}), 500
        return jsonify(books), 200

@app.route("/api/loans/add_loan", methods=['POST'])
def add_loan_handler():
    data = request.get_json() or {}
    member_id = data.get('member_id')
    copy_id = data.get('copy_id')
    if not member_id or not copy_id:
        return jsonify({"error": "member_id and copy_id required"}), 400
    loan_id = add_loans(dbConn, member_id, copy_id)
    return jsonify({"loan_id": loan_id}), 201

@app.route("/api/loans/remove_loan", methods=['POST'])
def remove_loan_handler():
    data = request.get_json() or {}
    loan_id = data.get('loan_id')
    if not loan_id:
        return jsonify({"error": "loan_id required"}), 400
    remove_loans(dbConn, loan_id)
    return jsonify({"ok": True}), 200

@app.route("/api/loans/get_loans", methods=['GET'])
def get_loans_handler():
    data = request.get_json() or {}
    member_id = data.get('member_id')
    if not member_id:
        return jsonify({"error": "member_id required"}), 400
    loans = get_loans_for_mem(dbConn, member_id)
    return jsonify(loans), 200
    
''' Main method '''
if __name__ == '__main__':
    app.run(debug=True)
    dbConn.close()
