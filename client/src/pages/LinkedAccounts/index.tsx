import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";

const LinkedAccounts = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full h-screen flex flex-col py-5 px-5 gap-y-2">
        <div className="overflow-hiddenpb-2">
          <Heading
            label="Linked Accounts"
            className="text-xl font-semibold main-website-text-color"
          />
          <Paragraph
            label="Manage your linked accounts and keep track of your finances. Add or Delete one."
            className="text-base main-website-text-color"
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default LinkedAccounts;
