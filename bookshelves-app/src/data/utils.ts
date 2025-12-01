export interface ApiError {
	error: string;
}

export async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		const errorData = (await response.json()) as ApiError;
		throw new Error(errorData.error || `Request failed with status ${response.status}`);
	}
	return response.json();
}
