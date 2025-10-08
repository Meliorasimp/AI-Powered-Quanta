import { render, screen } from "@testing-library/react";
import Budgetpopup from "../components/Budgetpopup";
import { Provider } from "react-redux";
import { store } from "../store";

// Mocking the redux state means making a fake redux store with the right state in order to test if my component renders correctly based on that state
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((fn) =>
    fn({
      budget: { description: "", amount: 0, category: "Housing" },
      interaction: { isBudgetPopupVisible: true },
      user: { id: "test-user" },
    })
  ),
}));

//I want to test if the Budgetpopup component renders correctly based on the mocked redux state
describe("Budgetpopup component", () => {
  it("renders the popup with correct heading and button", () => {
    render(
      <Provider store={store}>
        <Budgetpopup />
      </Provider>
    );
    expect(screen.getByText("Add Budget")).toBeInTheDocument();
    expect(screen.getByText("Create Budget")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g., Groceries")).toBeInTheDocument();
  });
});
