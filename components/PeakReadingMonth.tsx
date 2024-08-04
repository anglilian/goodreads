// components/PeakReadingMonth.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Book } from "@/types/types";
import colors from "@/constants/colours"; // Ensure the correct import path

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface PeakReadingMonthProps {
  books: Book[];
}

const PeakReadingMonth: React.FC<PeakReadingMonthProps> = ({ books }) => {
  const monthMap: { [key: string]: string } = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  };

  const getBooksReadPerMonth = (
    books: Book[]
  ): { labels: string[]; data: number[]; peakMonth: string } => {
    const monthCountMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    books.forEach((book) => {
      if (book["Date Read"]) {
        const month = new Date(book["Date Read"]).toLocaleString("default", {
          month: "short",
        });
        monthCountMap[month]++;
      }
    });

    const labels = Object.keys(monthCountMap);
    const data = Object.values(monthCountMap);
    const peakMonth = labels.reduce((a, b) =>
      monthCountMap[a] > monthCountMap[b] ? a : b
    );

    return { labels, data, peakMonth };
  };

  const { labels, data, peakMonth } = getBooksReadPerMonth(books);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Books Read",
        data,
        backgroundColor: `${colors.link}20`, // Adjust opacity by adding 80 in hex (50% opacity)
        borderWidth: 2,
        borderColor: colors.link,
        categoryPercentage: 0.9, // Adjust category width
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false, // Disable datalabels plugin
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: colors.secondary,
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Books",
          color: colors.secondary,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="mt-4 w-full justify-center space-y-4 p-4">
      <p>You rocked your reading charts in</p>
      <h1>{monthMap[peakMonth]}</h1>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PeakReadingMonth;
