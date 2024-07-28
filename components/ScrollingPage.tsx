"use client"; // This marks the component as a client component

import React, { useEffect, useRef, useState } from "react";
import BookCoversGrid from "./BookCoversGrid";
import { Book } from "@/types/types";
import LibraryBooks from "@mui/icons-material/LibraryBooks"; // Importing cottage icon
import Star from "@mui/icons-material/Star"; // Importing cottage icon
import BookComparison from "./BookComparison";
import TopGenres from "./TopGenres";
import Modal from "./Modal";

interface ScrollingPageProps {
  books: Book[];
}

const ScrollingPage: React.FC<ScrollingPageProps> = ({ books }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

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
    <div className="w-full relative h-screen overflow-hidden">
      <div className="fixed inset-0 bg-primary opacity-50 z-10"></div>
      <div className="relative -z-10" ref={gridRef}>
        <BookCoversGrid books={books} />
      </div>
      <div className="title fixed h-screen inset-0 flex flex-col justify-center items-center space-y-4 z-20">
        <h1 className="text-background bg-primary bg-opacity-75 rounded-lg p-4 pr-6 pl-6 drop-shadow-xl">
          Your Year in Books
        </h1>
        <div className="flex space-x-4">
          <LibraryBooks
            className="modal-icon"
            fontSize="large"
            onClick={() => setIsBookModalOpen(true)}
          />
          <Star
            className="modal-icon"
            fontSize="large"
            onClick={() => setIsInfoModalOpen(true)}
          />
        </div>
      </div>
      {isBookModalOpen && (
        <Modal onClose={() => setIsBookModalOpen(false)}>
          <BookComparison books={books} />
        </Modal>
      )}
      {isInfoModalOpen && (
        <Modal onClose={() => setIsInfoModalOpen(false)}>
          <TopGenres books={books} />
        </Modal>
      )}
    </div>
  );
};

export default ScrollingPage;
