"use client"

import { Book, getBook } from "@/data/book-data";
import { use, useEffect, useState } from "react";

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
	const [bookDetail, setBookDetail] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);
	const { bookId } = use(params);

	useEffect(() => {
		async function fetchBookDetails() {
			setLoading(true);
			const book = await getBook(bookId);
			console.log(book)
			setBookDetail(book);
			setLoading(false);
		}
		fetchBookDetails();
	}, [bookId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<div className="animate-pulse text-slate-400">Loading...</div>
			</div>
		);
	}

	if (!bookDetail) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<div className="text-slate-600">Book not found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="bg-gradient-to-r from-slate-700 to-slate-900 p-8 text-white">
						<div className="mb-2">
							<span className="inline-block bg-white bg-opacity-20 text-white text-sm font-semibold px-4 py-1 rounded-full">
								{bookDetail.genre}
							</span>
						</div>
						<h1 className="text-4xl font-bold mb-3">
							{bookDetail.title}
						</h1>
						<p className="text-xl text-slate-200">
							by {bookDetail.author_name || `Author ID: ${bookDetail.author_id}`}
						</p>
					</div>

					<div className="p-8">
						<div className="grid grid-cols-2 gap-6">
							<div className="bg-slate-50 rounded-lg p-6">
								<div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
									Book ID
								</div>
								<div className="text-2xl font-bold text-slate-900">
									#{bookId}
								</div>
							</div>

							<div className="bg-slate-50 rounded-lg p-6">
								<div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
									Published
								</div>
								<div className="text-2xl font-bold text-slate-900">
									{bookDetail.publication_year}
								</div>
							</div>

							<div className="bg-slate-50 rounded-lg p-6">
								<div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
									Genre
								</div>
								<div className="text-2xl font-bold text-slate-900">
									{bookDetail.genre}
								</div>
							</div>

							<div className="bg-slate-50 rounded-lg p-6">
								<div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
									Author ID
								</div>
								<div className="text-2xl font-bold text-slate-900">
									#{bookDetail.author_id}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
