import { Bar } from "react-chartjs-2";
import { RootState } from "../../../store";

import {
  Chart as ChartJS,
  CategoryScale, // x-axis
  LinearScale, // y-axis
  BarElement, // bars
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  setDailyData,
  setMonthlyData,
} from "../../../modules/Interaction.ts/dashboard";

// Register the components needed for a bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Barchart() {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state: RootState) => state.usertransaction.transactions
  );
  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);
  const monthlyTransfers = Array(12).fill(0);

  const graphMode = useSelector(
    (state: RootState) => state.dashboard.graphMode
  );
  const monthlyChart = useSelector(
    (state: RootState) => state.dashboard.monthlyDashboardData
  );

  const dailyChart = useSelector(
    (state: RootState) => state.dashboard.dailyDashboardData
  );

  const chartData = graphMode === "Monthly" ? monthlyChart : dailyChart;
  // Utility: get start of current week (Monday as day 0)
  function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // shift so Monday = 0
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
  }

  function getEndOfWeek(startOfWeek: Date) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + 7);
    return d;
  }

  const startOfWeek = getStartOfWeek();
  const endOfWeek = getEndOfWeek(startOfWeek);

  const dailyIncome = Array(7).fill(0);
  const dailyExpense = Array(7).fill(0);
  const dailyTransfers = Array(7).fill(0);

  transactions.forEach((t) => {
    const date = new Date(t.dateCreated);

    // Only count transactions within this week
    if (date < startOfWeek || date >= endOfWeek) return;

    const day = (date.getDay() + 6) % 7; // Monday=0, Sunday=6
    const amount = Number(t.amount) || 0;
    const type = t.type?.toLowerCase().trim();

    if (type === "income") {
      dailyIncome[day] += amount;
    } else if (type === "expense") {
      dailyExpense[day] += amount;
    } else if (type === "transfer") {
      dailyTransfers[day] += amount;
    }
  });

  transactions.forEach((transactions) => {
    if (transactions.type?.toLowerCase() === "income") {
      const month = new Date(transactions.dateCreated).getMonth();
      monthlyIncome[month] += transactions.amount as number;
    } else if (transactions.type?.toLowerCase() === "expense") {
      const month = new Date(transactions.dateCreated).getMonth();
      monthlyExpense[month] += transactions.amount as number;
    } else if (transactions.type?.toLowerCase() === "transfer") {
      const month = new Date(transactions.dateCreated).getMonth();
      monthlyTransfers[month] += transactions.amount as number;
    } else {
      return;
    }
  });

  const dailyChartData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Daily Income",
        data: dailyIncome,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Daily Expenses",
        data: dailyExpense,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Transfers Made",
        data: dailyTransfers,
        backgroundColor: "rgba(100, 255, 86, 0.2)",
        borderColor: "rgba(100, 255, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Income",
        data: monthlyIncome,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Monthly Expenses",
        data: monthlyExpense,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Transfers Made",
        data: monthlyTransfers,
        backgroundColor: "rgba(100, 255, 86, 0.2)",
        borderColor: "rgba(100, 255, 86, 1)",
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    dispatch(setMonthlyData(monthlyChartData));
    dispatch(setDailyData(dailyChartData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, transactions]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // allow chart to fill the container height
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income vs. Expenses",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full">
      <div className="relative w-full h-64 sm:h-80 md:h-96">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
