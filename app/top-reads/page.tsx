"use client";  // This marks the component as a client component

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import ImageWithFallback from '../../components/ImageWithFallback';
import { Book } from '../../data';
import '../globals.css';  // Ensure this is imported to apply the styles

const TopReadsPerYear: React.FC = () => {
  const [data, setData] = useState<Book[]>([]);
  const dataPath = process.env.NEXT_PUBLIC_DATA_PATH;

  useEffect(() => {
    fetch(`${dataPath}/2024-05-26-goodreads_library_export.csv`)
      .then(response => response.text())
      .then(csv => {
        const parsedData = Papa.parse<Book>(csv, { header: true }).data;
        setData(parsedData);
      });
  }, [dataPath]);

  const readBooks = data.filter(item => item["Exclusive Shelf"] === "read" && item["Date Read"]);
  const topBooks = readBooks.filter(item => item["My Rating"] === "5");

  const topReadsByYear = topBooks.reduce((acc, book) => {
    const year = dayjs(book['Date Read'], 'YYYY/MM/DD').year();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(book);
    return acc;
  }, {} as Record<number, Book[]>);

  const sortedYears = Object.keys(topReadsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-8">Top Reads by Year</h1>
      {sortedYears.map(year => (
        <div key={year} className="mb-8">
          <h2 className="text-xl font-medium text-gray-600">{year}</h2>
          <div className="flex flex-wrap justify-center">
            {topReadsByYear[parseInt(year)]
              .sort((a, b) => dayjs(b['Date Read']).diff(dayjs(a['Date Read'])))
              .slice(0, 10)
              .map(book => (
                <div key={book.ISBN ? book.ISBN.replace(/["=]/g, '') : book.Title} >
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
      ))}
    </div>
  );
};

export default TopReadsPerYear;
