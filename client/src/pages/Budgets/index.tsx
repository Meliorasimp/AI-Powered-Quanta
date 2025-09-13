import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import "../../styles/index.css";
import Button from "../../components/Button";
import { Plus } from "lucide-react";
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
import { Trash2Icon } from "lucide-react";
import {
  deleteUserBudget,
  deleteBudget,
} from "../../modules/Api/Budgets/displaybudget.ts";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Budgets = () => {
  const sdispatch = useDispatch();
  const dispatch = useAppDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
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
      <div className="w-10/11 min-h-screen flex flex-col py-5 px-5 gap-y-4 mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 border-b items-start sm:items-center">
          <div className="overflow-hidden pb-2">
            <Heading
              label="Budgets"
              className="text-lg sm:text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Curious where your money’s been going? Let’s take a look."
              variant="secondary"
            />
          </div>
          <div className="flex justify-start sm:ml-auto sm:justify-end w-full sm:w-auto">
            <Button
              label="Add Budget"
              onClick={() => dispatch(showBudgetPopup())}
              type="button"
              icon={<Plus className="inline-block" />}
              className="text-white px-3 py-1 rounded-sm cursor-pointer font-semibold"
            />
          </div>
        </div>
        <div className="h-full w-full flex flex-col gap-y-5">
          <div>
            {budget.loading && (
              <p className="flex justify-center items-center py-6">
                <MoonLoader
                  color={"#36d7b7"}
                  loading={budget.loading}
                  cssOverride={override}
                  size={50}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </p>
            )}
            {!budget.loading && budget.budgets.length === 0 && (
              <p className="py-2">No budgets found for this user.</p>
            )}

            {!budget.loading && budget.budgets.length > 0 && (
              <ul className="w-full flex flex-col gap-y-5">
                {budget.budgets.map((b) => (
                  <div
                    key={b._id}
                    className="statcard-purple p-4 rounded-lg w-full"
                  >
                    <div>
                      <div className="flex flex-row justify-between">
                        <Heading label={b.description} />
                        <div className="flex gap-x-6">
                          <Trash2Icon
                            className="inline-block cursor-pointer"
                            size={22}
                            color="red"
                            onClick={() => {
                              dispatch(deleteUserBudget(b._id));
                              sdispatch(deleteBudget(b._id));
                            }}
                          />
                        </div>
                      </div>
                      <div className="mt-2 w-full sm:w-2/3 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-between">
                        <Paragraph
                          label={`₱${b.amount.toFixed(2)} budgeted`}
                          variant="tertiary"
                          className="text-black"
                        />
                        <Paragraph
                          label={`Date created: ${new Date(
                            b.dateCreated
                          ).toLocaleDateString()}`}
                          variant="tertiary"
                          className="text-black"
                        />
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{ width: "82%" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
        {isBudgetPopupVisible && <Budgetpopup />}
      </div>
    </div>
  );
};

export default Budgets;
