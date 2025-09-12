import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type UserTransactionState = {
  transactions: Array<{
    _id: string;
    userId: string;
    transactionName: string;
    amount: number;
    merchant: string;
    type: "income" | "expense" | "transfer";
    status: "pending" | "cleared";
    dateCreated: string;
  }>;
  loading: boolean;
  error: string | null;
};

const initialUserTransactionState: UserTransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

export const displayTransactionsSlice = createSlice({
  name: "userTransactions",
  initialState: initialUserTransactionState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions = action.payload;
    });
    builder.addCase(getUserTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch transactions";
    });
  },
});

export const getUserTransactions = createAsyncThunk(
  "userTransactions/getUserTransactions",
  async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get/transactions/${userId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch user transactions");
      }
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Failed to fetch user transactions:", error);
      throw new Error("Failed to fetch user transactions");
    }
  }
);

export const { setTransactions, addTransaction } =
  displayTransactionsSlice.actions;

export const displayTransactionsReducer = displayTransactionsSlice.reducer;
