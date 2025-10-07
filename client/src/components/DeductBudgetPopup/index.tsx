import { useDispatch, useSelector } from "react-redux";
import { setIsDeductBudgetPopupVisible } from "../../modules/Interaction.ts";
import Button from "../Button/index.tsx";
import React from "react";
import { useAppDispatch } from "../../hooks/index.ts";
import { setAmountToDeduct } from "../../modules/Api/Budgets/addbudget.ts";
import { RootState } from "../../store.ts";
import { deductBudget } from "../../modules/Api/Budgets/displaybudget.ts";
import { toast } from "react-toastify";
const DeductBudgetPopup = () => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const deductedAmount = useSelector(
    (state: RootState) => state.deductAmount.amountToDeduct
  );
  const budgetId = useSelector(
    (state: RootState) => state.deductAmount.idToDeductFrom
  );
  console.log("Budget ID to deduct from:", budgetId);
  const handleClose = () => {
    dispatch(setIsDeductBudgetPopupVisible(false));
  };
  const handleBudgetAllocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await appDispatch(
      deductBudget({ budgetId: budgetId, amount: deductedAmount })
    ).unwrap();
    if (response) {
      dispatch(setIsDeductBudgetPopupVisible(false));
      appDispatch(setAmountToDeduct(0));
      toast.success("Amount deducted successfully!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto p-0">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 pt-6 flex flex-col gap-4 animate-fadeIn">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-2xl font-bold focus:outline-none"
            aria-label="Close"
            type="button"
            onClick={handleClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Allocate Amount
          </h2>
          <p className="mb-4 text-gray-500 dark:text-gray-300">
            Enter the amount you want to Deduct from this budget.
          </p>
          <form
            onSubmit={handleBudgetAllocationSubmit}
            className="flex flex-col gap-4"
          >
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-blue-400 transition-all outline-none"
              placeholder="0.00"
              onChange={(e) =>
                appDispatch(setAmountToDeduct(parseFloat(e.target.value)))
              }
              min={0}
            />
            <div className="flex gap-3 mt-2">
              <Button
                className="w-full bg-gray-200 dark:bg-gray-700 py-2 rounded-lg text-gray-700 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                label="Cancel"
                type="button"
                onClick={handleClose}
              />
              <Button
                className="w-full bg-blue-600 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                label="Allocate"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeductBudgetPopup;
