import Navbar from "../../components/Navbar";
import Paragraph from "../../components/Text/Paragraph";
import Heading from "../../components/Text/Heading";

const Profile = () => {
  return (
    <div className="flex flex-row app">
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
      </div>
    </div>
  );
};

export default Profile;
