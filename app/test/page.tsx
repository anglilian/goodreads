"use client"; // This marks the component as a client component

import React, { useEffect, useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import ImageWithFallback from "@/components/ImageWithFallback";
import { fetchBookCover } from "@/utils";
import useBooksData from "@/hooks/useBooksData";
import { Book } from "@/types/types";
import "@/app/globals.css"; // Ensure this is imported to apply the styles

function calculateOptimalImageSize(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number,
  numberOfImages: number
): {
  width: number;
  height: number;
  columns: number;
  rows: number;
  firstRowCols: number;
  lastRowCols: number;
} {
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
  let booksInLastRow = calculateBooksInLastRow(numberOfImages, bestColumns);
  let { firstRowCols, lastRowCols } = calculateBookDistribution(
    booksInLastRow,
    bestColumns
  );

  console.log(
    `Columns: ${bestColumns}, Rows: ${bestRows}, booksInLastRow: ${booksInLastRow}, Num books: ${numberOfImages}`
  );
  return {
    width: bestWidth,
    height: bestHeight,
    columns: bestColumns,
    rows: bestRows - 2,
    firstRowCols: firstRowCols,
    lastRowCols: lastRowCols,
  };
}

const calculateBooksInLastRow = (totalBooks: number, columns: number) => {
  const booksInLastRow = totalBooks % columns;
  return booksInLastRow === 0 ? columns : booksInLastRow;
};

const calculateBookDistribution = (booksInLastRow: number, columns: number) => {
  const firstRowCols = Math.floor((booksInLastRow + columns) / 2);
  const lastRowCols = booksInLastRow + columns - firstRowCols;
  return { firstRowCols, lastRowCols };
};

const BooksByYear: React.FC = () => {
  const data = useBooksData();
  const [books, setBooks] = useState<Book[]>([]);
  const [bookCovers, setBookCovers] = useState<Record<string, string>>({});
  const [optimalSize, setOptimalSize] = useState<{
    width: number;
    height: number;
    columns: number;
    rows: number;
    firstRowCols: number;
    lastRowCols: number;
  }>({
    width: 100,
    height: 150,
    columns: 1,
    rows: 1,
    firstRowCols: 1,
    lastRowCols: 1,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter books by the year 2024
    const booksFor2024 = data.filter(
      (book) => dayjs(book["Date Read"], "YYYY/MM/DD").year() === 2020
    );
    setBooks(booksFor2024);

    // Fetch book covers
    const fetchCovers = async () => {
      const covers = await Promise.all(
        booksFor2024.map(async (book) => {
          console.log(
            `Fetching cover for ISBN: ${book.ISBN}, Title: ${book.Title}, Author: ${book["Author l-f"]}`
          );
          const coverUrl = await fetchBookCover(
            book.ISBN,
            book.Title,
            book["Author l-f"]
          );
          const id = book["Book Id"];
          return { id, coverUrl };
        })
      );

      // Update the book covers state
      const coversMap = covers.reduce<Record<string, string>>(
        (acc, { id, coverUrl }) => {
          if (id) {
            acc[id] = coverUrl;
          }
          return acc;
        },
        {}
      );

      setBookCovers(coversMap);
      handleResize(); // Ensure the size is recalculated after loading
    };

    fetchCovers();
  }, [data]);

  const handleResize = useCallback(() => {
    const numBooks = books.length;
    const containerWidth = containerRef.current
      ? containerRef.current.clientWidth
      : window.innerWidth;
    const containerHeight = containerRef.current
      ? containerRef.current.clientHeight
      : window.innerHeight;
    const aspectRatio = 2 / 3; // Assuming the book covers have a 2:3 aspect ratio

    if (numBooks > 0) {
      const newSize = calculateOptimalImageSize(
        containerWidth,
        containerHeight,
        aspectRatio,
        numBooks
      );

      setOptimalSize(newSize);
    }
  }, [books]);

  useEffect(() => {
    // Recalculate the image size whenever the books or window size changes
    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially to set the size

    return () => window.removeEventListener("resize", handleResize);
  }, [books, handleResize]);

  const firstRowBooks = books.slice(0, optimalSize.firstRowCols);
  const centerRowBooks = books.slice(
    optimalSize.firstRowCols,
    books.length - optimalSize.lastRowCols
  );
  const lastRowBooks = books.slice(
    books.length - optimalSize.lastRowCols,
    books.length
  );

  return (
    <div
      ref={containerRef}
      className="p-8 max-w-screen-lg mx-auto flex flex-col justify-center items-center h-screen overflow-hidden"
    >
      <h1>Books Read in 2024</h1>
      <div
        className="grid justify-center items-center"
        style={{
          gridTemplateColumns: `repeat(${optimalSize.firstRowCols}, ${optimalSize.width}px)`,
          gridTemplateRows: `repeat(1 , ${optimalSize.height}px)`,
        }}
      >
        {firstRowBooks.map((book) => (
          <div
            key={book["Book Id"]}
            style={{ width: optimalSize.width, height: optimalSize.height }}
            className="flex justify-center items-center"
          >
            <ImageWithFallback
              imageSrc={bookCovers[book["Book Id"]]}
              alt={`${book.Title} by ${book["Author"]}`}
              placeholder={<div className="placeholder-box">{book.Title}</div>}
            />
          </div>
        ))}
      </div>
      <div
        className="grid justify-center items-center"
        style={{
          gridTemplateColumns: `repeat(${optimalSize.columns}, ${optimalSize.width}px)`,
          gridTemplateRows: `repeat(${optimalSize.rows}, ${optimalSize.height}px)`,
        }}
      >
        {centerRowBooks.map((book) => (
          <div
            key={book["Book Id"]}
            style={{ width: optimalSize.width, height: optimalSize.height }}
            className="flex justify-center items-center"
          >
            <ImageWithFallback
              imageSrc={bookCovers[book["Book Id"]]}
              alt={`${book.Title} by ${book["Author"]}`}
              placeholder={<div className="placeholder-box">{book.Title}</div>}
            />
          </div>
        ))}
      </div>
      <div
        className="grid justify-center items-center"
        style={{
          gridTemplateColumns: `repeat(${optimalSize.lastRowCols}, ${optimalSize.width}px)`,
          gridTemplateRows: `repeat(1 , ${optimalSize.height}px)`,
        }}
      >
        {lastRowBooks.map((book) => (
          <div
            key={book["Book Id"]}
            style={{ width: optimalSize.width, height: optimalSize.height }}
            className="flex justify-center items-center"
          >
            <ImageWithFallback
              imageSrc={bookCovers[book["Book Id"]]}
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
