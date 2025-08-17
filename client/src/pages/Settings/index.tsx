import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Button from "../../components/Button";

const Settings = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hidden pb-2 border-b border-white">
          <Heading
            label="Settings"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Manage your website settings and preferences."
            className="text-base main-website-text-color"
            variant="secondary"
          />
        </div>
        <div className="flex flex-col gap-y-5 mt-5 justify-start">
          <Heading
            label="Theme & Appearance"
            className="text-xl font-semibold text-white"
          />
          <Heading
            label="Theme Selection"
            className="text-lg font-semibold text-white"
          />
          <div className="flex flex-row gap-x-10 text-white">
            <Button
              label="Purple Haze"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Modern Dark"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Modern Light"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 h-full  rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
          </div>
          <Heading
            label="Font size"
            className="text-lg font-semibold text-white"
          />
          <div className="flex flex-row gap-x-10 text-white">
            <Button
              label="Small"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Medium"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Large"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
          </div>
          <Heading
            label="Currency Format"
            className="text-lg font-semibold text-white"
          />
          <div className="flex flex-row gap-x-10 text-white">
            <Button
              label="Philippine Peso"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/5 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="US Dollar"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/5 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="UK Pound"
              type="button"
              onClick={() => {}}
              className="border-2 py-2 px-10 rounded-lg w-1/5 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
          </div>
          <Heading
            label="Notifications"
            className="text-xl font-semibold text-white"
          />
          <div className="flex flex-row gap-x-10 text-white">
            <Button
              label="Enable"
              type="button"
              onClick={() => {}}
              className="py-2 px-10 rounded-lg w-1/5transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Disable"
              type="button"
              onClick={() => {}}
              className="py-2 px-10 rounded-lg w-1/5 text-red-400 transition-colors duration-300 hover:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
