import { UserTransactionState } from "../modules/Api/transaction/displaytransaction";
import { userBudgetState } from "../modules/Api/Budgets/displaybudget";

export const calculateRemainingBalance = (
  transactions: UserTransactionState["transactions"]
) => {
  return transactions.reduce((balance, t) => {
    const type = t.type?.toLowerCase();
    const amount = typeof t.amount === "number" ? t.amount : 0;

    if (type === "income") {
      return balance + amount;
    }
    if (type === "expense" || type === "transfer") {
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
export const calculateTotalIncome = (
  transactions: UserTransactionState["transactions"]
) => {
  return transactions.reduce((sum, t) => {
    const type = t.type?.toLowerCase();
    const amount = typeof t.amount === "number" ? t.amount : 0;
    return type === "income" ? sum + amount : sum;
  }, 0);
};

export const calculateTotalBudgetedAmount = (
  budgets: userBudgetState["budgets"]
) => {
  return budgets.reduce((sum, b) => {
    const amount = typeof b.amount === "number" ? b.amount : 0;
    return sum + amount;
  }, 0);
};
