// components/BooksStack.tsx
import React from "react";
import { Book } from "@/types/types";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import TabletAndroidIcon from "@mui/icons-material/TabletAndroid";
import SofaIcon from "@mui/icons-material/Chair"; // Importing chair icon
import CottageIcon from "@mui/icons-material/Cottage"; // Importing cottage icon

interface BooksStackProps {
  books: Book[];
}

const BooksStack: React.FC<BooksStackProps> = ({ books }) => {
  // Assumptions
  const AVERAGE_PERSON_HEIGHT_CM = 170; // average height of a person in cm
  const KINDLE_HEIGHT_CM = 16; // height of a Kindle in cm
  const SOFA_HEIGHT_CM = 85; // average height of a chair in cm
  const MIN_BOOK_HEIGHT_CM = 1.5; // minimum height of one book in cm
  const MAX_BOOK_HEIGHT_CM = 2.5; // maximum height of one book in cm
  const COTTAGE_HEIGHT_CM = 550; // average height of a cottage in cm

  const numBooks = books.length;

  // Determine the icon mode based on the number of books
  let iconHeightCm, IconComponent, iconMargin, iconLabel;
  if (numBooks < 11) {
    iconHeightCm = KINDLE_HEIGHT_CM;
    IconComponent = TabletAndroidIcon;
    iconMargin = 0;
    iconLabel = "Kindle";
  } else if (numBooks <= 35) {
    iconHeightCm = SOFA_HEIGHT_CM;
    IconComponent = SofaIcon;
    iconMargin = -40;
    iconLabel = "sofa";
  } else if (numBooks <= 80) {
    iconHeightCm = AVERAGE_PERSON_HEIGHT_CM;
    IconComponent = EmojiPeopleIcon;
    iconMargin = -15;
    iconLabel = "person";
  } else {
    iconHeightCm = COTTAGE_HEIGHT_CM;
    IconComponent = CottageIcon;
    iconMargin = -35;
    iconLabel = "house";
  }

  // Calculate the icon height in pixels based on 40% of the viewport height
  const iconHeightPx = window.innerHeight * 0.25;

  // Calculate the height of each book in pixels, varying between MIN_BOOK_HEIGHT_CM and MAX_BOOK_HEIGHT_CM
  const getRandomBookHeightPx = () =>
    (Math.random() * (MAX_BOOK_HEIGHT_CM - MIN_BOOK_HEIGHT_CM) +
      MIN_BOOK_HEIGHT_CM) *
    (iconHeightPx / iconHeightCm);
  const bookHeightsPx = Array.from({ length: numBooks }).map(() =>
    getRandomBookHeightPx()
  );

  // Generate a random width for each book between 95% and 105%
  const getRandomBookWidth = () => 95 + Math.random() * 10;

  // Define an array of colors for alternating
  const colors = ["#d4c4a8", "#6f4e37", "#8a9a5b"]; // Light Tan, Dark Brown, Muted Green
  const borderColors = ["#b7ad98", "#372212", "#5c6844"]; // Secondary color, Primary color, Darker Green

  // Generate a slight offset for each book
  const generateBookStyle = (index: number): React.CSSProperties => {
    const offsetX = (Math.random() - 0.5) * 10; // Random horizontal offset between -5 and 5 pixels
    const bookWidth = getRandomBookWidth(); // Get random book width
    return {
      height: `${bookHeightsPx[index]}px`,
      width: `${bookWidth}%`, // Apply random width
      backgroundColor: colors[index % colors.length],
      borderLeft: `5px solid ${borderColors[index % borderColors.length]}`,
      borderRight: `5px solid ${borderColors[index % borderColors.length]}`,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      position: "absolute",
      bottom: `${bookHeightsPx
        .slice(0, index)
        .reduce((acc, height) => acc + height, 0)}px`,
      transform: `translateX(${offsetX}px)`,
    };
  };

  // Calculate total height in pixels for the stack
  const totalStackHeightPx = bookHeightsPx.reduce(
    (acc, height) => acc + height,
    0
  );

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <h1>You read {numBooks} books this year</h1>
      <div className="flex flex-col justify-end items-center h-full">
        <div
          className="text-left flex items-end"
          style={{ height: `${iconHeightPx}px` }}
        >
          <div
            className="person mr-2 flex flex-col justify-end items-center"
            style={{
              height: `${iconHeightPx}px`,
              marginBottom: `${iconMargin}px`,
            }}
          >
            <IconComponent
              className="p-0 m-0"
              style={{ fontSize: `${iconHeightPx}px` }}
            />
          </div>
          <div
            className="stack relative w-16 mr-4"
            style={{ height: `${totalStackHeightPx}px` }}
          >
            {Array.from({ length: numBooks }).map((_, index) => (
              <div
                key={index}
                className="book"
                style={generateBookStyle(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="mt-8">(looks good stacked next to a {iconLabel})</p>
    </div>
  );
};

export default BooksStack;
