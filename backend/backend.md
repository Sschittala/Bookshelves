# About

This document is documentation and instruction on how to launch the app.

# Getting started

1. make a local environment by running `python -m venv env` in the backend folder.
2. Launch the environment from the backend folder by using `. /env/bin/activate`.
3. Make sure the requirements are installed via `pip install -r requirements.txt`.
4. Run the server via `flask --app app/main run --debug` and follow the address given. For more launch option check out the [official Flask quickstart](https://flask.palletsprojects.com/en/stable/quickstart/) guide.

# API docs

## Registration and log-in

### POST `/api/auth/register`

Expected request:
```json
{
    'username': 'example@email.com', // Notice that the username is the email for now, can be changed later
    'password': 'pass123',
    'confirm password': 'pass123'
}
```

Responses:
- If the username does not exist within the database and registration came through:

    ```json
    {
        'success': true
    }
    ```

    Response code: **200**

- If the username does exists, or confirmation password does not match:

    ```json
    {
        'success': false
    }
    ```

    Response code: **403**

### GET `/api/auth/login`

Expected request:

```json
{
    'username': "example@email.com", // Notice that the username is the email for now, can be changed later
    'password': "pass123",
}
```

Responses:

- If user exists within the database:

    ```json
    {
        'member_id': 168588
    }
    ```

    Response code: **200**

- If user does *not* exists within the database:

    ```json
    {
        'member_id': null
    }
    ```

    Response code: **403**