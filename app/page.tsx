// pages/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import "./globals.css"; // Ensure this is imported to apply the styles
import useBooksData from "@/hooks/useBooksData"; // Adjust the path according to your project structure
import TopGenres from "@/components/TopGenres";
import BookTable from "@/components/BookTable";
import TotalPagesRead from "@/components/TotalPagesRead";
import BooksStack from "@/components/BooksStack";
import BookFlippingLoader from "@/components/BookFlippingLoader";
import Start from "@/components/Start";

const Home: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userBooks, isLoading] = useBooksData(uploadedFile, currentYear);
  const [currentIndex, setCurrentIndex] = useState(0);

  const components = [
    <Start key="1" year={currentYear} />,
    <BooksStack key="2" books={userBooks} />,
    <TopGenres key="3" books={userBooks} />,
    <TotalPagesRead key="4" books={userBooks} />,
    <BookTable key="5" books={userBooks} />, // Display user books
  ];

  // Handle key press event to navigate components
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
      }
    };

    const handleTouchStart = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [components.length]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden text-center">
      {isLoading ? (
        <BookFlippingLoader />
      ) : (
        <>
          {!uploadedFile ? (
            <div className="flex flex-col items-center justify-center">
              <Start year={currentYear} />
              <p className="mt-2">
                Upload your Goodreads library{" "}
                <a href="https://www.goodreads.com/review/import">from here</a>{" "}
                to start
              </p>
              <div className="mt-4">
                <label className="flex items-center justify-center border border-gray-300 rounded p-2 cursor-pointer">
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full max-w-2xl mr-2 ml-2 h-full flex items-center justify-center">
                {components[currentIndex]}
              </div>
              <p className="mt-2">Click Enter or tap to start</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
