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
jest.mock("../../components/Notificationbar", () => () => (
  <div>NotificationBar</div>
));

import { render, screen } from "@testing-library/react";
import Notifications from "../../pages/Notifications";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Notifications Page", () => {
  it("renders Notifications page heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Notifications />
        </Provider>
      </MemoryRouter>
    );
    // There may be multiple 'Notifications' (sidebar, heading, etc.)
    const headings = screen.getAllByText(/Notifications/i);
    expect(headings.length).toBeGreaterThan(0);
    // Optionally, check for a heading element
    expect(headings.some((el) => el.tagName.startsWith("H"))).toBe(true);
  });
});
