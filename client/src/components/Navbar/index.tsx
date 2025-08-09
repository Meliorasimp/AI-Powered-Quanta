import "../../styles/index.css";
import Button from "../Button";

const Navbar = () => {
  return (
    <div className="w-1/5 h-screen navbar">
      <div className="flex flex-col items-start h-full gap-y-3">
        <h1 className="text-3xl font-bold mb-10 mt-4">Quanta</h1>
        <Button
          label="Dashboard"
          onClick={() => console.log("Dashboard clicked")}
          type="button"
          className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer rounded-lg"
        />
        <Button
          label="Transactions"
          onClick={() => console.log("Transactions clicked")}
          type="button"
          className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer"
        />
        <Button
          label="Budgets"
          onClick={() => console.log("Budgets clicked")}
          type="button"
          className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer"
        />
        <Button
          label="Linked Accounts"
          onClick={() => console.log("Linked Accounts clicked")}
          type="button"
          className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer"
        />
        <Button
          label="Notifications"
          onClick={() => console.log("Notifications clicked")}
          type="button"
          className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer"
        />
        <Button
          label="Analytics"
          onClick={() => console.log("Analytics clicked")}
          type="button"
          className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer"
        />
        <div className="flex flex-col items-start gap-y-2 mt-auto">
          <Button
            label="Settings"
            onClick={() => console.log("Settings clicked")}
            type="button"
            className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer"
          />
          <Button
            label="Profile"
            onClick={() => console.log("Profile clicked")}
            type="button"
            className="navbar-button-color text-xl hover:bg-gray-200 w-full py-1 text-left cursor-pointer mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
