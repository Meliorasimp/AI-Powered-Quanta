import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import "../../styles/index.css";
import Button from "../../components/Button";
import { Plus, Trash2Icon } from "lucide-react";
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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
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

          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600 opacity-70 rounded-full" />
            <div className="pt-3">
              {budget.loading && (
                <p className="flex justify-center items-center py-10">
                  <MoonLoader
                    color={"#36d7b7"}
                    loading={budget.loading}
                    cssOverride={override}
                    size={52}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </p>
              )}
              {!budget.loading && budget.budgets.length === 0 && (
                <div className="empty-state-box">
                  <p className="font-medium mb-1">No budgets yet</p>
                  <p className="text-xs opacity-70 mb-3">
                    Start organizing your finances by creating your first
                    budget.
                  </p>
                  <Button
                    label="Create Budget"
                    type="button"
                    onClick={() => dispatch(showBudgetPopup())}
                    className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600 text-white px-4 py-2 rounded-md cursor-pointer font-medium shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150"
                  />
                </div>
              )}

              {!budget.loading && budget.budgets.length > 0 && (
                <ul className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {budget.budgets.map((b) => {
                    const used = 0; // Placeholder: replace with real used tracking if available
                    const pct = Math.min(
                      b.amount > 0 ? (used / b.amount) * 100 : 0,
                      100
                    );
                    return (
                      <li key={b._id} className="budget-card-shell group">
                        <div className="flex items-start justify-between">
                          <div className="budget-card-header">
                            <Heading
                              label={b.description}
                              className="text-base sm:text-lg font-semibold"
                            />
                            <div className="budget-meta">
                              <span>
                                Created:{" "}
                                {new Date(b.dateCreated).toLocaleDateString()}
                              </span>
                              <span>Budgeted: ₱{b.amount.toFixed(2)}</span>
                            </div>
                          </div>
                          <button
                            aria-label="Delete budget"
                            className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 hover:border-white/20"
                            onClick={() => {
                              dispatch(deleteUserBudget(b._id));
                              sdispatch(deleteBudget(b._id));
                            }}
                          >
                            <Trash2Icon size={16} className="text-red-400" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="budget-progress">
                            <div
                              className="budget-progress-fill"
                              style={{ width: `${pct}%` }}
                            />
                            <div className="budget-progress-label">
                              <span>{pct.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-[11px] sm:text-xs opacity-80 font-medium">
                            <span>₱{used.toFixed(2)} used</span>
                            <span>₱{(b.amount - used).toFixed(2)} left</span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
        {isBudgetPopupVisible && <Budgetpopup />}
        {aiModal && <AiModal />}
      </div>
    </div>
  );
};

export default Budgets;
