"use client";  // This marks the component as a client component

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BookChartProps {
  chartData: any;
  options: any;
}

const BookChart: React.FC<BookChartProps> = ({ chartData, options }) => {
  return <Bar data={chartData} options={options} />;
};

export default BookChart;
