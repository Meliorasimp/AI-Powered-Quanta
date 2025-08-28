import Navbar from "../../components/Navbar";
import Paragraph from "../../components/Text/Paragraph";
import Heading from "../../components/Text/Heading";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import gehlee from "../../assets/gehlee.jpg";
import { FaPencilAlt, FaPlus, FaDoorClosed, FaTrash } from "react-icons/fa";
import google from "../../assets/google.png";
import brankas from "../../assets/brankas.jpg";
import finverse from "../../assets/finverse.jpg";

const Profile = () => {
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
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2 overflow-auto">
        <div className="overflow-hidden pb-2 border-b">
          <Heading
            label="Profile"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="View and edit your profile information."
            className="text-base main-website-text-color"
            variant="secondary"
          />
        </div>
        <div className="h-2/12">
          <div className="flex flex-row items-center gap-x-5 w-3/4 py-3">
            <div className="bg-yellow-200 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={gehlee}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mr-auto">
              <Heading label="Profile Picture" />
              <Paragraph
                label="File size must be below 15Mb"
                variant="tertiary"
              />
            </div>
            <div className="flex flex-row gap-x-5">
              <Button
                onClick={() => {}}
                type="button"
                label="Change Picture"
                className="bg-gray-600 rounded-lg px-5 py-2 hover:bg-gray-700 cursor-pointer"
              />
              <Button
                onClick={() => {}}
                type="button"
                label="Remove"
                className="px-7 py-2 text-red-300 hover:text-red-400 cursor-pointer"
              />
            </div>
          </div>
          <div className="w-full border-b py-5">
            <div className="w-3/4">
              <Heading label="Full Name" className="font-bold text-lg" />
              <div className="flex w-full pb-2">
                <div className="w-1/3 pr-2">
                  <Paragraph
                    label="First Name"
                    className="text-xs"
                    variant="tertiary"
                  />
                </div>
                <div className="w-1/3 pl-2">
                  <Paragraph
                    label="Last Name"
                    className="text-xs"
                    variant="tertiary"
                  />
                </div>
              </div>
              <div>
                <form className="flex w-full gap-2">
                  <input
                    type="text"
                    placeholder="Meinard Legashki"
                    className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                  />
                  <input
                    type="text"
                    placeholder="Limlengco"
                    className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                  />
                  <Button
                    onClick={() => {}}
                    type="submit"
                    label="Save Information"
                    icon={<FaPencilAlt className="inline-block" />}
                    className="py-2 px-12 rounded-md hover:bg-gray-700 cursor-pointer ml-auto"
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="w-full border-b py-5">
            <Heading label="Email Address" className="font-bold text-lg" />
            <Paragraph
              label="Manage your Email Address here."
              className="text-xs"
              variant="tertiary"
            />
            <div className="flex flex-col w-3/4 pt-3">
              <div className="w-1/2 pr-2 pb-3">
                <Paragraph
                  label="Email"
                  className="text-xs"
                  variant="tertiary"
                />
              </div>
              <div>
                <form className="w-full justify-between flex">
                  <input
                    type="text"
                    placeholder="limlengcomeinard@gmail.com"
                    className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                  />
                  <Button
                    onClick={() => {}}
                    type="submit"
                    label="Add Another Email"
                    icon={<FaPlus className="inline-block" />}
                    className="py-2 px-10 rounded-md hover:bg-gray-700 cursor-pointer ml-auto"
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="w-full border-b py-5">
            <Heading label="Password" className="font-bold text-lg" />
            <Paragraph
              label="Change your password here"
              className="text-xs"
              variant="tertiary"
            />
            <div className="flex flex-col w-3/4 pt-3">
              <div className="flex w-full pb-2">
                <div className="w-1/3 pr-2">
                  <Paragraph
                    label="Current Password"
                    className="text-xs"
                    variant="tertiary"
                  />
                </div>
                <div className="w-1/3 pl-2">
                  <Paragraph
                    label="New Password"
                    className="text-xs"
                    variant="tertiary"
                  />
                </div>
              </div>
              <form className="flex w-full gap-2">
                <input
                  type="text"
                  placeholder="Dummy Password"
                  className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                />
                <input
                  type="text"
                  placeholder="New Dummy Password"
                  className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                />
                <Button
                  onClick={() => {}}
                  type="submit"
                  label="Save Password"
                  icon={<FaPencilAlt className="inline-block" />}
                  className="py-2 px-12 rounded-md hover:bg-gray-700 cursor-pointer ml-auto"
                />
              </form>
            </div>
          </div>
          <div className="w-full border-b py-5">
            <Heading label="Integrated Account" className="font-bold text-lg" />
            <Paragraph
              label="Integrate your accounts for a seamless experience."
              className="text-xs"
              variant="tertiary"
            />
            <div className="flex w-3/4 pt-3">
              <div className="w-17 p-3">
                <img src={google} alt="" />
              </div>
              <div className="flex flex-col justify-center mr-auto">
                <Heading label="Google Account" className="font-bold text-lg" />
                <Paragraph
                  label="Connect to your Gmail Account to enable email notifications from there."
                  className="text-xs"
                  variant="tertiary"
                />
              </div>
              <Button
                onClick={() => {}}
                type="button"
                label="Connect"
                icon={<FaPlus className="inline-block" />}
                className="px-10 rounded-md hover:bg-gray-700 cursor-pointer mt-3"
              />
            </div>
            <div className="flex w-3/4 pt-3">
              <div className="w-17 p-3">
                <img src={brankas} alt="" />
              </div>
              <div className="flex flex-col justify-center mr-auto">
                <Heading
                  label="Brankas Account"
                  className="font-bold text-lg"
                />
                <Paragraph
                  label="Connect to your Brankas Account to enable financial data access."
                  className="text-xs"
                  variant="tertiary"
                />
              </div>
              <Button
                onClick={() => {}}
                type="button"
                label="Connect"
                icon={<FaPlus className="inline-block" />}
                className="px-10 rounded-md hover:bg-gray-700 cursor-pointer mt-3"
              />
            </div>
            <div className="flex w-3/4 pt-3">
              <div className="w-17 p-3">
                <img src={finverse} alt="" />
              </div>
              <div className="flex flex-col justify-center mr-auto">
                <Heading
                  label="Finverse Account"
                  className="font-bold text-lg"
                />
                <Paragraph
                  label="Connect to your Finverse Account to enable financial data access."
                  className="text-xs"
                  variant="tertiary"
                />
              </div>
              <Button
                onClick={() => {}}
                type="button"
                label="Connect"
                icon={<FaPlus className="inline-block" />}
                className="px-10 rounded-md hover:bg-gray-700 cursor-pointer mt-3"
              />
            </div>
          </div>
          <div className="w-full py-5">
            <Heading label="Account Security" className="font-bold text-lg" />
            <Paragraph
              label="Manage your account security settings."
              className="text-xs"
              variant="tertiary"
            />
            <div className="flex gap-x-5">
              <Button
                onClick={() => {}}
                type="button"
                label="Log out"
                icon={<FaDoorClosed className="inline-block" />}
                className="rounded-lg px-5 py-2 hover:bg-gray-700 cursor-pointer mt-3"
              />
              <Button
                onClick={() => {}}
                type="button"
                label="Remove Account"
                icon={<FaTrash className="inline-block" />}
                className="rounded-lg px-5 py-2 hover:bg-gray-700 cursor-pointer mt-3 text-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
