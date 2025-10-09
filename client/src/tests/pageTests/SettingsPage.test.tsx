jest.mock("../../components/Text/Heading", () => (props: { label: string }) => (
  <h1>{props.label}</h1>
));
jest.mock(
  "../../components/Text/Paragraph",
  () => (props: { label: string }) => <p>{props.label}</p>
);
jest.mock("../../components/Button", () => (props: { label?: string }) => (
  <button>{props.label || "Button"}</button>
));
jest.mock("../../components/Navbar", () => () => <nav>Navbar</nav>);

import { render, screen } from "@testing-library/react";
import Settings from "../../pages/Settings";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Settings Page", () => {
  it("renders Settings page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Settings />
        </Provider>
      </MemoryRouter>
    );
    // There may be multiple 'Settings' (sidebar, heading, etc.)
    // Only match heading elements (h1, h2, etc.) with 'Settings' text
    const headings = screen
      .getAllByText(/Settings/i)
      .filter((el) => /^H[1-6]$/.test(el.tagName));
    expect(headings.length).toBeGreaterThan(0);
  });
});
