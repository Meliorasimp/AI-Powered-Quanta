import { hideBudgetPopup } from "../../modules/Interaction.ts";
import { RootState } from "../../store.ts";
import { useSelector } from "react-redux";
import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph/index.tsx";
import Button from "../Button/index.tsx";
import {
  setDescription,
  setAmount,
  setCategory,
} from "../../modules/Api/Budgets/addbudget.ts";
import { addBudget } from "../../modules/Api/Budgets/addbudget.ts";
import { addBudget as addBudgetFromStore } from "../../modules/Api/Budgets/displaybudget.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import { toast } from "react-toastify";

const Budgetpopup = () => {
  const dispatch = useAppDispatch();
  const { description, amount, category } = useSelector(
    (state: RootState) => state.budget
  );
  console.log("Selected category:", category);
  const isBudgetPopupVisible = useSelector(
    (state: RootState) => state.interaction.isBudgetPopupVisible
  );

  const userId = useSelector((state: RootState) => state.user.id);
  if (!isBudgetPopupVisible) return null;

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() === "" || amount <= 0) {
      toast.error("Please provide a valid description and amount.");
      return;
    }

    try {
      await dispatch(
        addBudget({
          description,
          amount,
          category,
          id: userId,
          dateCreated: new Date().toISOString(),
        })
      ).unwrap();
      dispatch(hideBudgetPopup());
      dispatch(
        addBudgetFromStore({
          description,
          amount,
          category,
          dateCreated: new Date().toISOString(),
        })
      );
      toast.success("Budget added successfully!");
    } catch (error) {
      console.error("Failed to add budget:", error);
      toast.error("Failed to add budget. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-auto p-0">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 pt-6 flex flex-col gap-4 animate-fadeIn">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors text-2xl font-bold focus:outline-none"
            aria-label="Close"
            type="button"
            onClick={() => dispatch(hideBudgetPopup())}
          >
            &times;
          </button>
          <Heading
            label="Add Budget"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
          />
          <Paragraph
            label="Create a new budget to manage your expenses."
            variant="secondary"
            className="mb-4 text-gray-500 dark:text-gray-300"
          />
          <form onSubmit={handleBudgetSubmit} className="flex flex-col gap-4">
            <div>
              <Paragraph
                label="Budget Name"
                variant="tertiary"
                className="mb-1 text-gray-700 dark:text-gray-200"
              />
              <input
                type="text"
                value={description}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-blue-400 transition-all outline-none"
                placeholder="e.g., Groceries"
                onChange={(e) => dispatch(setDescription(e.target.value))}
                autoFocus
              />
            </div>
            <div>
              <Paragraph
                label="Starting Amount"
                variant="tertiary"
                className="mb-1 text-gray-700 dark:text-gray-200"
              />
              <input
                type="number"
                value={amount}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-blue-400 transition-all outline-none"
                step={0.01}
                placeholder="0.00"
                onChange={(e) =>
                  dispatch(setAmount(parseFloat(e.target.value)))
                }
                min={0}
              />
              <Paragraph
                label="Category"
                variant="tertiary"
                className="mb-1 text-gray-700 dark:text-gray-200"
              />
              <select
                name="category"
                id="category"
                value={category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-blue-400 transition-all outline-none"
              >
                <option value="Housing">Housing</option>
                <option value="Food and Groceries">Food and Groceries</option>
                <option value="Travel">Travel</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Debt Repayment">Debt Repayment</option>
                <option value="Pets">Pets</option>
              </select>
            </div>
            <Button
              label="Create Budget"
              className="mt-2 w-full bg-blue-600 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              type="submit"
            />
            <Button
              label="Cancel"
              className="w-full bg-gray-200 dark:bg-gray-700 py-2 rounded-lg text-gray-700 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
              type="button"
              onClick={() => dispatch(hideBudgetPopup())}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Budgetpopup;
