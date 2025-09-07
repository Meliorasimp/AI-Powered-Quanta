import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export type userBudgetState = {
  budgets: Array<{
    _id: string;
    description: string;
    amount: number;
    dateCreated: string;
    userId: string;
  }>;
  loading: boolean;
  error: string | null;
};

const initialUserBudgetState: userBudgetState = {
  budgets: [],
  loading: false,
  error: null,
};

const userBudgetsSlice = createSlice({
  name: "userBudgets",
  initialState: initialUserBudgetState,
  reducers: {
    setBudgets: (state, action) => {
      state.budgets = action.payload;
    },
    addBudget: (state, action) => {
      state.budgets.push(action.payload);
    },
    deleteBudget: (state, action) => {
      state.budgets = state.budgets.filter(
        (budget) => budget._id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    handleFetchBudgets(builder);
    handleDeleteBudget(builder);
  },
});

export const fetchUserBudgets = createAsyncThunk(
  "userBudgets/fetchUserBudgets",
  async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/userbudgets/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }
      const data = await response.json();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to fetch budgets");
      }
      throw new Error("Failed to fetch budgets");
    }
  }
);

export const deleteUserBudget = createAsyncThunk(
  "userBudgets/deleteUserBudget",
  async (budgetId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deletebudget/${budgetId}`
      );
      toast.success("Budget deleted successfully!");
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || "Failed to delete budget");
      }
      throw new Error("Failed to delete budget");
    }
  }
);

function handleFetchBudgets(builder: ActionReducerMapBuilder<userBudgetState>) {
  builder.addCase(fetchUserBudgets.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase(fetchUserBudgets.fulfilled, (state, action) => {
    state.loading = false;
    state.budgets = action.payload;
  });
  builder.addCase(fetchUserBudgets.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to fetch budgets";
  });
}

function handleDeleteBudget(builder: ActionReducerMapBuilder<userBudgetState>) {
  builder.addCase(deleteUserBudget.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase(deleteUserBudget.fulfilled, (state, action) => {
    state.loading = false;
    state.budgets = state.budgets.filter(
      (budget) => budget._id !== action.payload
    );
  });
  builder.addCase(deleteUserBudget.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to delete budget";
  });
}

export const { setBudgets, addBudget, deleteBudget } = userBudgetsSlice.actions;

export const userBudgetReducer = userBudgetsSlice.reducer;
