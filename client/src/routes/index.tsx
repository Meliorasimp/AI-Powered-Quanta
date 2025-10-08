import { RouteObject } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Budgets from "../pages/Budgets";
import LinkedAccounts from "../pages/LinkedAccounts";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import LandingPage from "../pages/Landingpage";
import Navbar from "../components/Navbar";
import About from "../pages/About";
import Contacts from "../pages/Contacts";
import SavingsGoals from "../pages/Goals";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
  },
  {
    path: "/budgets",
    element: <Budgets />,
  },
  {
    path: "/linkedaccounts",
    element: <LinkedAccounts />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings/navbar",
    element: <Navbar />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contacts />,
  },
  {
    path: "/goals",
    element: <SavingsGoals />,
  },
];

export default routes;
