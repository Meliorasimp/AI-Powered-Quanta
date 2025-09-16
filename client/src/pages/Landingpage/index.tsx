import "../../styles/index.css";
import LandingPageNavbar from "../../components/Landingpagenavbar";
import Button from "../../components/Button";
import Heading from "../../components/Text/Heading";
import { RootState } from "../../store";
import { useAppSelector, useAppDispatch } from "../../hooks";
import RegisterForm from "../../components/Register";
import Login from "../../components/Login";
import { showRegisterForm } from "../../modules/Interaction.ts";
import landingpagebg from "../../assets/landingpage-bg.jpg";
import { motion } from "framer-motion";
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
      className="landing-page-background-color relative min-h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${landingpagebg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LandingPageNavbar />
      <div className="relative z-10 flex flex-col flex-grow w-full items-center justify-center px-4 sm:px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            label="Take control of your financial future today! Smarter Spending Starts with Better Tracking"
            className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-tight sm:leading-snug pb-5 sm:pb-7 max-w-4xl mx-auto"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto"
        >
          <Heading label="Take control of your finances effortlessly. Track your spending, plan your budget, and watch your savings grow." />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            label="Get Started"
            type="button"
            onClick={() => dispatch(showRegisterForm())}
            className="mt-6 py-3 px-6 sm:py-4 sm:px-8 md:py-5 md:px-10 bg-green-500 rounded-full text-base sm:text-lg hover:bg-green-600 transition-colors duration-200 cursor-pointer"
          />
        </motion.div>
      </div>

      {RegisterFormState && <RegisterForm />}
      {LoginFormState && <Login />}
    </div>
  );
};

export default LandingPage;
