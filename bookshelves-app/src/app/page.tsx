// import { Separator } from "@radix-ui/react-separator";
// import { MoreHorizontal } from "lucide-react";
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
// import { Card, CardContent, CardFooter } from "../components/ui/card";
// import { Button } from "../components/ui/button";

// // --- Mock Data ---
// type BookData = {
//   id: string;
//   title: string;
//   author: string;
//   genre: string;
//   color: string;
// };

// const LIBRARY_DATA: BookData[] = [
//   { id: "1", title: "The Silent Echo", author: "H.R. Moresby", genre: "Mystery", color: "bg-slate-700" },
//   { id: "2", title: "Cybernetic Dreams", author: "A.I. Winter", genre: "Sci-Fi", color: "bg-cyan-900" },
//   { id: "3", title: "The Lost Garden", author: "Clara V.", genre: "Fiction", color: "bg-emerald-900" },
//   { id: "4", title: "Calculus II", author: "James Stewart", genre: "Education", color: "bg-red-900" },
//   { id: "5", title: "Martian Chronicles", author: "Ray Bradbury", genre: "Sci-Fi", color: "bg-orange-900" },
//   { id: "6", title: "Deep Sleep", author: "Dr. R. Walker", genre: "Health", color: "bg-blue-900" },
//   { id: "7", title: "Algorithms", author: "Sedgewick", genre: "Education", color: "bg-yellow-900" },
//   { id: "8", title: "Noir City", author: "Frank Miller", genre: "Mystery", color: "bg-zinc-800" },
//   { id: "9", title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", color: "bg-amber-900" },
//   { id: "10", title: "1984", author: "George Orwell", genre: "Fiction", color: "bg-red-950" },
//   { id: "11", title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", color: "bg-blue-950" },
//   { id: "12", title: "Gone Girl", author: "Gillian Flynn", genre: "Mystery", color: "bg-pink-950" },
// ];

// const getBooksByGenre = (books: BookData[]) => {
//   return books.reduce((acc, book) => {
//     if (!acc[book.genre]) {
//       acc[book.genre] = [];
//     }
//     acc[book.genre].push(book);
//     return acc;
//   }, {} as Record<string, BookData[]>);
// };

// export default function Home() {
//   const booksByGenre = getBooksByGenre(LIBRARY_DATA);
//   const genres = Object.keys(booksByGenre);

//   return (
//     <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">

//       {/* Main Content Area */}
//       <div className="container mx-auto py-10 px-4 md:px-6 space-y-12">

//         <div className="space-y-2">
//           <h1 className="text-3xl font-bold tracking-tight">Public Archive</h1>
//           <p className="text-zinc-500">Accessing {LIBRARY_DATA.length} titles across {genres.length} categories.</p>
//         </div>

//         {genres.map((genre) => (
//           <section key={genre} className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-medium text-zinc-200 flex items-center gap-2">
//                 {genre}
//               </h3>
//               <Separator className="flex-1 ml-4 bg-zinc-900" />
//             </div>

//             <Carousel
//               opts={{
//                 align: "start",
//                 loop: false,
//               }}
//               className="w-full"
//             >
//               <CarouselContent className="-ml-4">
//                 {booksByGenre[genre].map((book) => (
//                   <CarouselItem key={book.id} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
//                     <div className="group">
//                       <Card className="border-zinc-900 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-colors duration-200 h-[300px] flex flex-col rounded-md">
//                         {/* Flat Color Block Cover - No Gradients/Flares */}
//                         <div className={`h-40 w-full ${book.color} p-4 flex items-end`}>
//                           <span className="font-semibold text-md leading-tight text-white/90">
//                             {book.title}
//                           </span>
//                         </div>

//                         <CardContent className="p-4 flex-1 bg-zinc-950">
//                           <p className="text-sm text-zinc-500 font-medium">{book.author}</p>
//                         </CardContent>

//                         <CardFooter className="p-4 pt-0 bg-zinc-950 flex justify-between items-center border-t border-zinc-900/50">
//                           <span className="text-xs text-zinc-600 uppercase tracking-wider font-bold">
//                             {book.genre}
//                           </span>
//                           <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600 hover:text-zinc-300">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </CardFooter>
//                       </Card>
//                     </div>
//                   </CarouselItem>
//                 ))}
//               </CarouselContent>
//               <CarouselPrevious className="hidden md:flex bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white -left-4" />
//               <CarouselNext className="hidden md:flex bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white -right-4" />
//             </Carousel>
//           </section>
//         ))}
//       </div>
//     </main>
//   );
// }

"use client";

import { Separator } from "@radix-ui/react-separator";
import { MoreHorizontal } from "lucide-react";
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

type Book = {
  book_id: number;
  title: string;
  genre: string;
  publication_year: number;
  author_name: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched books:", data); // should be an array now
        setBooks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  

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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Public Archive</h1>
          <p className="text-zinc-500">
            Accessing {books.length} titles across {genres.length} categories.
          </p>
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


