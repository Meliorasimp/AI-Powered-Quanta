import { hideBudgetPopup } from "../../modules/Interaction.ts";
import { RootState } from "../../store.ts";
import { useSelector } from "react-redux";
import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph/index.tsx";
import Button from "../Button/index.tsx";
import {
  setDescription,
  setAmount,
} from "../../modules/Api/Budgets/addbudget.ts";
import { addBudget } from "../../modules/Api/Budgets/addbudget.ts";
import { addBudget as addBudgetFromStore } from "../../modules/Api/Budgets/displaybudget.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import { toast } from "react-toastify";

const Budgetpopup = () => {
  const dispatch = useAppDispatch();
  const { description, amount } = useSelector(
    (state: RootState) => state.budget
  );
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
          id: userId,
          dateCreated: new Date().toISOString(),
        })
      ).unwrap();
      dispatch(hideBudgetPopup());
      dispatch(
        addBudgetFromStore({
          description,
          amount,
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
    <div
      className="fixed inset-0 flex items-center justify-center 
                bg-black/50 backdrop-blur-xs z-50 h-full w-full"
    >
      <div className="text-white">
        <div className="bg-gray-900 flex flex-col justify-center rounded-2xl items-center">
          <div className="w-full h-full p-10">
            <Heading label="Add Budget" className="text-2xl font-semibold" />
            <Paragraph
              label="Create a new budget to manage your expenses."
              variant="secondary"
            />
            <div className="mt-5">
              <form onSubmit={handleBudgetSubmit}>
                <Paragraph label="Description" variant="tertiary" />
                <input
                  type="text"
                  value={description}
                  className="w-full bg-gray-300 p-2 my-2 rounded-lg text-black"
                  placeholder="e.g., Groceries"
                  onChange={(e) => dispatch(setDescription(e.target.value))}
                />
                <Paragraph label="Amount" variant="tertiary" />
                <input
                  type="number"
                  value={amount}
                  className="w-full bg-gray-300 p-2 my-2 rounded-lg text-black"
                  step={0.01}
                  placeholder="0.00"
                  onChange={(e) =>
                    dispatch(setAmount(parseFloat(e.target.value)))
                  }
                />
                <Button
                  label="Create Budget"
                  className="mt-7 w-full bg-gray-500 py-2 rounded-lg text-white font-semibold hover:bg-gray-400 cursor-pointer transition-colors duration-300"
                  type="submit"
                />
                <Button
                  label="Cancel Creation"
                  className="mt-7 w-full bg-red-500 py-2 rounded-lg text-white font-semibold hover:bg-red-400 cursor-pointer transition-colors duration-300"
                  type="button"
                  onClick={() => dispatch(hideBudgetPopup())}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgetpopup;
