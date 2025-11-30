from flask import Flask, request, jsonify, session
from datatier import *
from random import randint
import os

''' Database methods '''

# Establishes db connection
def get_db_connection():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    # This gives you name-bases access to columns in your database
    #conn.row_factory = sqlite3.Row
    return conn

# Adds user to accounts and members tables
# 
# Returns tuple with (bool, error message), if registration is 
# successful, return (True, ""), otherwise (False, "Error that occurred")
def register_user(dbConn, username, password):
    # check if user is in accounts
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
    # No check for "members" table since it's presumed entrees are created together
    # Generating member id

    # TODO see if any members have same id, and re-generate it if so
    id = randint(1, 999999)

    # Adding user to tables
    sql = """
        Insert Into accounts(member_id, email, password)
        VALUES (?, ?, ?)
        """
    perform_action(dbConn, sql, parameters=(int(id), str(username), str(password)))

    name = username.split('@')[0]

    sql = """
        Insert Into members(member_id, name, email)
        VALUES (?, ?, ?)
        """
    perform_action(dbConn, sql, parameters=(int(id), str(name), str(username)))

    dbConn.commit() # have to make sure we commit otherwise db doenst change

    return (True, "")
    

# Confirm weather the acount exists
# 
# Returns member id if user exists, None otherwise
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

# Returns holds from the given member
# 
# Just a list of books, pretty much
def get_holds_for_mem(dbConn, member_id):
    sql = """
        SELECT *
        FROM holds
        WHERE member_id = ?
    """
    res = select_n_rows(dbConn, sql, (str(member_id),))
    # res is a list of lists (or [] !!!), so we return it as-is
    return res


# Puts book on hold for a given member
# 
# Scans books for an available ones and sees if there are any to hold,
# if there is none, returns an error.
# If everything is good, returns hold id
def hold_book_for_mem(dbConn, book_id, member_id):
    sql = """
        Insert Into holds(hold_id, member_id, book_id)
        VALUES
        (?, ?, ?)
    """
    hold_id = randint(0, 99) # TODO rewrite to guarantee we don;t hit existing id
    perform_action(dbConn, sql, (str(hold_id), str(member_id), str(book_id)))

# Removes hold for a given book copy
# 
# Basically just adds date for fulfilled hold
def remove_hold(dbConn, hold_id):
    sql = """
        UPDATE holds
        SET fulfilled_at = CURRENT_TIMESTAMP
        WHERE hold_id = ?
    """
    perform_action(dbConn, sql, (str(hold_id),))

# --- Book Management Database Methods ---

# Returns a list of all books
def get_all_books(dbConn):
    sql = """
        SELECT book_id, title, genre, publication_year
        FROM books
        ORDER BY title
    """
    res = select_n_rows(dbConn, sql)

    books_list = []
    # Map the results (list of tuples) to a list of dictionaries for JSON
    for row in res:
        books_list.append({
            "id": row[0],  # Using 'id' for frontend consistency
            "title": row[1],
            "genre": row[2],
            "publication_year": row[3]
        })
    return books_list

# Adds a new book
def create_book(dbConn, title, genre, author, publication_year):
    sql = """
        INSERT INTO books (title, genre, publication_year)
        VALUES (?, ?, ?)
    """
    perform_action(dbConn, sql, parameters=(title, genre, author, publication_year))
    dbConn.commit()
    return True

# Updates an existing book
def update_book(dbConn, book_id, title, genre, author, publication_year):
    sql = """
        UPDATE books
        SET title=?, genre=?, publication_year=?
        WHERE book_id=?
    """
    # Note the order of parameters must match the SQL statement placeholders
    perform_action(dbConn, sql, parameters=(title, genre, author, publication_year, book_id))
    dbConn.commit()
    return True

# Deletes a book
def delete_book(dbConn, book_id):
    sql = """
        DELETE FROM books
        WHERE book_id=?
    """
    perform_action(dbConn, sql, parameters=(book_id,))
    dbConn.commit()
    return True
''' Initializing the app '''
app = Flask(__name__)
dbConn = get_db_connection() # Connection to the database




''' Request handlers '''
# Example request and response
# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>", 200

# Registering a user


app.secret_key = os.urandom(32).hex()

@app.route('/api/auth/register', methods=['POST'])
def register_handler():
    """
    We should not be getting the request from the URL.
    username = request.args['username'] # Attention! we are presuming the username is an e-mail in format "username@example.com"!
    password = request.args['password']
    """
    data = request.get_json() or {} # Gets the json data from the body
    username = data.get('username')
    password = data.get('password')
    conf_password = data.get('confirm password')

    if not username or not password or not conf_password:
        return jsonify({'success': False}), 400

    if password == conf_password:
        success, err = register_user(dbConn, username, password)
        if success:
            return jsonify({'success': True}), 200 # TODO do we need to return something specific?
        else:
            return jsonify({'success': False}), 403
    else: # if passwords do not match
        return jsonify({'success': False}), 403

# Logging in the user
@app.route('/api/auth/login', methods=['POST'])
def login_handler():
    data = request.get_json() or {} # Gets the json data from the body
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    member_id = confirm_user(dbConn, username, password)

    if member_id == None:
        return jsonify({"member_id": None}), 403

    session.permanent = True
    session['username'] = username
    session['member_id'] = member_id

    return jsonify({"member_id": member_id}), 200

@app.route('/api/auth/logout', methods=['POST']) # logout = clear cookie
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
    # getting holds
    member_id = request.args['member_id']
    hold_list = get_holds_for_mem(dbConn, member_id)
    if not hold_list:
        return

    # preparing the return
    return_list = [] # list for dictionaries to be JSON-ified
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
    book_id = request.args['book_id']
    member_id = request.args['member_id']

    hold_book_for_mem(dbConn, book_id, member_id)

    return

# Remove holds for a user
@app.route('/api/holds/remove_hold', methods=['POST'])
def remove_hold_handler():
    hold_id = request.args['hold_id']

    remove_hold(dbConn, hold_id)

    return

# CRUD for books
# --- Book Management Routes (CRUD) ---

@app.route('/api/books', methods=['GET'])
def books_get_all_handler():
    """Read: Fetch all books."""
    try:
        books = get_all_books(dbConn)
        # Check if books list is None (error from datatier)
        if books is None:
            return jsonify({"error": "Database error while fetching books."}), 500
        return jsonify(books), 200
    except Exception as e:
        print(f"Error fetching books: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@app.route('/api/books', methods=['POST'])
def books_create_handler():
    """Create: Add a new book."""
    data = request.get_json() or {}
    required_fields = ['title', 'genre', 'publication_year']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required book data fields."}), 400
    
    try:
        # Convert publication_year to integer if necessary
        pub_year = int(data['publication_year'])
        create_book(dbConn, data['title'], data['genre'], pub_year)
        return jsonify({"success": True}), 201
    except ValueError:
        return jsonify({"error": "Publication year must be a valid number."}), 400
    except Exception as e:
        print(f"Error creating book: {e}")
        return jsonify({"error": "Failed to create book."}), 500

@app.route('/api/books/<int:book_id>', methods=['PUT'])
def books_update_handler(book_id):
    """Update: Modify an existing book by ID."""
    data = request.get_json() or {}
    required_fields = ['title', 'genre', 'publication_year']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required book data fields."}), 400
    
    try:
        pub_year = int(data['publication_year'])
        update_book(dbConn, book_id, data['title'], data['genre'], pub_year)
        return jsonify({"success": True}), 200
    except ValueError:
        return jsonify({"error": "Publication year must be a valid number."}), 400
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
''' Main method '''
if __name__ == '__main__':
    app.run(debug=True)

    # Closing the database connection
    dbConn.close()
