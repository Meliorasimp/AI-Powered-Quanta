import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
import {
  setSelectFilterByIncome,
  setSelectFilterByExpense,
  setSelectFilterByTransfer,
  setSelectFilterByPending,
  setSelectFilterByCleared,
  showTransactionPopup,
} from "../../modules/Interaction.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import TransactionCard from "../../components/transactionpopup";
import {
  getTransactionsByStatus,
  getTransactionsByType,
  getUserTransactions,
  setTransactions,
} from "../../modules/Api/transaction/displaytransaction.ts";
import React, { useEffect } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSProperties } from "react";
import "../../styles/index.css";
import { UserTransactionState } from "../../modules/Api/transaction/displaytransaction.ts";
import {
  setTotalExpense,
  setRemainingBalance,
} from "../../modules/Interaction.ts/dashboard/index.ts";
import { setSelectFilterByAll } from "../../modules/Interaction.ts";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const sortAll = useSelector(
    (state: RootState) => state.interaction.SelectFilterByAll
  );
  const sortIncome = useSelector(
    (state: RootState) => state.interaction.selectFilterByIncome
  );

  const sortExpense = useSelector(
    (state: RootState) => state.interaction.selectFilterByExpense
  );

  const sortTransfer = useSelector(
    (state: RootState) => state.interaction.selectFilterByTransfer
  );

  const sortPending = useSelector(
    (state: RootState) => state.interaction.selectFilterByPending
  );

  const sortCleared = useSelector(
    (state: RootState) => state.interaction.selectFilterByCleared
  );

  const id = useSelector((state: RootState) => state.user.id);
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );
  const transaction = useSelector(
    (state: RootState) => state.interaction.isTransactionPopupVisible
  );

  const userTransaction = useSelector(
    (state: RootState) => state.usertransaction
  );
  console.log("User Transactions from Redux:", userTransaction);
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const actions: Record<string, () => void> = {
      all: () => getTransactions(),
      income: () => {
        console.log("Income selected");
        dispatch(setSelectFilterByIncome());

        dispatch(getTransactionsByType({ userId: id, type: "income" }));
      },
      expense: () => {
        console.log("Expense selected");
        dispatch(setSelectFilterByExpense());
        dispatch(getTransactionsByType({ userId: id, type: "expense" }));
      },
      transfer: () => {
        console.log("Transfer selected");
        dispatch(setSelectFilterByTransfer());
        dispatch(getTransactionsByType({ userId: id, type: "transfer" }));
      },
      pending: () => {
        console.log("Pending selected");
        dispatch(setSelectFilterByPending());
        dispatch(getTransactionsByStatus({ userId: id, status: "pending" }));
      },
      cleared: () => {
        console.log("Cleared selected");
        dispatch(setSelectFilterByCleared());
        dispatch(getTransactionsByStatus({ userId: id, status: "cleared" }));
      },
    };
    if (actions[value]) {
      actions[value]();
    }
  };
  const getTransactions = async () => {
    dispatch(setSelectFilterByAll());
    try {
      const response = await dispatch(getUserTransactions(id)).unwrap();
      const totalExpenses = response.reduce(
        (sum: number, t: UserTransactionState["transactions"][number]) => {
          return t.type?.toLowerCase() === "expense" ? sum + t.amount : sum;
        },
        0
      );

      const RemainingBalance = response.reduce(
        (balance: number, t: UserTransactionState["transactions"][number]) => {
          const type = t.type?.toLowerCase();
          const amount = typeof t.amount === "number" ? t.amount : 0;

          if (type === "income") {
            return balance + amount;
          }

          if (type === "expense") {
            return balance - amount;
          }
          return balance;
        },
        0
      );

      dispatch(setRemainingBalance(RemainingBalance));
      dispatch(setTotalExpense(totalExpenses));
      dispatch(setTransactions(response));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, navigate]);

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
      <div className="w-10/11 min-h-screen flex flex-col py-5 px-5 gap-y-5 mx-auto">
        <div className="overflow-hidden border-b-2 border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <Heading
              label="Transactions"
              className="text-lg sm:text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Take a look at what you've been purchasing lately!"
              className="text-sm sm:text-base main-website-text-color"
              variant="secondary"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-2 sm:gap-3 sm:pt-0">
            <Button
              type="button"
              label="Add"
              icon={<Plus className="inline-block" />}
              className="text-green-500 px-3 py-1 rounded-sm cursor-pointer font-semibold"
              onClick={() => dispatch(showTransactionPopup())}
            />
            <Heading
              label="Filter by:"
              className="text-sm sm:text-base main-website-text-color flex items-center"
            />
            <select
              className="text-white outline-none rounded-sm px-2 py-1 sm:py-2 text-sm sm:text-base"
              onChange={handleFilterChange}
            >
              <option value="all" className="text-black">
                All
              </option>
              <option value="income" className="text-black">
                Income
              </option>
              <option value="expense" className="text-black">
                Expense
              </option>
              <option value="transfer" className="text-black">
                Transfer
              </option>
              <option value="pending" className="text-black">
                Pending
              </option>
              <option value="cleared" className="text-black">
                Cleared
              </option>
            </select>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full overflow-x-auto">
            {userTransaction.loading && (
              <p className="flex justify-center items-center py-6">
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
                <p className="py-4">No transactions found for this user.</p>
              )}

            {!userTransaction.loading &&
              userTransaction.transactions.length > 0 && (
                <table className="w-full min-w-[720px] table-fixed text-sm sm:text-base">
                  <thead>
                    <tr className="bg-blue-900 text-gray-100 text-left border-1 border-gray-500">
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal align-top">
                        Transaction Name
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal align-top">
                        Amount
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal align-top">
                        Merchant
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal align-top">
                        Type
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal align-top">
                        Status
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-normal align-top">
                        Date Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortAll &&
                      [...userTransaction.transactions].reverse().map((t) => (
                        <tr
                          key={t._id || Math.random()}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-2 sm:px-4 py-2">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.amount}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.merchant}
                          </td>
                          <td
                            className={`border-y border-white px-2 sm:px-4 py-2 ${
                              t.type === "income"
                                ? "text-green-500"
                                : t.type === "expense"
                                ? "text-red-500"
                                : "text-blue-500"
                            }`}
                          >
                            {t.type}
                          </td>
                          <td
                            className={`border-y px-2 sm:px-4 border-white py-2 ${
                              t.status === "pending"
                                ? "text-yellow-200"
                                : t.status === "cleared"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {t.status}
                          </td>
                          <td className="border-y border-r px-2 sm:px-4 py-2">
                            {new Date(t.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    {sortIncome &&
                      !userTransaction.loading &&
                      userTransaction.transactionsByType &&
                      userTransaction.transactionsByType.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-2 sm:px-4 py-2">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.amount}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.merchant}
                          </td>
                          <td className="border-y border-white px-2 sm:px-4 py-2 text-green-500">
                            {t.type}
                          </td>
                          <td
                            className={`border-y px-2 sm:px-4 border-white py-2 ${
                              t.status === "pending"
                                ? "text-yellow-200"
                                : t.status === "cleared"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {t.status}
                          </td>
                          <td className="border-y border-r px-2 sm:px-4 py-2">
                            {new Date(t.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    {sortExpense &&
                      !userTransaction.loading &&
                      userTransaction.transactionsByType &&
                      userTransaction.transactionsByType.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-2 sm:px-4 py-2">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.amount}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.merchant}
                          </td>
                          <td className="border-y border-white px-2 sm:px-4 py-2 text-red-500">
                            {t.type}
                          </td>
                          <td
                            className={`border-y px-2 sm:px-4 border-white py-2 ${
                              t.status === "pending"
                                ? "text-yellow-200"
                                : t.status === "cleared"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {t.status}
                          </td>
                          <td className="border-y border-r px-2 sm:px-4 py-2">
                            {new Date(t.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    {sortTransfer &&
                      !userTransaction.loading &&
                      userTransaction.transactionsByType &&
                      userTransaction.transactionsByType.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-2 sm:px-4 py-2">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.amount}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.merchant}
                          </td>
                          <td className="border-y border-white px-2 sm:px-4 py-2 text-blue-500">
                            {t.type}
                          </td>
                          <td
                            className={`border-y px-2 sm:px-4 border-white py-2 ${
                              t.status === "pending"
                                ? "text-yellow-200"
                                : t.status === "cleared"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {t.status}
                          </td>
                          <td className="border-y border-r px-2 sm:px-4 py-2">
                            {new Date(t.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    {sortPending &&
                      !userTransaction.loading &&
                      userTransaction.transactionsByStatus &&
                      userTransaction.transactionsByStatus.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-2 sm:px-4 py-2">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.amount}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.merchant}
                          </td>
                          <td className={`border-y px-2 sm:px-4 py-2`}>
                            {t.type}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2 ">
                            <span className="text-yellow-200">{t.status}</span>
                          </td>
                          <td className="border-y border-r px-2 sm:px-4 py-2 ">
                            {new Date(t.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    {sortCleared &&
                      !userTransaction.loading &&
                      userTransaction.transactionsByStatus &&
                      userTransaction.transactionsByStatus.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-2 sm:px-4 py-2">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.amount}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2">
                            {t.merchant}
                          </td>
                          <td
                            className={`border-y px-2 sm:px-4 py-2 ${
                              t.type === "income"
                                ? "text-green-500"
                                : t.type === "expense"
                                ? "text-red-500"
                                : "text-blue-500"
                            }`}
                          >
                            {t.type}
                          </td>
                          <td className="border-y px-2 sm:px-4 py-2 ">
                            <span className="text-green-500">{t.status}</span>
                          </td>
                          <td className="border-y border-r px-2 sm:px-4 py-2 ">
                            {new Date(t.dateCreated)
                              .toLocaleDateString("en-PH", { month: "long" })
                              .toLowerCase()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
          </div>
        </div>
        {transaction && <TransactionCard />}
      </div>
    </div>
  );
};

export default Transactions;
