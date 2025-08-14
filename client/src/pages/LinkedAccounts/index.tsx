import Navbar from "../../components/Navbar";
import Heading from "../../components/Text/Heading";
import Paragraph from "../../components/Text/Paragraph";
import LinkedAccountData from "../../components/Linkedaccountdata";

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
        <div className="h-full w-full">
          <div className="flex flex-col gap-y-5 w-full h-full">
            <table className="table-fixed w-full">
              <thead className="py-10">
                <tr className="bg-gray-700">
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
