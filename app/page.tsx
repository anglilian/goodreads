// pages/index.tsx
"use client";

import React from "react";
import "./globals.css"; // Ensure this is imported to apply the styles
import useBooksData from "@/hooks/useBooksData"; // Adjust the path according to your project structure
import TopGenres from "@/components/TopGenres";
import BookTable from "@/components/BookTable";
import TotalPagesRead from "@/components/TotalPagesRead";
import TotalBooksRead from "@/components/TotalBooksRead";
import BooksStack from "@/components/BooksStack";

const Home: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [thisYearBooks, isLoading] = useBooksData(2024);

  return (
    <div className="flex flex-col items-center justify-center m-10 text-center">
      <h1 className="text-4xl font-bold mb-8">
        {currentYear} Goodreads Wrapped
      </h1>
      {isLoading ? (
        <div>Looking through your library...</div>
      ) : (
        <div className="w-full max-w-4xl  mx-auto items-center">
          <div className="flex flex-row  justify-evenly flex-wrap">
            <div className="min-h-52 flex flex-col justify-around">
              <TopGenres books={thisYearBooks} />
              <TotalPagesRead books={thisYearBooks} />
            </div>
            <BooksStack books={thisYearBooks} />
          </div>

          <BookTable books={thisYearBooks} />
        </div>
      )}
    </div>
  );
};

export default Home;
