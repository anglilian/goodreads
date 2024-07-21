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

  const topGenres = getTopGenres(books);

  return (
    <div className="mt-10 text-left ">
      <h2>Top Genres</h2>
      <ul className="list-none list-inside ">
        {topGenres.map((item, index) => (
          <li key={index}>
            #{index + 1} {item.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopGenres;
