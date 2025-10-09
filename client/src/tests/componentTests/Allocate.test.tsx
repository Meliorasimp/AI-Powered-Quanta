import { render, screen } from "@testing-library/react";
import Allocate from "../../components/Allocate";
import { Provider } from "react-redux";
import { store } from "../../store";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((fn) =>
    fn({
      user: { id: "test-user" },
      interaction: {
        goalId: "goal-1",
        setIsAllocatePopupVisible: true,
        amountToAllocate: 0,
      },
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
    })
  ),
  useDispatch: jest.fn(() => jest.fn()),
}));

describe("Allocate component", () => {
  it("renders the Allocate component with correct heading", () => {
    render(
      <Provider store={store}>
        <Allocate />
      </Provider>
    );
    expect(screen.getByText("Allocate Funds")).toBeInTheDocument();
    expect(screen.getByText("Vacation Fund")).toBeInTheDocument();
    expect(screen.getByLabelText("Amount to Allocate:")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /allocate/i })
    ).toBeInTheDocument();
  });

  it("allows user to change the allocation amount", () => {
    render(
      <Provider store={store}>
        <Allocate />
      </Provider>
    );
    const input = screen.getByLabelText(
      "Amount to Allocate:"
    ) as HTMLInputElement;
    // Simulate user typing 500
    input.focus();
    input.value = "500";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.value).toBe("500");
  });
});
