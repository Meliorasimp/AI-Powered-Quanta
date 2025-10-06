import { setIsDeleteGoalPopupVisible } from "../../modules/Interaction.ts";
import { RootState } from "../../store.ts";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../hooks/index.ts";
import Button from "../Button/index.tsx";
import { deleteGoal } from "../../modules/Api/Goals/goalSlice.ts";

const DeleteGoalPopup = ({
  onGoalDeleted,
}: {
  onGoalDeleted?: (goalId?: string) => void;
}) => {
  const goalId = useSelector((state: RootState) => state.interaction.goalId);
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const handleDeleteGoal = async () => {
    // Dispatch an action to delete the goal using the goalId
    console.log("Deleting goal with ID:", goalId);
    await appDispatch(deleteGoal(goalId || ""));
    if (typeof onGoalDeleted === "function") {
      onGoalDeleted(goalId ?? undefined);
    }
    dispatch(setIsDeleteGoalPopupVisible(false));
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-opacity-20"
        onClick={() => setIsDeleteGoalPopupVisible(false)}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 w-full max-w-md mx-4 rounded-lg shadow-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold text-white mb-3">Delete Goal</h2>
        <p className="text-gray-200 mb-6">
          Are you sure you want to delete this goal? This action cannot be
          undone.
        </p>

        <div className="flex justify-end space-x-3">
          <Button
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => dispatch(setIsDeleteGoalPopupVisible(false))}
            label="Cancel"
            type="button"
          />
          <Button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
            onClick={handleDeleteGoal}
            label="Delete"
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalPopup;
