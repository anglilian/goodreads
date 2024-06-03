import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Book } from '../types/types';

const useBooksData = (): Book[] => {
  const [data, setData] = useState<Book[]>([]);
  const dataPath = process.env.NEXT_PUBLIC_DATA_PATH;

  useEffect(() => {
    fetch(`${dataPath}/2024-05-26-goodreads_library_export.csv`)
      .then(response => response.text())
      .then(csv => {
        const parsedData = Papa.parse<Book>(csv, { header: true }).data;
        const filteredData = parsedData.filter(book => 
          book.ISBN || book.Title || book.Author
        );
        setData(filteredData);
      });
  }, [dataPath]);

  return data;
}

export default useBooksData;
