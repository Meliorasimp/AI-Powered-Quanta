import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import LinkedAccountData from "../../components/Linkedaccountdata";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import Button from "../../components/Button";
import { Plus } from "lucide-react";

const LinkedAccounts = () => {
  const { isThemeLight, isThemeDark, isThemePurple } = useSelector(
    (state: RootState) => state.interaction
  );

  return (
    <div
      className={`flex flex-col app ${
        isThemePurple
          ? "purple"
          : isThemeLight
          ? "light"
          : isThemeDark
          ? "dark"
          : ""
      }`}
    >
      <Navbar />
      <div className="w-10/11 h-screen flex flex-col py-5 px-5 gap-y-2 mx-auto">
        <div className="flex flex-row gap-x-10 items-center justify-between">
          <div className="overflow-hidden pb-2">
            <Heading
              label="Linked Bank Accounts"
              className="text-xl font-semibold main-website-text-color"
            />
            <Paragraph
              label="Manage your Bank accounts and keep track of your finances. Add or Delete one."
              className="text-base main-website-text-color"
              variant="secondary"
            />
          </div>
          <div>
            <Button
              label="Add Account"
              type="button"
              icon={<Plus className="inline-block" />}
              className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer "
            />
          </div>
        </div>
        <div className="h-full w-full">
          <div className="flex flex-col gap-y-5 w-full h-full">
            <table className="table-fixed w-full">
              <thead className="py-10">
                <tr className="bg-blue-900">
                  <th className="text-left px-4 py-3 align-middle">
                    <Heading
                      label="Bank Name"
                      className="text-md font-semibold text-gray-200"
                    />
                  </th>
                  <th className="text-left px-4 py-3 align-middle">
                    <Heading
                      label="Account Type"
                      className="text-md font-semibold text-gray-200"
                    />
                  </th>
                  <th className="text-left px-4 py-3 align-middle">
                    <Heading
                      label="Acc. Holder name"
                      className="text-md font-semibold text-gray-200"
                    />
                  </th>
                  <th className="text-left px-4 py-3 align-middle">
                    <Heading
                      label="Acc. number"
                      className="text-md font-semibold text-gray-200"
                    />
                  </th>
                  <th className="text-left px-4 py-3 align-middle">
                    <Heading
                      label="Status"
                      className="text-md font-semibold text-gray-200"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="py-10">
                {/** <Placeholder data /> */}
                <LinkedAccountData
                  bankname="BDO"
                  accounttype="Savings"
                  accountholdername="Meinard Legashki Limlengco"
                  accountnumber="09289352628"
                  status="Verified"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedAccounts;
