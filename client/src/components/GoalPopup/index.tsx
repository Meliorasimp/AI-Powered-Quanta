import { useDispatch, useSelector } from "react-redux";
import { hideGoalPopup } from "../../modules/Interaction.ts";
import Heading from "../Text/Heading";
import { useEffect, useRef, useState } from "react";
import { createGoal } from "../../modules/Api/Goals/goalSlice";
import { RootState, AppDispatch } from "../../store";

type GoalFormState = {
  name: string;
  target: string;
  current: string;
  deadline: string;
  category: string;
  priority: string;
  frequency: string;
  notes: string;
};

const initialForm: GoalFormState = {
  name: "",
  target: "",
  current: "",
  deadline: "",
  category: "general",
  priority: "medium",
  frequency: "monthly",
  notes: "",
};

const GoalPopup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<GoalFormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const targetNum = parseFloat(form.target) || 0;
  const currentNum = parseFloat(form.current) || 0;
  const progress =
    targetNum > 0 ? Math.min(100, (currentNum / targetNum) * 100) : 0;

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  const close = () => dispatch(hideGoalPopup());

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const clone = { ...prev };
        delete clone[name];
        return clone;
      });
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name required";
    if (!form.target.trim()) next.target = "Target amount required";
    if (form.target && parseFloat(form.target) <= 0)
      next.target = "Target must be > 0";
    if (form.current && parseFloat(form.current) < 0)
      next.current = "Current cannot be negative";
    if (form.current && targetNum && currentNum > targetNum)
      next.current = "Current exceeds target";
    if (!form.deadline) next.deadline = "Deadline required";
    return next;
  };

  const userId = useSelector((state: RootState) => state.user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    try {
      await dispatch(
        createGoal({
          userId,
          goal: {
            name: form.name.trim(),
            target: form.target || "0",
            current: form.current || "0",
            deadline: form.deadline,
            category: form.category,
            priority: form.priority,
            frequency: form.frequency,
            notes: form.notes || "",
          },
        })
      ).unwrap();
      close();
    } catch {
      setErrors((prev) => ({ ...prev, submit: "Failed to create goal" }));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={close}
      onKeyDown={onKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-popup-title"
    >
      <div
        className="w-full max-w-3xl mx-auto px-0 sm:px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0f0f17] border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_0.25s_ease]">
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 bg-gradient-to-r from-indigo-600/20 via-purple-600/10 to-fuchsia-600/10 border-b border-gray-700/60">
            <Heading
              id="goal-popup-title"
              label="Create a New Goal"
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

          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Left column */}
            <div className="md:col-span-7 flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="goal-name"
                  className="text-sm font-medium text-gray-300"
                >
                  Goal Name <span className="text-red-400">*</span>
                </label>
                <input
                  ref={firstFieldRef}
                  id="goal-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Emergency Fund"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full rounded-md bg-gray-800/70 border ${
                    errors.name ? "border-red-500" : "border-gray-600"
                  } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.name && (
                  <p className="text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="target"
                    className="text-sm font-medium text-gray-300"
                  >
                    Target Amount <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      id="target"
                      name="target"
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.target}
                      onChange={handleChange}
                      placeholder="5000"
                      className={`w-full rounded-md bg-gray-800/70 border ${
                        errors.target ? "border-red-500" : "border-gray-600"
                      } pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  {errors.target && (
                    <p className="text-xs text-red-400">{errors.target}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="current"
                    className="text-sm font-medium text-gray-300"
                  >
                    Current Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      $
                    </span>
                    <input
                      id="current"
                      name="current"
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.current}
                      onChange={handleChange}
                      placeholder="1200"
                      className={`w-full rounded-md bg-gray-800/70 border ${
                        errors.current ? "border-red-500" : "border-gray-600"
                      } pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                  </div>
                  {errors.current && (
                    <p className="text-xs text-red-400">{errors.current}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="deadline"
                    className="text-sm font-medium text-gray-300"
                  >
                    Deadline <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                    className={`w-full rounded-md bg-gray-800/70 border ${
                      errors.deadline ? "border-red-500" : "border-gray-600"
                    } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.deadline && (
                    <p className="text-xs text-red-400">{errors.deadline}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-300"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-800/70 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="general">General</option>
                    <option value="savings">Savings</option>
                    <option value="emergency">Emergency</option>
                    <option value="travel">Travel</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="priority"
                    className="text-sm font-medium text-gray-300"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-800/70 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="frequency"
                    className="text-sm font-medium text-gray-300"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={form.frequency}
                    onChange={handleChange}
                    className="w-full rounded-md bg-gray-800/70 border border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="one-time">One-time</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-300">
                    Progress
                  </label>
                  <div className="flex flex-col gap-1">
                    <div className="h-2.5 w-full bg-gray-700/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                        aria-label="Goal progress"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        role="progressbar"
                      />
                    </div>
                    <span className="text-[11px] tracking-wide text-gray-400">
                      {progress.toFixed(1)}% funded
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="notes"
                  className="text-sm font-medium text-gray-300"
                >
                  Notes / Description
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add any context or strategy for achieving this goal..."
                  className="w-full rounded-md bg-gray-800/70 border border-gray-600 px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right column – live summary */}
            <aside className="md:col-span-5 flex flex-col gap-5 bg-gray-800/40 border border-gray-700/60 rounded-xl p-5">
              <Heading
                label="Live Preview"
                className="text-base font-semibold tracking-wide main-website-text-color"
              />
              <div className="text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Goal Name:</span>
                  <span className="font-medium text-gray-200 truncate max-w-[55%] text-right">
                    {form.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target:</span>
                  <span className="font-medium text-gray-200">
                    {targetNum ? `$${targetNum.toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current:</span>
                  <span className="font-medium text-gray-200">
                    {currentNum ? `$${currentNum.toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Deadline:</span>
                  <span className="font-medium text-gray-200">
                    {form.deadline || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority:</span>
                  <span className="font-medium capitalize text-gray-200">
                    {form.priority}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="h-2.5 w-full bg-gray-700/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[11px] mt-1 text-gray-400 tracking-wide">
                    {progress.toFixed(1)}% complete
                  </p>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                {errors.submit && (
                  <p className="text-xs text-red-400 -mt-1">{errors.submit}</p>
                )}
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white text-sm font-medium py-2.5 shadow hover:from-indigo-500 hover:via-purple-500 hover:to-fuchsia-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    !form.name ||
                    !form.target ||
                    !form.deadline ||
                    Object.keys(errors).length > 0
                  }
                >
                  Save Goal
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="w-full inline-flex items-center justify-center rounded-md border border-gray-600 text-gray-300 text-sm font-medium py-2 hover:bg-gray-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalPopup;
