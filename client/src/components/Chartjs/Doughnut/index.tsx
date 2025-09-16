import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const balance = useSelector(
    (state: RootState) => state.dashboard.remainingBalance
  );
  const expenses = useSelector(
    (state: RootState) => state.dashboard.totalExpense
  );
  const transfers = useSelector(
    (state: RootState) => state.dashboard.totalTransfersMade
  );

  const data = {
    labels: ["Balance", "Expenses", "Transfers"],
    datasets: [
      {
        data: [balance, expenses, transfers],
        backgroundColor: ["lightgreen", "red", "blue"],
        hoverBackgroundColor: ["green", "darkred", "darkblue"],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div style={{ width: "320px", height: "320px", margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
