CREATE TABLE IF NOT EXISTS Members (
    member_id INTEGER PRIMARY KEY,  
    member_name TEXT,
    member_email TEXT,
);

CREATE TABLE IF NOT EXISTS Books (
    book_id INTEGER PRIMARY KEY,  
    title TEXT,
    publication_year INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP   
);

CREATE TABLE IF NOT EXISTS Authors (
    author_id INTEGER PRIMARY KEY,  
    author_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Book_authors ( -- junction table for many-to-many book-author relationship
    book_id INTEGER, 
    author_id INTEGER,  
);

CREATE TABLE IF NOT EXISTS Book_copies ( -- physical copies of books. Multiple copies
    copy_id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL, 
    condition TEXT,
    acquisition_date DATETIME DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS Book_authors (
    loan_id INTEGER PRIMARY KEY,
    member_id INTEGER NOT NULL,
    copy_id INTEGER NOT NULL,
    overdue BOOLEAN, -- Quick parameter to check if a loan is overdue.
    due_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    returned_at DATETIME
);

CREATE TABLE IF NOT EXISTS Loans (
    loan_id INTEGER PRIMARY KEY,
    member_id INTEGER NOT NULL,
    copy_id INTEGER NOT NULL,
    overdue BOOLEAN, -- Quick parameter to check if a loan is overdue.
    due_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    returned_at DATETIME
);

CREATE TABLE IF NOT EXISTS Holds (
    hold_id INTEGER PRIMARY KEY,
    member_id INTEGER NOT NULL,
    copy_id INTEGER NOT NULL,
    placed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
);


-- Table fines {
--   fine_id integer [primary key]
--   loan_id integer [not null]
--   amount decimal(10,2) [not null]
--   reason varchar [note: 'overdue, damaged, lost']
  
--   Note: 'Fine tracking with payment history. Replaces fees_due denormalized field.'
-- }
