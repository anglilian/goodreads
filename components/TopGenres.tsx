// components/TopGenres.tsx
import React from "react";
import { Book } from "@/types/types";

interface TopGenresProps {
  books: Book[];
}

interface GenreCount {
  genre: string;
  count: number;
}

const TopGenres: React.FC<TopGenresProps> = ({ books }) => {
  const getTopGenres = (books: Book[]): GenreCount[] => {
    const genreCountMap: { [key: string]: number } = {};

    books.forEach((book) => {
      if (book.Genre) {
        if (genreCountMap[book.Genre]) {
          genreCountMap[book.Genre]++;
        } else {
          genreCountMap[book.Genre] = 1;
        }
      }
    });

    const genreCounts: GenreCount[] = Object.keys(genreCountMap).map(
      (genre) => ({
        genre,
        count: genreCountMap[genre],
      })
    );

    genreCounts.sort((a, b) => b.count - a.count);

    return genreCounts.slice(0, 3); // Return only the top 3 genres
  };

  const getTopRatedBooks = (books: Book[]): Book[] => {
    return books
      .filter((book) => book["My Rating"] !== undefined)
      .sort(
        (a, b) =>
          parseFloat(b["My Rating"] || "0") - parseFloat(a["My Rating"] || "0")
      )
      .slice(0, 3);
  };

  const topGenres = getTopGenres(books);

  return (
    <div className="mt-4 w-full justify-center space-y-2 p-4">
      <h2>Top Reads from your Top Genres</h2>
      <ul className="list-none list-inside">
        {topGenres.map((item, index) => (
          <li key={index} className="mb-4">
            <div className="border p-4 rounded-lg shadow-md inline-block">
              <h3 className="text-lg mb-2">
                <span className="font-bold ">
                  #{index + 1} {item.genre}
                </span>
                : {item.count} books
              </h3>
              <div className="flex justify-center">
                {getTopRatedBooks(
                  books.filter((book) => book.Genre === item.genre)
                ).map((book, coverIndex) =>
                  book.CoverURL ? (
                    <img
                      key={coverIndex}
                      src={book.CoverURL}
                      alt={`${book.Title} cover`}
                      title={`${book.Title} by ${book.Author}`}
                      className="flex-none w-1/4 h-auto mr-2 mb-2"
                    />
                  ) : (
                    <div
                      key={coverIndex}
                      className="flex-none w-1/4 h-24 bg-gray-300 mr-2 mb-2 flex items-center justify-center"
                      title={`${book.Title} by ${book.Author}`}
                    >
                      No Cover
                    </div>
                  )
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopGenres;
