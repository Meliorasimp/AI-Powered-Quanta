import { render, screen } from "@testing-library/react";
import Budgetcard from "../../components/Budgetcard";
import { Provider } from "react-redux";
import { store } from "../../store";

describe("Budgetcard component", () => {
  it("renders with correct props", () => {
    render(
      <Provider store={store}>
        <Budgetcard
          title="Groceries"
          amountallocated={200}
          description="Weekly groceries"
          progress={50}
          startdate={new Date("2025-10-01")}
          enddate={new Date("2025-10-31")}
        />
      </Provider>
    );
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Weekly groceries")).toBeInTheDocument();
    expect(screen.getAllByText("$200").length).toBeGreaterThan(0);
    expect(screen.getByText("50%"));
    expect(screen.getByText("10/1/2025")).toBeInTheDocument();
    expect(screen.getByText("10/31/2025")).toBeInTheDocument();
  });
});
