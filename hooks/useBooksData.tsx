// hooks/useBooksData.tsx
"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Book } from "../types/types";

const useBooksData = (
  csvFile: File | null,
  year?: number
): [Book[], boolean] => {
  const [data, setData] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getLastName = (authorLf: string) => {
    if (!authorLf) return "";
    const parts = authorLf.split(",");
    return parts[0].trim();
  };

  const removeTextInsideParentheses = (title: string) => {
    return title.replace(/\s*\([^)]*\)/g, "").trim();
  };

  const getFirstWords = (text: string, wordCount: number) => {
    return text.split(" ").slice(0, wordCount).join(" ");
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const cleanIsbn = (isbn: string) => {
    return isbn.replace(/["=]/g, "");
  };

  const fetchDetailsFromGoogleBooksByISBN = async (
    isbn: string
  ): Promise<{ genre: string | null; coverUrl: string | null }> => {
    const query = `isbn:${encodeURIComponent(isbn)}`;
    console.log(`Google Books API query by ISBN: ${query}`);

    let response;
    let data;
    let attempts = 0;
    const maxAttempts = 5;
    const baseDelayMs = 2000;

    while (attempts < maxAttempts) {
      try {
        response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}`
        );
        if (response.status === 429) {
          attempts++;
          const retryAfter = response.headers.get("Retry-After");
          const waitTime = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : baseDelayMs * attempts;
          await delay(waitTime);
        } else {
          data = await response.json();
          break;
        }
      } catch (error) {
        console.error(
          `Error fetching details from Google Books for ISBN ${isbn}:`,
          error
        );
        return { genre: null, coverUrl: null };
      }
    }

    if (data?.items && data.items.length > 0) {
      const bookInfo = data.items[0].volumeInfo;
      const genre = bookInfo.categories ? bookInfo.categories[0] : null;
      const coverUrl = bookInfo.imageLinks
        ? bookInfo.imageLinks.thumbnail
        : null;
      console.log(
        `Found details for ISBN ${isbn} in Google Books: Genre=${genre}, CoverURL=${coverUrl}`
      );
      return { genre, coverUrl };
    }
    console.log(`No details found for ISBN ${isbn} in Google Books`);
    return { genre: null, coverUrl: null };
  };

  const fetchDetailsFromOpenLibraryByISBN = async (
    isbn: string
  ): Promise<{ genre: string | null; coverUrl: string | null }> => {
    const query = `isbn=${encodeURIComponent(isbn)}`;
    console.log(`Open Library API query by ISBN: ${query}`);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?${query}`
      );
      const data = await response.json();

      if (data?.docs && data.docs.length > 0) {
        const genre = data.docs[0].subject ? data.docs[0].subject[0] : null;
        const coverId = data.docs[0].cover_i ? data.docs[0].cover_i : null;
        const coverUrl = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : null;
        console.log(
          `Found details for ISBN ${isbn} in Open Library: Genre=${genre}, CoverURL=${coverUrl}`
        );
        return { genre, coverUrl };
      }
    } catch (error) {
      console.error(
        `Error fetching details from Open Library for ISBN ${isbn}:`,
        error
      );
      return { genre: null, coverUrl: null };
    }

    console.log(`No details found for ISBN ${isbn} in Open Library`);
    return { genre: null, coverUrl: null };
  };

  const fetchDetailsByISBN = async (
    isbn: string
  ): Promise<{ genre: string | null; coverUrl: string | null }> => {
    let details = await fetchDetailsFromGoogleBooksByISBN(isbn);
    if (!details.genre || !details.coverUrl) {
      details = await fetchDetailsFromOpenLibraryByISBN(isbn);
    }
    return details;
  };

  const fetchDetailsFromGoogleBooksByTitleAuthor = async (
    title: string,
    authorLf: string
  ): Promise<{
    isbn: string | null;
    genre: string | null;
    coverUrl: string | null;
  }> => {
    const lastName = getLastName(authorLf);
    const cleanedTitle = removeTextInsideParentheses(title);
    const query = `intitle:${encodeURIComponent(
      cleanedTitle
    )}+inauthor:${encodeURIComponent(lastName)}`;
    console.log(`Google Books API query by Title/Author: ${query}`);

    let response;
    let data;
    let attempts = 0;
    const maxAttempts = 5;
    const baseDelayMs = 2000;

    while (attempts < maxAttempts) {
      try {
        response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}`
        );
        if (response.status === 429) {
          attempts++;
          const retryAfter = response.headers.get("Retry-After");
          const waitTime = retryAfter
            ? parseInt(retryAfter, 10) * 1000
            : baseDelayMs * attempts;
          await delay(waitTime);
        } else {
          data = await response.json();
          break;
        }
      } catch (error) {
        console.error(
          `Error fetching details from Google Books for ${title} by ${lastName}:`,
          error
        );
        return { isbn: null, genre: null, coverUrl: null };
      }
    }

    if (data?.items && data.items.length > 0) {
      const bookInfo = data.items[0].volumeInfo;
      const genre = bookInfo.categories ? bookInfo.categories[0] : null;
      const coverUrl = bookInfo.imageLinks
        ? bookInfo.imageLinks.thumbnail
        : null;
      if (
        bookInfo.industryIdentifiers &&
        bookInfo.industryIdentifiers.length > 0
      ) {
        const isbnInfo = bookInfo.industryIdentifiers.find(
          (identifier: any) =>
            identifier.type === "ISBN_13" || identifier.type === "ISBN_10"
        );
        const cleanedIsbn = isbnInfo ? cleanIsbn(isbnInfo.identifier) : null;
        console.log(
          `Found details for ${title} in Google Books: ISBN=${cleanedIsbn}, Genre=${genre}, CoverURL=${coverUrl}`
        );
        return { isbn: cleanedIsbn, genre, coverUrl };
      }
    }
    console.log(`No details found for ${title} in Google Books`);
    return { isbn: null, genre: null, coverUrl: null };
  };

  const fetchDetailsFromOpenLibraryByTitleAuthor = async (
    title: string,
    authorLf: string
  ): Promise<{
    isbn: string | null;
    genre: string | null;
    coverUrl: string | null;
  }> => {
    const lastName = getLastName(authorLf);
    const cleanedTitle = removeTextInsideParentheses(title);
    const firstWords = getFirstWords(cleanedTitle, 3);
    const query = `title=${encodeURIComponent(
      firstWords
    )}&author=${encodeURIComponent(lastName)}`;
    console.log(`Open Library API query by Title/Author: ${query}`);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?${query}`
      );
      const data = await response.json();

      if (data?.docs && data.docs.length > 0) {
        const genre = data.docs[0].subject ? data.docs[0].subject[0] : null;
        const isbn = data.docs[0].isbn ? cleanIsbn(data.docs[0].isbn[0]) : null;
        const coverId = data.docs[0].cover_i ? data.docs[0].cover_i : null;
        const coverUrl = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : null;
        console.log(
          `Found details for ${title} in Open Library: ISBN=${isbn}, Genre=${genre}, CoverURL=${coverUrl}`
        );
        return { isbn, genre, coverUrl };
      }
    } catch (error) {
      console.error(
        `Error fetching details from Open Library for ${title} by ${lastName}:`,
        error
      );
      return { isbn: null, genre: null, coverUrl: null };
    }

    console.log(`No details found for ${title} in Open Library`);
    return { isbn: null, genre: null, coverUrl: null };
  };

  const fetchDetailsByTitleAuthor = async (
    title: string,
    authorLf: string
  ): Promise<{
    isbn: string | null;
    genre: string | null;
    coverUrl: string | null;
  }> => {
    let details = await fetchDetailsFromGoogleBooksByTitleAuthor(
      title,
      authorLf
    );
    if (!details.isbn) {
      details = await fetchDetailsFromOpenLibraryByTitleAuthor(title, authorLf);
    }
    return details;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!csvFile) return;

      setIsLoading(true);
      try {
        const csv = await csvFile.text();
        const parsedData = Papa.parse<Book>(csv, { header: true }).data;

        console.log("Parsed CSV data:", parsedData);

        // Filter books first
        const filteredBooks = parsedData.filter((book) => {
          const isRead = book["Exclusive Shelf"] === "read";
          const dateRead = book["Date Read"]
            ? new Date(book["Date Read"])
            : null;
          const matchesYear = year
            ? dateRead && dateRead.getFullYear() === year
            : true;

          return isRead && matchesYear;
        });

        console.log("Filtered books:", filteredBooks);

        // Fetch details for books
        const booksWithDetails = await Promise.all(
          filteredBooks.map(async (book) => {
            const cleanedIsbn = book.ISBN ? cleanIsbn(book.ISBN) : null;
            let isbn = cleanedIsbn;
            let genre = null;
            let coverUrl = null;

            if (cleanedIsbn) {
              // Fetch genre and cover URL by ISBN
              const details = await fetchDetailsByISBN(cleanedIsbn);
              genre = details.genre;
              coverUrl = details.coverUrl;
            } else if (book.Title && book.Author) {
              // Fetch ISBN, genre, and cover URL by Title and Author
              const details = await fetchDetailsByTitleAuthor(
                book.Title,
                book.Author
              );
              isbn = details.isbn;
              genre = details.genre;
              coverUrl = details.coverUrl;
            }

            return { ...book, ISBN: isbn, Genre: genre, CoverURL: coverUrl };
          })
        );

        console.log("Books with details:", booksWithDetails);

        setData(booksWithDetails);
      } catch (error) {
        console.error("Error fetching the CSV file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [csvFile, year]);

  return [data, isLoading];
};

export default useBooksData;
