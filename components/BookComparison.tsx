import { Book } from "@/types/types";
import BookStack from "./BookStack";

interface BookComparisonProps {
  books: Book[];
}

const BookComparison: React.FC<BookComparisonProps> = ({ books }) => {
  const numBooks = books.length;

  let iconHeightCm = 165; // average height of a person in cm
  let IconComponent = (
    <svg viewBox="4 2 16.36 20" className="icon">
      <circle cx="12" cy="4" r="2"></circle>
      <path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-2.54C8.24 6.99 6 4.75 6 2H4c0 3.16 2.11 5.84 5 6.71V22h2v-6h2v6h2V10.05L18.95 14l1.41-1.41z"></path>
    </svg>
  );

  // Calculate the icon height in pixels based on 25% of the viewport height
  const scaling = 0.3;
  const iconHeightPx = window.innerHeight * scaling;

  return (
    <div className="flex flex-col h-full w-full p-4 space-y-8">
      <h1>You read {numBooks} books this year</h1>

      <div className="flex flex-col flex-grow justify-end items-center h-full">
        <div className="flex items-end">
          <div className="flex flex-col justify-end">
            <div
              style={{
                height: `${iconHeightPx}px`,
              }}
            >
              {IconComponent}
            </div>
          </div>
          <BookStack
            iconHeightCm={iconHeightCm}
            books={books}
            scaling={scaling}
          />
        </div>
      </div>
    </div>
  );
};

export default BookComparison;
