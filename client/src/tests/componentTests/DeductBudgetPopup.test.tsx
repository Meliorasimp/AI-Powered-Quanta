import { render, screen } from "@testing-library/react";
import DeductBudgetPopup from "../../components/DeductBudgetPopup";
import { Provider } from "react-redux";
import { store } from "../../store";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((fn) =>
    fn({
      deductAmount: { amountToDeduct: 0, idToDeductFrom: "budget-1" },
      interaction: { isDeductBudgetPopupVisible: true },
      user: { id: "test-user" },
    })
  ),
  useDispatch: jest.fn(() => jest.fn()),
}));

describe("DeductBudgetPopup component", () => {
  it("renders the popup with correct heading and input", () => {
    render(
      <Provider store={store}>
        <DeductBudgetPopup />
      </Provider>
    );
    expect(screen.getByText("Allocate Amount")).toBeInTheDocument();
    expect(
      screen.getByText("Enter the amount you want to Deduct from this budget.")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /allocate/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });
});
