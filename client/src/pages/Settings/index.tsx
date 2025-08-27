import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Button from "../../components/Button";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  switchToDarkTheme,
  switchToLightTheme,
  switchToPurpleTheme,
} from "../../modules/Interaction.ts";

const Settings = () => {
  const dispatch = useDispatch();
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  return (
    <div
      className={`flex flex-row app ${
        isThemePurple
          ? "purple"
          : isThemeLight
          ? "light"
          : isThemeDark
          ? "dark"
          : isThemePurple
      }`}
    >
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hidden pb-2 border-b border-white">
          <Heading
            label="Settings"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Manage your website settings and preferences."
            className="text-base"
            variant="secondary"
          />
        </div>
        <div className="flex flex-col gap-y-5 mt-5 justify-start">
          <Heading
            label="Theme & Appearance"
            className="text-xl font-semibold"
          />
          <Heading label="Theme Selection" className="text-lg font-semibold" />
          <div className="flex flex-row gap-x-10 ">
            <Button
              label="Purple Haze"
              type="button"
              onClick={() => dispatch(switchToPurpleTheme())}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Modern Dark"
              type="button"
              onClick={() => dispatch(switchToDarkTheme())}
              className="border-2 py-2 px-10 rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
            <Button
              label="Modern Light"
              type="button"
              onClick={() => dispatch(switchToLightTheme())}
              className="border-2 py-2 px-10 h-full  rounded-lg w-1/6 hover:bg-gray-700 transition-colors duration-300 hover:cursor-pointer"
            />
          </div>
          <Heading label="Font size" className="text-lg font-semibold " />
          <div className="flex flex-row gap-x-10 ">
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
          <Heading label="Notifications" className="text-xl font-semibold " />
          <div className="flex flex-row gap-x-10">
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
