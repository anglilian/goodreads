import React from "react";
import Link from "next/link";
import "./globals.css"; // Ensure this is imported to apply the styles

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-8">Goodreads Wrapped</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/books-per-year" className="nav-link">
              Books Per Year
            </Link>
          </li>
          <li>
            <Link href="/year-in-books" className="nav-link">
              Year in Books
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
