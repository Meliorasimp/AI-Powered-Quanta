type tabledataprops = {
  transactionid?: string;
  amount?: string;
  merchant?: string;
  type?: string;
  paymentcard?: string;
  cardsuffix?: string;
  status?: string;
  date?: string;
  className?: string;
};

function TableData({
  transactionid,
  amount,
  merchant,
  type,
  paymentcard,
  cardsuffix,
  status,
  date,
  className,
}: tabledataprops) {
  return (
    <>
      <td className={className}>{transactionid}</td>
      <td className={className}>{amount}</td>
      <td className={className}>{merchant}</td>
      <td className={className}>{type}</td>
      <td className={className}>{paymentcard}</td>
      <td className={className}>{cardsuffix}</td>
      <td className={className}>{status}</td>
      <td className={className}>{date}</td>
    </>
  );
}

export default TableData;
