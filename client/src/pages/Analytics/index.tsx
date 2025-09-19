import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Barchart from "../../components/Chartjs/Barchart/index.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Linechart from "../../components/Chartjs/Linechart/index.tsx";

const Analytics = () => {
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
      <div className="w-10/11 h-screen flex flex-col py-5 px-5 gap-y-2 mx-auto">
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
        </div>
        <div className="flex flex-row gap-x-5">
          <div className="w-1/2  flex flex-col gap-y-5 mt-5 border border-gray-600 p-5 rounded-lg">
            <div>
              <Heading
                label="Income Vs. Expense"
                className="text-xl font-bold"
              />
            </div>
            <div className="w-full h-[400px] flex">
              <Barchart />
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-y-5 mt-5 border border-gray-600 p-5 rounded-lg">
            <div>
              <Heading
                label="This Months Net Progression"
                className="text-xl font-bold"
              />
            </div>
            <div className="w-full h-[400px] flex">
              <Linechart containerClassName="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
