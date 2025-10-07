import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import "../../styles/index.css";
import Button from "../../components/Button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { showBudgetPopup } from "../../modules/Interaction.ts";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store.ts";
import Budgetpopup from "../../components/Budgetpopup/index.tsx";
import {
  fetchUserBudgets,
  setBudgets,
} from "../../modules/Api/Budgets/displaybudget.ts";
import { useEffect, CSSProperties } from "react";
import { useAppDispatch } from "../../hooks/index.ts";
import { MoonLoader } from "react-spinners";
import {
  deleteUserBudget,
  deleteBudget,
} from "../../modules/Api/Budgets/displaybudget.ts";
import AiModal from "../../components/AiModal/index.tsx";
import { setIsDeductBudgetPopupVisible } from "../../modules/Interaction.ts";
import DeductBudgetPopup from "../../components/DeductBudgetPopup/index.tsx";
import { setIdToDeductFrom } from "../../modules/Api/Budgets/addbudget.ts";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Budgets = () => {
  const sdispatch = useDispatch();
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const aiModal = useSelector(
    (state: RootState) => state.dashboard.isAiPopupVisible
  );
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );
  const isBudgetPopupVisible = useSelector(
    (state: RootState) => state.interaction.isBudgetPopupVisible
  );
  const isDeductBudgetPopupVisible = useSelector(
    (state: RootState) => state.interaction.isDeductBudgetPopupVisible
  );

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        console.log("Fetching budgets for user ID:", userId);
        const result = await dispatch(fetchUserBudgets(userId)).unwrap();
        console.log("Fetched budgets:", result);
        setBudgets(result);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      }
    };

    fetchBudgets();
  }, [dispatch, userId]);

  const budget = useSelector((state: RootState) => state.userbudget);

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
      <div className="w-10/11 min-h-screen flex flex-col py-6 px-4 sm:px-6 gap-y-8 mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 border-b-4 pb-6 border-purple-700">
            <div className="space-y-1">
              <Heading
                label="Budgets"
                className="text-xl sm:text-2xl font-semibold tracking-tight drop-shadow-sm"
              />
              <Paragraph
                label="Plan, track, and optimize where your money goes."
                variant="secondary"
                className="text-xs sm:text-sm opacity-80"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                label="Add Budget"
                onClick={() => dispatch(showBudgetPopup())}
                type="button"
                icon={<Plus className="inline-block w-4 h-4" />}
                className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600 text-white px-5 py-2 rounded-md cursor-pointer font-medium shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150 border border-white/10"
              />
            </div>
          </div>
          <div>
            {budget.loading && (
              <MoonLoader
                color="#7e22ce"
                loading={budget.loading}
                cssOverride={override}
                size={40}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            )}
            {!budget.loading && budget.budgets.length === 0 && (
              <Paragraph
                label="No budgets found. Start by adding a new budget."
                variant="tertiary"
                className="text-center text-gray-500 dark:text-gray-400 mt-10"
              />
            )}
            {!budget.loading &&
              budget.budgets.length > 0 &&
              budget.budgets.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-col w-full mb-4 p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-fuchsia-500/10 border-2 border-purple-900 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500 transition-all duration-300"
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <div className="text-white text-xl font-semibold">
                      <h1>{b.description}</h1>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Button
                        label="Deduct"
                        className="py-1 px-5 rounded-lg text-red-500 text- cursor-pointer"
                        icon={<Minus className="inline-block" size={20} />}
                        type="button"
                        onClick={() => {
                          dispatch(setIsDeductBudgetPopupVisible(true));
                          dispatch(setIdToDeductFrom(b._id));
                        }}
                      />
                      <Button
                        label="Delete"
                        type="button"
                        className="text-red-500 text-md cursor-pointer"
                        icon={<Trash2 className="inline-block" size={20} />}
                        onClick={async () => {
                          await dispatch(deleteUserBudget(b._id));
                          sdispatch(deleteBudget(b._id));
                        }}
                      />
                    </div>
                  </div>
                  <p>
                    Date created:{" "}
                    {new Date(b.dateCreated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
                    <p className="text-sm text-gray-300 bg-blue-950 px-6 py-2 rounded-full">
                      Category: {b.category}
                    </p>
                  </div>
                  <div className="mt-5 text-lg">
                    Budget Amount:{" "}
                    <span className="text-green-400 font-semibold">
                      ${b.amount}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {isBudgetPopupVisible && <Budgetpopup />}
        {aiModal && <AiModal />}
        {isDeductBudgetPopupVisible && <DeductBudgetPopup />}
      </div>
    </div>
  );
};

export default Budgets;
