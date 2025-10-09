import { render, screen } from "@testing-library/react";
import SavingsGoals from "../../pages/Goals";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Goals Page", () => {
  it("renders Goals page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <SavingsGoals />
        </Provider>
      </MemoryRouter>
    );
    expect(
      screen.getAllByRole("heading", { name: /Goals|Goal/i })[0]
    ).toBeInTheDocument();
  });
});
