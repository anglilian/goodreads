// Define the Book type with optional fields for properties that might be missing
export type Book = {
  ISBN?: string | null;
  Title: string;
  Author: string;
  "Author l-f": string;
  "Date Read"?: string;
  "My Rating"?: string;
  "Exclusive Shelf"?: string;
  "Number of Pages"?: string;
  "Book Id": string;
  Genre?: string | null;
  CoverURL?: string | null;
};

export interface GenreCount {
  genre: string;
  count: number;
}
