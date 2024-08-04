"use client"; // This marks the component as a client component

import React, { useEffect, useRef, useState } from "react";
import BookCoversGrid from "./BookCoversGrid";
import { Book } from "@/types/types";
import LibraryBooks from "@mui/icons-material/LibraryBooks"; // Importing library books icon
import Star from "@mui/icons-material/Star"; // Importing star icon
import BookComparison from "./BookComparison";
import TopGenres from "./TopGenres";
import Modal from "./Modal";
import Tooltip from "@mui/material/Tooltip"; // Importing Tooltip component
import Calendar from "@mui/icons-material/CalendarMonth";
import PeakReadingMonth from "./PeakReadingMonth";

interface ScrollingPageProps {
  books: Book[];
}

const ScrollingPage: React.FC<ScrollingPageProps> = ({ books }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    useState<boolean>(false);

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
        <h1 className="text-primary bg-background bg-opacity-90 rounded-lg p-4 pr-6 pl-6 drop-shadow-xl">
          Your Year in Books
        </h1>
        <div className="flex space-x-4">
          <Tooltip title="Books Read">
            <LibraryBooks
              className="modal-icon"
              fontSize="large"
              onClick={() => setIsBookModalOpen(true)}
            />
          </Tooltip>
          <Tooltip title="Top Genres">
            <Star
              className="modal-icon"
              fontSize="large"
              onClick={() => setIsInfoModalOpen(true)}
            />
          </Tooltip>
          <Tooltip title="Peak reading month">
            <Calendar
              className="modal-icon"
              fontSize="large"
              onClick={() => setIsCalendarModalOpen(true)}
            />
          </Tooltip>
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
      {isCalendarModalOpen && (
        <Modal onClose={() => setIsCalendarModalOpen(false)}>
          <PeakReadingMonth books={books} />
        </Modal>
      )}
    </div>
  );
};

export default ScrollingPage;
