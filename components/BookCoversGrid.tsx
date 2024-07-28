"use client"; // This marks the component as a client component

import React, { useEffect, useState, useRef, useCallback } from "react";
import { debounce } from "lodash";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Book } from "@/types/types";
import "@/app/globals.css"; // Ensure this is imported to apply the styles

interface BookCoversGridProps {
  books: Book[];
}

const BookCoversGrid: React.FC<BookCoversGridProps> = ({ books }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicatedBooks = [...books, ...books]; // Duplicate books for wrapping effect

  const [containerWidth, setContainerWidth] = useState<number>(
    window.innerWidth
  );

  const handleResize = useCallback(
    debounce(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    }, 300),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Call it initially to set the size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full p-2 overflow-hidden relative"
    >
      <div className="fixed inset-0 bg-primary opacity-50 pointer-events-none z-10"></div>
      <div className="bookGridContent grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-1 p-4 relative animate-scroll">
        {duplicatedBooks.map((book, index) => (
          <div
            key={`${book["Book Id"]}-${index}`}
            className="flex justify-center items-center"
          >
            <ImageWithFallback
              imageSrc={book.CoverURL}
              alt={`${book.Title} by ${book["Author"]}`}
              placeholder={<div className="placeholder-box">{book.Title}</div>}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookCoversGrid;
