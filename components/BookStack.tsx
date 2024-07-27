import React from "react";
import { Book } from "@/types/types";

interface BookStackProps {
  iconHeightCm: number;
  books: Book[];
  scaling: number;
}

const BookStack: React.FC<BookStackProps> = ({
  iconHeightCm,
  books,
  scaling,
}) => {
  // Calculate the icon height in pixels based on the scaling factor of the viewport height
  const iconHeightPx = window.innerHeight * scaling;

  // Calculate the height of each book in pixels based on the number of pages
  const calculateBookHeightPx = (pages: number) => {
    const heightCm = pages / 100; // 1 cm per 100 pages
    return (heightCm / iconHeightCm) * iconHeightPx; // Convert to pixels
  };

  // Map books to their respective heights in pixels
  const bookHeightsPx = books.map((book) => ({
    ...book,
    heightPx: calculateBookHeightPx(Number(book["Number of Pages"])),
  }));

  // Generate a random width for each book between 95% and 105%
  const getRandomBookWidth = () => 110 + Math.random() * 10;

  // Define an array of colors for alternating
  const colors = ["#d4c4a8", "#6f4e37", "#8a9a5b"]; // Light Tan, Dark Brown, Muted Green
  const borderColors = ["#b7ad98", "#372212", "#5c6844"]; // Secondary color, Primary color, Darker Green

  // Generate a slight offset for each book
  const generateBookStyle = (index: number): React.CSSProperties => {
    const offsetX = (Math.random() - 0.5) * 10; // Random horizontal offset between -5 and 5 pixels
    const bookWidth = getRandomBookWidth(); // Get random book width
    const borderWidth = bookWidth * 0.05; // Border width as 5% of book width
    return {
      height: `${bookHeightsPx[index].heightPx}px`,
      width: `${bookWidth}%`, // Apply random width
      backgroundColor: colors[index % colors.length],
      borderLeft: `${borderWidth}px solid ${
        borderColors[index % borderColors.length]
      }`,
      borderRight: `${borderWidth}px solid ${
        borderColors[index % borderColors.length]
      }`,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      position: "absolute",
      bottom: `${bookHeightsPx
        .slice(0, index)
        .reduce((acc, book) => acc + book.heightPx, 0)}px`,
      transform: `translateX(${offsetX}px)`,
    };
  };

  // Calculate total height in pixels for the stack
  const totalStackHeightPx = bookHeightsPx.reduce(
    (acc, book) => acc + book.heightPx,
    0
  );

  return (
    <div
      className="stack relative w-16 mr-4"
      style={{ height: `${totalStackHeightPx}px` }}
    >
      {Array.from({ length: books.length }).map((_, index) => (
        <div key={index} className="book" style={generateBookStyle(index)} />
      ))}
    </div>
  );
};

export default BookStack;
