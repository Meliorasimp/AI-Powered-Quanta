import { render, screen } from "@testing-library/react";
import DeleteGoalPopup from "../../components/DeleteGoalPopup";
import { Provider } from "react-redux";
import { store } from "../../store";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((fn) =>
    fn({
      interaction: { isDeleteGoalPopupVisible: true, goalId: "goal-1" },
      displayGoal: {
        goals: [
          {
            _id: "goal-1",
            name: "Vacation Fund",
            target: 1000,
            current: 200,
            deadline: "2029-12-31",
            category: "general",
            priority: "low",
            frequency: "monthly",
            notes: "test notes",
          },
        ],
      },
      user: { id: "test-user" },
    })
  ),
  useDispatch: jest.fn(() => jest.fn()),
}));

describe("DeleteGoalPopup component", () => {
  it("renders the popup with correct heading and buttons", () => {
    render(
      <Provider store={store}>
        <DeleteGoalPopup />
      </Provider>
    );
    expect(screen.getByText("Delete Goal")).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });
});
