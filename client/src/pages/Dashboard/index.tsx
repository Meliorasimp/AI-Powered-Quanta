import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Statcard from "../../components/Statcard";
import Tabledata from "../../components/Text/Tabledata";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const data = [
    { name: "meinard", age: 25 },
    { name: "john", age: 30 },
    { name: "jane", age: 28 },
  ];
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-screen h-screen flex flex-col py-5 px-5 gap-y-2">
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
        <div className="flex-grow overflow-hidden h-1/4">
          <Heading
            label="Expense Graph"
            className="text-xl font-semibold main-website-text-color"
          />
          <ResponsiveContainer>
            <LineChart data={data}>
              <Line type="monotone" dataKey="age" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-grow overflow-hidden flex">
          <div className="w-1/2">
            <Heading
              label="Recent Transactions"
              className="text-xl font-semibold main-website-text-color"
            />
            <table className="w-full table-row">
              <thead>
                <tr className="text-gray-100 text-left bg-gray-700">
                  <th className="px-4 py-2 text-md font-normal align-top">
                    Transaction ID
                  </th>
                  <th className="px-4 py-2 text-md font-normal align-top">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-md font-normal align-top">
                    Merchant
                  </th>
                  <th className="px-4 py-2 text-md font-normal align-top">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-800 text-sm">
                  {/* Placeholder data */}
                  <Tabledata
                    className="px-4 py-2 align-top text-gray-200"
                    transactionid="123456789"
                    amount="1000"
                    merchant="Netflix"
                    type="Expense"
                  />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
