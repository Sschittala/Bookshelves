import { handleResponse } from "./utils";

export interface Hold {
	hold_id: number;
	member_id: number;
	book_id: number;
	placed_at: string;
	notified_at: string | null;
	fulfilled_at: string | null;
}

export async function getHolds(memberId: number): Promise<Hold[]> {
	const response = await fetch(`/api/holds/get_holds?member_id=${memberId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	});
	return handleResponse<Hold[]>(response);
}

export async function setHold(memberId: number, bookId: number): Promise<{ hold_id: number }> {
	const response = await fetch('/api/holds/set_hold', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ member_id: memberId, book_id: bookId }),
	});
	return handleResponse<{ hold_id: number }>(response);
}

export async function removeHold(holdId: number): Promise<{ ok: boolean }> {
	const response = await fetch('/api/holds/remove_hold', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ hold_id: holdId }),
	});
	return handleResponse<{ ok: boolean }>(response);
}
