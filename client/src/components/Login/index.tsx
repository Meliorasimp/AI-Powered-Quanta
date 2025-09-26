import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph";
import { hideLoginForm } from "../../modules/Interaction.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";
import google from "../../assets/google.png";
import loginimage from "../../assets/verifydata.svg";
import github from "../../assets/github.png";
import Button from "../Button";

import { RootState } from "../../store.ts";
import {
  setLoginPassword,
  setLoginEmail,
  loginUser,
  setUser,
} from "../../modules/Api/Users/userslice.ts";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../modules/Interaction.ts";
import "../../styles/index.css";
const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const emailValue = useAppSelector((state: RootState) => state.login.email);
  const passwordValue = useAppSelector(
    (state: RootState) => state.login.password
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLoginEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLoginPassword(e.target.value));
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleGithubLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailValue === "" || passwordValue === "") {
      alert("Both fields are required");
      return;
    }

    try {
      const result = await dispatch(
        loginUser({ email: emailValue, password: passwordValue })
      ).unwrap();

      dispatch(LoginUser());
      console.log("Dispatching setUser with:", {
        email: result.user.email,
        id: result.user.id,
        username: result.user.username,
      });
      dispatch(
        setUser({
          email: result.user.email,
          id: result.user.id,
          username: result.user.username,
        })
      );

      dispatch(hideLoginForm());
      navigate("/dashboard");
      console.log("Login success:", result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                bg-black/50 backdrop-blur-xs z-50 "
    >
      <div className="bg-gray-900 w-2/3 h-3/4 flex flex-row justify-center rounded-2xl items-center">
        <div className="w-full pr-8 pl-8">
          <div className="text-white">
            <Heading
              label="Log in to stay on top of your finances"
              className="text-white text-2xl font-bold "
            />
            <Paragraph
              label="Enter your credentials to access your account."
              variant="secondary"
            />
            <form
              className="flex flex-col text-white pt-10 justify-center pb-2"
              onSubmit={handleLoginSubmit}
            >
              <input
                type="email"
                placeholder="E-mail address"
                value={emailValue}
                onChange={handleEmailChange}
                className="mb-4 p-2 rounded border text-base"
              />
              <input
                type="password"
                placeholder="Password"
                value={passwordValue}
                onChange={handlePasswordChange}
                className="mb-4 p-2 rounded bg-transparent border border-white text-base"
              />
              <Button
                label="Login"
                type="submit"
                onClick={() => {}}
                className="bg-blue-400 py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors duration-200 mb-4 text-lg"
              />
              <Button
                label="Cancel"
                type="button"
                onClick={() => dispatch(hideLoginForm())}
                className="bg-red-400 py-2 rounded-lg cursor-pointer hover:bg-red-500 transition-colors duration-200 mb-4 text-lg"
              />
            </form>
            <div>
              <p className="text-center text-lg">Or login using</p>
              <div className="flex flex-row justify-center pt-2 gap-x-5">
                <div className="w-12 h-12">
                  <img
                    src={google}
                    alt="Google logo"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={handleGoogleLogin}
                  />
                </div>
                <div className="w-12 h-12">
                  <img
                    src={github}
                    alt="GitHub logo"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={handleGithubLogin}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={loginimage}
            alt="Login illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
