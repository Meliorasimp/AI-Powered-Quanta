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
      className="landing-page-background-color relative min-h-screen w-full flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for text readability on busy backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      <LandingPageNavbar />

      <div className="relative z-10 flex flex-col w-full flex-grow items-center justify-center px-4 sm:px-6 md:px-12 text-center">
        <Heading
          label="Take control of your financial future today! Smarter Spending Starts with Better Tracking"
          className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight sm:leading-snug pb-5 sm:pb-7 max-w-4xl mx-auto"
        />
        <Heading
          label="Take control of your finances effortlessly. Track your spending, plan your budget, and watch your savings grow."
          className="text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto"
        />
        <Button
          label="Get Started"
          type="button"
          onClick={() => dispatch(showRegisterForm())}
          className="mt-6 py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 bg-black/90 rounded-full text-base sm:text-lg hover:bg-gray-900 transition-colors duration-200 cursor-pointer"
        />
      </div>

      {RegisterFormState && <RegisterForm />}
      {LoginFormState && <Login />}
    </div>
  );
};

export default LandingPage;
