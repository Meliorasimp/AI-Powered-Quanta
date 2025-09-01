import "../../styles/index.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Heading from "../Text/Heading";
import { LayoutDashboardIcon } from "lucide-react";
import { PiggyBankIcon } from "lucide-react";

const Navbar = () => {
  const nav = useNavigate();
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  const themeClass = isThemePurple
    ? "purple"
    : isThemeLight
    ? "light"
    : isThemeDark
    ? "dark"
    : "";

  return (
    <div className={`w-full ${themeClass}`}>
      <div className="relative flex items-center justify-between px-6 py-4">
        <h1 className="text-3xl font-bold text-purple-200">Quanta</h1>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-x-6">
          {/* Dashboard */}
          <Button
            label="Dashboard"
            onClick={() => nav("/dashboard")}
            type="button"
            className="main-website-text-color text-lg hover:bg-gray-600 py-1 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
            icon={<LayoutDashboardIcon className="inline-block w-5 h-5 mr-2" />}
          />

          <div className="relative group">
            <Button
              label="Finance"
              className="text-white text-lg px-4 py-2 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
              icon={
                <PiggyBankIcon
                  className="inline-block w-5 h-5 mr-2"
                  size={70}
                />
              }
              onClick={() => {}}
              type="button"
            />
            <div className="absolute left-0 hidden group-hover:block shadow-lg rounded min-w-[160px] z-50">
              <Button
                label="Transactions"
                onClick={() => nav("/transactions")}
                type="button"
                className="text-left text-lg text-white hover:bg-gray-600 w-full px-4 py-2"
              />
              <Button
                label="Budgets"
                onClick={() => nav("/budgets")}
                type="button"
                className="text-left text-lg text-white hover:bg-gray-600 w-full px-4 py-2"
              />
              <Button
                label="Analytics"
                onClick={() => nav("/analytics/financialoverview")}
                type="button"
                className="text-left text-lg text-white hover:bg-gray-600 w-full px-4 py-2"
              />
            </div>
          </div>
        </div>
        <div className="w-32">
          <div className="relative group">
            <Heading
              label="Profile"
              className="text-white text-lg px-4 py-2 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
            />
            <div className="absolute left-0 mt-1 hidden group-hover:block bg-white shadow-lg rounded min-w-[160px] z-50">
              <Button
                label="Profile Settings"
                onClick={() => nav("/profile")}
                type="button"
                className="text-left text-sm text-black hover:bg-gray-100 w-full px-4 py-2"
              />
              <Button
                label="Linked Accounts"
                onClick={() => nav("/linkedaccounts")}
                type="button"
                className="text-left text-sm text-black hover:bg-gray-100 w-full px-4 py-2"
              />
              <Button
                label="Notifications"
                onClick={() => nav("/notifications")}
                type="button"
                className="text-left text-sm text-black hover:bg-gray-100 w-full px-4 py-2"
              />
              <Button
                label="Settings"
                onClick={() => nav("/settings")}
                type="button"
                className="text-left text-sm text-black hover:bg-gray-100 w-full px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
