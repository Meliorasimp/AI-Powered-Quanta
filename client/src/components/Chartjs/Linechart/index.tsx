import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  Chart as ChartJS,
  CategoryScale, // x-axis
  LinearScale, // y-axis
  LineElement, // line
  Title,
  Tooltip,
  Legend,
  PointElement,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type LinechartProps = {
  containerClassName?: string;
  dataOverride?: ChartData<"line", number[], string>;
  optionsOverride?: ChartOptions<"line">;
};

const Linechart = ({
  containerClassName,
  dataOverride,
  optionsOverride,
}: LinechartProps) => {
  interface ProgressionPoint {
    date: string;
    remainingBalance: number;
  }
  const progression: ProgressionPoint[] = [];
  const transactions = useSelector(
    (state: RootState) => state.usertransaction.transactions
  );
  const totalIncome = transactions.reduce((acc, t) => {
    if (t.type?.toLowerCase().trim() === "income") {
      return acc + (Number(t.amount) || 0);
    }
    return acc;
  }, 0);

  let remaining = totalIncome;

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
  );

  sorted.forEach((t) => {
    if (t.type?.toLowerCase().trim() === "expense") {
      remaining -= Number(t.amount) || 0;
      progression.push({ date: t.dateCreated, remainingBalance: remaining });
    }
    if (t.type?.toLowerCase().trim() === "transfer") {
      remaining -= Number(t.amount) || 0;
      progression.push({ date: t.dateCreated, remainingBalance: remaining });
    }
  });

  console.log("Progression data:", progression);

  const data: ChartData<"line", number[], string> = dataOverride ?? {
    labels: progression.reverse().map((p) =>
      new Date(p.date).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Sample Line Chart",
        data: progression.reverse().map((p) => p.remainingBalance),
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = optionsOverride ?? {
    responsive: true,
    maintainAspectRatio: false, // allow the chart to fill the container height
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Line Chart Example",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="w-full">
      {/* The parent must have a defined height. Pass containerClassName="h-full" to fill a fixed-height parent. */}
      <div
        className={containerClassName ?? "relative w-full h-64 sm:h-80 md:h-96"}
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Linechart;
