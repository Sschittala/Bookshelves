import React, { useState, useEffect } from "react";

type Book = {
  id: number;
  title: string;
  genre: string;
  publication_year: number;
  author: string;
  color: string
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formData, setFormData] = useState({ title: "", genre: "", publication_year: "", author: "", color: "" });
  const [editingBookId, setEditingBookId] = useState<number | null>(null);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching books");
    }
  };

  // Add or Update a Book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingBookId ? "PUT" : "POST";
    const url = editingBookId ? `/api/books/${editingBookId}` : "/api/books";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save book");
      alert(editingBookId ? "Book updated successfully" : "Book added successfully");
      setFormData({ title: "", genre: "", publication_year: "" });
      setEditingBookId(null);
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert("Error saving book");
    }
  };

  // Delete a Book
  const handleDelete = async (bookId: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete book");
      alert("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      console.error(error);
      alert("Error deleting book");
    }
  };

  // Populate form for editing
  const handleEdit = (book: Book) => {
    setFormData({ title: book.title, genre: book.genre, publication_year: book.publication_year.toString(), author: book.author, color: book.color});
    setEditingBookId(book.id);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book Management</h1>

      {/* Form for Adding/Editing a Book */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="number"
            placeholder="Publication Year"
            value={formData.publication_year}
            onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {editingBookId ? "Update Book" : "Add Book"}
        </button>
      </form>

      {/* List of Books */}
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Genre</th>
            <th className="border px-4 py-2">Publication Year</th>
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
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(book)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book.book_id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
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