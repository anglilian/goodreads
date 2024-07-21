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
  const [thisYearBooks, isLoading] = useBooksData(currentYear);
  const [currentIndex, setCurrentIndex] = useState(0);

  const components = [
    <Start key="1" year={currentYear} />,
    <BooksStack key="2" books={thisYearBooks} />,
    <TopGenres key="3" books={thisYearBooks} />,
    <TotalPagesRead key="4" books={thisYearBooks} />,
  ];

  // Handle key press event to navigate components
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
      }
    };

    const handleScreenTap = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % components.length);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("click", handleScreenTap);
    window.addEventListener("touchstart", handleScreenTap);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("click", handleScreenTap);
      window.removeEventListener("touchstart", handleScreenTap);
    };
  }, [components.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden text-center">
      {isLoading ? (
        <BookFlippingLoader />
      ) : (
        <div className="w-full max-w-2xl mr-2 ml-2 h-full flex items-center justify-center">
          {components[currentIndex]}
        </div>
      )}
    </div>
  );
};

export default Home;
