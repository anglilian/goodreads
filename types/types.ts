export interface ImageWithFallbackProps {
  isbn?: string;
  title?: string;
  authorLf?: string;
  alt: string;
  placeholder: React.ReactNode;
}

export interface Book {
  Title: string;
  Author: string;
  "Author l-f": string;
  "Date Read": string;
  ISBN: string;
  "My Rating": string;
  "Exclusive Shelf": string;
  "Number of Pages": string;
}
