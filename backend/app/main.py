from flask import Flask
from datatier import *

''' Database methods '''

# Establishes db connection
def get_db_connection():
    conn = sqlite3.connect('database.db', check_same_thread=False)
    # This gives you name-bases access to columns in your database
    conn.row_factory = sqlite3.Row
    return conn

''' Initializing the app '''
app = Flask(__name__)
dbConn = get_db_connection() # Connection to the database

''' Request handlers '''
# Example request and response
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>", 200

''' Main method '''
if __name__ == '__main__':
    app.run(debug=True)

    # Closing the database connection
    dbConn.close()