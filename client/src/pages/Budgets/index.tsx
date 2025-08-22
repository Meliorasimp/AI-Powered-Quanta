import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Budgetcard from "../../components/Budgetcard";
import "../../styles/index.css";
import Button from "../../components/Button";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { showPopup } from "../../modules/Interaction.ts";
import { useDispatch } from "react-redux";

const Budgets = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="flex flex-row gap-x-10">
          <div className="overflow-hidden pb-2">
            <Heading
              label="Budgets"
              className="text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Curious where your money’s been going? Let’s take a look."
              className="text-base main-website-text-color"
              variant="secondary"
            />
          </div>
          <div className="flex justify-center">
            <Button
              label="Add Budget"
              onClick={() => dispatch(showPopup())}
              type="button"
              icon={<Plus className="inline-block" />}
              className="text-white text-base bg-gray-700 px-7 rounded-4xl hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
            />
          </div>
        </div>
        <div className="h-full w-full flex flex-row gap-x-5">
          <div className="h-full w-3/4 flex flex-col gap-y-5">
            <Budgetcard
              title="Washing Machine"
              amountallocated={500}
              description="A budget for the new washing machine."
              startdate={new Date("2023-01-01")}
              enddate={new Date("2023-12-31")}
              className="h-3/7 hover:scale-101 transition-transform duration-200"
              onClick={() => console.log("Budget Card Clicked")}
            />
            <Budgetcard
              title="Home Renovation"
              amountallocated={5000}
              description="A budget for the home renovation."
              startdate={new Date("2023-01-01")}
              enddate={new Date("2023-12-31")}
              className="h-3/7 hover:scale-101 transition-transform duration-200"
            />
            <div className="flex flex-row justify-between">
              <Button
                onClick={() => console.log("Edit Clicked")}
                type="button"
                className="hover:cursor-pointer"
                icon={<ArrowLeft color="white" />}
              />
              <Button
                onClick={() => console.log("Edit Clicked")}
                type="button"
                className="hover:cursor-pointer "
                icon={<ArrowRight color="white" />}
              />
            </div>
          </div>
          <div className="h-full w-1/4 flex flex-col gap-y-5">
            <div className="h-3/7 text-lg font-semibold budget-card shadow-2xl p-2 hover:scale-101 transition-transform duration-200">
              <Heading label="Total Budget Amount" />
              <Paragraph
                label="$5,500"
                className="text-green-500"
                variant="primary"
              />
            </div>
            <div className="h-3/7 text-lg font-semibold budget-card shadow-2xl p-2 hover:scale-101 transition-transform duration-200">
              <Heading label="Income After Budget" />
              <Paragraph
                label="$94,500"
                className="text-green-500"
                variant="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
