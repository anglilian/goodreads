"use client"; // This marks the component as a client component

import React, { useEffect, useState, useRef } from "react";
import BookComparison from "./BookComparison";
import BookCoversGrid from "./BookCoversGrid";
import { Book } from "@/types/types";
import TopGenres from "./TopGenres";

interface ScrollingPageProps {
  books: Book[];
}

const ScrollingPage: React.FC<ScrollingPageProps> = ({ books }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookGridRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const topGenresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleIntersection = (entries: any[]) => {
      entries.forEach((entry: { target: any; isIntersecting: any }) => {
        const { target, isIntersecting } = entry;

        if (target === comparisonRef.current) {
          toggleClass(bookGridRef.current, "locked", isIntersecting);
          toggleClass(titleRef.current, "hidden", isIntersecting);
          toggleClass(comparisonRef.current, "visible", isIntersecting);
        } else if (target === topGenresRef.current) {
          toggleClass(topGenresRef.current, "visible", isIntersecting);
        }
      });
    };

    const toggleClass = (
      element: HTMLDivElement | null,
      className: string,
      add: any
    ) => {
      if (element) {
        if (add) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (comparisonRef.current) observer.observe(comparisonRef.current);
    if (topGenresRef.current) observer.observe(topGenresRef.current);

    return () => {
      if (comparisonRef.current) observer.unobserve(comparisonRef.current);
      if (topGenresRef.current) observer.unobserve(topGenresRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div ref={bookGridRef} className={`z-0 min-h-screen relative`}>
        <BookCoversGrid books={books} />
      </div>
      <div
        id="title"
        ref={titleRef}
        className="title fixed min-h-screen inset-0 flex justify-center items-center pointer-events-none z-20 transition-opacity duration-500"
      >
        <h1 className="text-background drop-shadow-xl">Your Year in Books</h1>
      </div>
      {/* Spacer element to create scroll depth */}
      <div className="h-10"></div>
      <div
        ref={comparisonRef}
        id="bookComparison"
        className={`scroller-element transition-transform duration-500`}
      >
        <div className="bg-background rounded-lg">
          <BookComparison books={books} />
        </div>
      </div>
      {/* Spacer element to create scroll depth */}
      <div className="h-20"></div>
      <div
        id="topGenres"
        className={`scroller-element transition-transform duration-500`}
      >
        <div className="bg-background rounded-lg">
          <TopGenres books={books} />
        </div>
      </div>
    </div>
  );
};

export default ScrollingPage;
