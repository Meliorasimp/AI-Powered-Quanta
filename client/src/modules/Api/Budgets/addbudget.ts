import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type BudgetState = {
  description: string;
  amount: number;
  id: string;
};

type AddBudgetState = {
  description: string;
  amount: number;
  dateCreated: string;
  loading?: boolean;
  error?: string | null;
};

const initialAddBudgetState: AddBudgetState = {
  description: "",
  amount: 0,
  dateCreated: new Date().toISOString(),
  loading: false,
  error: null,
};

const AddBudgetSlice = createSlice({
  name: "budget",
  initialState: initialAddBudgetState,
  reducers: {
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBudget.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addBudget.fulfilled, (state) => {
      state.loading = false;
      state.description = "";
      state.amount = 0;
    });
    builder.addCase(addBudget.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to add budget";
    });
  },
});

export const addBudget = createAsyncThunk(
  "budget/addBudget",
  async (budgetData: BudgetState) => {
    try {
      const response = await axios.post("/api/budgets", budgetData);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to add budget"
        );
      }
    }
  }
);

export const { setDescription, setAmount } = AddBudgetSlice.actions;

export const budgetReducer = AddBudgetSlice.reducer;
