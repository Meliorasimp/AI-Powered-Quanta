import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import { useNavigate } from "react-router-dom";
import { Info, MoveUpRight, Target } from "lucide-react";
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
  setIsAllocatePopupVisible,
  setGoalId,
} from "../../modules/Interaction.ts/index.ts";
import TransactionCard from "../../components/transactionpopup/index.tsx";
import GoalPopup from "../../components/GoalPopup/index.tsx";
import { fetchUserGoal } from "../../modules/Api/Goals/displayGoal.ts";
import Pie from "../../components/Chartjs/Pie/index.tsx";
import Allocate from "../../components/Allocate/index.tsx";
import { DisplayGoal } from "../../modules/Api/Goals/displayGoal.ts";

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
  const budgetedAmount = useAppSelector(
    (state: RootState) => state.userbudget.totalBudgetedAmount
  );
  const summary = useAppSelector(
    (state: RootState) => state.dashboard.summarization
  );
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
  const goalId = useAppSelector((state: RootState) => state.interaction.goalId);
  const isAllocatePopupVisible = useAppSelector(
    (state: RootState) => state.interaction.isAllocatePopupVisible
  );
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.REACT_APP_API_URL}/user/protected`,
          { withCredentials: true }
        );
        dispatch(setUser(response.data.user));
        if (response.data.user && response.data.user.id) {
          const userTransactions = await dispatch(
            getUserTransactions(response.data.user.id)
          ).unwrap();
          console.log("Fetched Transactions:", userTransactions);
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

    {
      /*const fetchAiSummary = async () => {
      try {
        if (!userId) {
          console.warn("No user ID available for AI summary fetch.");
          return;
        }
        const result = await dispatch(getAiSummary(userId)).unwrap();
        console.log("AI Summary Result:", result);
        if (result?.summary) {
          dispatch(setSummarization(result.summary));
        }
      } catch (error) {
        console.error("Error fetching AI summary:", error);
      }
    }; */
    }

    //fetchAiSummary();
    fetchUserData();
  }, [navigate, dispatch, userId]);

  useEffect(() => {
    if (!userId) return;
    if (goals.length > 0) return;
    (async () => {
      try {
        console.log("Fetching goals for User ID:", userId);
        await dispatch(fetchUserGoal(userId)).unwrap();
        console.log("Goals fetched and stored in state.");
      } catch (e) {
        console.error("Error fetching user goals:", e);
      }
    })();
  }, [userId, dispatch, goals.length]);

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
                  remainingBalance ? remainingBalance.toLocaleString() : "0"
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
                label={`$${
                  totalExpenses ? totalExpenses.toLocaleString() : "0"
                }`}
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
                label={`$${
                  budgetedAmount ? budgetedAmount.toLocaleString() : "0"
                }`}
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
                  totalTransfersMade ? totalTransfersMade.toLocaleString() : "0"
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
                  <p className="text-xl text-center w-5/6">
                    No transactions found. Start Adding one!
                  </p>
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
        <div className="w-full flex flex-col gap-4 md:flex-row md:gap-4 md:justify-end">
          <div className="md:w-3/11 py-5 px-4 border-2 mt-2 rounded-lg border-gray-700">
            <div className="flex items-center justify-between">
              <Heading
                label="AI Feedback & Summary"
                className="text-lg main-website-text-color"
              />
              <Button
                type="button"
                label="Refresh"
                className="text-xs px-2 py-1 rounded-md cursor-pointer"
                onClick={() => {
                  if (!userId) return;
                  dispatch(getAiSummary(userId))
                    .unwrap()
                    .then(
                      (res) =>
                        res?.summary && dispatch(setSummarization(res.summary))
                    )
                    .catch((e) =>
                      console.error("Failed to refresh AI summary", e)
                    );
                }}
              />
            </div>
            <div className="mt-4 h-[290px] overflow-auto">
              {summary ? (
                <p className="text-sm sm:text-base px-2 main-website-text-color text-gray-300 text-left">
                  {summary}
                </p>
              ) : (
                <p className="text-sm sm:text-md main-website-text-color">
                  No summary available yet. Click Refresh to generate insights.
                </p>
              )}
            </div>
          </div>
          <div className="md:w-4/11 py-5 px-4 border-2 mt-2 rounded-lg border-gray-700">
            <div>
              <Heading
                label="Expense Category Breakdown"
                className="text-lg main-website-text-color"
              />
              <div className="flex justify-center items-center mt-4 h-[290px]">
                <Pie />
              </div>
            </div>
          </div>
          <div className="w-full md:w-4/11 h-96 py-5 px-5 border-2 mt-2 rounded-lg border-gray-700">
            <div className="flex flex-row items-center justify-between">
              <Heading
                label="Goals"
                className="text-lg main-website-text-color"
              />
              <div className="flex flex-row gap-x-2">
                <Button
                  label="Add"
                  type="button"
                  className="cursor-pointer"
                  icon={<PlusIcon className="inline-block" />}
                  onClick={() => dispatch(showGoalPopup())}
                />
                <Button
                  label="View All"
                  type="button"
                  icon={<MoveUpRight className="inline-block" />}
                  className="cursor-pointer"
                  onClick={() => navigate("/goals")}
                />
              </div>
            </div>
            <div className="w-full h-full mt-2">
              {goals.length === 0 && (
                <p className="text-gray-500">No goals set. Add a new goal!</p>
              )}
              {goals.length > 0 && (
                <ul className="space-y-4">
                  {goals
                    .filter((g: DisplayGoal) => g.name && g.target)
                    .map((g: DisplayGoal) => (
                      <li
                        key={g._id}
                        className="rounded-xl px-2 py-3 shadow hover:shadow-lg transition-shadow duration-200 flex flex-col gap-2"
                      >
                        <div className="flex flex-row justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <span className="text-lg font-semibold text-white truncate">
                              {g.name}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Target className="inline-block" size={16} />
                              {g.deadline
                                ? `Due: ${g.deadline}`
                                : "No deadline"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <button
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1 font-medium shadow"
                              onClick={() => {
                                if (!g._id) return;
                                dispatch(setGoalId(g._id));
                                dispatch(setIsAllocatePopupVisible(true));
                              }}
                            >
                              <PlusIcon size={12} /> Allocate
                            </button>
                            <span className="text-sm text-green-300 font-bold">
                              ${g.current}
                            </span>
                            <span className="text-xs text-gray-400">
                              Target: ${g.target}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full mt-2">
                          {(() => {
                            const currentVal = Number(g.current) || 0;
                            const targetVal = Number(g.target) || 0;
                            const pct =
                              targetVal > 0
                                ? Math.min((currentVal / targetVal) * 100, 100)
                                : 0;
                            return (
                              <div
                                className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                                title={pct.toFixed(2) + "% of goal reached"}
                              />
                            );
                          })()}
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      {transactionPopup && <TransactionCard />}
      {goalPopup && <GoalPopup />}
      {isAllocatePopupVisible && goalId && <Allocate />}
    </div>
  );
};

export default Dashboard;
