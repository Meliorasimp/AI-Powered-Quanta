import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import { MemoryRouter } from "react-router-dom";
import Analytics from "../pages/Analytics";
import axios from "axios";

jest.mock("axios");
(axios.get as jest.Mock).mockResolvedValue({
  data: { user: { id: "test-user-id", username: "Test User" } },
});

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

describe("Analytics", () => {
  test("renders line chart placeholder", async () => {
    renderWithProviders(<Analytics />);
    await waitFor(() => {
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    });
  });
});
