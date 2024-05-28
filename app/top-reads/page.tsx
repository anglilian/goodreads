"use client";  // This marks the component as a client component

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Papa from 'papaparse';
import TopReads from '../../components/TopReads';
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

  return <TopReads topReadsByYear={topReadsByYear} />;
};

export default TopReadsPerYear;
