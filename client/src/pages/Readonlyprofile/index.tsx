import Navbar from "../../components/Navbar";
import Paragraph from "../../components/Text/Paragraph";
import Heading from "../../components/Text/Heading";
import Button from "../../components/Button";

const Readonlyprofile = () => {
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
            onClick={() => {}}
            type="button"
          />
        </div>
      </div>
    </div>
  );
};

export default Readonlyprofile;
