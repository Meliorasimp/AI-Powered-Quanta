import { render, screen } from "@testing-library/react";
import AiModal from "../../components/AiModal";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn((fn) =>
    fn({
      dashboard: {
        messages: [],
        remainingBalance: 0,
        totalExpense: 0,
        totalBudgetAmount: 0,
        totalTransfersMade: 0,
        totalIncome: 0,
        graphMode: "Monthly",
        monthlyDashboardData: { labels: [], datasets: [] },
        dailyDashboardData: { labels: [], datasets: [] },
        summarization: "",
        greeting: "",
        isAiPopupVisible: true,
        isLoading: false,
        amountAllocated: 0,
        error: null,
      },
      interaction: { isAiModalVisible: true },
      user: { id: "test-user", username: "Test User" },
    })
  ),
}));

describe("AiModal component", () => {
  it("renders the modal with correct heading and button", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <AiModal />
        </MemoryRouter>
      </Provider>
    );
    expect(
      screen.getByText(/Ask me anything about your finances, Test User\./i)
    ).toBeInTheDocument();
    expect(screen.getByText("Qwen Bot")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message and press Enter...")
    ).toBeInTheDocument();
  });
});
