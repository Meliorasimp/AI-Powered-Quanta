import { motion } from "framer-motion";
import landingpagebg from "../../assets/landingpage-bg.jpg";
import LandingPageNavbar from "../../components/Landingpagenavbar";
import Heading from "../../components/Text/Heading";
import { ChartBar, HandCoins, NotebookTabs } from "lucide-react";
import Paragraph from "../../components/Text/Paragraph";
import "../../styles/index.css";
import RegisterForm from "../../components/Register";
import Login from "../../components/Login";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
const About = () => {
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
      <div className="relative mt-10 w-full sm:text-3xl md:text-5xl font-semibold leading-tight sm:leading-snug pb-5 sm:pb-7 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Heading
            label="The Website that helps you learn and grow your Finances"
            className="text-4xl text-center"
          />
        </motion.div>
      </div>
      <div className="flex flex-row mx-30 h-96 gap-x-10">
        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.2,
          }}
          className="bg-green-600 opacity-90 w-1/3 h-full rounded-lg flex flex-col items-center justify-start hover:scale-101 transition-scale duration-600 pt-10"
        >
          <HandCoins size={80} className="inline-block" color="lightgreen" />
          <span className="text-3xl font-semibold ml-4 text-green-300 text-glow-green">
            Expense Tracker
          </span>
          <div className="text-left mx-5 mt-3">
            <Paragraph
              variant="secondary"
              label="Easily keep track of every expense and take full control of your budget with clear, organized insights. 
            Quanta helps you record your spending, categorize transactions, Input your income and monitor your progress in real time."
            />
          </div>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: -30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 0.4,
          }}
          className="bg-green-600 opacity-90 w-1/3 h-full rounded-lg flex flex-col items-center justify-start hover:scale-101 transition-scale duration-600 pt-10"
        >
          <NotebookTabs size={80} className="inline-block" color="lightgreen" />
          <span className="text-3xl font-semibold ml-4 text-green-300 text-glow-green">
            Budget Planner
          </span>
          <div className="text-left mx-5 mt-3">
            <Paragraph
              variant="secondary"
              label="Plan your budget effectively with Quanta. Set your financial goals, allocate funds to different categories, and track your progress with ease."
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-green-600 opacity-90 w-1/3 h-full rounded-lg flex flex-col items-center justify-start hover:scale-101 transition-scale duration-600 pt-10"
        >
          <ChartBar size={80} className="inline-block" color="lightgreen" />
          <span className="text-3xl font-semibold ml-4 text-green-300 text-glow-green">
            Spending Analytics
          </span>
          <div className="text-left mx-5 mt-3">
            <Paragraph
              variant="secondary"
              label="Gain deeper insight into your finances with interactive visual charts and detailed reports that bring your spending patterns to life. 
              Instantly spot trends, track changes over time, and identify habits that may be helping or hurting your goals."
            />
          </div>
        </motion.div>
      </div>
      {RegisterFormState && <RegisterForm />}
      {LoginFormState && <Login />}
    </div>
  );
};

export default About;
