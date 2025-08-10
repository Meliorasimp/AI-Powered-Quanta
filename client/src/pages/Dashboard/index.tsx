import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Statcard from "../../components/Statcard";

const Dashboard = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="h-1/5 overflow-hidden">
          <Heading
            label="Dashboard"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Here's an overview of your Financial Status."
            variant="secondary"
            className="text-base main-website-text-color"
          />
          <div className="flex flex-row w-full gap-x-10 h-full justify-around">
            <Statcard label="Expenses" value="100000" />
            <Statcard label="Remaining Income" value="100000" />
            <Statcard label="Net Profit" value="100000" />
          </div>
        </div>
        <div className="flex-grow">
          <Heading
            label="Expense Graph"
            className="text-xl font-semibold main-website-text-color"
          />
        </div>
        <div className="flex-grow">
          <Heading
            label="Recent Transactions"
            className="text-xl font-semibold main-website-text-color"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
