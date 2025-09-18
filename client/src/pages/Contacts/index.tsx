import { RootState } from "../../store";
import { useAppSelector } from "../../hooks";
import landingpagebg from "../../assets/landingpage-bg.jpg";
import LandingPageNavbar from "../../components/Landingpagenavbar";
import RegisterForm from "../../components/Register";
import contact from "../../assets/contact.svg";
import Login from "../../components/Login";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import Button from "../../components/Button";
import { motion } from "framer-motion";
const Contacts = () => {
  const RegisterFormState = useAppSelector(
    (state: RootState) => state.interaction.isRegisterFormVisible
  );
  const LoginFormState = useAppSelector(
    (state: RootState) => state.interaction.isLoginFormVisible
  );
  return (
    <div
      className="landing-page-background-color relative h-screen w-full flex flex-col"
      style={{
        backgroundImage: `url(${landingpagebg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <LandingPageNavbar />
      <motion.div
        className="bg-green-500 w-2/3 h-3/4 flex items-center justify-between mx-auto mt-10 rounded-2xl"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-2/5 h-full bg-yellow-50 rounded-tl-2xl rounded-bl-2xl">
          <img src={contact} alt="" className="h-full w-full object-fit" />
        </div>
        <div className="w-3/5 h-full p-10 text-white flex flex-col">
          <Heading
            label="Contact Us"
            className="text-4xl text-green-200 font-extrabold mb-3"
          />
          <Paragraph
            label="If you have any questions or feedback, feel free to message me, I would love to hear from you!"
            variant="secondary"
            className="text-lg"
          />
          <div className="mt-10">
            <form>
              <div className="flex flex-row gap-x-5">
                <input
                  type="text"
                  placeholder="Your name..."
                  className="p-2 rounded-md border-2 outline-none w-full"
                />
                <input
                  type="email"
                  placeholder="Your email..."
                  className="p-2 rounded-md border-2 outline-none w-full"
                />
              </div>
              <textarea
                name="message"
                id="message"
                className="mt-5 p-2 rounded-md border-2 outline-none w-full h-50"
                placeholder="Your message..."
              ></textarea>
              <Button
                label="Send Message"
                type="submit"
                className="mt-5 bg-green-200 text-black px-5 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
              />
            </form>
          </div>
        </div>
      </motion.div>
      {RegisterFormState && <RegisterForm />}
      {LoginFormState && <Login />}
    </div>
  );
};

export default Contacts;
