import { render, screen } from "@testing-library/react";
import LinkedAccounts from "../../pages/LinkedAccounts";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("LinkedAccounts Page", () => {
  it("renders LinkedAccounts page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <LinkedAccounts />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Linked Bank Accounts/i)).toBeInTheDocument();
  });
});
