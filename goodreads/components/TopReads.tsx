"use client";  // This marks the component as a client component

import React from 'react';
import dayjs from 'dayjs';
import ImageWithFallback from '../components/ImageWithFallback'; // Adjusted import path
import { Book } from '../data';

interface TopReadsProps {
  topReadsByYear: Record<number, Book[]>;
}

const TopReads: React.FC<TopReadsProps> = ({ topReadsByYear }) => {
  const sortedYears = Object.keys(topReadsByYear).sort((a, b) => parseInt(b) - parseInt(a));
  const imageSizeClass = "h-56 w-32";  // Define the size class here

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-8">Top Reads by Year</h1>
      {sortedYears.map(year => (
        <div key={year} className="mb-8">
          <h2 className="text-xl font-medium mb-4 text-gray-600">{year}</h2>
          <div className="flex flex-wrap justify-center">
            {topReadsByYear[parseInt(year)]
              .sort((a, b) => dayjs(b['Date Read']).diff(dayjs(a['Date Read'])))
              .slice(0, 10)
              .map(book => (
                <div key={book.ISBN.replace(/["=]/g, '') || book.Title} className="m-2">
                  {book.ISBN || (book.Title && book["Author l-f"]) ? (
                    <ImageWithFallback
                      isbn={book.ISBN ? book.ISBN.replace(/["=]/g, '') : undefined}
                      title={book.Title}
                      authorLf={book["Author l-f"]}
                      alt={`${book.Title} by ${book["Author"]}`}
                      placeholder={<div className="w-full h-full flex items-center justify-center"><p>{book.Title}</p></div>}
                      sizeClass={imageSizeClass}  // Pass the size class as a prop
                    />
                  ) : (
                    <div className={`${imageSizeClass} bg-gray-200 flex items-center justify-center`} title={`${book.Title} by ${book["Author"]}`}>
                      <p>{book.Title}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopReads;
