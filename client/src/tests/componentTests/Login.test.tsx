import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../../components/Login";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn((fn) =>
    fn({
      login: { email: "", password: "" },
      user: { id: "test-user" },
    })
  ),
}));

describe("Login component", () => {
  it("renders the login form with email and password inputs", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Login />
        </Provider>
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows error if fields are empty and form is submitted", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <Login />
        </Provider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByText(/both fields are required/i)).toBeInTheDocument();
  });
});
