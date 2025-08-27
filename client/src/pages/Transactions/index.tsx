import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Tabledata from "../../components/Text/Tabledata";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Transactions = () => {
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  return (
    <div
      className={`flex flex-row app ${
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
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-5">
        <div className="overflow-hidden border-b-2 border-gray-200 pb-2">
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
        <div className="h-full w-full flex flex-row">
          <div className=" h-full">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-blue-900 text-gray-100 text-left border-1 border-gray-500 ">
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Transaction ID
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
                    Payment card
                  </th>
                  <th className="px-4 py-2 text-sm font-normal align-top">
                    Card Suffix
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
                    transactionid="123456789"
                    amount="1000"
                    merchant="Netflix"
                    type="Expense"
                    paymentcard="Debit Card"
                    cardsuffix="1234"
                    status="Completed"
                    date="12-08-2025"
                  />
                </tr>
                <tr className="text-gray-800 text-sm border-b-1 border-r-1 border-l-2 border-gray-500">
                  {/* Placeholder data */}
                  <Tabledata
                    className="px-4 py-2 align-top text-gray-200"
                    transactionid="987654321"
                    amount="1000"
                    merchant="Netflix"
                    type="Expense"
                    paymentcard="Debit Card"
                    cardsuffix="1234"
                    status="Completed"
                    date="12-08-2025"
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
