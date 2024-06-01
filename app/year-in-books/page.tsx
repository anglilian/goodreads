"use client";  // This marks the component as a client component

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ImageWithFallback from '../../components/ImageWithFallback';
import useBooksData from '../../hooks/useBooksData';
import { Book } from '../../types/types';
import '../globals.css';  // Ensure this is imported to apply the styles

const BooksByYear: React.FC = () => {
  const data = useBooksData();
  const [year, setYear] = useState<number>(dayjs().year());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // Extract unique years from the data
    const years = Array.from(new Set(data
      .filter(book => book['Date Read'] && dayjs(book['Date Read'], 'YYYY/MM/DD', true).isValid())
      .map(book => dayjs(book['Date Read'], 'YYYY/MM/DD').year())
    ));
    const sortedYears = years.sort((a, b) => b - a); // Sort years in descending order
    setAvailableYears(sortedYears);

    // Set the default year to the most recent one if available
    if (sortedYears.length > 0) {
      const mostRecentYear = sortedYears[0];
      setYear(mostRecentYear);

      // Filter books by the default year
      fetchBooksForYear(mostRecentYear, data);
    }
  }, [data]);

  const fetchBooksForYear = (selectedYear: number, data: Book[]) => {
    const booksForYear = data.filter(book => dayjs(book['Date Read'], 'YYYY/MM/DD').year() === selectedYear);
    setBooks(booksForYear);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(selectedYear);

    // Filter books for the selected year
    fetchBooksForYear(selectedYear, data);
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-center items-center mb-8">
        <h1>Your</h1>
        <select 
          value={year} 
          onChange={handleYearChange} 
          className="ml-4 text-4xl font-bold bg-transparent border-none focus:outline-none custom-dropdown"
        >
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <h1>in Books</h1>
      </div>
      <div className="flex flex-wrap justify-center">
        {books.map(book => (
          <div key={book.ISBN ? book.ISBN.replace(/["=]/g, '') : book.Title} className="gap-1">
            <ImageWithFallback
              isbn={book.ISBN ? book.ISBN.replace(/["=]/g, '') : undefined}
              title={book.Title}
              authorLf={book["Author l-f"]}
              alt={`${book.Title} by ${book["Author"]}`}
              placeholder={<div className="placeholder-box">{book.Title}</div>}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksByYear;
