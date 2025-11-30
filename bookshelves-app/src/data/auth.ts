export const getSession = async () => {
	const res = await fetch('/api/auth/me', {
		method: 'GET',
		credentials: 'include'
	});
	return res.json();
};

export const logout = async () => {
	const res = await fetch('/api/auth/logout', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
	});
	return res.json();
}

export const login = async (username: string, password: string) => {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password
		})
	});
	return res.json();
}

export const register = async (username: string, password: string, confirm_password: string) => {
	const res = await fetch('/api/auth/register', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password,
			'confirm password': confirm_password
		})
	});
	return res.json();
}
