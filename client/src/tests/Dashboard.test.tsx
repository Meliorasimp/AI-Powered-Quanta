import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";

test("renders Dashboard component", () => {
  render(<Dashboard />);
  expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
});
