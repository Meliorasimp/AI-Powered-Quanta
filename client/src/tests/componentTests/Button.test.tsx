import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../../components/Button";

//Unit Testing is Hard for me XD

describe("Button component", () => {
  it("renders with the correct label", () => {
    render(<Button label="Click Me" type="button" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} type="button" />);
    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button label="Styled" className="custom-class" type="button" />);
    expect(screen.getByText("Styled")).toHaveClass("custom-class");
  });
});
