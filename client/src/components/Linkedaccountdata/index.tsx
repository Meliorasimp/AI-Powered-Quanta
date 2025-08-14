type LinkedAccountProps = {
  bankname: string;
  accounttype: string;
  accountholdername: string;
  accountnumber: string;
  status: string;
};

function LinkedAccountData({
  bankname,
  accounttype,
  accountholdername,
  accountnumber,
  status,
}: LinkedAccountProps) {
  return (
    <tr className="text-gray-300 text-sm hover:bg-gray-500 hover:cursor-pointer transition-all duration-200">
      <td className="text-left px-4 py-3">
        <span>{bankname}</span>
      </td>
      <td className="text-left px-4 py-3">
        <span>{accounttype}</span>
      </td>
      <td className="text-left px-4 py-3">
        <span>{accountholdername}</span>
      </td>
      <td className="text-left px-4 py-3">
        <span>{accountnumber}</span>
      </td>
      <td className="text-left px-4 py-3">
        <span>{status}</span>
      </td>
    </tr>
  );
}

export default LinkedAccountData;
