import React from 'react';
import Link from 'next/link';
import './globals.css';  // Ensure this is imported to apply the styles

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Li-Lian's Library</h1>
      <h2 className="text-xl font-medium mb-8 text-gray-600">Take a walk through her reading journey over the last decade.</h2>
      <nav>
      <ul className="space-y-4" >
          <li><Link href="/books-per-year" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">Books Per Year</Link></li>
          <li><Link href="/top-reads" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">Top Reads</Link></li>
          <li><Link href="/year-in-books" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300">Year in Books</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
