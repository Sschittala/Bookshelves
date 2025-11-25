"use client"

import { use, useEffect } from "react";

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {

	const { bookId } = use(params)

	useEffect(() => {
		async function fetchPostDetails() {

		}

		fetchPostDetails();
	}, [])

	return (
		<div>This is bookId: {bookId}</div>
	)
}
