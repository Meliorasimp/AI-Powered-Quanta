import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { Provider } from "react-redux";
import { store } from "../store";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Transactions from "../pages/Transactions";
import userEvent from "@testing-library/user-event";

jest.mock("axios");

// Helper to mock fetch (used by budgets thunk) and axios.get (used by multiple thunks)
const mockNetworkLayer = () => {
  // Mock axios.get with URL-based responses
  (axios.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes("/user/protected")) {
      return Promise.resolve({
        status: 200,
        data: { user: { id: "test-user-id", username: "Test User" } },
      });
    }
    if (url.includes("/api/get/transactions/")) {
      return Promise.resolve({ status: 200, data: [] }); // empty transactions
    }
    if (url.includes("/ai/summarize/")) {
      return Promise.resolve({
        status: 200,
        data: { summary: "Test summary" },
      });
    }
    return Promise.resolve({ status: 200, data: {} });
  });

  // Mock global fetch for budgets call
  global.fetch = jest.fn().mockImplementation((url: string) => {
    if (url.includes("/api/userbudgets/")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([]), // no budgets
      }) as unknown as Promise<Response>;
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    }) as unknown as Promise<Response>;
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockNetworkLayer();
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};
describe("Dashboard", () => {
  test("renders Dashboard component", async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });
  });

  test("renders charts", async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
    });
  });

  test("navigates to Transactions page on 'View all' click", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Click the button that triggers navigate('/transactions')
    await userEvent.click(screen.getByRole("button", { name: /view all/i }));

    // Assert distinctive text from Transactions page (paragraph under heading)
    const paragraph = await screen.findByText(
      /Take a look at what you've been purchasing lately!/i
    );
    expect(paragraph).toBeInTheDocument();
  });
});
