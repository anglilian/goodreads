"use client";  // This line marks the component as a client component

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import dayjs from 'dayjs';
import './globals.css';  // Import the CSS file


// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the interface for the book data
interface Book {
  Title: string;
  ISBN: string;
  'Date Read': string;
  'Number of Pages': string;
  'Exclusive Shelf': string;
  "My Rating": string;
  Author: string;
  'Author l-f': string;
}

export default function Home() {
  const [data, setData] = useState<Book[]>([]);

  useEffect(() => {
    fetch('/goodreads_data/2024-05-26-goodreads_library_export.csv')
      .then(response => response.text())
      .then(csv => {
        const parsedData = Papa.parse<Book>(csv, { header: true }).data;
        setData(parsedData);
      });
  }, []);

  const readBooks = data.filter(item => item["Exclusive Shelf"] === "read" && item["Date Read"]);

  // Extract the year from "Date Read" and count books per year and total pages read per year
  const booksReadByYear = readBooks.reduce((acc, book) => {
    const year = dayjs(book['Date Read'], 'YYYY/MM/DD').year(); // Parse date in the format YYYY/MM/DD
    if (!acc[year]) {
      acc[year] = { books: 0, pages: 0 }; // Initialize the year count if it doesn't exist
    }
    acc[year].books++; // Increment the count for the year
    acc[year].pages += parseInt(book['Number of Pages'], 10) || 0; // Add the number of pages read
    return acc; // Return the accumulator object for the next iteration
  }, {} as Record<number, { books: number; pages: number }>);

   // Convert the aggregated data into a format suitable for the chart
   const chartData = {
    labels: Object.keys(booksReadByYear),
    datasets: [
      {
        label: 'Books Read',
        data: Object.values(booksReadByYear).map(yearData => yearData.books),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y-books', // Assign this dataset to the first y-axis
      },
      {
        label: 'Pages Read',
        data: Object.values(booksReadByYear).map(yearData => yearData.pages),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'y-pages', // Assign this dataset to the second y-axis
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Ensure the position is a valid literal
      },
      title: {
        display: true,
        text: 'Books and Pages Read Per Year',
      },
    },
    scales: {
      'y-books': {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Books Read',
        },
      },
      'y-pages': {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Pages Read',
        },
        grid: {
          drawOnChartArea: false, // Optional: don't draw grid on this axis
        },
      },
    },
  };

  const topBooks = readBooks.filter(item => item["My Rating"] === "5");

  // Group the top reads by year
  const topReadsByYear = topBooks.reduce((acc, book) => {
    const year = dayjs(book['Date Read'], 'YYYY/MM/DD').year();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(book);
    return acc;
  }, {} as Record<number, Book[]>);

  return (
    <div>
      <Bar data={chartData} options={options} />
      <h1>Top Reads by Year</h1>
      {Object.keys(topReadsByYear).map(year => (
        <div key={year}>
          <h2 style={{textAlign:'center'}}>{year}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {topReadsByYear[parseInt(year)].map(book => (
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
}

function getLastName(authorLf) {
  if (!authorLf) return '';
  const parts = authorLf.split(',');
  return parts[0].trim();
}

function removeTextInsideParentheses(title) {
  console.log(title.replace(/\s*\([^)]*\)/g, '').trim())
  return title.replace(/\s*\([^)]*\)/g, '').trim();
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchBookCover(isbn, title, authorLf) {
  let query = '';
  if (isbn) {
    query = `isbn:${isbn}`;
  } else if (title && authorLf) {
    const lastName = getLastName(authorLf);
    const cleanedTitle = removeTextInsideParentheses(title);
    query = `intitle:${encodeURIComponent(cleanedTitle)}+inauthor:${encodeURIComponent(lastName)}`;
  } else {
    return null;
  }

  let response;
  let data;
  let attempts = 0;
  const maxAttempts = 3;
  const baseDelayMs = 2000;

  while (attempts < maxAttempts) {
    try {
      response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&fields=items(volumeInfo/imageLinks/thumbnail)`);
      if (response.status === 429) {
        attempts++;
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : baseDelayMs * attempts;
        await delay(waitTime);
      } else {
        data = await response.json();
        break;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }

  const book = data?.items ? data.items[0] : null;
  return book?.volumeInfo?.imageLinks?.thumbnail || null;
}


interface ImageWithFallbackProps {
  isbn?: string;
  title?: string;
  authorLf?: string;
  alt: string;
  placeholder: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ isbn, title, authorLf, alt, placeholder }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const coverImage = await fetchBookCover(isbn, title, authorLf);
      if (coverImage) {
        setImageSrc(coverImage);
        setIsImageLoaded(true);
      } else {
        setIsImageLoaded(false);
      }
    };

    loadImage();
  }, [isbn, title, authorLf]);

  return (
    isImageLoaded && imageSrc ? <img src={imageSrc} alt={alt} title={alt} style={{ width: '100px', height: '150px' }} /> : placeholder
  );
};