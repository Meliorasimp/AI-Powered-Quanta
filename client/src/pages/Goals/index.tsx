import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import "../../styles/index.css";
import { RootState } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import {
  showGoalPopup,
  setIsAllocatePopupVisible,
  setGoalId,
  setIsDeleteGoalPopupVisible,
} from "../../modules/Interaction.ts";
import GoalPopup from "../../components/GoalPopup/index.tsx";
import Allocate from "../../components/Allocate/index.tsx";
import { useEffect } from "react";
import {
  DisplayGoal,
  fetchUserGoal,
  removeGoal,
} from "../../modules/Api/Goals/displayGoal.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import DeleteGoalPopup from "../../components/DeleteGoalPopup/index.tsx";

const SavingsGoals = () => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const goalPopup = useSelector(
    (state: RootState) => state.interaction.isGoalPopupVisible
  );
  const allocate = useSelector(
    (state: RootState) => state.interaction.isAllocatePopupVisible
  );
  const goals = useSelector((state: RootState) => state.displayGoal.goals);
  const goalId = useSelector((state: RootState) => state.interaction.goalId);
  const userId = useSelector((state: RootState) => state.user.id);
  const isDeleteGoalPopupVisible = useSelector(
    (state: RootState) => state.interaction.isDeleteGoalPopupVisible
  );
  console.log("User ID in Goals page:", userId);
  const { isThemePurple, isThemeLight, isThemeDark } = useSelector(
    (state: RootState) => state.interaction
  );

  useEffect(() => {
    if (!userId) return; // dont fetch if no user
    (async () => {
      try {
        const goals = await appDispatch(fetchUserGoal(userId)).unwrap();
        console.log("Fetched goals:", goals);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      }
    })();
  }, [appDispatch, userId]);
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
                label="Saving Goals"
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
                label="Add Saving Goal"
                type="button"
                onClick={() => dispatch(showGoalPopup())}
                icon={<Plus className="inline-block w-4 h-4" />}
                className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-violet-600 text-white px-5 py-2 rounded-md cursor-pointer font-medium shadow hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-150 border border-white/10"
              />
            </div>
          </div>
          <div>
            {goals.length === 0 && (
              <div className="flex flex-col items-center justify-center w-full h-96 rounded-xl p-8 shadow-sm">
                {/* Illustration */}
                <div className="w-24 h-24 mb-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4m0 4h.01"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-700 mb-2">
                  No goals yet
                </h1>
                <p className="text-gray-500 mb-6 text-center max-w-xs">
                  Start by creating your first goal and track your progress
                  here.
                </p>
              </div>
            )}
            {goals &&
              goals.map((goal: DisplayGoal) => (
                <div
                  key={goal._id}
                  className="flex flex-col w-full mb-4 p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-fuchsia-500/10 border-2 border-purple-900 rounded-2xl shadow-sm hover:shadow-md hover:border-green-500 transition-all duration-300"
                >
                  <div className="flex w-full items-center gap-4">
                    <div className="text-white text-xl font-semibold">
                      <h1>{goal.name}</h1>
                    </div>
                    <div className="ml-auto flex flex-row items-center">
                      <Button
                        label="Allocate"
                        className="py-1 px-5 rounded-lg text-green-500 cursor-pointer"
                        icon={<Plus className="inline-block w-4 h-4 mb-1" />}
                        type="button"
                        onClick={() => {
                          dispatch(setGoalId(goal._id ?? null));
                          dispatch(setIsAllocatePopupVisible(true));
                        }}
                      />
                      <Button
                        label="Delete"
                        className="py-1 px-5 rounded-lg text-red-500 cursor-pointer"
                        type="button"
                        icon={<Trash2 className="inline-block w-4 h-4 mb-1" />}
                        onClick={() => {
                          dispatch(setGoalId(goal._id ?? null));
                          dispatch(setIsAllocatePopupVisible(false));
                          dispatch(setIsDeleteGoalPopupVisible(true));
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="mr-2">Deadline:</span>
                      {goal.deadline}
                    </p>
                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
                      <p className="text-sm text-gray-300 bg-blue-950 px-6 py-2 rounded-full">
                        Frequency: {goal.frequency}
                      </p>
                      <p className="text-sm text-gray-300 bg-blue-950 px-6 py-2 rounded-full">
                        Priority: {goal.priority}
                      </p>
                      <p className="text-sm text-gray-300 bg-blue-950 px-6 py-2 rounded-full">
                        Category: {goal.category}
                      </p>
                    </div>
                    <div className="flex flex-row justify-between mt-4">
                      <p className="text-lg max-w-lg">
                        Current Amount:{" "}
                        <span className="text-green-500">${goal.current}</span>
                      </p>
                      <p className="text-lg max-w-lg">
                        Target Amount:{" "}
                        <span className="text-green-500">${goal.target}</span>
                      </p>
                    </div>
                    <div className="w-full mt-3 relative">
                      <div className="h-2 bg-gray-300 rounded-full" />
                      <div
                        className="absolute top-0 left-0 h-2 bg-green-500 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${(goal.current / goal.target) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {goalPopup && <GoalPopup />}
      {allocate && goalId && <Allocate />}
      {isDeleteGoalPopupVisible && (
        <DeleteGoalPopup
          onGoalDeleted={async (deletedGoalId?: string) => {
            if (deletedGoalId) {
              appDispatch(removeGoal(deletedGoalId));
            }
            if (userId) await appDispatch(fetchUserGoal(userId));
          }}
        />
      )}
    </div>
  );
};

export default SavingsGoals;
