import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Statcard from "../../components/Statcard";
import LineChart from "../../components/Linechart";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Banknote,
  MoveDiagonalIcon,
  PiggyBankIcon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../styles/index.css";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import axios from "axios";
import { setUser } from "../../modules/Api/Users/userslice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const username = useAppSelector((state: RootState) => state.user.username);
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/protected",
          { withCredentials: true }
        );
        console.log("Protected route response:", response.data);
        dispatch(setUser(response.data.user));
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };
    fetchUserData();
  }, [navigate, dispatch]);

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
      <div className="w-10/11 min-h-screen flex flex-col py-5 px-5 gap-y-2 mx-auto">
        <div>
          <Heading
            label="Dashboard"
            className="text-lg font-semibold main-website-text-color"
          />
          <Paragraph
            label={
              username
                ? `Welcome back ${username}! Here is your Financial statistics`
                : "Welcome back!"
            }
            variant="secondary"
            className="text-base main-website-text-color"
          />
          <div className="flex flex-row pt-7 justify-between">
            <Statcard
              icon={<DollarSign size={50} color="lightgray" />}
              label="Total Balance"
              value="100000"
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)]"
            />
            <Statcard
              icon={<Banknote size={50} color="lightgray" />}
              label="Remaining Income"
              value="100000"
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)]"
            />
            <Statcard
              icon={<MoveDiagonalIcon size={50} color="lightgray" />}
              label="Net Profit"
              value="100000"
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)]"
            />
            <Statcard
              icon={<PiggyBankIcon size={50} color="lightgray" />}
              label="Savings"
              value="100000"
              className=" statcard-purple p-5 shadow-[1px_4px_10px_rgba(255,255,255,0.4)]"
            />
          </div>
        </div>
        <div className="py-5 px-4 border-2 mt-4 rounded-lg border-gray-700">
          <Heading
            label="Income vs. Expenses Graph"
            className="text-lg font-semibold main-website-text-color"
          />
          <div className="w-full h-[400px]">
            <LineChart />
          </div>
        </div>
        <div className="flex flex-row gap-x-4">
          <div className="w-8/11 py-5 px-4 border-2 mt-2 rounded-lg border-gray-700">
            <div className="flex flex-row">
              <Heading
                label="Recent Transactions"
                className="text-lg font-semibold main-website-text-color"
              />
              <Button
                label="View all"
                type="button"
                className="ml-auto text-lg cursor-pointer"
                onClick={() => navigate("/transactions")}
              />
            </div>
            <table className="w-full mt-4 border-blue-500">
              <thead>
                <tr className="text-gray-100">
                  <td className="text-base px-4 py-2 font-semibold">
                    Transaction ID
                  </td>
                  <td className="text-base px-4 py-2 font-semibold">Amount</td>
                  <td className="text-base px-4 py-2 font-semibold">
                    Merchant
                  </td>
                  <td className="text-base px-4 py-2 font-semibold">Date</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-base px-4 py-2">1312312</td>
                  <td className="text-base px-4 py-2">$100</td>
                  <td className="text-base px-4 py-2">Amazon</td>
                  <td className="text-base px-4 py-2">2023-03-15</td>
                </tr>
                <tr>
                  <td className="text-base px-4 py-2">31231</td>
                  <td className="text-base px-4 py-2">$100</td>
                  <td className="text-base px-4 py-2">Amazon</td>
                  <td className="text-base px-4 py-2">2023-03-15</td>
                </tr>
                <tr>
                  <td className="text-base px-4 py-2">431231</td>
                  <td className="text-base px-4 py-2">$100</td>
                  <td className="text-base px-4 py-2">Amazon</td>
                  <td className="text-base px-4 py-2">2023-03-15</td>
                </tr>
                <tr>
                  <td className="text-base px-4 py-2">4321</td>
                  <td className="text-base px-4 py-2">$100</td>
                  <td className="text-base px-4 py-2">Amazon</td>
                  <td className="text-base px-4 py-2">2023-03-15</td>
                </tr>
                <tr>
                  <td className="text-base px-4 py-2">14512</td>
                  <td className="text-base px-4 py-2">$100</td>
                  <td className="text-base px-4 py-2">Amazon</td>
                  <td className="text-base px-4 py-2">2023-03-15</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-3/11 py-5 px-4 border-2 mt-2 rounded-lg border-gray-700">
            <Heading
              label="Upcoming Bills"
              className="text-lg font-semibold main-website-text-color"
            />
            <table className="w-full mt-4 border-blue-500">
              <thead>
                <tr className="text-gray-100">
                  <td className="text-base px-4 py-2 font-semibold">
                    Merchant
                  </td>
                  <td className="text-base px-4 py-2 font-semibold">Amount</td>
                  <td className="text-base px-4 py-2 font-semibold">
                    Due Date
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-base px-4 py-2">Netflix</td>
                  <td className="text-base px-4 py-2">$200</td>
                  <td className="text-base px-4 py-2">2023-04-01</td>
                </tr>
                <tr>
                  <td className="text-base px-4 py-2">Electric Bill</td>
                  <td className="text-base px-4 py-2">$150</td>
                  <td className="text-base px-4 py-2">2023-04-15</td>
                </tr>
                <tr>
                  <td className="text-base px-4 py-2">PLDC</td>
                  <td className="text-base px-4 py-2">$300</td>
                  <td className="text-base px-4 py-2">2023-04-30</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
