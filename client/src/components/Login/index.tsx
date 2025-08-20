import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph";
import { hideLoginForm } from "../../modules/Interaction.ts";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub, FaTwitter, FaMicrosoft } from "react-icons/fa";
import Button from "../Button";

const Login = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                bg-black/50 backdrop-blur-xs z-50"
    >
      <div
        className="bg-[rgba(10,1,63,0.9)] w-2/3 h-3/4 flex flex-row justify-center rounded-2xl"
        onClick={() => dispatch(hideLoginForm())}
      >
        <div className="w-full pt-8 pr-8 pl-8">
          <div className="text-white">
            <Heading
              label="Log in to stay on top of your finances"
              className="text-white text-2xl font-bold mb-10"
            />
            <Paragraph
              label="Enter your credentials to access your account."
              variant="secondary"
            />
            <form className="flex flex-col text-white pt-10 justify-center pb-2">
              <input
                type="email"
                placeholder="E-mail address"
                className="mb-4 p-2 rounded border"
              />
              <input
                type="password"
                placeholder="Password"
                className="mb-4 p-2 rounded bg-transparent border border-white"
              />
              <Button
                label="Login"
                type="button"
                onClick={() => {}}
                className="bg-blue-400 py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition-colors duration-200 mb-4"
              />
              <Button
                label="Cancel"
                type="button"
                onClick={() => {}}
                className="bg-red-400 py-2 rounded-lg cursor-pointer hover:bg-red-500 transition-colors duration-200 mb-4"
              />
            </form>
            <div>
              <Paragraph label="Or login using" variant="tertiary" />
              <div className="flex flex-row justify-center pt-2">
                <FcGoogle className="text-3xl mx-2 cursor-pointer hover:scale-110 transition-transform duration-200" />
                <FaFacebook className="text-3xl mx-2 cursor-pointer hover:scale-110 transition-transform duration-200" />
                <FaGithub className="text-3xl mx-2 cursor-pointer hover:scale-110 transition-transform duration-200" />
                <FaTwitter className="text-3xl mx-2 cursor-pointer hover:scale-110 transition-transform duration-200" />
                <FaMicrosoft className="text-3xl mx-2 cursor-pointer hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-center"></div>
      </div>
    </div>
  );
};

export default Login;
