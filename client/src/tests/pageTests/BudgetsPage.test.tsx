import { render, screen } from "@testing-library/react";
import Budgets from "../../pages/Budgets";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Budgets Page", () => {
  it("renders Budgets page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Budgets />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Budgets/i)[0]).toBeInTheDocument();
  });
});
