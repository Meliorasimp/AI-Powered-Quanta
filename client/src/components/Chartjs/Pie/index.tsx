import { Pie as PieChart } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

const Pie = () => {
  const totalHousingCategory = useSelector((state: RootState) => {
    return state.usertransaction.transactions
      .filter((t) => t.type === "expense" && t.expenseCategory === "Housing")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  const totalUtilitiesCategory = useSelector((state: RootState) => {
    return state.usertransaction.transactions
      .filter((t) => t.type === "expense" && t.expenseCategory === "Utilities")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  const totalGroceriesCategory = useSelector((state: RootState) => {
    return state.usertransaction.transactions
      .filter((t) => t.type === "expense" && t.expenseCategory === "Groceries")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  const totalEntertainmentCategory = useSelector((state: RootState) => {
    return state.usertransaction.transactions
      .filter(
        (t) => t.type === "expense" && t.expenseCategory === "Entertainment"
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  const totalTransportationCategory = useSelector((state: RootState) => {
    return state.usertransaction.transactions
      .filter(
        (t) => t.type === "expense" && t.expenseCategory === "Transportation"
      )
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  const totalEducationCategory = useSelector((state: RootState) => {
    return state.usertransaction.transactions
      .filter((t) => t.type === "expense" && t.expenseCategory === "Education")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  });

  const data = {
    labels: [
      "Housing",
      "Utilities",
      "Groceries",
      "Transportation",
      "Entertainment",
      "Education",
    ],
    datasets: [
      {
        label: "Expenses Made on this Category",
        data: [
          totalHousingCategory,
          totalUtilitiesCategory,
          totalGroceriesCategory,
          totalTransportationCategory,
          totalEntertainmentCategory,
          totalEducationCategory,
        ],
        backgroundColor: [
          "rgba(255, 0, 0, 1)",
          "rgba(0, 0, 255, 1)",
          "rgba(0, 255, 0, 1)",
          "rgba(255, 255, 0, 1)",
          "rgba(128, 0, 128, 1)",
          "rgba(255, 165, 0, 1)",
        ],
      },
    ],
  };
  const config = {
    type: "pie",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right" as const,
          labels: { color: "lightgray", padding: 20 },
        },
      },
    },
  };
  return (
    <div className="w-full h-[250px] flex justify-center items-center">
      <PieChart data={data} options={config.options} />
    </div>
  );
};

export default Pie;
