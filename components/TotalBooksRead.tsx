// components/TotalBooksRead.tsx
import React from "react";
import { Book } from "@/types/types";

interface TotalBooksReadProps {
  books: Book[];
}

const TotalBooksRead: React.FC<TotalBooksReadProps> = ({ books }) => {
  const totalBooksRead = books.length;

  return (
    <div className="mt-10 text-left">
      <h2 className="text-2xl font-bold mb-4">Total Books Read</h2>
      <p className="text-lg">{totalBooksRead} books</p>
    </div>
  );
};

export default TotalBooksRead;
