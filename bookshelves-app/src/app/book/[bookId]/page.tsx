"use client";

import { Book, getBook } from "@/data/book-data";
import { use, useEffect, useState } from "react";
import { Copy, AlertCircle } from "lucide-react";

export default function BookDetailPage({ params }: { params: Promise<{ bookId: string }> }) {
	const [bookDetail, setBookDetail] = useState<Book | null>(null);
	const [loading, setLoading] = useState(true);
	const { bookId } = use(params);

	useEffect(() => {
		async function fetchBookDetails() {
			setLoading(true);
			try {
				const book = await getBook(bookId);
				setBookDetail(book);
			} catch (error) {
				console.error("Error fetching book:", error);
				setBookDetail(null);
			} finally {
				setLoading(false);
			}
		}
		fetchBookDetails();
	}, [bookId]);

	if (loading) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
				<div className="animate-pulse text-zinc-400">Loading library data...</div>
			</div>
		);
	}

	if (!bookDetail) {
		return (
			<div className="min-h-screen bg-zinc-950 flex items-center justify-center">
				<div className="text-zinc-500">Book not found in archive.</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-950 py-12 px-4 font-sans text-zinc-100">
			<div className="max-w-5xl mx-auto space-y-8">
				{/* Header Section */}
				<div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
					<div className="bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 border-b border-zinc-800">
						<div className="mb-4">
							<span className="inline-block bg-blue-900/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-900/50">
								{bookDetail.genre}
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
							{bookDetail.title}
						</h1>
						<p className="text-xl text-zinc-400">
							by <span className="text-zinc-200">{bookDetail.author_name || `Unknown Author (ID: ${bookDetail.author_id})`}</span>
						</p>
					</div>

					<div className="p-8">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<div className="bg-zinc-950/50 rounded-lg p-5 border border-zinc-800/50">
								<div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
									Book ID
								</div>
								<div className="text-2xl font-mono text-zinc-300">
									#{bookId}
								</div>
							</div>

							<div className="bg-zinc-900/50 rounded-lg p-5 border border-zinc-800/50">
								<div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
									Published
								</div>
								<div className="text-2xl font-mono text-zinc-300">
									{bookDetail.publication_year}
								</div>
							</div>

							<div className="bg-zinc-900/50 rounded-lg p-5 border border-zinc-800/50">
								<div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
									Genre
								</div>
								<div className="text-2xl font-medium text-zinc-300 truncate">
									{bookDetail.genre}
								</div>
							</div>

							<div className="bg-zinc-900/50 rounded-lg p-5 border border-zinc-800/50">
								<div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
									Copies Owned
								</div>
								<div className="text-2xl font-mono text-zinc-300">
									{bookDetail.copies?.length || 0}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-zinc-200 flex items-center gap-2">
						<Copy className="w-6 h-6 text-zinc-500" />
						Physical Copies
					</h2>
					{bookDetail.copies && bookDetail.copies.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{bookDetail.copies.map((copy) => (
								<div
									key={copy.copy_id}
									className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors"
								>
									<div className="flex flex-col">
										<span className="text-xs text-zinc-500 font-mono uppercase tracking-widest mb-1">
											Copy ID
										</span>
										<span className="text-lg font-mono text-white">
											#{copy.copy_id}
										</span>
									</div>
									<div className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${copy.condition.toLowerCase() === 'new' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' :
										copy.condition.toLowerCase() === 'good' ? 'bg-blue-950/30 text-blue-400 border-blue-900/50' :
											'bg-amber-950/30 text-amber-400 border-amber-900/50'
										}`}>
										{copy.condition}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-zinc-500">
							<AlertCircle className="w-10 h-10 mb-3 opacity-50" />
							<p>No physical copies registered in the system.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
