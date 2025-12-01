import { handleResponse } from "@/data/utils"

export interface Copy {
	copy_id: number,
	condition: string,
	loan: Loan
}

export interface Loan {
	loan_id: number,
	member_id: number,
	due_date: Date,
	start_date: Date,
	end_date: Date,
	returned_at: Date
}

export interface Book {
	book_id: number;
	title: string;
	genre: string;
	publication_year: number;
	author_id: number;
	author_name?: string;
	copies: Copy[]
}

export interface BookPayload {
	title: string;
	genre: string;
	publication_year: number;
	authors: string[];
	copies: [{ condition: string }];
}

export async function getBook(book_id: string): Promise<Book> {
	const response = await fetch(`/api/books?book_id=${book_id}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
	return handleResponse<Book>(response);
}


export async function getBooks(): Promise<Book[]> {
	const response = await fetch('/api/books', {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	return handleResponse<Book[]>(response);
}

export async function createBook(book: BookPayload): Promise<{ success: boolean; book_id: number }> {
	const response = await fetch('/api/books', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(book),
	});

	return handleResponse<{ success: boolean; book_id: number }>(response);
}

export async function updateBook(bookId: number, book: BookPayload): Promise<{ success: boolean }> {
	const response = await fetch(`/api/books/${bookId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(book),
	});
	return handleResponse<{ success: boolean }>(response);
}

export async function deleteBook(bookId: number): Promise<{ success: boolean }> {
	const response = await fetch(`/api/books/${bookId}`, {
		method: 'DELETE',
		headers: { 'Content-Type': 'application/json' },
	});
	return handleResponse<{ success: boolean }>(response);
}
