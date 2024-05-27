"use client";  // This marks the component as a client component

import React from 'react';
import dayjs from 'dayjs';
import ImageWithFallback from './ImageWithFallback';
import { Book } from '../data';

interface TopReadsProps {
  topReadsByYear: Record<number, Book[]>;
}

const TopReads: React.FC<TopReadsProps> = ({ topReadsByYear }) => {
  const sortedYears = Object.keys(topReadsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div>
      <h1>Top Reads by Year</h1>
      {sortedYears.map(year => (
        <div key={year}>
          <h2 style={{ textAlign: 'center' }}>{year}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {topReadsByYear[parseInt(year)]
              .sort((a, b) => dayjs(b['Date Read']).diff(dayjs(a['Date Read'])))
              .slice(0, 10)
              .map(book => (
                <div key={book.ISBN.replace(/["=]/g, '') || book.Title} style={{ margin: '10px' }}>
                  {book.ISBN || (book.Title && book["Author l-f"]) ? (
                    <ImageWithFallback
                      isbn={book.ISBN ? book.ISBN.replace(/["=]/g, '') : undefined}
                      title={book.Title}
                      authorLf={book["Author l-f"]}
                      alt={`${book.Title} by ${book["Author"]}`}
                      placeholder={<div className="placeholder-box" style={{ width: '100px', height: '150px' }} title={`${book.Title} by ${book["Author"]}`}><p>{book.Title}</p></div>}
                    />
                  ) : (
                    <div className="placeholder-box" style={{ width: '100px', height: '150px' }} title={`${book.Title} by ${book["Author"]}`}>
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
