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
    category: string;
    dateCreated: string;
    userId: string;
  }>;
  loading: boolean;
  error: string | null;
  totalBudgetedAmount: number;
};

const initialUserBudgetState: userBudgetState = {
  budgets: [],
  loading: false,
  error: null,
  totalBudgetedAmount: 0,
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
    clearBudgets: (state) => {
      state.budgets = [];
    },
    setTotalBudgetedAmount: (state, action) => {
      state.totalBudgetedAmount = action.payload;
    },
  },
  extraReducers: (builder) => {
    handleFetchBudgets(builder);
    handleDeleteBudget(builder);
    handleDetectBudget(builder);
  },
});

export const fetchUserBudgets = createAsyncThunk(
  "userBudgets/fetchUserBudgets",
  async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/userbudgets/${userId}`
      );
      if (response.status === 404) {
        return [];
      }
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to fetch budgets");
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
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
        `${import.meta.env.VITE_API_URL}/api/deletebudget/${budgetId}`
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

export const deductBudget = createAsyncThunk(
  "userBudgets/deductBudget",
  async (
    { budgetId, amount }: { budgetId: string; amount: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/budget/deductbudget`,
        {
          budgetId,
          amount,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to deduct budget");
      }
    }
  }
);

function handleDetectBudget(builder: ActionReducerMapBuilder<userBudgetState>) {
  builder.addCase(deductBudget.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  builder.addCase(deductBudget.fulfilled, (state, action) => {
    state.loading = false;
    const updatedBudget = action.payload;
    const index = state.budgets.findIndex(
      (budget) => budget._id === updatedBudget._id
    );
    if (index !== -1) {
      state.budgets[index] = updatedBudget;
    }
  });
  builder.addCase(deductBudget.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
}

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

export const {
  setBudgets,
  addBudget,
  deleteBudget,
  clearBudgets,
  setTotalBudgetedAmount,
} = userBudgetsSlice.actions;

export const userBudgetReducer = userBudgetsSlice.reducer;
