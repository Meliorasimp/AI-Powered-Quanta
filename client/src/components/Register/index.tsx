import Button from "../Button";
import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph";
import investment from "../../assets/undraw_investment-data_frxx.svg";
import {
  switchToLoginForm,
  hideRegisterForm,
} from "../../modules/Interaction.ts";
import { RootState } from "../../store.ts";
import {
  setRegisterEmail,
  setRegisterUsername,
  setRegisterPassword,
  registerUser,
  resetRegisterForm,
} from "../../modules/Api/Users/userslice.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const emailAddressValue = useAppSelector(
    (state: RootState) => state.register.email
  );
  const usernameValue = useAppSelector(
    (state: RootState) => state.register.username
  );
  const passwordValue = useAppSelector(
    (state: RootState) => state.register.password
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterEmail(e.target.value));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterUsername(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterPassword(e.target.value));
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      emailAddressValue === "" ||
      usernameValue === "" ||
      passwordValue === ""
    ) {
      alert("All fields are required.");
      return;
    }
    if (passwordValue.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    dispatch(
      registerUser({
        email: emailAddressValue,
        username: usernameValue,
        password: passwordValue,
      })
    );
    dispatch(resetRegisterForm());
    dispatch(hideRegisterForm());
    console.log("Registration form submitted");
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                bg-black/50 backdrop-blur-xs z-50"
    >
      <div className="bg-[rgba(10,1,63,0.9)] w-2/3 h-3/4 flex flex-row justify-center rounded-2xl">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={investment}
            alt="Investment illustration"
            className="max-w-full h-auto"
          />
        </div>
        <div className="w-full pt-8 pr-8 pl-8">
          <Heading
            label="Turn your spending into savings!"
            className="text-white text-2xl font-bold mb-10"
          />
          <Paragraph
            label="Save more money by tracking your spending habits and finding areas to cut back."
            className="text-white"
            variant="secondary"
          />
          <form
            className="flex flex-col text-white pt-10 justify-center"
            onSubmit={handleRegisterSubmit}
          >
            <input
              type="email"
              placeholder="E-mail address"
              value={emailAddressValue}
              onChange={handleEmailChange}
              className="mb-4 p-2 rounded border"
            />
            <input
              type="text"
              placeholder="Username"
              value={usernameValue}
              onChange={handleUsernameChange}
              className="mb-4 p-2 rounded border"
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordValue}
              onChange={handlePasswordChange}
              className="mb-4 p-2 rounded border"
            />
            <Button
              label="Register"
              type="submit"
              onClick={() => {}}
              className="bg-blue-400 py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors duration-200 mb-4"
            />
            <Button
              label="Cancel"
              type="button"
              onClick={() => {
                dispatch(hideRegisterForm());
              }}
              className="bg-red-400 py-2 rounded-lg cursor-pointer hover:bg-red-500 transition-colors duration-200 mb-4"
            />
            <div className="flex flex-row justify-center gap-x-2">
              <Paragraph label="Already have an account?" variant="tertiary" />
              <Button
                label="Log in"
                onClick={() => {
                  dispatch(switchToLoginForm());
                }}
                type="button"
                className="text-gray-200 hover:underline cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
