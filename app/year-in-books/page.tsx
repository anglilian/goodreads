"use client";  // This marks the component as a client component

import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import ImageWithFallback from '../../components/ImageWithFallback';
import { fetchBookCover } from '@/utils';
import useBooksData from '../../hooks/useBooksData';
import { Book } from '../../types/types';
import '../globals.css';  // Ensure this is imported to apply the styles
import Loader from '@/components/Loader';

const BooksByYear: React.FC = () => {
  const data = useBooksData();
  const [year, setYear] = useState<number>(dayjs().year());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true)

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

  const fetchBooksForYear = async (selectedYear: number, data: Book[]) => {
    const booksForYear = data.filter(book => dayjs(book['Date Read'], 'YYYY/MM/DD').year() === selectedYear);
    setBooks(booksForYear);

    // Fetch book covers
    const covers = await Promise.all(
      booksForYear.map(async book => {
        console.log(`Fetching cover for ISBN: ${book.ISBN}, Title: ${book.Title}, Author: ${book['Author l-f']}`);
        const coverUrl = await fetchBookCover(book.ISBN, book.Title, book['Author l-f']);
        const id = book["Book Id"]
        return { id, coverUrl };
      })
    );

    // Update the book covers state
    const coversMap = covers.reduce<Record<string, string>>((acc, { id, coverUrl }) => {
      if (id) {
        acc[id] = coverUrl;
      }
      return acc;
    }, {});
    setBookCovers(coversMap);
    setLoading(false);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(selectedYear);

    // Filter books for the selected year
    setLoading(true);
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
      {loading ? (
        <div className="flex justify-center items-center">
            <Loader />
          </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {books.map(book => (
            <div key={book["Book Id"]} className="gap-1">
              <ImageWithFallback
                imageSrc={bookCovers[book["Book Id"]]}
                alt={`${book.Title} by ${book["Author"]}`}
                placeholder={<div className="placeholder-box">{book.Title}</div>}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksByYear;
