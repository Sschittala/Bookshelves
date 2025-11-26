from flask import Flask, request, jsonify
from datatier import *
from random import randint

''' Database methods '''

# Establishes db connection
def get_db_connection():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    # This gives you name-bases access to columns in your database
    conn.row_factory = sqlite3.Row
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
                return "Success", 200 # TODO do we need to return something specific?
            else:
                return err, 403
        else: # if passwords do not match
            return # TODO do we need to return something at all?

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