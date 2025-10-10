import Navbar from "../../components/Navbar";
import Paragraph from "../../components/Text/Paragraph";
import Heading from "../../components/Text/Heading";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/Button";
import user from "../../assets/circle-user-round.svg";
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
import { setLoggedIn, setUser } from "../../modules/Api/Users/userslice.ts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearTransactions } from "../../modules/Api/transaction/displaytransaction.ts";
import { clearBudgets } from "../../modules/Api/Budgets/displaybudget.ts";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleUserLogout = async () => {
    console.log("Logging out user with ID:", userid);
    try {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(
        setUser({
          id: "",
          email: "",
          username: "",
          photo: "",
          firstname: "",
          lastname: "",
        })
      );
      dispatch(setLoggedIn(false));
      dispatch(setUser({ id: "", email: "", username: "" }));
      dispatch(clearTransactions());
      dispatch(clearBudgets());
      console.log("Logout response:", response.data);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
      <div className="w-10/11 min-h-screen flex flex-col py-8 px-4 sm:px-6 lg:px-8 gap-y-8 overflow-auto mx-auto">
        <header className="flex flex-col gap-2">
          <Heading
            label="Profile"
            className="text-2xl font-semibold tracking-tight"
          />
          <Paragraph
            label="Manage your identity, security, and account preferences."
            className="text-sm opacity-80"
            variant="secondary"
          />
        </header>

        {/* Avatar + Upload */}
        <section className="card-surface">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6">
            <div className="avatar-ring w-24 h-24 sm:w-28 sm:h-28">
              <img src={profilePicture || user} alt="profile" />
            </div>
            <div className="flex-1 space-y-2">
              <Heading
                label="Profile Picture"
                className="text-lg font-semibold"
              />
              <Paragraph
                label="Upload a clear photo under 15MB."
                variant="tertiary"
                className="text-xs opacity-70"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="mt-1 text-xs sm:text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:sm:text-sm file:font-medium file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Full Name */}
        <section className="card-surface p-6">
          <div className="card-header">
            <div>
              <p className="section-title">Identity</p>
              <Heading label="Full Name" className="text-lg font-semibold" />
            </div>
          </div>
          <form onSubmit={handleFullNameSubmit} className="input-grid">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide opacity-70">
                First Name
              </label>
              <input
                type="text"
                placeholder={userfirstname}
                className="input-field border-2 rounded-full border-gray-500 p-2 font-light mt-2 text-lg"
                value={firstname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setFirstName(e.target.value))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide opacity-70">
                Last Name
              </label>
              <input
                type="text"
                placeholder={userLastName}
                className="input-field border-2 rounded-full border-gray-500 p-2 font-light mt-2 text-lg"
                value={lastname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setLastName(e.target.value))
                }
              />
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
              <Button
                type="submit"
                label="Save Name"
                icon={<FaPencilAlt className="inline-block" />}
                className="gradient-btn-primary px-4 py-2 rounded-full"
              />
            </div>
          </form>
        </section>

        {/* Email */}
        <section className="card-surface p-6">
          <div className="card-header">
            <div>
              <p className="section-title">Contact</p>
              <Heading
                label="Email Address"
                className="text-lg font-semibold"
              />
            </div>
          </div>
          <form
            onSubmit={handleEmailSubmit}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-end"
          >
            <div className="flex-1 w-full flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide opacity-70">
                Primary Email
              </label>
              <input
                type="email"
                placeholder={useremail}
                className="input-field border-2 rounded-full border-gray-500 p-2 font-light mt-2 text-lg"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setEmail(e.target.value))
                }
              />
            </div>
            <Button
              type="submit"
              label="Update Email"
              icon={<FaPlus className="inline-block" />}
              className="gradient-btn-primary px-4 py-2 rounded-full"
            />
          </form>
        </section>

        {/* Password */}
        <section className="card-surface p-6">
          <div className="card-header">
            <div>
              <p className="section-title">Security</p>
              <Heading label="Password" className="text-lg font-semibold" />
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="input-grid">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide opacity-70">
                Current Password
              </label>
              <input
                type="password"
                className="input-field border-2 rounded-full border-gray-500 p-2 font-light mt-2 text-lg"
                value={currentpasswordInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setCurrentPassword(e.target.value))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] uppercase tracking-wide opacity-70">
                New Password
              </label>
              <input
                type="password"
                className="input-field border-2 rounded-full border-gray-500 p-2 font-light mt-2 text-lg"
                value={newpasswordInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setNewPassword(e.target.value))
                }
              />
            </div>
            <div className="sm:col-span-2 flex justify-end mt-2">
              <Button
                type="submit"
                label="Save Password"
                icon={<FaPencilAlt className="inline-block" />}
                className="gradient-btn-primary px-4 py-2 rounded-full"
              />
            </div>
          </form>
        </section>

        {/* Account Security */}
        <section className="card-surface p-6">
          <div className="card-header">
            <div>
              <p className="section-title">Account</p>
              <Heading
                label="Account Security"
                className="text-lg font-semibold"
              />
            </div>
          </div>
          <div className="action-bar">
            <Button
              onClick={() => handleUserLogout()}
              type="button"
              label="Log Out"
              icon={<FaDoorClosed className="inline-block" />}
              className="gradient-btn-primary px-4 py-2 rounded-full mt-4"
            />
            <Button
              onClick={() => {}}
              type="button"
              label="Remove Account"
              icon={<FaTrash className="inline-block" />}
              className="danger-outline px-4 py-2 rounded-full mt-4"
            />
          </div>
        </section>
      </div>
      {isRegisterFormVisible && <RegisterForm />}
      {isLoginFormVisible && <Login />}
    </div>
  );
};

export default Profile;
