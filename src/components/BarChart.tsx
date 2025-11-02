import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./BarChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({ title, labels, data, backgroundColor = "rgba(102, 126, 234, 0.8)", borderColor = "rgba(102, 126, 234, 1)" }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor,
        borderColor,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#94a3b8",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className='bar-chart-container'>
      <h3 className='bar-chart-title'>{title}</h3>
      <div className='bar-chart-wrapper'>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;
