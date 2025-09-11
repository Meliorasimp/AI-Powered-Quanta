type tabledataprops = {
  transactionname?: string;
  amount?: string;
  merchant?: string;
  type?: string;
  status?: string;
  date?: string;
  className?: string;
};

function TableData({
  transactionname,
  amount,
  merchant,
  type,
  status,
  date,
  className,
}: tabledataprops) {
  return (
    <>
      <td className={className}>{transactionname}</td>
      <td className={className}>{amount}</td>
      <td className={className}>{merchant}</td>
      <td className={className}>{type}</td>
      <td className={className}>{status}</td>
      <td className={className}>{date}</td>
    </>
  );
}

export default TableData;
