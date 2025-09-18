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
  transactionsByType?: Array<{
    _id: string;
    userId: string;
    transactionName: string;
    amount: number;
    merchant: string;
    type: "income" | "expense" | "transfer";
    status: "pending" | "cleared";
    dateCreated: string;
  }>;
  transactionsByStatus?: Array<{
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
  transactionsByType: [],
  transactionsByStatus: [],
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
    clearTransactions: (state) => {
      state.transactions = [];
    },
  },
  extraReducers: (builder) => {
    // Get All Transactions
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

    //Get Transactions by Type
    builder.addCase(getTransactionsByType.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTransactionsByType.fulfilled, (state, action) => {
      state.loading = false;
      state.transactionsByType = action.payload;
    });
    builder.addCase(getTransactionsByType.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to fetch income transactions";
    });

    //Get Transactions by Status
    builder.addCase(getTransactionsByStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getTransactionsByStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.transactionsByStatus = action.payload;
    });
    builder.addCase(getTransactionsByStatus.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to fetch pending transactions";
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

export const getTransactionsByType = createAsyncThunk(
  "userTransactions/getTransactionsByType",
  async ({ userId, type }: { userId: string; type: string }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get/${type}/${userId}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${type} transactions`);
      }
      const data = await response.data;
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${type} transactions:`, error);
      throw new Error(`Failed to fetch ${type} transactions`);
    }
  }
);

export const getTransactionsByStatus = createAsyncThunk(
  "userTransactions/getTransactionsByStatus",
  async ({ userId, status }: { userId: string; status: string }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/get/status/${status}/${userId}`
      );
      if (response.status !== 200) {
        throw new Error(`Failed to fetch ${status} transactions`);
      }
      const data = await response.data;
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${status} transactions:`, error);
      throw new Error(`Failed to fetch ${status} transactions`);
    }
  }
);

export const { setTransactions, addTransaction, clearTransactions } =
  displayTransactionsSlice.actions;

export const displayTransactionsReducer = displayTransactionsSlice.reducer;
