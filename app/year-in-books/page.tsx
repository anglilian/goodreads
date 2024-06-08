"use client";  // This marks the component as a client component

import React, { useEffect, useState, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import ImageWithFallback from '@/components/ImageWithFallback';
import { fetchBookCover } from '@/utils';
import useBooksData from '@/hooks/useBooksData';
import { Book } from '@/types/types';
import '@/app/globals.css';  // Ensure this is imported to apply the styles
import Loader from '@/components/Loader';
import { debounce } from 'lodash';

function calculateOptimalImageSize(containerWidth: number, containerHeight: number, aspectRatio: number, numberOfImages: number): { width: number, height: number, columns: number, rows: number } {
  let low = 1;
  let high = containerHeight;
  let bestHeight = low;

  while (low <= high) {
    let height = Math.floor((low + high) / 2);
    let width = height * aspectRatio;
    let columns = Math.floor(containerWidth / width);
    let rows = Math.floor(containerHeight / height);

    if (columns * rows >= numberOfImages) {
        bestHeight = height;
        low = height + 1;
    } else {
        high = height - 1;
    }
  }

  let bestWidth = bestHeight * aspectRatio;
  let bestColumns = Math.floor(containerWidth / bestWidth);
  let bestRows = Math.ceil(numberOfImages / bestColumns);

  return { width: bestWidth, height: bestHeight, columns: bestColumns, rows: bestRows };
}

const BooksByYear: React.FC = () => {
  const data = useBooksData();
  const [year, setYear] = useState<number>(dayjs().year());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [optimalSize, setOptimalSize] = useState<{ width: number, height: number, columns: number, rows: number }>({ width: 100, height: 150, columns: 1, rows: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleResize = useCallback(debounce(() => {
    const numBooks = books.length;
    const containerWidth = containerRef.current ? containerRef.current.clientWidth : window.innerWidth;
    const containerHeight = containerRef.current ? containerRef.current.clientHeight : window.innerHeight;
    const aspectRatio = 2 / 3; // Assuming the book covers have a 2:3 aspect ratio

    if (numBooks > 0) {
      console.log(containerWidth, containerHeight);
      setOptimalSize(calculateOptimalImageSize(containerWidth, containerHeight, aspectRatio, numBooks));
    }
  }, 300), [books]);

  useEffect(() => {
    // Recalculate the image size whenever the books or window size changes
    window.addEventListener('resize', handleResize);
    handleResize(); // Call it initially to set the size

    return () => window.removeEventListener('resize', handleResize);
  }, [books, handleResize]);

  const fetchBooksForYear = async (selectedYear: number, data: Book[]) => {
    const booksForYear = data.filter(book => dayjs(book['Date Read'], 'YYYY/MM/DD').year() === selectedYear);
    setBooks(booksForYear);

    // Fetch book covers
    const covers = await Promise.all(
      booksForYear.map(async book => {
        console.log(`Fetching cover for ISBN: ${book.ISBN}, Title: ${book.Title}, Author: ${book['Author l-f']}`);
        const coverUrl = await fetchBookCover(book.ISBN, book.Title, book['Author l-f']);
        const id = book["Book Id"];
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
    handleResize(); // Ensure the size is recalculated after loading
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(selectedYear);

    // Filter books for the selected year
    setLoading(true);
    fetchBooksForYear(selectedYear, data);
  };

  return (
    <div className="p-8 max-w-screen-lg mx-auto h-screen overflow-hidden">
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
        <div>
          <Loader />
        </div>
      ) : (
        <div ref={containerRef} style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${optimalSize.columns}, ${optimalSize.width}px)`, 
          gridTemplateRows: `repeat(${optimalSize.rows}, ${optimalSize.height}px)`,
        }}>
        {books.map(book => (
          <div key={book["Book Id"]} style={{ width: optimalSize.width, height: optimalSize.height }} className="flex justify-center items-center">
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
