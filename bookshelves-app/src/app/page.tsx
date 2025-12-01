"use client";

import { Separator } from "@radix-ui/react-separator";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Book, getBooks } from "@/data/book-data";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllBooks() {
      const books: Book[] = await getBooks();

      console.log(books)
      setBooks(books);

      setLoading(false);
    }
    fetchAllBooks();
  }, [])


  const getBooksByGenre = (books: Book[]) => {
    return books.reduce((acc, book) => {
      if (!acc[book.genre]) acc[book.genre] = [];
      acc[book.genre].push(book);
      return acc;
    }, {} as Record<string, Book[]>);
  };

  if (loading) return <p className="p-10 text-center">Loading books...</p>;

  const booksByGenre = getBooksByGenre(Array.isArray(books) ? books : []);
  const genres = Object.keys(booksByGenre);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="container mx-auto py-10 px-4 md:px-6 space-y-12">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Public Archive</h1>
            <p className="text-zinc-500">
              Accessing {books.length} titles across {genres.length} categories.
            </p>
          </div>

          <Link href="/create/book">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Add New Book
            </Button>
          </Link>
        </div>

        {genres.map((genre) => (
          <section key={genre} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-zinc-200 flex items-center gap-2">
                {genre}
              </h3>
              <Separator className="flex-1 ml-4 bg-zinc-900" />
            </div>

            <Carousel opts={{ align: "start", loop: false }} className="w-full">
              <CarouselContent className="-ml-4">
                {booksByGenre[genre].map((book) => (
                  <CarouselItem
                    key={book.book_id}
                    className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <div className="group">
                      <Card className="border-zinc-900 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-colors duration-200 h-[300px] flex flex-col rounded-md">
                        <div className="h-40 w-full bg-zinc-700 p-4 flex items-end">
                          <span className="font-semibold text-md leading-tight text-white/90">
                            {book.title}
                          </span>
                        </div>

                        <CardContent className="p-4 flex-1 bg-zinc-950">
                          <p className="text-sm text-zinc-500 font-medium">
                            {book.author_name}
                          </p>
                        </CardContent>

                        <CardFooter className="p-4 pt-0 bg-zinc-950 flex justify-between items-center border-t border-zinc-900/50">
                          <span className="text-xs text-zinc-600 uppercase tracking-wider font-bold">
                            {book.genre}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-zinc-600 hover:text-zinc-300"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white -left-4" />
              <CarouselNext className="hidden md:flex bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white -right-4" />
            </Carousel>
          </section>
        ))}
      </div>
    </main>
  );
}
