import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "./PieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  labels,
  data,
  colors = ["rgba(102, 126, 234, 0.8)", "rgba(118, 75, 162, 0.8)", "rgba(237, 100, 166, 0.8)", "rgba(255, 154, 158, 0.8)", "rgba(250, 208, 196, 0.8)"],
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderColor: colors.map((c) => c.replace("0.8", "1")),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          color: "#e2e8f0",
          font: {
            size: 12,
          },
        },
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
  };

  return (
    <div className='pie-chart-container'>
      <h3 className='pie-chart-title'>{title}</h3>
      <div className='pie-chart-wrapper'>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
