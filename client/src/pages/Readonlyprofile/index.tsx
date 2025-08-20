import Navbar from "../../components/Navbar";
import Paragraph from "../../components/Text/Paragraph";
import Heading from "../../components/Text/Heading";
import Button from "../../components/Button";
import RegisterForm from "../../components/Register/index.tsx";
import Login from "../../components/Login/index.tsx";
import { showRegisterForm } from "../../modules/Interaction.ts/index.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store.ts";

const Readonlyprofile = () => {
  const dispatch = useDispatch();
  const isRegisterFormVisible = useSelector(
    (state: RootState) => state.interaction.isRegisterFormVisible
  );
  const isLoginFormVisible = useSelector(
    (state: RootState) => state.interaction.isLoginFormVisible
  );

  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hiddenpb-2">
          <Heading
            label="Profile"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="View and edit your profile information."
            className="text-base main-website-text-color"
            variant="secondary"
          />
        </div>
        <div className="border-t border-white text-white justify-center items-center flex flex-col text-xl pt-10 w-full">
          <Heading
            label="You must be logged in to Change profile!"
            className="text-white justify-center flex text-xl pt-10"
          />
          <Button
            label="Login"
            className="mt-4 bg-purple-600 w-1/5 py-2 rounded-lg hover:bg-purple-500 hover:cursor-pointer"
            onClick={() => {
              dispatch(showRegisterForm());
            }}
            type="button"
          />
        </div>
      </div>
      {isRegisterFormVisible && <RegisterForm />}
      {isLoginFormVisible && <Login />}
    </div>
  );
};

export default Readonlyprofile;
