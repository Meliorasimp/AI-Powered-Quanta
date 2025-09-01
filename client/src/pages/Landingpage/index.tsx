import "../../styles/index.css";
import LandingPageNavbar from "../../components/Landingpagenavbar";
import Button from "../../components/Button";
import Heading from "../../components/Text/Heading";
import bgImage from "../../assets/calculator.jpg";
import { RootState } from "../../store";
import { useAppSelector, useAppDispatch } from "../../hooks";
import RegisterForm from "../../components/Register";
import Login from "../../components/Login";
import { showRegisterForm } from "../../modules/Interaction.ts";
const LandingPage = () => {
  const dispatch = useAppDispatch();
  const RegisterFormState = useAppSelector(
    (state: RootState) => state.interaction.isRegisterFormVisible
  );

  const LoginFormState = useAppSelector(
    (state: RootState) => state.interaction.isLoginFormVisible
  );
  return (
    <div
      className="landing-page-background-color h-screen w-screen flex flex-col"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover" }}
    >
      <LandingPageNavbar />
      <div className="flex-grow flex-col w-full items-center justify-center flex px-50 text-center">
        <Heading
          label="Take control of your financial future today! Smarter Spending Starts with Better Tracking"
          className="text-5xl font-semibold leading-snug pb-7"
        />
        <Heading
          label="Take control of your finances effortlessly. Track your spending, plan your budget, and watch your savings grow."
          className="text-xl font-light leading-snug"
        />
        <Button
          label="Get Started"
          type="button"
          onClick={() => dispatch(showRegisterForm())}
          className="mt-5 py-5 px-10 bg-black rounded-full opacity-90 text-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
        />
      </div>
      {RegisterFormState && <RegisterForm />}
      {LoginFormState && <Login />}
    </div>
  );
};

export default LandingPage;
