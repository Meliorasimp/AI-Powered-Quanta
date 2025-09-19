import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Statcard from "../../components/Statcard";

import Doughnut from "../../components/Chartjs/Doughnut/index.tsx";
import { useNavigate } from "react-router-dom";
import { DollarSign, Banknote } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../styles/index.css";
import Button from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../hooks";
import axios from "axios";
import { setUser } from "../../modules/Api/Users/userslice";
import { MoonLoader } from "react-spinners";
import { CSSProperties } from "react";
import {
  getUserTransactions,
  setTransactions,
} from "../../modules/Api/transaction/displaytransaction.ts";
import { useEffect } from "react";
import {
  calculateRemainingBalance,
  calculateTotalExpenses,
  calculateTotalTransfersMade,
  calculateTotalIncome,
} from "../../utils/index.ts";
import {
  setRemainingBalance,
  setTotalExpense,
  setTotalTransfersMade,
  setTotalIncome,
} from "../../modules/Interaction.ts/dashboard/index.ts";
import Barchart from "../../components/Chartjs/Barchart/index.tsx";
import { setGraphMode } from "../..//modules/Interaction.ts/dashboard/index.ts";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const graphMode = useSelector(
    (state: RootState) => state.dashboard.graphMode
  );
  console.log("Current graph mode:", graphMode);

  const username = useAppSelector((state: RootState) => state.user.username);
  const totalExpenses = useAppSelector(
    (state: RootState) => state.dashboard.totalExpense
  );
  const remainingBalance = useAppSelector(
    (state: RootState) => state.dashboard.remainingBalance
  );
  const totalTransfersMade = useAppSelector(
    (state: RootState) => state.dashboard.totalTransfersMade
  );
  const userTransaction = useAppSelector(
    (state: RootState) => state.usertransaction
  );
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
        if (response.data.user && response.data.user.id) {
          const userTransactions = await dispatch(
            getUserTransactions(response.data.user.id)
          ).unwrap();
          dispatch(setTransactions(userTransactions));

          const totalExpenses = calculateTotalExpenses(userTransactions);
          dispatch(setTotalExpense(totalExpenses));

          const remainingBalance = calculateRemainingBalance(userTransactions);
          dispatch(setRemainingBalance(remainingBalance));

          const totalTransfers = calculateTotalTransfersMade(userTransactions);
          dispatch(setTotalTransfersMade(totalTransfers));

          const totalIncome = calculateTotalIncome(userTransactions);
          dispatch(setTotalIncome(totalIncome));
        }
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
            variant="tertiary"
          />
          <div className="grid pt-7 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Statcard
              icon={<DollarSign size={50} color="lightgray" />}
              label="Remaining Balance"
              value={remainingBalance ? remainingBalance.toString() : "0"}
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)] w-full"
            />
            <Statcard
              icon={<Banknote size={50} color="lightgray" />}
              label="Total Expenses"
              value={totalExpenses ? totalExpenses.toString() : "0"}
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)] w-full"
            />
            <Statcard
              icon={<Banknote size={40} color="lightgray" />}
              label="Total Budget Amount"
              value="100000"
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)] w-full"
            />
            <Statcard
              icon={<Banknote size={40} color="lightgray" />}
              label="Total Transfers made"
              value={totalTransfersMade ? totalTransfersMade.toString() : "0"}
              className="statcard-purple p-5 shadow-[0_4px_10px_rgba(255,255,255,0.2)] w-full"
            />
          </div>
        </div>
        <div className="flex gap-x-4 flex-col lg:flex-row lg:gap-x-4 lg:justify-center">
          <div className="py-5 px-4 border-2 mt-4 rounded-lg border-gray-700 w-full sm:w-[90%] lg:w-[70%] mx-auto">
            <div className="flex flex-row ">
              <Heading
                label="Income vs. Expenses Graph"
                className="text-base sm:text-lg font-semibold main-website-text-color text-center sm:text-left mr-10"
              />
              <Button
                label="Monthly"
                type="button"
                className="text-base text-gray-400 sm:text-lg font-semibold main-website-text-color text-center sm:text-left hover:bg-gray-700 rounded-lg cursor-pointer mr-10 px-3"
                onClick={() => dispatch(setGraphMode("Monthly"))}
              />
              <Button
                label="Daily"
                type="button"
                className="text-base text-gray-400 sm:text-lg font-semibold main-website-text-color text-center sm:text-left hover:bg-gray-700 rounded-lg cursor-pointer mr-10 px-3"
                onClick={() => dispatch(setGraphMode("Daily"))}
              />
            </div>
            <div className="w-full h-[300px] sm:h-[400px] flex justify-center items-center">
              <Barchart />
            </div>
          </div>
          <div className="py-5 px-4 border-2 mt-4 rounded-lg border-gray-700 w-full sm:w-[90%] lg:w-[30%] mx-auto">
            <Heading
              label="Transactions Graph"
              className="text-base sm:text-lg font-semibold main-website-text-color text-center sm:text-left"
            />
            <div className="w-full h-[300px] sm:h-[400px] flex justify-center items-center">
              <Doughnut />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:gap-4 md:justify-center">
          <div className="w-full md:w-8/11 py-5 px-4 border-2 mt-2 rounded-lg border-gray-700">
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
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[520px] mt-4 border-blue-500">
                {userTransaction.loading && (
                  <p className="flex justify-center items-center">
                    <MoonLoader
                      color={"#36d7b7"}
                      loading={userTransaction.loading}
                      cssOverride={override}
                      size={50}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </p>
                )}
                {!userTransaction.loading &&
                  userTransaction.transactions.length === 0 && (
                    <p>No transactions found for this user.</p>
                  )}
                {!userTransaction.loading &&
                  userTransaction.transactions.length > 0 && (
                    <>
                      <thead>
                        <tr className="text-gray-100">
                          <td className="text-base px-4 py-2 font-semibold">
                            Transaction Name
                          </td>
                          <td className="text-base px-4 py-2 font-semibold">
                            Amount
                          </td>
                          <td className="text-base px-4 py-2 font-semibold">
                            Merchant
                          </td>
                          <td className="text-base px-4 py-2 font-semibold">
                            Date
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {userTransaction.transactions
                          .slice(0, 5)
                          .map((transaction) => (
                            <tr key={transaction._id}>
                              <td className="text-base px-4 py-2">
                                {transaction.transactionName}
                              </td>
                              <td className="text-base px-4 py-2">
                                {transaction.amount}
                              </td>
                              <td className="text-base px-4 py-2">
                                {transaction.merchant}
                              </td>
                              <td className="text-base px-4 py-2">
                                {new Date(
                                  transaction.dateCreated
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </>
                  )}
              </table>
            </div>
          </div>
          <div className="w-full md:w-4/11 py-5 px-4 border-2 mt-2 rounded-lg border-gray-700">
            <Heading
              label="AI Insight"
              className="text-lg font-semibold main-website-text-color"
            />
            <div className="w-full overflow-x-auto h-full">
              <table className="w-full min-w-[420px] mt-4 border-blue-500">
                <thead>
                  <tr className="text-gray-100">
                    <td className="text-base px-4 py-2 font-semibold">
                      Merchant
                    </td>
                    <td className="text-base px-4 py-2 font-semibold">
                      Amount
                    </td>
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
    </div>
  );
};

export default Dashboard;
