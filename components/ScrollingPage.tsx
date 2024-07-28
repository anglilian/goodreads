"use client"; // This marks the component as a client component

import React, { useEffect, useRef } from "react";
import BookCoversGrid from "./BookCoversGrid";
import { Book } from "@/types/types";

interface ScrollingPageProps {
  books: Book[];
}

const ScrollingPage: React.FC<ScrollingPageProps> = ({ books }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const grid = gridRef.current;
      if (grid) {
        // Reset scroll position to create infinite loop effect
        if (grid.scrollTop >= grid.scrollHeight / 2) {
          grid.scrollTop = 0;
        } else {
          grid.scrollTop += 1;
        }
      }
    };

    const intervalId = setInterval(handleScroll, 50); // Adjust speed here

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full relative h-screen overflow-hidden ">
      <div className="relative -z-10" ref={gridRef}>
        <BookCoversGrid books={books} />
      </div>
      <div className="title fixed h-screen inset-0 flex flex-col justify-center items-center pointer-events-none space-y-4 z-20">
        <h1 className="text-background bg-secondary rounded-full p-4 drop-shadow-xl">
          Your Year in Books
        </h1>
        <p className="text-background italic">Press Enter or tap to continue</p>
      </div>
    </div>
  );
};

export default ScrollingPage;
