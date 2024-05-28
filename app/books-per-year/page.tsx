"use client";  // This marks the component as a client component

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import BookChart from '../../components/BookChart';
import { Book } from '../../data';
import '../globals.css';  // Ensure this is imported to apply the styles

const BooksPerYear: React.FC = () => {
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

  const booksReadByYear = readBooks.reduce((acc, book) => {
    const year = dayjs(book['Date Read'], 'YYYY/MM/DD').year();
    if (!acc[year]) {
      acc[year] = { books: 0, pages: 0 };
    }
    acc[year].books++;
    acc[year].pages += parseInt(book['Number of Pages'], 10) || 0;
    return acc;
  }, {} as Record<number, { books: number; pages: number }>);

  const chartData = {
    labels: Object.keys(booksReadByYear),
    datasets: [
      {
        label: 'Books Read',
        data: Object.values(booksReadByYear).map(yearData => yearData.books),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y-books',
      },
      {
        label: 'Pages Read',
        data: Object.values(booksReadByYear).map(yearData => yearData.pages),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'y-pages',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
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
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div>
      <BookChart chartData={chartData} options={options} />
    </div>
  );
};

export default BooksPerYear;
