import React from "react";
import { Book } from "@/types/types";

interface BookTableProps {
  books: Book[];
}

const BookTable: React.FC<BookTableProps> = ({ books }) => {
  return (
    <table className="min-w-full bg-white mt-8">
      <thead>
        <tr>
          <th className="py-2">Title</th>
          <th className="py-2">Author</th>
          <th className="py-2">ISBN</th>
          <th className="py-2">Genre</th>
          <th className="py-2">Cover</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => (
          <tr key={index} className="bg-gray-100 border-b">
            <td className="py-2 px-4">{book.Title}</td>
            <td className="py-2 px-4">{book.Author}</td>
            <td className="py-2 px-4">{book.ISBN ? book.ISBN : "N/A"}</td>
            <td className="py-2 px-4">{book.Genre ? book.Genre : "N/A"}</td>
            <td className="py-2 px-4">
              {book.CoverURL ? (
                <img
                  src={book.CoverURL}
                  alt={`${book.Title} cover`}
                  className="w-16 h-auto"
                />
              ) : (
                "N/A"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;
