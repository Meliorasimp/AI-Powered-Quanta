import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
import { ArrowBigDown } from "lucide-react";
import { showTransactionPopup } from "../../modules/Interaction.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import TransactionCard from "../../components/transactionpopup";
import {
  addTransaction,
  getUserTransactions,
} from "../../modules/Api/transaction/displaytransaction.ts";
import { useEffect } from "react";
import MoonLoader from "react-spinners/MoonLoader";
import { CSSProperties } from "react";
import "../../styles/index.css";
import { UserTransactionState } from "../../modules/Api/transaction/displaytransaction.ts";

const Transactions = () => {
  const dispatch = useAppDispatch();
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
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await dispatch(getUserTransactions(id)).unwrap();
        console.log("Fetched transactions:", response);
        const totalExpenses = response.reduce(
          (sum: number, t: UserTransactionState["transactions"][number]) => {
            return t.type?.toLowerCase() === "expense" ? sum + t.amount : sum;
          },
          0
        );
        console.log("Total Expenses:", totalExpenses);
        dispatch(addTransaction(response));
      } catch (error) {
        console.error(error);
      }
    };
    getTransactions();
  }, [dispatch, id]);

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
      <div className="w-10/11 h-screen flex flex-col py-5 px-5 gap-y-5 mx-auto">
        <div className="overflow-hidden border-b-2 border-gray-200 pb-2 flex items-center justify-between">
          <div>
            <Heading
              label="Transactions"
              className="text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Take a look at what you've been purchasing lately!"
              className="text-base main-website-text-color"
              variant="secondary"
            />
          </div>
          <div className="flex flex-row pt-3">
            <Button
              type="button"
              label="Add"
              icon={<Plus className="inline-block" />}
              className="text-green-500 px-3 rounded-sm cursor-pointer font-semibold"
              onClick={() => dispatch(showTransactionPopup())}
            />
            <Button
              label="Filter by: All"
              type="button"
              icon={<ArrowBigDown className="inline-block" />}
              className="text-white px-3 rounded-sm cursor-pointer font-semibold"
            />
          </div>
        </div>
        <div className="h-full w-full flex flex-row">
          <div className=" h-full">
            <table className="w-full table-fixed">
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
                  <React.Fragment>
                    <thead>
                      <tr className="bg-blue-900 text-gray-100 text-left border-1 border-gray-500 ">
                        <th className="px-4 py-2 text-sm font-normal align-top">
                          Transaction Name
                        </th>
                        <th className="px-4 py-2 text-sm font-normal align-top">
                          Amount
                        </th>
                        <th className="px-4 py-2 text-sm font-normal align-top">
                          Merchant
                        </th>
                        <th className="px-4 py-2 text-sm font-normal align-top">
                          Type
                        </th>
                        <th className="px-4 py-2 text-sm font-normal align-top">
                          Status
                        </th>
                        <th className="px-4 py-2 text-sm font-normal align-top">
                          Date Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransaction.transactions.map((t) => (
                        <tr
                          key={t._id}
                          className="hover:bg-white hover:text-black"
                        >
                          <td className="border-y border-l px-4 py-2 ">
                            {t.transactionName}
                          </td>
                          <td className="border-y px-4 py-2">{t.amount}</td>
                          <td className="border-y px-4 py-2">{t.merchant}</td>
                          <td className="border-y px-4 py-2">{t.type}</td>
                          <td className="border-y px-4 py-2">{t.status}</td>
                          <td className="border-y border-r px-4 py-2">
                            {new Date(t.dateCreated).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </React.Fragment>
                )}

              {/*<thead>
                <tr className="bg-blue-900 text-gray-100 text-left border-1 border-gray-500 ">
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Transaction Name
                  </th>
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Merchant
                  </th>
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Type
                  </th>
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Status
                  </th>
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Date Created
                  </th>
                </tr>
              </thead>*/}
            </table>
          </div>
        </div>
        {transaction && <TransactionCard />}
      </div>
    </div>
  );
};

export default Transactions;
