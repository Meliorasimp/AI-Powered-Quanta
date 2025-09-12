import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph/index.tsx";
import { hideTransactionPopup } from "../../modules/Interaction.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import Button from "../Button/index.tsx";
import { FaMoneyBillAlt } from "react-icons/fa";
import { BanknoteArrowDown, Check, Ellipsis, Rotate3d } from "lucide-react";
import {
  setTransactionName,
  setTransactionAmount,
  setMerchant,
  setType,
  setStatus,
  resetTransaction,
} from "../../modules/Api/transaction/addtransaction.ts";
import { RootState } from "../../store.ts";
import { useSelector } from "react-redux";
import { submitTransaction } from "../../modules/Api/transaction/addtransaction.ts";
import { toast } from "react-toastify";

const TransactionCard = () => {
  const dispatch = useAppDispatch();
  const id = useSelector((state: RootState) => state.user.id);
  const transactionName = useSelector(
    (state: RootState) => state.transaction.transactionName
  );
  const amount = useSelector((state: RootState) => state.transaction.amount);
  const merchant = useSelector(
    (state: RootState) => state.transaction.merchant
  );
  const type = useSelector((state: RootState) => state.transaction.type);
  const status = useSelector((state: RootState) => state.transaction.status);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        submitTransaction({
          userId: id,
          transactionName,
          amount,
          merchant,
          type,
          status,
        })
      ).unwrap();
      if (response) {
        toast.success("Transaction submitted successfully!");
        dispatch(hideTransactionPopup());
        dispatch(resetTransaction());
      }
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                bg-black/50 backdrop-blur-xs z-50 h-full w-full"
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
              <form onSubmit={handleTransactionSubmit}>
                <Paragraph label="Transaction Name" variant="secondary" />
                <input
                  type="text"
                  className="p-2 rounded bg-gray-300 mt-2 mb-2 w-full text-black"
                  value={transactionName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(setTransactionName(e.target.value))
                  }
                />
                <Paragraph label="Amount" variant="secondary" />
                <input
                  type="number"
                  className="p-2 rounded bg-gray-300 mt-2 mb-2 w-full text-black"
                  step={0.01}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setTransactionAmount(parseFloat(e.target.value)));
                  }}
                />
                <Paragraph label="Merchant" variant="secondary" />
                <input
                  type="text"
                  className="p-2 rounded bg-gray-300 mt-2 mb-2 w-full text-black"
                  value={merchant}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(setMerchant(e.target.value))
                  }
                />
                <Paragraph label="Type" variant="secondary" />
                <div className="flex flex-row justify-between mt-2 mb-2">
                  <Button
                    label="Income"
                    type="button"
                    icon={<FaMoneyBillAlt className="inline-block" />}
                    className={`px-4 py-2 rounded-lg cursor-pointer border-2 border-gray-600 ${
                      type === "income"
                        ? "bg-green-700 text-white border-green-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                    onClick={() => dispatch(setType("income"))}
                    isClicked={type === "income"}
                  />
                  <Button
                    label="Expense"
                    type="button"
                    icon={<BanknoteArrowDown className="inline-block" />}
                    className={`px-4 py-2 rounded-lg cursor-pointer border-2 border-gray-600  ${
                      type === "expense"
                        ? "bg-red-700 text-white border-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                    onClick={() => dispatch(setType("expense"))}
                    isClicked={type === "expense"}
                  />
                  <Button
                    label="Transfer"
                    type="button"
                    icon={<Rotate3d className="inline-block" />}
                    className={`px-4 py-2 rounded-lg cursor-pointer border-2 border-gray-600 ${
                      type === "transfer"
                        ? "bg-blue-700 text-white border-green-600"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    onClick={() => dispatch(setType("transfer"))}
                    isClicked={type === "transfer"}
                  />
                </div>
                <Paragraph label="Status" variant="secondary" />
                <div className="flex flex-row justify-between mt-2 mb-2 gap-x-10">
                  <Button
                    label="Pending"
                    type="button"
                    icon={<Ellipsis className="inline-block" />}
                    className={`bg-gray-500 text-white px-6 py-2 rounded-lg cursor-pointer w-1/2 ${
                      status === "pending" ? "bg-yellow-500" : ""
                    }`}
                    onClick={() => dispatch(setStatus("pending"))}
                    isClicked={status === "pending"}
                  />
                  <Button
                    label="Cleared"
                    type="button"
                    icon={<Check className="inline-block" />}
                    className={`bg-gray-500 text-white px-6 py-2 rounded-lg cursor-pointer w-1/2 ${
                      status === "cleared" ? "bg-green-500" : ""
                    }`}
                    onClick={() => dispatch(setStatus("cleared"))}
                  />
                </div>
                <div className="flex flex-col justify-between mt-4 gap-y-4">
                  <Button
                    label="Create Transaction"
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 w-full"
                  />
                  <Button
                    label="Cancel"
                    type="button"
                    className="bg-red-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-red-600 w-full"
                    onClick={() => dispatch(hideTransactionPopup())}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
