// React import for mocked framer-motion components
import React from "react";
/*
  Lightweight mocks to isolate the LandingPage from heavy child components / animations.
  These are intentionally minimal and typed to avoid eslint 'any' warnings.
*/
jest.mock("../../components/Text/Heading", () => (props: { label: string }) => (
  <h1>{props.label}</h1>
));
jest.mock("../../components/Register", () => () => <div>RegisterForm</div>);
jest.mock("../../components/Login", () => () => <div>Login</div>);
jest.mock("../../components/Landingpagenavbar", () => () => <nav>Navbar</nav>);
jest.mock("../../components/Button", () => (props: { label?: string }) => (
  <button>{props.label || "Button"}</button>
));

// framer-motion mock kept ultra simple (no animation logic needed for static render test)
jest.mock("framer-motion", () => {
  type StubProps = { children?: React.ReactNode };
  const MotionStub = ({ children }: StubProps) => <div>{children}</div>;
  const proxy = new Proxy(
    {},
    {
      get: () => MotionStub,
    }
  );
  return { motion: proxy, AnimatePresence: MotionStub };
});

// IntersectionObserver polyfill (scoped & typed) — only define if absent
beforeAll(() => {
  if (!("IntersectionObserver" in globalThis)) {
    class IO implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = "0px";
      readonly thresholds: ReadonlyArray<number> = [0];
      constructor() {
        /* no-op */
      }
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    // Assign polyfill
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.IntersectionObserver =
      IO as unknown as typeof IntersectionObserver;
  }
});

import { render, screen } from "@testing-library/react";
import LandingPage from "../../pages/Landingpage";
import { Provider } from "react-redux";
import { store } from "../../store";
import { MemoryRouter } from "react-router-dom";

describe("Landing Page", () => {
  it("renders Landing page main heading", () => {
    render(
      <MemoryRouter>
        <Provider store={store}>
          <LandingPage />
        </Provider>
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Smarter Spending Starts with Better Tracking!/i)
    ).toBeInTheDocument();
  });
});
