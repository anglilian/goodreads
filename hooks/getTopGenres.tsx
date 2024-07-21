// utils/getTopGenres.ts
import { Book, GenreCount } from "@/types/types";

export const getTopGenres = (books: Book[]): GenreCount[] => {
  const genreCount: { [key: string]: number } = books.reduce((acc, book) => {
    const genre = book.Genre || "Unknown";
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});

  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

  return sortedGenres.slice(0, 3).map(([genre, count]) => ({ genre, count }));
};
