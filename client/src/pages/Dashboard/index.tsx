import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Doughnut from "../../components/Chartjs/Doughnut/index.tsx";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
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
import { Plus as PlusIcon } from "lucide-react";
import AiModal from "../../components/AiModal/index.tsx";
import { fetchUserBudgets } from "../../modules/Api/Budgets/displaybudget.ts";
import { calculateTotalBudgetedAmount } from "../../utils/index.ts";
import { setTotalBudgetedAmount } from "../../modules/Api/Budgets/displaybudget.ts";
import {
  calculateExpensePercentage,
  calculateBudgetPercentage,
  calculateTransferPercentage,
  formatDateByHour,
} from "../../utils/index.ts";
import {
  showGoalPopup,
  showTransactionPopup,
} from "../../modules/Interaction.ts/index.ts";
import TransactionCard from "../../components/transactionpopup/index.tsx";
import GoalPopup from "../../components/GoalPopup/index.tsx";
import {
  fetchUserGoal,
  setDisplayGoal,
} from "../../modules/Api/Goals/displayGoal.ts";

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
  const transactionPopup = useAppSelector(
    (state: RootState) => state.interaction.isTransactionPopupVisible
  );
  const goalPopup = useAppSelector(
    (state: RootState) => state.interaction.isGoalPopupVisible
  );
  console.log("User ID from state:", userId);
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

  const totalIncome = useAppSelector(
    (state: RootState) => state.dashboard.totalIncome
  );
  const totalBudgetedAmount = useAppSelector(
    (state: RootState) => state.userbudget.totalBudgetedAmount
  );

  const userTransaction = useAppSelector(
    (state: RootState) => state.usertransaction
  );
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  const goals = useAppSelector((state: RootState) => state.displayGoal.goals);

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

    //getAiSummarization();
    fetchUserData();
  }, [navigate, dispatch, userId]);

  useEffect(() => {
    const fetchUserGoals = async () => {
      if (userId) {
        try {
          console.log("Fetching goals for User ID:", userId);
          const userGoals = await dispatch(fetchUserGoal(userId)).unwrap();
          console.log("User Goals:", userGoals);
          dispatch(setDisplayGoal(userGoals));
          console.log("userGoals dispatched to state:", goals);
        } catch (error) {
          console.error("Error fetching user goals:", error);
        }
      }
    };
    fetchUserGoals();
  }, [userId, dispatch]);

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
      <div className="w-10/11 flex flex-col py-5 px-5 gap-y-2 mx-auto">
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
            <div className="border-2 rounded-lg border-gray-700 p-5 flex flex-col justify-center items-left relative shadow-[4px_4px_10px_rgba(255,255,255,0.1)]">
              <div className="flex flex-row items-center gap-x-2 justify-start">
                <Heading
                  label="Remaining Balance"
                  className="text-md main-website-text-color"
                />
                <Info className="cursor-pointer" />
              </div>
              <Heading
                label={`$${
                  remainingBalance ? remainingBalance.toString() : "0"
                }`}
                className="text-2xl font-semibold main-website-text-color mt-2"
              />
              <div className="bar-container relative bottom-0 left-0 w-full h-2 mt-4 flex rounded-full overflow-hidden">
                {/* Expense portion */}
                <div
                  className="expense-bar-fill bg-red-500"
                  style={{
                    width: `${calculateExpensePercentage(
                      totalIncome,
                      totalExpenses
                    )}%`,
                  }}
                />

                {/* Budget portion */}
                <div
                  className="budget-bar-fill bg-purple-500"
                  style={{
                    width: `${calculateBudgetPercentage(
                      totalBudgetedAmount,
                      totalIncome
                    )}%`,
                  }}
                />

                {/* Transfer portion */}
                <div
                  className="transfers-bar-fill bg-blue-500"
                  style={{
                    width: `${calculateTransferPercentage(
                      totalTransfersMade,
                      totalIncome
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="border-2 rounded-lg border-gray-700 p-5 flex flex-col justify-center items-left relative shadow-[4px_4px_10px_rgba(255,255,255,0.1)]">
              <div className="flex flex-row items-center gap-x-2 justify-start">
                <Heading
                  label="Total Expenses"
                  className="text-md main-website-text-color"
                />
                <Info className="cursor-pointer" />
              </div>
              <Heading
                label={`$${totalExpenses ? totalExpenses.toString() : "0"}`}
                className="text-2xl font-semibold main-website-text-color mt-2"
              />
              <div className="bar-container rounded-full left-0 w-full h-2 mt-4">
                <div
                  className="expense-bar-fill"
                  style={{
                    width: `${calculateExpensePercentage(
                      totalIncome,
                      totalExpenses
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="border-2 rounded-lg border-gray-700 p-5 flex flex-col justify-center items-left relative shadow-[4px_4px_10px_rgba(255,255,255,0.1)]">
              <div className="flex flex-row items-center gap-x-2 justify-start">
                <Heading
                  label="Total Budgeted Amount"
                  className="text-md main-website-text-color"
                />
                <Info className="cursor-pointer" />
              </div>
              <Heading
                label={`$${budgetedAmount ? budgetedAmount.toString() : "0"}`}
                className="text-2xl font-semibold main-website-text-color mt-2"
              />
              <div className="bar-container rounded-full left-0 w-full h-2 mt-4">
                <div
                  className="budget-bar-fill"
                  style={{
                    width: `${calculateBudgetPercentage(
                      totalBudgetedAmount,
                      totalIncome
                    )}%`,
                  }}
                />
              </div>
            </div>
            <div className="border-2 rounded-lg border-gray-700 p-5 flex flex-col justify-center items-left relative shadow-[4px_4px_10px_rgba(255,255,255,0.1)]">
              <div className="flex flex-row items-center gap-x-2 justify-start">
                <Heading
                  label="Total Transfers Made"
                  className="text-md main-website-text-color"
                />
                <Info className="cursor-pointer" />
              </div>
              <Heading
                label={`$${
                  totalTransfersMade ? totalTransfersMade.toString() : "0"
                }`}
                className="text-2xl font-semibold main-website-text-color mt-2"
              />
              <div className="bar-container rounded-full left-0 w-full h-2 mt-4">
                <div
                  className="transfers-bar-fill"
                  style={{
                    width: `${calculateTransferPercentage(
                      totalTransfersMade,
                      totalIncome
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-x-4 flex-col lg:flex-row lg:gap-x-4 lg:justify-center w-full h-full">
          <div className="py-5 px-4 border-2 mt-4 rounded-lg border-gray-700 sm:w-[90%] lg:w-[70%] mx-auto shadow-[4px_4px_10px_rgba(255,255,255,0.1)]">
            <div className="flex flex-row">
              <Heading
                label="Income vs. Expenses Graph"
                className="text-base sm:text-lg main-website-text-color text-center sm:text-left mr-10"
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
          <div className="py-5 px-4 border-2 mt-4 rounded-lg border-gray-700 w-full sm:w-[90%] lg:w-[30%] mx-auto shadow-[4px_4px_10px_rgba(255,255,255,0.1)] overflow-auto">
            <div className="flex flex-row justify-between items-center">
              <Heading
                label="Recent Transactions"
                className="text-base sm:text-lg main-website-text-color text-center sm:text-left"
              />
              <Button
                label="Add"
                type="button"
                icon={<PlusIcon className="inline-block" />}
                className="cursor-pointer"
                onClick={() => dispatch(showTransactionPopup())}
              />
            </div>
            <div className="w-full h-[300px] sm:h-[400px] flex justify-center items-center ">
              {userTransaction.loading && (
                <MoonLoader
                  color={"#36d7b7"}
                  loading={userTransaction.loading}
                  cssOverride={override}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              )}{" "}
              {!userTransaction.loading && userTransaction.error && (
                <p className="text-red-500">
                  Error:{" "}
                  {userTransaction.error || "Failed to load transactions."}
                </p>
              )}{" "}
              {!userTransaction.loading &&
                userTransaction.transactions.length === 0 && (
                  <p>No transactions found.</p>
                )}{" "}
              {!userTransaction.loading &&
                userTransaction.transactions.length > 0 && (
                  <div className="w-full h-full flex flex-col gap-y-4 mt-5">
                    {[...userTransaction.transactions]
                      .reverse()
                      .slice(0, 7)
                      .map((transactions) => (
                        <div
                          key={transactions._id}
                          className="flex justify-between items-start"
                        >
                          <div>
                            <div>{transactions.transactionName}</div>
                            <div className="text-sm text-gray-500">
                              {formatDateByHour(transactions.dateCreated)}
                            </div>
                          </div>
                          <div className="text-lg min-w-[80px] text-right">
                            <span
                              className={
                                transactions.type.toLowerCase() === "expense"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }
                            >
                              {transactions.type.toLowerCase() === "expense"
                                ? "-"
                                : "+"}
                              ${transactions.amount}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
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
            <div className="w-full overflow-x-auto"></div>
          </div>
          <div className="w-full md:w-4/11 h-96 py-5 px-5 border-2 mt-2 rounded-lg border-gray-700">
            <div className="flex flex-row items-center justify-between">
              <Heading
                label="Goals"
                className="text-lg font-semibold main-website-text-color"
              />
              <Button
                label="Add Goal"
                type="button"
                className="cursor-pointer"
                icon={<PlusIcon className="inline-block" />}
                onClick={() => dispatch(showGoalPopup())}
              />
            </div>
            <div className="w-full h-full mt-2"></div>
          </div>
        </div>
      </div>
      {transactionPopup && <TransactionCard />}
      {goalPopup && <GoalPopup />}
    </div>
  );
};

export default Dashboard;
