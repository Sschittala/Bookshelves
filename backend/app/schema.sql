PRAGMA foreign_keys = ON;

-- members
CREATE TABLE members (
    member_id     INTEGER PRIMARY KEY,
    name          TEXT,
    email         TEXT
);

-- books
CREATE TABLE books (
    book_id          INTEGER PRIMARY KEY,
    title            TEXT,
    genre            TEXT,
    publication_year INTEGER,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- authors
CREATE TABLE authors (
    author_id   INTEGER PRIMARY KEY,
    author_name TEXT NOT NULL
);

-- book_authors (many-to-many)
CREATE TABLE book_authors (
    book_id   INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

-- book_copies
CREATE TABLE book_copies (
    copy_id   INTEGER PRIMARY KEY,
    book_id   INTEGER NOT NULL,
    condition TEXT,
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- loans
CREATE TABLE loans (
    loan_id    INTEGER PRIMARY KEY,
    member_id  INTEGER NOT NULL,
    copy_id    INTEGER NOT NULL,
    due_date   TIMESTAMP NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date   TIMESTAMP,
    returned_at TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (copy_id)   REFERENCES book_copies(copy_id)
);

CREATE TRIGGER set_end_date
AFTER INSERT ON loans
FOR EACH ROW
BEGIN
    UPDATE loans
    SET end_date = DATETIME(NEW.start_date, '+30 days')
    WHERE loan_id = NEW.loan_id;
END;

-- holds
CREATE TABLE holds (
    hold_id      INTEGER PRIMARY KEY,
    member_id    INTEGER NOT NULL,
    book_id      INTEGER NOT NULL,
    placed_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified_at  TIMESTAMP,
    fulfilled_at TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (book_id)   REFERENCES books(book_id)
);
