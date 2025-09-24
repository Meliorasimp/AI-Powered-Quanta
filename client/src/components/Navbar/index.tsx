import "../../styles/index.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Heading from "../Text/Heading";
import { LayoutDashboardIcon, PiggyBankIcon, Menu, X } from "lucide-react";
import gehlee from "../../assets/gehlee.jpg";
import {
  setMobileOpen,
  setFinanceOpen,
  setProfileOpen,
} from "../../modules/Interaction.ts";
import { useAppDispatch } from "../../hooks";
import Qwen from "../../assets/qwen.svg";
import { toggleAiPopup } from "../../modules/Interaction.ts/dashboard/index.ts";

const Navbar = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const profilePicture = useSelector((state: RootState) => state.user.photo);
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );
  const mobileOpen = useSelector(
    (state: RootState) => state.interaction.isMobileOpen
  );
  const financeOpen = useSelector(
    (state: RootState) => state.interaction.isFinanceOpen
  );
  const profileOpen = useSelector(
    (state: RootState) => state.interaction.isProfileOpen
  );

  const themeClass = isThemePurple
    ? "purple"
    : isThemeLight
    ? "light"
    : isThemeDark
    ? "dark"
    : "";

  const handleNavigate = (path: string) => {
    dispatch(setMobileOpen(false));
    nav(path);
  };

  return (
    <div className={`w-full ${themeClass}`}>
      <div className="relative flex items-center justify-between px-6 py-4">
        <h1
          className="lg:text-3xl font-bold sm:text-pink-700 sm: text-2xl"
          onClick={() => nav("/")}
        >
          Quanta
        </h1>
        {/* Center nav (desktop only) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-x-6 z-20">
          {/* Dashboard */}
          <div
            className="w-8 h-8 hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => dispatch(toggleAiPopup())}
          >
            <img src={Qwen} alt="Qwen" />
          </div>
          <Button
            label="Dashboard"
            onClick={() => handleNavigate("/dashboard")}
            type="button"
            className="main-website-text-color text-lg hover:bg-gray-600 py-1 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
            icon={<LayoutDashboardIcon className="inline-block w-5 h-5 mr-2" />}
          />

          <div
            className="relative group"
            onMouseEnter={() => dispatch(setFinanceOpen(true))}
            onMouseLeave={() => dispatch(setFinanceOpen(false))}
          >
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
            <div
              className={`${
                financeOpen ? "block" : "hidden"
              } md:group-hover:block absolute left-0 top-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-[180px] z-50`}
            >
              <Button
                label="Transactions"
                onClick={() => handleNavigate("/transactions")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
              <Button
                label="Budgets"
                onClick={() => handleNavigate("/budgets")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
              <Button
                label="Analytics"
                onClick={() => handleNavigate("/analytics/financialoverview")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="w-32 hidden md:block">
          <div
            className="relative group z-10"
            onMouseEnter={() => dispatch(setProfileOpen(true))}
            onMouseLeave={() => dispatch(setProfileOpen(false))}
          >
            <div className="flex flex-row items-center">
              <div className="w-10 h-10">
                <img
                  src={profilePicture || gehlee}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <Heading
                label="Profile"
                className="text-white text-lg px-4 py-2 rounded cursor-pointer hover:bg-gray-600 transition-colors duration-200"
              />
            </div>
            <div
              className={`${
                profileOpen ? "block" : "hidden"
              } md:group-hover:block absolute right-0 top-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg min-w-[180px] z-50`}
            >
              <Button
                label="Profile Settings"
                onClick={() => handleNavigate("/profile")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
              <Button
                label="Linked Accounts"
                onClick={() => handleNavigate("/linkedaccounts")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
              <Button
                label="Notifications"
                onClick={() => handleNavigate("/notifications")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
              <Button
                label="Settings"
                onClick={() => handleNavigate("/settings")}
                type="button"
                className="text-left text-sm text-white hover:bg-gray-700 w-full px-4 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="md:hidden ml-auto">
          <button
            type="button"
            className="p-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => dispatch(setMobileOpen(!mobileOpen))}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden px-6 pb-4 ${mobileOpen ? "block" : "hidden"}`}
      >
        <div className="flex flex-col gap-2">
          <Button
            label="Dashboard"
            onClick={() => handleNavigate("/dashboard")}
            type="button"
            className="w-full text-left main-website-text-color text-base hover:bg-gray-700 py-2 px-3 rounded-lg"
            icon={<LayoutDashboardIcon className="inline-block w-5 h-5" />}
          />
          <div className="mt-2">
            <Heading label="Finance" className="text-white text-sm mb-1" />
            <div className="flex flex-col">
              <Button
                label="Transactions"
                onClick={() => handleNavigate("/transactions")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
              <Button
                label="Budgets"
                onClick={() => handleNavigate("/budgets")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
              <Button
                label="Analytics"
                onClick={() => handleNavigate("/analytics/financialoverview")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-3">
            <Heading label="Profile" className="text-white text-sm mb-1" />
            <div className="flex items-center gap-3 mb-2">
              <img
                src={profilePicture || gehlee}
                alt="profile"
                className="w-8 h-8 object-cover rounded-full"
              />
              <span className="text-white text-sm">Account</span>
            </div>
            <div className="flex flex-col">
              <Button
                label="Profile Settings"
                onClick={() => handleNavigate("/profile")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
              <Button
                label="Linked Accounts"
                onClick={() => handleNavigate("/linkedaccounts")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
              <Button
                label="Notifications"
                onClick={() => handleNavigate("/notifications")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
              <Button
                label="Settings"
                onClick={() => handleNavigate("/settings")}
                type="button"
                className="w-full text-left text-base text-white hover:bg-gray-700 py-2 px-3 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
