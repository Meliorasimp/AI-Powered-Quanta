import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Statcard from "../../components/Statcard";
import ReactMarkdown from "react-markdown";
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
  getAiSummary,
  setSummarization,
} from "../../modules/Interaction.ts/dashboard/index.ts";
import Barchart from "../../components/Chartjs/Barchart/index.tsx";
import { setGraphMode } from "../..//modules/Interaction.ts/dashboard/index.ts";
import Qwen from "../../assets/qwen.svg";
import AiModal from "../../components/AiModal/index.tsx";
import { fetchUserBudgets } from "../../modules/Api/Budgets/displaybudget.ts";
import { calculateTotalBudgetedAmount } from "../../utils/index.ts";
import { setTotalBudgetedAmount } from "../../modules/Api/Budgets/displaybudget.ts";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const aiPopup = useSelector(
    (state: RootState) => state.dashboard.isAiPopupVisible
  );
  const username = useAppSelector((state: RootState) => state.user.username);
  const userId = useAppSelector((state: RootState) => state.user.id);
  const userBudgets = useAppSelector(
    (state: RootState) => state.userbudget.budgets
  );
  console.log("User Budgets from state:", userBudgets);
  const budgetedAmount = useAppSelector(
    (state: RootState) => state.userbudget.totalBudgetedAmount
  );
  console.log("Total Budgeted Amount from state:", budgetedAmount);
  const summary = useAppSelector(
    (state: RootState) => state.dashboard.summarization
  );
  console.log("AI Summary from state:", summary);
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

          const userBudgets = await dispatch(
            fetchUserBudgets(response.data.user.id)
          ).unwrap();

          const safeBudgets = Array.isArray(userBudgets) ? userBudgets : [];

          if (safeBudgets.length > 0) {
            const totalBudgetedAmount =
              calculateTotalBudgetedAmount(safeBudgets);
            dispatch(setTotalBudgetedAmount(totalBudgetedAmount));
            console.log(
              "Calculated Total Budgeted Amount:",
              totalBudgetedAmount
            );
          } else {
            dispatch(setTotalBudgetedAmount(0));
            console.log("No budgets found, setting total budgeted amount to 0");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };

    const getAiSummarization = async () => {
      const response = await dispatch(getAiSummary(userId)).unwrap();
      console.log("AI Summarization:", response);
      dispatch(setSummarization(response.summary));
      console.log("Updated summarization in state:", response.summary);
    };

    getAiSummarization();
    fetchUserData();
  }, [navigate, dispatch, userId]);

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
          {aiPopup && <AiModal />}
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
              label="Total Budgeted Amount"
              value={budgetedAmount ? budgetedAmount.toString() : "0"}
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
                          .slice(0, 6)
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
          <div className="w-full md:w-4/11 h-96 overflow-y-auto py-5 px-5 border-2 mt-2 rounded-lg border-gray-700">
            <div className="flex flex-row items-center">
              <Heading
                label="AI Insight"
                className="text-lg font-semibold main-website-text-color"
              />
              <img src={Qwen} alt="Qwen Logo" className="h-8 w-20" />
            </div>
            <div className="w-full h-full mt-2">
              {summary ? (
                <div className="leading-loose">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              ) : (
                <p className="flex justify-center items-center mt-10">
                  <MoonLoader
                    color={"#36d7b7"}
                    loading={true}
                    cssOverride={override}
                    size={50}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
