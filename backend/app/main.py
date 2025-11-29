from flask import Flask, request, jsonify
from datatier import *
from random import randint

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
    res = select_one_row(dbConn, sql, parameters=(username))
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
    
    if len(res) == 0:
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
    perform_action(dbConn, sql, (str(hold_id)))

''' Initializing the app '''
app = Flask(__name__)
dbConn = get_db_connection() # Connection to the database

''' Request handlers '''
# Example request and response
# @app.route("/")
# def hello_world():
#     return "<p>Hello, World!</p>", 200

# Registering a user
@app.route('/api/auth/register', methods=['POST'])
def register_handler():
    if request.method == 'POST':
        username = request.args['username'] # Attention! we are presuming the username is an e-mail in format "username@example.com"!
        password = request.args['password']
        conf_password = request.args['confirm password']
        if password == conf_password:
            success, err = register_user(dbConn, username, password)
            if success:
                return jsonify({'success': True}), 200 # TODO do we need to return something specific?
            else:
                return jsonify({'success': False}), 403
        else: # if passwords do not match
            return jsonify({'success': False}), 403

# Logging in the user
@app.route('/api/auth/login', methods=['GET'])
def login_handler():
    if request.method == 'GET':
        username = request.args['username']
        password = request.args['password']

        member_id = confirm_user(dbConn, username, password)
        if member_id == None:
            return jsonify({"member_id": None}), 403
        return jsonify({"member_id": member_id}), 200

''' Main method '''
if __name__ == '__main__':
    app.run(debug=True)

    # Closing the database connection
    dbConn.close()