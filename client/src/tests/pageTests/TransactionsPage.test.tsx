import { render, screen } from "@testing-library/react";
import Transactions from "../../pages/Transactions";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Transactions Page", () => {
  it("renders Transactions page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Transactions />
        </Provider>
      </MemoryRouter>
    );
    expect(
      screen.getAllByText(/Transactions|Transaction/i)[0]
    ).toBeInTheDocument();
  });
});
