import { handleResponse } from "./utils";

export interface Loan {
	loan_id: number;
	book_id: number;
	copy_id: number;
	title: string;
	author: string;
	due_date: string;
	returned_at: string | null;
}

export async function addLoan(memberId: number, copyId: number): Promise<{ loan_id: number }> {
	const response = await fetch('/api/loans/add_loan', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ member_id: memberId, copy_id: copyId }),
	});
	return handleResponse<{ loan_id: number }>(response);
}



export async function removeLoan(loanId: number): Promise<{ ok: boolean }> {
	const response = await fetch('/api/loans/remove_loan', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ loan_id: loanId }),
	});
	return handleResponse<{ ok: boolean }>(response);
}

export async function getLoans(memberId: number): Promise<Loan[]> {
	const response = await fetch(`/api/loans/get_loans?member_id=${memberId}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})

	return handleResponse<Loan[]>(response);
}
