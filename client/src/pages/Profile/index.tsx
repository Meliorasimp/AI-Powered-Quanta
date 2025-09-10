import Navbar from "../../components/Navbar";
import Paragraph from "../../components/Text/Paragraph";
import Heading from "../../components/Text/Heading";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import gehlee from "../../assets/gehlee.jpg";
import { FaPencilAlt, FaPlus, FaDoorClosed, FaTrash } from "react-icons/fa";
import {
  setFirstName,
  setLastName,
  setEmail,
  setCurrentPassword,
  setNewPassword,
  updateFullName,
  updateEmail,
  updatePassword,
} from "../../modules/Api/Users/userprofile";
import { uploadProfilePicture } from "../../modules/Api/Users/userprofile";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Login from "../../components/Login/index.tsx";
import RegisterForm from "../../components/Register/index.tsx";
import { setUser } from "../../modules/Api/Users/userslice.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";

const Profile = () => {
  const dispatch = useAppDispatch();

  const { isRegisterFormVisible, isLoginFormVisible } = useAppSelector(
    (state: RootState) => state.interaction
  );
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );
  const userid = useSelector((state: RootState) => state.user.id);
  const userfirstname = useSelector((state: RootState) => state.user.firstname);
  const userLastName = useSelector((state: RootState) => state.user.lastname);
  const useremail = useSelector((state: RootState) => state.user.email);
  const profilePicture = useSelector((state: RootState) => state.user.photo);
  console.log("Profile Picture from Redux:", profilePicture);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { firstname, lastname } = useSelector(
    (state: RootState) => state.fullname
  );
  const { email } = useAppSelector((state: RootState) => state.email);
  const { currentpasswordInput, newpasswordInput } = useSelector(
    (state: RootState) => state.password
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    console.log("Selected file:", file);
    formData.append("profilePicture", file);

    dispatch(uploadProfilePicture({ id: userid, formData }));
  };

  const handleFullNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstname || !lastname) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await dispatch(
        updateFullName({ firstname, lastname, id: userid })
      ).unwrap();
      dispatch(
        setUser({
          firstname: response.user.firstname,
          lastname: response.user.lastname,
          id: userid,
        })
      );
      dispatch(setFirstName(""));
      dispatch(setLastName(""));
      toast.success("Full name updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log("Update error:", error);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "") {
      alert("Email field is required");
      return;
    }
    try {
      const response = await dispatch(
        updateEmail({ email, id: userid })
      ).unwrap();
      dispatch(setUser({ email: response.user.email, id: userid }));
      dispatch(setEmail(""));
      toast.success("Email updated successfully!");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentpasswordInput || !newpasswordInput) {
      alert("Both fields are required");
      return;
    }
    try {
      await dispatch(
        updatePassword({
          currentpassword: currentpasswordInput,
          newpassword: newpasswordInput,
          id: userid,
        })
      ).unwrap();
      toast.success("Email updated successfully!");
      alert("Password updated successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
      console.log(err);
    }
  };
  return (
    <div
      className={`flex flex-col app w-full ${
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
      <div className="w-full min-h-screen flex flex-col py-5 px-5 gap-y-2 overflow-auto mx-auto">
        <div className="pb-2 border-b">
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
          <form
            className="flex flex-row items-center gap-x-5 w-3/4 py-3"
            encType="multipart/form-data"
          >
            <div className="bg-yellow-200 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={profilePicture || gehlee}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="mt-2 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200"
            />
          </form>

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
                <form
                  className="flex w-full gap-2"
                  onSubmit={handleFullNameSubmit}
                >
                  <input
                    type="text"
                    placeholder={userfirstname}
                    className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                    value={firstname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch(setFirstName(e.target.value));
                    }}
                  />
                  <input
                    type="text"
                    placeholder={userLastName}
                    className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                    value={lastname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch(setLastName(e.target.value))
                    }
                  />
                  <Button
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
                <form
                  className="w-full justify-between flex"
                  onSubmit={handleEmailSubmit}
                >
                  <input
                    type="text"
                    placeholder={useremail}
                    className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch(setEmail(e.target.value));
                    }}
                  />
                  <Button
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
              <form
                className="flex w-full gap-2"
                onSubmit={handlePasswordSubmit}
              >
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                  value={currentpasswordInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setCurrentPassword(e.target.value));
                  }}
                />
                <input
                  type="text"
                  className="border-2 border-gray-300 rounded-md p-2 w-1/3"
                  value={newpasswordInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(setNewPassword(e.target.value));
                  }}
                />
                <Button
                  type="submit"
                  label="Save Password"
                  icon={<FaPencilAlt className="inline-block" />}
                  className="py-2 px-12 rounded-md hover:bg-gray-700 cursor-pointer ml-auto"
                />
              </form>
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
      {isRegisterFormVisible && <RegisterForm />}
      {isLoginFormVisible && <Login />}
    </div>
  );
};

export default Profile;
