"use client";

import React from "react";
import "./globals.css"; // Ensure this is imported to apply the styles
import useBooksData from "../hooks/useBooksData"; // Adjust the path according to your project structure

const Home: React.FC = () => {
  const data = useBooksData(2024);

  return (
    <div className="flex flex-col items-center justify-center m-10 text-center">
      <h1 className="text-4xl font-bold mb-8">Goodreads Wrapped</h1>
      <div className="w-full max-w-4xl mx-auto">
        <table className="min-w-full bg-white">
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
            {data.map((book, index) => (
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
      </div>
    </div>
  );
};

export default Home;
