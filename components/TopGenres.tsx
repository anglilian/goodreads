// components/TopGenres.tsx
import React from "react";
import { GenreCount } from "@/types/types";

interface TopGenresProps {
  genres: GenreCount[];
  year: number;
}

const TopGenres: React.FC<TopGenresProps> = ({ genres, year }) => {
  return (
    <div className="mt-10 text-left">
      <h2 className="text-2xl font-bold mb-4">Top Genres of {year}</h2>
      <ul className="list-none list-inside ">
        {genres.map((item, index) => (
          <li key={index} className="text-lg">
            #{index + 1} {item.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopGenres;
