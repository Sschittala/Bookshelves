"use client";

import { useState, useEffect } from "react";

type Book = {
  book_id: number;
  title: string;
  genre: string;
  publication_year: number;
  author_id: number;
  author_name: string;
};

type Author = {
  author_id: number;
  name: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    publication_year: "",
    author_id: "",
  });
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    setBooks(data);
  };

  const fetchAuthors = async () => {
    const res = await fetch("/api/authors");
    const data = await res.json();
    setAuthors(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingBookId ? "PUT" : "POST";
    const url = editingBookId ? `/api/books/${editingBookId}` : "/api/books";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        publication_year: Number(formData.publication_year),
        author_id: Number(formData.author_id),
      }),
    });

    if (response.ok) {
      fetchBooks();
      setEditingBookId(null);
      setFormData({ title: "", genre: "", publication_year: "", author_id: "" });
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBookId(book.book_id);
    setFormData({
      title: book.title,
      genre: book.genre,
      publication_year: book.publication_year.toString(),
      author_id: book.author_id.toString(),
    });
  };

  const handleDelete = async (book_id: number) => {
    if (!confirm("Delete this book?")) return;
    await fetch(`/api/books/${book_id}`, { method: "DELETE" });
    fetchBooks();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book Management</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 p-4 border rounded shadow bg-white"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingBookId ? "Edit Book" : "Add New Book"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />

        <input
          type="text"
          placeholder="Genre"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />

        <input
          type="number"
          placeholder="Publication Year"
          value={formData.publication_year}
          onChange={(e) =>
            setFormData({ ...formData, publication_year: e.target.value })
          }
          className="border p-2 rounded w-full mb-2"
          required
        />

        <select
          value={formData.author_id}
          onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
          className="border p-2 rounded w-full mb-4"
          required
        >
          <option value="">Select Author</option>
          {authors.map((author) => (
            <option key={author.author_id} value={author.author_id}>
              {author.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingBookId ? "Update Book" : "Add Book"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Genre</th>
            <th className="border px-4 py-2">Year</th>
            <th className="border px-4 py-2">Author</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.book_id}>
              <td className="border px-4 py-2">{book.book_id}</td>
              <td className="border px-4 py-2">{book.title}</td>
              <td className="border px-4 py-2">{book.genre}</td>
              <td className="border px-4 py-2">{book.publication_year}</td>
              <td className="border px-4 py-2">{book.author_name}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(book)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(book.book_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}