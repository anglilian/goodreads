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
                {book.ISBN ? (
                  <ImageWithFallback
                    src={`https://covers.openlibrary.org/b/isbn/${book.ISBN.replace(/["=]/g, '')}-M.jpg`}
                    alt={`${book.Title} cover`}
                    title={`${book.Title} by ${book.Author}`}
                    placeholder={<div className="placeholder-box" style={{ width: '100px', height: '150px' }} title={`${book.Title} by ${book.Author}`}><p>{book.Title}</p></div>}
                  />
                ) : (
                  <div className="placeholder-box" style={{ width: '100px', height: '150px' }} title={`${book.Title} by ${book.Author}`}>
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

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  title: string;
  placeholder: React.ReactNode;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, title, placeholder }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (img.width > 1 && img.height > 1) {
        setIsImageLoaded(true);
      } else {
        setIsImageLoaded(false);
      }
    };
    img.onerror = () => setIsImageLoaded(false);
  }, [src]);

  return (
    isImageLoaded ? <img src={src} alt={alt} title={title} style={{ width: '100px', height: '150px' }} /> : placeholder
  );
};