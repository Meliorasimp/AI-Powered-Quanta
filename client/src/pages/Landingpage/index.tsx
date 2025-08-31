import "../../styles/index.css";
import LandingPageNavbar from "../../components/Landingpagenavbar";
import Heading from "../../components/Text/Heading";
const LandingPage = () => {
  return (
    <div className="landing-page-background-color h-screen w-screen flex flex-col">
      <LandingPageNavbar />
      <div className="flex-grow flex-col w-1/2 items-center justify-center flex">
        <Heading
          label="Take control of your financial future today!"
          className="text-5xl font-bold ml-20 leading-snug"
        />
        <Heading
          label="With Quanta, managing your finances is easy, clear, and stress-free. Take control of your finances effortlessly. Track your spending, plan your budget, and watch your savings grow."
          className="text-xl font-light leading-snug mt-4 ml-20"
        />
      </div>
    </div>
  );
};

export default LandingPage;
