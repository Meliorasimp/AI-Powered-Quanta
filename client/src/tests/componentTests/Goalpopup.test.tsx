import { fireEvent, render, screen } from "@testing-library/react";
import Goalpopup from "../../components/GoalPopup";
import Goals from "../../pages/Goals";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

// Mocking the redux state means making a fake redux store with the right state in order to test if my component renders correctly based on that state
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((fn) =>
    fn({
      displayGoal: { goals: [] }, // Added to fix test error
      goal: {
        name: "",
        target: 0,
        current: 0,
        deadline: "",
        category: "",
        priority: "",
        frequency: "",
        notes: "",
      },
      interaction: { isGoalPopupVisible: true },
      user: { id: "test-user" },
    })
  ),
}));

describe("Goalpopup component", () => {
  it("renders the popup with correct heading and button", () => {
    render(
      <Provider store={store}>
        <Goalpopup />
      </Provider>
    );
    expect(screen.getByText("Create a New Goal")).toBeInTheDocument();
    expect(screen.getByText("Live Preview")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. Emergency Fund")
    ).toBeInTheDocument();
  });
});

describe("Goals page", () => {
  it("shows the Goalpopup when +Add button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Goals />
        </MemoryRouter>
      </Provider>
    );
    // Find and click the +Add button
    fireEvent.click(screen.getByRole("button", { name: /add/i }));

    // Now the popup should appear
    expect(screen.getByText("Create a New Goal")).toBeInTheDocument();
    expect(screen.getByText("Live Preview")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("e.g. Emergency Fund")
    ).toBeInTheDocument();
  });
});
