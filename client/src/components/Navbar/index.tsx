import "../../styles/index.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BanknoteArrowDown,
  Wallet,
  CreditCard,
  BellRing,
  ChartArea,
  Settings,
  User,
} from "lucide-react";

const Navbar = () => {
  const nav = useNavigate();

  return (
    <div className="w-1/4 h-screen navbar">
      <div className="flex flex-col items-start h-full gap-y-3">
        <h1 className="text-3xl font-bold mb-10 mt-4 text-purple-200">
          Quanta
        </h1>
        <Button
          label="Dashboard"
          onClick={() => nav("/")}
          type="button"
          className="main-website-text-color text-xl hover:bg-gray-600 w-full py-1 text-left cursor-pointer rounded-lg"
          icon={<LayoutDashboard className="inline-block ml-2" />}
        />
        <Button
          label="Transactions"
          onClick={() => nav("/transactions")}
          type="button"
          className="main-website-text-color text-xl hover:bg-gray-600 w-full py-1 text-left cursor-pointer rounded-lg"
          icon={<BanknoteArrowDown className="inline-block ml-2" />}
        />
        <Button
          label="Budgets"
          onClick={() => nav("/budgets")}
          type="button"
          className="main-website-text-color text-xl hover:bg-gray-600 w-full py-1 text-left cursor-pointer rounded-lg"
          icon={<Wallet className="inline-block ml-2" />}
        />
        <Button
          label="Linked Accounts"
          onClick={() => nav("/linkedaccounts")}
          type="button"
          className="main-website-text-color text-xl hover:bg-gray-600 w-full py-1 text-left cursor-pointer rounded-lg"
          icon={<CreditCard className="inline-block ml-2" />}
        />
        <Button
          label="Notifications"
          onClick={() => nav("/notifications")}
          type="button"
          className="main-website-text-color text-xl hover:bg-gray-600 w-full py-1 text-left cursor-pointer rounded-lg"
          icon={<BellRing className="inline-block ml-2" />}
        />
        <Button
          label="Analytics"
          onClick={() => nav("/analytics")}
          type="button"
          className="main-website-text-color text-xl hover:bg-gray-600 w-full py-1 text-left cursor-pointer rounded-lg"
          icon={<ChartArea className="inline-block ml-2" />}
        />
        <div className="flex flex-col items-start gap-y-2 mt-auto">
          <Button
            label="Settings"
            onClick={() => nav("/settings")}
            type="button"
            className="main-website-text-color text-xl w-full py-1 text-left cursor-pointer"
            icon={<Settings className="inline-block ml-2" />}
          />
          <Button
            label="Profile"
            onClick={() => nav("/profile")}
            type="button"
            className="main-website-text-color text-xl w-full py-1 text-left cursor-pointer mb-4"
            icon={<User className="inline-block ml-2" />}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
