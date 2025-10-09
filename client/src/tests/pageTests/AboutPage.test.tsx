import { render, screen } from "@testing-library/react";
import About from "../../pages/About";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("About Page", () => {
  it("renders About page main heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <About />
        </Provider>
      </MemoryRouter>
    );
    expect(
      screen.getByText(
        /The Website that helps you learn and grow your Finances/i
      )
    ).toBeInTheDocument();
  });
});
