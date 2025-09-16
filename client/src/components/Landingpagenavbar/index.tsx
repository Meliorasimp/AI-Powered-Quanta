import Heading from "../Text/Heading";
import "../../styles/index.css";
import { useAppDispatch } from "../../hooks";
import { showRegisterForm } from "../../modules/Interaction.ts";
import Button from "../Button/index.tsx";
import { useNavigate } from "react-router-dom";

const LandingPageNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-row space-x-15 text-2xl p-6 font-light justify-between relative z-100">
      <Heading label="Quanta" className="font-extrabold" />
      <div className="flex flex-row space-x-15">
        <Button
          label="Home"
          className="glow-text-white cursor-pointer"
          type="button"
          onClick={() => navigate("/")}
        />
        <Button
          label="About"
          className="glow-text-white cursor-pointer"
          type="button"
          onClick={() => navigate("/about")}
        />
        <Button
          label="Contact"
          className="glow-text-white cursor-pointer"
          type="button"
          onClick={() => navigate("/contact")}
        />
      </div>
      <div className="flex flex-row space-x-15">
        <Button
          label="Sign Up"
          onClick={() => dispatch(showRegisterForm())}
          type="button"
          className="glow-text-white z-10"
        />
      </div>
    </div>
  );
};

export default LandingPageNavbar;
