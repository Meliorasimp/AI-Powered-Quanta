import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph/index.tsx";
import { hideTransactionPopup } from "../../modules/Interaction.ts";
import { useDispatch } from "react-redux";
import Button from "../Button/index.tsx";

const TransactionCard = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                bg-black/50 backdrop-blur-xs z-50 h-full w-full"
      onClick={() => dispatch(hideTransactionPopup())}
    >
      <div className="text-white">
        <div className="bg-gray-900 flex flex-col justify-center rounded-2xl items-center">
          <div className="w-full h-full p-10">
            <Heading
              label="Create a new Transaction"
              className="text-2xl font-semibold"
            />
            <Paragraph
              label="Track a new transaction to manage your personal finances."
              variant="secondary"
            />
            <div className="mt-5">
              <form>
                <Paragraph label="Transaction Name" variant="secondary" />
                <input
                  type="text"
                  className="p-2 rounded bg-gray-300 mt-2 mb-2 w-full text-black"
                />
                <Paragraph label="Amount" variant="secondary" />
                <input
                  type="number"
                  className="p-2 rounded bg-gray-300 mt-2 mb-2 w-full text-black"
                  step={0.01}
                  placeholder="0.00"
                />
                <Paragraph label="Merchant" variant="secondary" />
                <input
                  type="text"
                  className="p-2 rounded bg-gray-300 mt-2 mb-2 w-full text-black"
                />
                <Paragraph label="Type" variant="secondary" />
                <div className="flex flex-row justify-between mt-2">
                  <Button
                    label="Income"
                    type="button"
                    className="bg-green-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-600"
                  />
                  <Button
                    label="Expense"
                    type="button"
                    className="bg-red-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-red-600"
                  />
                  <Button
                    label="Transfer"
                    type="button"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
                  />
                </div>
                <Paragraph label="Status" variant="secondary" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
