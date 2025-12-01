import { handleResponse } from "@/data/utils"

export interface Book {
	book_id: number;
	title: string;
	genre: string;
	publication_year: number;
	author_id: number;
	author_name?: string;
}

export interface BookPayload {
	title: string;
	genre: string;
	publication_year: number;
	author_id: number;
}

export async function getBook(book_id: string): Promise<Book> {
	const response = await fetch('/api/books', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			book_id
		})
	});
	return handleResponse<Book>(response);
}


export async function getBooks(): Promise<Book[]> {
	const response = await fetch('/api/books', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({})
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
