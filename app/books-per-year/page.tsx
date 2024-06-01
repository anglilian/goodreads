"use client";  // This marks the component as a client component

import dayjs from 'dayjs';
import BookChart from '../../components/BookChart';
import useBooksData from '../../hooks/useBooksData';
import '../globals.css';  // Ensure this is imported to apply the styles

const BooksPerYear: React.FC = () => {
  const data = useBooksData();

  const readBooks = data.filter(item => item["Exclusive Shelf"] === "read" && item["Date Read"]);

  const booksReadByYear = readBooks.reduce((acc, book) => {
    const year = dayjs(book['Date Read'], 'YYYY/MM/DD').year();
    if (!acc[year]) {
      acc[year] = { books: 0, pages: 0 };
    }
    acc[year].books++;
    acc[year].pages += parseInt(book['Number of Pages'], 10) || 0;
    return acc;
  }, {} as Record<number, { books: number; pages: number }>);

  const chartData = {
    labels: Object.keys(booksReadByYear),
    datasets: [
      {
        label: 'Books Read',
        data: Object.values(booksReadByYear).map(yearData => yearData.books),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y-books',
      },
      {
        label: 'Pages Read',
        data: Object.values(booksReadByYear).map(yearData => yearData.pages),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        yAxisID: 'y-pages',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      'y-books': {
        type: 'linear' as const,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Books Read',
        },
      },
      'y-pages': {
        type: 'linear' as const,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Pages Read',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className='p-8'>
      <h1 className='mb-8'>Books and Pages Read per Year</h1>
      <BookChart chartData={chartData} options={options} />
    </div>
  );
};

export default BooksPerYear;
