import Heading from "../Text/Heading";
const LandingPageNavbar = () => {
  return (
    <div className="flex flex-row space-x-15 text-2xl p-6 font-light justify-between">
      <Heading label="Quanta" className="font-extrabold" />
      <div className="flex flex-row space-x-15">
        <Heading label="Home" />
        <Heading label="About" />
        <Heading label="Contact" />
      </div>
      <div className="flex flex-row space-x-15">
        <Heading label="Sign Up" />
      </div>
    </div>
  );
};

export default LandingPageNavbar;
