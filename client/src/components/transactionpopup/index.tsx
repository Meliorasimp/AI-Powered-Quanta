import Heading from "../Text/Heading";
import { hideTransactionPopup } from "../../modules/Interaction.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import { FaMoneyBillAlt } from "react-icons/fa";
import { BanknoteArrowDown, Check, Ellipsis, Rotate3d, X } from "lucide-react";
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
import { addTransaction } from "../../modules/Api/transaction/displaytransaction.ts";
import { useEffect, useRef } from "react";

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

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

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
        dispatch(addTransaction(response));
        dispatch(hideTransactionPopup());
        dispatch(resetTransaction());
      }
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-dialog-title"
      onClick={() => dispatch(hideTransactionPopup())}
      onKeyDown={(e) => e.key === "Escape" && dispatch(hideTransactionPopup())}
    >
      <div
        className="relative w-full max-w-3xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#111827] border border-gray-700/70 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.25s_ease]">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-fuchsia-600/10 border-b border-gray-700/60">
            <div>
              <Heading
                id="transaction-dialog-title"
                label="Create a New Transaction"
                className="text-xl sm:text-2xl font-semibold tracking-wide"
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Track a new transaction to manage your finances.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close dialog"
              className="text-gray-400 hover:text-gray-200 transition-colors rounded-md p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={() => dispatch(hideTransactionPopup())}
            >
              <X size={20} />
            </button>
          </div>
          {/* Form */}
          <form
            onSubmit={handleTransactionSubmit}
            className="px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Left side form fields */}
            <div className="md:col-span-7 flex flex-col gap-5">
              {/* Transaction Name */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="transaction-name"
                  className="text-sm font-medium text-gray-300"
                >
                  Transaction Name
                </label>
                <input
                  ref={firstInputRef}
                  id="transaction-name"
                  type="text"
                  value={transactionName}
                  onChange={(e) => dispatch(setTransactionName(e.target.value))}
                  placeholder="e.g. Grocery Shopping"
                  className="w-full rounded-md bg-gray-800/70 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              {/* Merchant & Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="merchant"
                    className="text-sm font-medium text-gray-300"
                  >
                    Merchant
                  </label>
                  <input
                    id="merchant"
                    type="text"
                    value={merchant}
                    onChange={(e) => dispatch(setMerchant(e.target.value))}
                    placeholder="Store / Payee"
                    className="w-full rounded-md bg-gray-800/70 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium text-gray-300"
                  >
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                      $
                    </span>
                    <input
                      id="amount"
                      type="number"
                      step={0.01}
                      min={0}
                      value={amount || ""}
                      placeholder="0.00"
                      onChange={(e) =>
                        dispatch(
                          setTransactionAmount(parseFloat(e.target.value) || 0)
                        )
                      }
                      className="w-full rounded-md bg-gray-800/70 border border-gray-600 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Type Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-300">Type</span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch(setType("income"))}
                    className={`group flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                      type === "income"
                        ? "border-green-400/60 bg-green-600/20 text-green-200 shadow-inner"
                        : "border-gray-600 bg-gray-800/60 text-gray-300 hover:border-green-500/60 hover:text-green-200"
                    }`}
                  >
                    <FaMoneyBillAlt className="text-green-300" /> Income
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setType("expense"))}
                    className={`group flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                      type === "expense"
                        ? "border-red-400/60 bg-red-600/20 text-red-200 shadow-inner"
                        : "border-gray-600 bg-gray-800/60 text-gray-300 hover:border-red-500/60 hover:text-red-200"
                    }`}
                  >
                    <BanknoteArrowDown className="text-red-300" /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setType("transfer"))}
                    className={`group flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                      type === "transfer"
                        ? "border-blue-400/60 bg-blue-600/20 text-blue-200 shadow-inner"
                        : "border-gray-600 bg-gray-800/60 text-gray-300 hover:border-blue-500/60 hover:text-blue-200"
                    }`}
                  >
                    <Rotate3d className="text-blue-300" /> Transfer
                  </button>
                </div>
              </div>
              {/* Status Selection */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-300">
                  Status
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch(setStatus("pending"))}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                      status === "pending"
                        ? "border-yellow-400/60 bg-yellow-600/20 text-yellow-200 shadow-inner"
                        : "border-gray-600 bg-gray-800/60 text-gray-300 hover:border-yellow-500/60 hover:text-yellow-200"
                    }`}
                  >
                    <Ellipsis size={16} /> Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setStatus("cleared"))}
                    className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs sm:text-sm font-medium transition-all ${
                      status === "cleared"
                        ? "border-green-400/60 bg-green-600/20 text-green-200 shadow-inner"
                        : "border-gray-600 bg-gray-800/60 text-gray-300 hover:border-green-500/60 hover:text-green-200"
                    }`}
                  >
                    <Check size={16} /> Cleared
                  </button>
                </div>
              </div>
            </div>
            {/* Right side summary / helper panel */}
            <aside className="md:col-span-5 flex flex-col gap-5 bg-gray-800/40 border border-gray-700/60 rounded-xl p-5">
              <Heading
                label="Quick Summary"
                className="text-base font-semibold tracking-wide"
              />
              <div className="text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-medium text-gray-200 truncate max-w-[55%] text-right">
                    {transactionName || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Merchant:</span>
                  <span className="font-medium text-gray-200 truncate max-w-[55%] text-right">
                    {merchant || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="font-medium text-gray-200">
                    {amount ? `$${amount.toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="font-medium capitalize text-gray-200">
                    {type || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-medium capitalize text-gray-200">
                    {status || "—"}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white text-sm font-medium py-2.5 shadow hover:from-indigo-500 hover:via-purple-500 hover:to-fuchsia-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!transactionName || !amount}
                >
                  Save Transaction
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(hideTransactionPopup())}
                  className="w-full inline-flex items-center justify-center rounded-md border border-gray-600 text-gray-300 text-sm font-medium py-2 hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
