"use client";

import React, { useState } from 'react';
import { BookOpen, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import { BookPayload, createBook } from '@/data/book-data';

interface FormData {
  title: string;
  genre: string;
  publication_year: string | number;
  authors: string[];
  copies: { condition: string }[];
}

export default function AddBookForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    genre: '',
    publication_year: '',
    authors: [''],
    copies: [{ condition: 'new' }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy',
    'Romance', 'Thriller', 'Biography', 'History', 'Self-Help',
    'Poetry', 'Children', 'Young Adult', 'Horror', 'Adventure', 'Action'
  ];

  const conditions = ['new', 'good', 'fair', 'poor'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData(prev => ({ ...prev, authors: newAuthors }));
  };

  const addAuthor = () => {
    setFormData(prev => ({ ...prev, authors: [...prev.authors, ''] }));
  };

  const removeAuthor = (index: number) => {
    if (formData.authors.length > 1) {
      const newAuthors = formData.authors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, authors: newAuthors }));
    }
  };

  const handleCopyConditionChange = (index: number, condition: string) => {
    const newCopies = [...formData.copies];
    newCopies[index] = { condition };
    setFormData(prev => ({ ...prev, copies: newCopies }));
  };

  const addCopy = () => {
    setFormData(prev => ({ ...prev, copies: [...prev.copies, { condition: 'new' }] }));
  };

  const removeCopy = (index: number) => {
    if (formData.copies.length > 1) {
      const newCopies = formData.copies.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, copies: newCopies }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    if (!formData.publication_year) {
      newErrors.publication_year = 'Publication year is required';
    } else {
      const year = typeof formData.publication_year === 'string'
        ? parseInt(formData.publication_year)
        : formData.publication_year;
      const currentYear = new Date().getFullYear();
      if (year < 1000 || year > currentYear + 1) {
        newErrors.publication_year = `Year must be between 1000 and ${currentYear + 1}`;
      }
    }

    const validAuthors = formData.authors.filter(author => author.trim());
    if (validAuthors.length === 0) {
      newErrors.authors = 'At least one author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const validAuthors = formData.authors.filter(author => author.trim());

      const bookData: BookPayload = {
        title: formData.title.trim(),
        genre: formData.genre,
        publication_year: typeof formData.publication_year === 'string'
          ? parseInt(formData.publication_year)
          : formData.publication_year,
        authors: validAuthors,
        copies: [formData.copies[0]]
      };

      await createBook(bookData);

      setSubmitStatus({
        type: 'success',
        message: `Book "${formData.title}" added successfully with ${formData.copies.length} cop${formData.copies.length === 1 ? 'y' : 'ies'}!`
      });

      setFormData({
        title: '',
        genre: '',
        publication_year: '',
        authors: [''],
        copies: [{ condition: 'new' }]
      });

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to add book. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Add New Book</h1>
            </div>
            <p className="mt-2 text-blue-100">Add a new book to the library catalog</p>
          </div>

          <div className="px-6 py-8 space-y-6">
            {submitStatus && (
              <div className={`p-4 rounded-lg flex items-start space-x-3 ${submitStatus.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
                }`}>
                {submitStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {submitStatus.message}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.genre ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select a genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
                )}
              </div>

              <div>
                <label htmlFor="publication_year" className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Year *
                </label>
                <input
                  type="number"
                  id="publication_year"
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.publication_year ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="2024"
                  min="1000"
                  max={new Date().getFullYear() + 1}
                />
                {errors.publication_year && (
                  <p className="mt-1 text-sm text-red-600">{errors.publication_year}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Authors *
                </label>
                <button
                  type="button"
                  onClick={addAuthor}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Author</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => handleAuthorChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Author ${index + 1} name`}
                    />
                    {formData.authors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAuthor(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.authors && (
                <p className="mt-1 text-sm text-red-600">{errors.authors}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Book Copies ({formData.copies.length})
                </label>
                <button
                  type="button"
                  onClick={addCopy}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Copy</span>
                </button>
              </div>
              <div className="space-y-3">
                {formData.copies.map((copy, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 w-16">Copy {index + 1}</span>
                    <select
                      value={copy.condition}
                      onChange={(e) => handleCopyConditionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>
                          {condition.charAt(0).toUpperCase() + condition.slice(1)}
                        </option>
                      ))}
                    </select>
                    {formData.copies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCopy(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Book...
                  </span>
                ) : (
                  'Add Book to Library'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
