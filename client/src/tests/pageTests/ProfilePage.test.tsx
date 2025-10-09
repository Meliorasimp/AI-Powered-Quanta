import { render, screen } from "@testing-library/react";
import Profile from "../../pages/Profile";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Profile Page", () => {
  it("renders Profile page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Profile />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Profile|Account|User/i)[0]).toBeInTheDocument();
  });
});
