import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type TransactionType = {
  userId: string;
  transactionName: string;
  amount: number;
  merchant: string;
  type: "income" | "expense" | "transfer";
  expenseCategory?:
    | "Housing"
    | "Utilities"
    | "Groceries"
    | "Entertainment"
    | "Transportation"
    | "Education";
  status: "pending" | "cleared";
  dateCreated?: string;
  loading?: boolean;
  error?: string | null;
};

const initialTransactionState: TransactionType = {
  userId: "",
  transactionName: "",
  amount: 0,
  merchant: "",
  type: "expense",
  status: "pending",
  dateCreated: new Date().toISOString(),
  loading: false,
  error: null,
  expenseCategory: undefined,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialTransactionState,
  reducers: {
    setTransactionName: (state, action: PayloadAction<string>) => {
      state.transactionName = action.payload;
    },
    setTransactionAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    setMerchant: (state, action: PayloadAction<string>) => {
      state.merchant = action.payload;
    },
    setType: (
      state,
      action: PayloadAction<"income" | "expense" | "transfer">
    ) => {
      state.type = action.payload;
    },
    setExpenseCategory: (
      state,
      action: PayloadAction<
        | "Housing"
        | "Utilities"
        | "Groceries"
        | "Entertainment"
        | "Transportation"
        | "Education"
      >
    ) => {
      state.expenseCategory = action.payload;
    },
    clearExpenseCategory: (state) => {
      state.expenseCategory = undefined;
    },
    setStatus: (state, action: PayloadAction<"pending" | "cleared">) => {
      state.status = action.payload;
    },

    resetTransaction: (state) => {
      Object.assign(state, initialTransactionState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitTransaction.fulfilled, (state, action) => {
        const {
          userId,
          transactionName,
          amount,
          merchant,
          type,
          status,
          dateCreated,
        } = action.payload;

        state.loading = false;
        state.userId = userId;
        state.transactionName = transactionName;
        state.amount = amount;
        state.merchant = merchant;
        state.type = type;
        state.expenseCategory =
          type === "expense" ? state.expenseCategory : undefined;
        state.status = status;
        state.dateCreated = dateCreated;
      })
      .addCase(submitTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to submit transaction";
      });
  },
});

export const submitTransaction = createAsyncThunk(
  "transaction/submitTransaction",
  async (transactionPayload: TransactionType) => {
    try {
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URL}/api/create/transaction/${
          transactionPayload.userId
        }`,
        transactionPayload
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to submit transaction");
    }
  }
);

export const {
  setTransactionName,
  setTransactionAmount,
  setMerchant,
  setType,
  setExpenseCategory,
  clearExpenseCategory,
  setStatus,
  resetTransaction,
} = transactionSlice.actions;

export const transactionReducer = transactionSlice.reducer;
