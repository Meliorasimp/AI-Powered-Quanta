import Heading from "../Text/Heading";
import "../../styles/index.css";
import { useAppDispatch } from "../../hooks";
import { showRegisterForm } from "../../modules/Interaction.ts";
import Button from "../Button/index.tsx";
const LandingPageNavbar = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row space-x-15 text-2xl p-6 font-light justify-between">
      <Heading label="Quanta" className="font-extrabold" />
      <div className="flex flex-row space-x-15">
        <Heading label="Home" className="glow-text-white" />
        <Heading label="About" className="glow-text-white" />
        <Heading label="Contact" className="glow-text-white" />
      </div>
      <div className="flex flex-row space-x-15">
        <Button
          label="Sign Up"
          onClick={() => dispatch(showRegisterForm())}
          type="button"
          className="glow-text-white"
        />
      </div>
    </div>
  );
};

export default LandingPageNavbar;
