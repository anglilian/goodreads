// components/TotalPagesRead.tsx
import React from "react";
import { Book } from "@/types/types";

interface TotalPagesReadProps {
  books: Book[];
}

const TotalPagesRead: React.FC<TotalPagesReadProps> = ({ books }) => {
  const totalPagesRead = books.reduce((total, book) => {
    const pages = parseInt(book["Number of Pages"] || "0", 10);
    return total + (isNaN(pages) ? 0 : pages);
  }, 0);

  const totalHours = totalPagesRead / 60; // assuming an average person reads 250 wpm and the average page has 250 words

  return (
    <div className="mt-10 text-left">
      <h2>Hours Read</h2>
      <p>{Math.round(totalHours)} hours</p>
      <p>
        (like binge-watching {Math.round(totalHours / 10)} seasons of your
        favourite TV series, but better)
      </p>
    </div>
  );
};

export default TotalPagesRead;
