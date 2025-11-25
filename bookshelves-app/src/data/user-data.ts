
export async function getUserById(userId: string) {
	try {
		const response = await fetch(`/api/member/${userId}`, {
			'headers': {
				'Content-Type': 'application/json',
			},
			'method': 'POST',
		})

	} catch (error) {
		console.error(error)
	}
}

