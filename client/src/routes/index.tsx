import { RouteObject } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Budgets from "../pages/Budgets";
import LinkedAccounts from "../pages/LinkedAccounts";
import Analytics from "../pages/Analytics";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Readonlyprofile from "../pages/Readonlyprofile";
import Profile from "../pages/Profile";
import AuthRedirect from "../components/Redirect";

const routes: RouteObject[] = [
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
    path: "/analytics/financialoverview",
    element: <Analytics />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

export default routes;
