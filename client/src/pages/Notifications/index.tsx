import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import NotificationBar from "../../components/Notificationbar";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

const Notifications = () => {
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
          : ""
      }`}
    >
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hiddenpb-2">
          <Heading
            label="Notifications"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Stay updated with your financial activities and alerts."
            className="text-base main-website-text-color"
            variant="secondary"
          />
        </div>
        <div>
          <div className="flex flex-row justify-start gap-x-20 border-t border-gray-600 border-b">
            <Button
              label="All"
              className="text-base border-b border-transparent hover:border-gray-400 px-2 py-2 cursor-pointer"
              onClick={() => console.log("Marked all as read")}
              type="button"
            />
            <Button
              label="Unread"
              className="text-base main-website-text-color border-b border-transparent hover:border-gray-400 px-2 py-2 cursor-pointer"
              onClick={() => console.log("Marked all as read")}
              type="button"
            />
            <Button
              label="Archived"
              className="text-base main-website-text-color border-b border-transparent hover:border-gray-400 px-2 py-2 cursor-pointer"
              onClick={() => console.log("Marked all as read")}
              type="button"
            />
            <Button
              label="Financial Activity"
              className="text-base main-website-text-color border-b border-transparent hover:border-gray-400 px-2 py-2 cursor-pointer"
              onClick={() => console.log("Marked all as read")}
              type="button"
            />
            <Button
              label="Budget Goals"
              className="text-base main-website-text-color border-b border-transparent hover:border-gray-400 px-2 py-2 cursor-pointer"
              onClick={() => console.log("Marked all as read")}
              type="button"
            />
          </div>
          <div className="flex flex-col gap-y-5 pt-5">
            <NotificationBar
              title="New Budget Created"
              timestamp={new Date()}
              message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor..."
              categorytag="Bill payment"
            />
            <NotificationBar
              title="New Message"
              timestamp={new Date()}
              message="You have received a new message..."
              categorytag="Message"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
