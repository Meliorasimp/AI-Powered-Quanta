jest.mock("../../components/Chartjs/Pie", () => () => <div>Pie Chart</div>);

import { render, screen } from "@testing-library/react";
import Dashboard from "../../pages/Dashboard";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Dashboard Page", () => {
  it("renders Dashboard page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Dashboard />
        </Provider>
      </MemoryRouter>
    );
    // Use a more specific query to avoid Pie import/export issues
    expect(
      screen.getAllByText(/dashboard/i, { exact: false })[0]
    ).toBeInTheDocument();
  });
});
