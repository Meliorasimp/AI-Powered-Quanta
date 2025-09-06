import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import "../../styles/index.css";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
import { showBudgetPopup } from "../../modules/Interaction.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store.ts";
import Budgetpopup from "../../components/Budgetpopup/index.tsx";

const Budgets = () => {
  const dispatch = useDispatch();
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  const isBudgetPopupVisible = useSelector(
    (state: RootState) => state.interaction.isBudgetPopupVisible
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
      <div className="w-10/11 h-screen flex flex-col py-5 px-5 gap-y-2 mx-auto">
        <div className="flex flex-row gap-x-10 border-b">
          <div className="overflow-hidden pb-2">
            <Heading
              label="Budgets"
              className="text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Curious where your money’s been going? Let’s take a look."
              variant="secondary"
            />
          </div>
          <div className="flex justify-center ml-auto">
            <Button
              label="Add Budget"
              onClick={() => dispatch(showBudgetPopup())}
              type="button"
              icon={<Plus className="inline-block" />}
              className="text-white px-3 rounded-sm cursor-pointer"
            />
          </div>
        </div>
        <div className="h-full w-full flex flex-col gap-y-5">
          <div className="statcard-purple p-4 rounded-lg">
            <h3 className="text-white font-semibold">Groceries</h3>
            <p className="text-sm text-gray-400">
              ₱3,000 budgeted • ₱2,450 spent
            </p>
            <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{ width: "82%" }}
              />
            </div>
          </div>
          <div className="statcard-purple p-4 rounded-lg shadow-[0_4px_10px_rgba(255,255,255,0.1)]">
            <h3 className="text-white font-semibold">Groceries</h3>
            <p className="text-sm text-gray-400">
              ₱3,000 budgeted • ₱2,450 spent
            </p>
            <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{ width: "82%" }}
              />
            </div>
          </div>
        </div>
        {isBudgetPopupVisible && <Budgetpopup />}
      </div>
    </div>
  );
};

export default Budgets;
