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
import { setTotalExpense } from "../../modules/Interaction.ts/dashboard/index.ts";
import { setSelectFilterByAll } from "../../modules/Interaction.ts";
import { useNavigate } from "react-router-dom";
import AiModal from "../../components/AiModal";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const aiModal = useSelector(
    (state: RootState) => state.dashboard.isAiPopupVisible
  );
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
      <div className="w-10/11 min-h-screen flex flex-col py-6 px-4 sm:px-6 gap-y-6 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
              <Heading
                label="Transactions"
                className="text-xl sm:text-2xl font-semibold tracking-tight drop-shadow-sm"
              />
              <Paragraph
                label="Monitor and analyze your financial activity in real-time."
                className="text-xs sm:text-sm opacity-80"
                variant="secondary"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                label="Add Transaction"
                icon={<Plus className="inline-block w-4 h-4" />}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-md cursor-pointer font-medium shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150 border border-white/10"
                onClick={() => dispatch(showTransactionPopup())}
              />
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="opacity-80">Filter:</span>
                <select
                  className="bg-white/5 border border-white/10 focus:border-white/30 transition-colors rounded-md px-2 py-2 text-xs sm:text-sm outline-none backdrop-blur-sm"
                  onChange={handleFilterChange}
                  defaultValue={sortAll ? "all" : undefined}
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
          </div>
          <div className="table-container-card relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600 opacity-70" />
            <div className="w-full overflow-x-auto rounded-b-xl">
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
                  <div className="empty-state-box">
                    <p className="font-medium mb-1">No transactions found</p>
                    <p className="text-xs opacity-70 mb-3">
                      Start by adding your first transaction.
                    </p>
                    <Button
                      type="button"
                      label="Add Transaction"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-md cursor-pointer font-medium shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150"
                      onClick={() => dispatch(showTransactionPopup())}
                    />
                  </div>
                )}

              {!userTransaction.loading &&
                userTransaction.transactions.length > 0 && (
                  <table className="w-full min-w-[760px] text-sm sm:text-[15px]">
                    <thead>
                      <tr className="table-header-gradient text-gray-100 text-left">
                        <th className="pl-4 pr-2 py-3 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
                          Name
                        </th>
                        <th className="px-2 py-3 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
                          Amount
                        </th>
                        <th className="px-2 py-3 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
                          Merchant
                        </th>
                        <th className="px-2 py-3 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
                          Type
                        </th>
                        <th className="px-2 py-3 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-2 py-3 text-[11px] sm:text-xs font-medium uppercase tracking-wide">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {sortAll &&
                        [...userTransaction.transactions].reverse().map((t) => (
                          <tr
                            key={t._id || Math.random()}
                            className="row-hover-surface group"
                          >
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap font-medium">
                              {t.transactionName}
                            </td>
                            <td className="px-2 py-3 tabular-nums">
                              <span className="font-semibold ${t.type === 'expense' ? 'text-red-400' : t.type === 'income' ? 'text-green-400' : 'text-blue-400'}">
                                {t.amount}
                              </span>
                            </td>
                            <td
                              className="px-2 py-3 max-w-[160px] truncate"
                              title={t.merchant}
                            >
                              {t.merchant}
                            </td>
                            <td className="px-2 py-3">
                              <span
                                className={`badge ${
                                  t.type === "income"
                                    ? "badge-income"
                                    : t.type === "expense"
                                    ? "badge-expense"
                                    : "badge-transfer"
                                }`}
                              >
                                {t.type}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span
                                className={`badge ${
                                  t.status === "pending"
                                    ? "badge-pending"
                                    : t.status === "cleared"
                                    ? "badge-cleared"
                                    : "badge-expense"
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-[11px] sm:text-xs opacity-80">
                              {new Date(t.dateCreated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      {sortIncome &&
                        !userTransaction.loading &&
                        userTransaction.transactionsByType &&
                        userTransaction.transactionsByType.map((t) => (
                          <tr key={t._id} className="row-hover-surface group">
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap font-medium">
                              {t.transactionName}
                            </td>
                            <td className="px-2 py-3 tabular-nums">
                              <span className="font-semibold text-green-400">
                                {t.amount}
                              </span>
                            </td>
                            <td
                              className="px-2 py-3 max-w-[160px] truncate"
                              title={t.merchant}
                            >
                              {t.merchant}
                            </td>
                            <td className="px-2 py-3">
                              <span className="badge badge-income">
                                {t.type}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span
                                className={`badge ${
                                  t.status === "pending"
                                    ? "badge-pending"
                                    : t.status === "cleared"
                                    ? "badge-cleared"
                                    : "badge-expense"
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-[11px] sm:text-xs opacity-80">
                              {new Date(t.dateCreated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      {sortExpense &&
                        !userTransaction.loading &&
                        userTransaction.transactionsByType &&
                        userTransaction.transactionsByType.map((t) => (
                          <tr key={t._id} className="row-hover-surface group">
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap font-medium">
                              {t.transactionName}
                            </td>
                            <td className="px-2 py-3 tabular-nums">
                              <span className="font-semibold text-red-400">
                                {t.amount}
                              </span>
                            </td>
                            <td
                              className="px-2 py-3 max-w-[160px] truncate"
                              title={t.merchant}
                            >
                              {t.merchant}
                            </td>
                            <td className="px-2 py-3">
                              <span className="badge badge-expense">
                                {t.type}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span
                                className={`badge ${
                                  t.status === "pending"
                                    ? "badge-pending"
                                    : t.status === "cleared"
                                    ? "badge-cleared"
                                    : "badge-expense"
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-[11px] sm:text-xs opacity-80">
                              {new Date(t.dateCreated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      {sortTransfer &&
                        !userTransaction.loading &&
                        userTransaction.transactionsByType &&
                        userTransaction.transactionsByType.map((t) => (
                          <tr key={t._id} className="row-hover-surface group">
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap font-medium">
                              {t.transactionName}
                            </td>
                            <td className="px-2 py-3 tabular-nums">
                              <span className="font-semibold text-blue-400">
                                {t.amount}
                              </span>
                            </td>
                            <td
                              className="px-2 py-3 max-w-[160px] truncate"
                              title={t.merchant}
                            >
                              {t.merchant}
                            </td>
                            <td className="px-2 py-3">
                              <span className="badge badge-transfer">
                                {t.type}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span
                                className={`badge ${
                                  t.status === "pending"
                                    ? "badge-pending"
                                    : t.status === "cleared"
                                    ? "badge-cleared"
                                    : "badge-expense"
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-[11px] sm:text-xs opacity-80">
                              {new Date(t.dateCreated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      {sortPending &&
                        !userTransaction.loading &&
                        userTransaction.transactionsByStatus &&
                        userTransaction.transactionsByStatus.map((t) => (
                          <tr key={t._id} className="row-hover-surface group">
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap font-medium">
                              {t.transactionName}
                            </td>
                            <td className="px-2 py-3 tabular-nums">
                              <span className="font-semibold">{t.amount}</span>
                            </td>
                            <td
                              className="px-2 py-3 max-w-[160px] truncate"
                              title={t.merchant}
                            >
                              {t.merchant}
                            </td>
                            <td className="px-2 py-3">
                              <span className="badge badge-transfer">
                                {t.type}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span className="badge badge-pending">
                                {t.status}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-[11px] sm:text-xs opacity-80">
                              {new Date(t.dateCreated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      {sortCleared &&
                        !userTransaction.loading &&
                        userTransaction.transactionsByStatus &&
                        userTransaction.transactionsByStatus.map((t) => (
                          <tr key={t._id} className="row-hover-surface group">
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap font-medium">
                              {t.transactionName}
                            </td>
                            <td className="px-2 py-3 tabular-nums">
                              <span
                                className={`${
                                  t.type === "expense"
                                    ? "text-red-400"
                                    : t.type === "income"
                                    ? "text-green-400"
                                    : "text-blue-400"
                                } font-semibold`}
                              >
                                {t.amount}
                              </span>
                            </td>
                            <td
                              className="px-2 py-3 max-w-[160px] truncate"
                              title={t.merchant}
                            >
                              {t.merchant}
                            </td>
                            <td className="px-2 py-3">
                              <span
                                className={`badge ${
                                  t.type === "income"
                                    ? "badge-income"
                                    : t.type === "expense"
                                    ? "badge-expense"
                                    : "badge-transfer"
                                }`}
                              >
                                {t.type}
                              </span>
                            </td>
                            <td className="px-2 py-3">
                              <span className="badge badge-cleared">
                                {t.status}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-[11px] sm:text-xs opacity-80">
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
        </div>
        {transaction && <TransactionCard />}
        {aiModal && <AiModal />}
      </div>
    </div>
  );
};

export default Transactions;
