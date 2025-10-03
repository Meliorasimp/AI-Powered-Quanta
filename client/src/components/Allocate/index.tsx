import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../modules/store.ts";
import { setIsAllocatePopupVisible } from "../../modules/Interaction.ts";
import Heading from "../Text/Heading/index.tsx";
import { DisplayGoal } from "../../modules/Api/Goals/displayGoal.ts";

const Allocate = () => {
  const dispatch = useDispatch();
  const close = () => dispatch(setIsAllocatePopupVisible(false));
  const goals = useSelector((state: RootState) => state.displayGoal.goals);
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={close}
    >
      <div
        className="w-full max-w-5xl mx-auto px-0 sm:px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0f0f17] border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.25s_ease]">
          <div className="flex items-start justify-between px-6 py-5 bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-fuchsia-600/10 border-b border-gray-700/60">
            <Heading
              id="goal-popup-title"
              label="Allocate Funds"
              className="text-xl sm:text-2xl font-semibold tracking-wide main-website-text-color"
            />
            <button
              onClick={close}
              aria-label="Close goal dialog"
              className="text-gray-400 hover:text-gray-200 transition-colors rounded-md p-1 focus:outline-none focus-visible:ring ring-offset-0 ring-indigo-500"
            >
              ✕
            </button>
          </div>
          <section className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            Hello world
          </section>
        </div>
      </div>
    </div>
  );
};

export default Allocate;
