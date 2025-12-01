'use client';

import Link from "next/link";
import { Book, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { Suspense } from "react";
import { Searchbar } from "@/components/searchbar/searchbar";

export function Navbar() {
	const { session, signOut } = useSession()

	return (
		<nav className="border-b border-zinc-800 bg-zinc-950 text-zinc-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
			{/* Brand */}
			<div className="flex items-center gap-2">
				<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
					<Book className="h-6 w-6 text-zinc-100" />
					<span className="text-lg font-bold tracking-tight">Bookshelves</span>
				</Link>
			</div>

			{/* Center Search */}
			<div className="hidden md:flex flex-1 max-w-md mx-6">
				<Suspense fallback={<div className="w-full h-9 bg-zinc-900 rounded-md animate-pulse" />}>
					<Searchbar />
				</Suspense>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-2">
				<Button variant="ghost" size="sm" className="hidden sm:flex text-zinc-400 hover:text-white">
					Genres
				</Button>
				<div className="h-4 w-px bg-zinc-800 hidden sm:block mx-2"></div>

				{session?.authenticated ? (
					<>
						<Link href="/profile">
							<Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
								{session.username || 'Profile'}
							</Button>
						</Link>
						<Button
							variant="ghost"
							size="sm"
							onClick={signOut}
							className="text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-1"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					</>
				) : (
					<>
						<Link href="/login">
							<Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
								Login
							</Button>
						</Link>
						<Link href="/register">
							<Button size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-medium">
								Join
							</Button>
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}

