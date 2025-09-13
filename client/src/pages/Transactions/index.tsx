import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
import { ArrowBigDown } from "lucide-react";
import { showTransactionPopup } from "../../modules/Interaction.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import TransactionCard from "../../components/transactionpopup";
import {
  getUserTransactions,
  setTransactions,
} from "../../modules/Api/transaction/displaytransaction.ts";
import { useEffect } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSProperties } from "react";
import "../../styles/index.css";
import { UserTransactionState } from "../../modules/Api/transaction/displaytransaction.ts";
import {
  setTotalExpense,
  setRemainingBalance,
} from "../../modules/Interaction.ts/dashboard/index.ts";
import { useNavigate } from "react-router-dom";

const Transactions = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await dispatch(getUserTransactions(id)).unwrap();
        const totalExpenses = response.reduce(
          (sum: number, t: UserTransactionState["transactions"][number]) => {
            return t.type?.toLowerCase() === "expense" ? sum + t.amount : sum;
          },
          0
        );

        const RemainingBalance = response.reduce(
          (
            balance: number,
            t: UserTransactionState["transactions"][number]
          ) => {
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
    getTransactions();
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
            <Button
              label="Filter by: All"
              type="button"
              icon={<ArrowBigDown className="inline-block" />}
              className="text-white px-3 py-1 rounded-sm cursor-pointer font-semibold"
            />
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
                    {userTransaction.transactions
                      .filter(
                        (t) =>
                          t &&
                          t.dateCreated &&
                          !isNaN(new Date(t.dateCreated).getTime())
                      )
                      .map((t) => (
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
