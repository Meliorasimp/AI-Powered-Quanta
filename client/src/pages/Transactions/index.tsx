import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Tabledata from "../../components/Text/Tabledata";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
import { ArrowBigDown } from "lucide-react";
import { showTransactionPopup } from "../../modules/Interaction.ts";
import { useDispatch } from "react-redux";
import TransactionCard from "../../components/transactionpopup";

const Transactions = () => {
  const dispatch = useDispatch();
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );
  const transaction = useSelector(
    (state: RootState) => state.interaction.isTransactionPopupVisible
  );
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
          <div className="flex flex-row">
            <Button
              label="Add Transaction"
              type="button"
              icon={<Plus className="inline-block" />}
              className="text-white px-3 rounded-sm cursor-pointer font-semibold"
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-gray-800 text-sm border-b-1 border-r-1 border-l-2 border-gray-500">
                  {/* Placeholder data */}
                  <Tabledata
                    className="px-4 py-2 align-top text-gray-200"
                    transactionname="Test name"
                    amount="1000"
                    merchant="Netflix"
                    type="Expense"
                    status="Completed"
                    date="12-08-2025"
                  />
                </tr>
                <tr className="text-gray-800 text-sm border-b-1 border-r-1 border-l-2 border-gray-500">
                  {/* Placeholder data */}
                  <Tabledata
                    className="px-4 py-2 align-top text-gray-200"
                    transactionname="Test name 2"
                    amount="1000"
                    merchant="Netflix"
                    type="Expense"
                    status="Completed"
                    date="12-08-2025"
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {transaction && <TransactionCard />}
      </div>
    </div>
  );
};

export default Transactions;
