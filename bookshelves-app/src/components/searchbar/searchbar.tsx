"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL ||  "http://localhost:5000/";

export function Searchbar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params
  useEffect(() => {
    const urlQuery = searchParams.get("q") ||  "";
    setQuery(urlQuery);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          type="search"
          placeholder="Search by title, genre, or author..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-zinc-700"
        />
      </div>
    </form>
  );
}