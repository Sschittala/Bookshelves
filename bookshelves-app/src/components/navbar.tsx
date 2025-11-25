import { Book, Search, User } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Navbar() {
	return (
		<nav className="w-full border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
			<div className="flex items-center gap-6">
				<div className="flex items-center gap-2">
					<Book className="h-6 w-6 text-zinc-100" />
					<span className="text-lg font-semibold tracking-tight text-zinc-100">
						Bookshelves
					</span>
				</div>

				{/* Navigation Links */}
				<div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
					<a href="#" className="hover:text-zinc-100 transition-colors">Catalog</a>
					<a href="#" className="hover:text-zinc-100 transition-colors">Genres</a>
					<a href="#" className="hover:text-zinc-100 transition-colors">Community</a>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="relative w-64 hidden sm:block">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
					<Input
						type="search"
						placeholder="Search the archive..."
						className="pl-9 bg-zinc-900 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
					/>
				</div>
				<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
					<User className="h-5 w-5" />
				</Button>
			</div>
		</nav>
	);
}

