import "../../styles/index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store.ts";
import { useAppDispatch } from "../../hooks/index.ts";
import {
  setAmountToAllocate,
  setIsAllocatePopupVisible,
} from "../../modules/Interaction.ts";
import Heading from "../Text/Heading/index.tsx";
import { DisplayGoal } from "../../modules/Api/Goals/displayGoal.ts";
import { Target } from "lucide-react";
import Button from "../Button/index.tsx";
import { allocateAmountToGoal } from "../../modules/Interaction.ts/dashboard/index.ts";
import { fetchUserGoal } from "../../modules/Api/Goals/displayGoal.ts";
import React from "react";

const Allocate = () => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  const close = () => dispatch(setIsAllocatePopupVisible(false));
  const goalId = useSelector((state: RootState) => state.interaction.goalId);
  const goal = useSelector((state: RootState) => state.displayGoal.goals);
  const currentGoal = goal.find((g: DisplayGoal) => g._id === goalId);
  const amountToAllocate = useSelector(
    (state: RootState) => state.interaction.amountToAllocate
  );
  console.log("Current Goal in Allocate:", amountToAllocate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAmountToAllocate(Number(e.target.value)));
  };

  const userId = useSelector((state: RootState) => state.user.id);
  const handleAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await appDispatch(
        allocateAmountToGoal({
          goalId: goalId || "",
          amount: amountToAllocate || 0,
        })
      ).unwrap();
      if (userId) {
        appDispatch(fetchUserGoal(userId));
        appDispatch(setAmountToAllocate(0));
        appDispatch(setIsAllocatePopupVisible(false));
      }
    } catch (err) {
      // Optionally handle error
      console.error("Allocation failed:", err);
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-lg z-50"
      aria-modal="true"
      role="dialog"
      onClick={close}
    >
      <div
        className="w-full max-w-lg mx-auto px-2 sm:px-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/10 border border-gray-700/40 rounded-3xl shadow-2xl overflow-hidden animate-[fadeIn_0.25s_ease] backdrop-blur-xl">
          <div className="flex items-center justify-between px-7 py-6 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-fuchsia-500/20 border-b border-gray-700/40">
            <Heading
              id="goal-popup-title"
              label="Allocate Funds"
              className="text-2xl font-bold tracking-wide text-white drop-shadow"
            />
            <button
              onClick={close}
              aria-label="Close goal dialog"
              className="text-gray-300 hover:text-white transition-colors rounded-full p-2 focus:outline-none focus-visible:ring-2 ring-offset-2 ring-indigo-400"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
          <section className="p-7 space-y-6 max-h-[70vh] overflow-y-auto">
            <h1 className="text-xl font-semibold text-white/90">
              Goal:{" "}
              <span className="font-bold text-indigo-300">
                {currentGoal?.name}
              </span>
            </h1>
            <div className="flex flex-wrap gap-4 justify-between text-sm">
              <span className="text-gray-300 bg-gray-800/40 px-3 py-1 rounded-full">
                Frequency: {currentGoal?.frequency}
              </span>
              <span className="text-gray-300 bg-gray-800/40 px-3 py-1 rounded-full">
                Priority: {currentGoal?.priority}
              </span>
              <span className="text-gray-300 bg-gray-800/40 px-3 py-1 rounded-full">
                Deadline: {currentGoal?.deadline}
              </span>
            </div>
            <p className="text-green-400 text-sm bg-gray-900/30 px-3 py-2 rounded-xl">
              <span className="text-gray-400 font-medium">Notes:</span>{" "}
              {currentGoal?.notes || "No description provided."}
            </p>
            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-3 sm:space-y-0 mt-2 justify-between items-center">
              <span className="text-white/80 text-base">
                <span className="font-medium">Current Saved:</span>{" "}
                <span className="text-green-300 font-bold">
                  ${currentGoal?.current ? currentGoal.current : "0.00"}
                </span>
              </span>
              <span className="text-white/80 text-base">
                <Target className="inline-block mr-1 mb-1 text-indigo-400" />
                <span className="font-medium">Target:</span>{" "}
                <span className="text-indigo-300 font-bold">
                  ${currentGoal?.target ? currentGoal.target : "0.00"}
                </span>
              </span>
            </div>
            <form className="space-y-6 mt-2" onSubmit={handleAllocation}>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label
                  htmlFor="vol"
                  className="text-lg text-white/90 font-semibold"
                >
                  Amount to Allocate:
                </label>
                <input
                  type="number"
                  value={amountToAllocate}
                  onChange={handleChange}
                  step={1}
                  min={0}
                  required
                  className="w-32 px-3 py-2 rounded-lg border border-indigo-400 bg-white/20 text-indigo-200 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-sm"
                />
              </div>
              <input
                type="range"
                id="vol"
                name="vol"
                min="0"
                max={
                  currentGoal?.target
                    ? Number(currentGoal.target) - (currentGoal?.current || 0)
                    : 100
                }
                step="1"
                value={amountToAllocate}
                onChange={handleChange}
                className="w-full h-3 mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400 rounded-full appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 slider"
              />
              <div className="flex justify-center">
                <Button
                  label="Allocate"
                  type="submit"
                  className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl mt-4 w-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Allocate;
