import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Book } from "../types/types";

const useBooksData = (): Book[] => {
  const [data, setData] = useState<Book[]>([]);
  const csvFilePath = "/goodreads_data/2024-05-26-goodreads_library_export.csv"; // Path relative to public directory

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvFilePath);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const csv = await response.text();
        const parsedData = Papa.parse<Book>(csv, { header: true }).data;
        const filteredData = parsedData.filter(
          (book) => book.ISBN || book.Title || book.Author
        );
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching the CSV file:", error);
      }
    };

    fetchData();
  }, [csvFilePath]);

  return data;
};

export default useBooksData;
