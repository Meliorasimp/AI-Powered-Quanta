import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import LineChart from "../../components/Linechart";

const Analytics = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hidden pb-2 flex flex-row">
          <div className="pr-10">
            <Heading
              label="Analytics"
              className="text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Graphs and Technical Insights"
              className="text-base main-website-text-color"
              variant="secondary"
            />
          </div>
          <div className="text-white flex gap-x-10 justify-center items-center">
            <Heading
              label="Financial Overview"
              className="hover:bg-gray-700 px-6 py-2 cursor-pointer rounded-lg"
            />
            <Heading
              label="Goals and Liabilities"
              className="hover:bg-gray-700 px-6 py-2 cursor-pointer rounded-lg"
            />
          </div>
        </div>
        <div className="w-full">
          <Heading
            label="Net worth progression"
            className="text-white text-xl font-bold"
          />
          <div className="w-full h-60">
            <LineChart />
          </div>
          <Heading
            label="Income vs Expenses"
            className="text-white text-xl font-bold"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
