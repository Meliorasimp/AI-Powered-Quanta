import { render, screen } from "@testing-library/react";
import Contacts from "../../pages/Contacts";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Contacts Page", () => {
  it("renders Contacts page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Contacts />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Contact Us/i)).toBeInTheDocument();
  });
});
