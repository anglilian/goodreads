import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Li-Lian's Reading History</h1>
      <nav>
        <ul>
          <li><Link href="/books-per-year">Books Per Year</Link></li>
          <li><Link href="/top-reads">Top Reads</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
