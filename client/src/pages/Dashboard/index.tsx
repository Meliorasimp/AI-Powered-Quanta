import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Statcard from "../../components/Statcard";
import LineChart from "../../components/Linechart";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../styles/index.css";

const Dashboard = () => {
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  return (
    <div
      className={`flex flex-col app ${
        isThemePurple
          ? "purple"
          : isThemeLight
          ? "light"
          : isThemeDark
          ? "dark"
          : ""
      }`}
    >
      <Navbar />
      <div className="w-9/10 h-screen flex flex-col py-5 px-5 gap-y-2 mx-auto">
        <div>
          <Heading
            label="Dashboard"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Here's an overview of your Financial Status."
            variant="secondary"
            className="text-base main-website-text-color"
          />
          <div className="flex flex-row pt-7 justify-evenly">
            <Statcard
              label="Total Balance"
              value="100000"
              className="statcard-purple p-5"
            />
            <Statcard
              label="Remaining Income"
              value="100000"
              className="statcard-purple p-5"
            />
            <Statcard
              label="Net Profit"
              value="100000"
              className="statcard-purple p-5"
            />
            <Statcard
              label="Savings"
              value="100000"
              className="statcard-purple p-5"
            />
          </div>
        </div>
        <div className="pt-7">
          <Heading
            label="Income vs. Expenses"
            className="text-xl font-semibold main-website-text-color"
          />
          <div className="w-full h-[400px]">
            <LineChart />
          </div>
        </div>
        <div className="bg-yellow-200">Hello</div>
      </div>
    </div>
  );
};

export default Dashboard;
