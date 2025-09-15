import { UserTransactionState } from "../modules/Api/transaction/displaytransaction";
export const calculateRemainingBalance = (
  transactions: UserTransactionState["transactions"]
) => {
  return transactions.reduce((balance, t) => {
    const type = t.type?.toLowerCase();
    const amount = typeof t.amount === "number" ? t.amount : 0;

    if (type === "income") {
      return balance + amount;
    }
    if (type === "expense") {
      return balance - amount;
    }
    return balance;
  }, 0);
};

export const calculateTotalExpenses = (
  transactions: UserTransactionState["transactions"]
) => {
  return transactions.reduce((sum, t) => {
    const type = t.type?.toLowerCase();
    const amount = typeof t.amount === "number" ? t.amount : 0;

    if (type === "expense") {
      return sum + amount;
    }
    return sum;
  }, 0);
};

export const calculateTotalTransfersMade = (
  transactions: UserTransactionState["transactions"]
) => {
  return transactions.reduce((sum, t) => {
    const type = t.type?.toLowerCase();
    const amount = typeof t.amount === "number" ? t.amount : 0;

    if (type === "transfer") {
      return sum + amount;
    }
    return sum;
  }, 0);
};
