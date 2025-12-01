"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Book as BookIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Book, getBooks } from "@/data/book-data";
import Link from "next/link";

export function Searchbar() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await getBooks();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load books for search", err);
      }
    }
    loadBooks();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredBooks([]);
      setIsOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = books.filter((book) =>
      book.title.toLowerCase().includes(lowerQuery) ||
      (book.author_name && book.author_name.toLowerCase().includes(lowerQuery)) ||
      book.genre.toLowerCase().includes(lowerQuery)
    );

    setFilteredBooks(results);
    setIsOpen(true);
  }, [query, books]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="w-full relative z-50">
      <form onSubmit={handleSubmit} className="w-full relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          type="search"
          placeholder="Search by title, genre, or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          className="pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700 w-full"
        />
      </form >

      {
        isOpen && query.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl overflow-hidden max-h-96 overflow-y-auto">
            {filteredBooks.length > 0 ? (
              <ul>
                {filteredBooks.map((book) => (
                  <li key={book.book_id} className="border-b border-zinc-800 last:border-0">
                    <Link
                      href={`/book/${book.book_id}`}
                      className="block p-3 hover:bg-zinc-800 transition-colors flex items-start gap-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="bg-zinc-800 p-2 rounded flex-shrink-0">
                        <BookIcon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{book.title}</p>
                        <p className="text-xs text-zinc-500">
                          {book.author_name} • <span className="text-zinc-600">{book.genre}</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500">
                No books found matching "{query}"
              </div>
            )}
          </div>
        )
      }
    </div >
  );
}
