import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type BudgetState = {
  description: string;
  amount: number;
  category: string;
  dateCreated: string;
  id: string;
  amountToDeduct?: number;
  idToDeductFrom?: string;
};

type AddBudgetState = {
  description: string;
  amount: number;
  category: string;
  dateCreated: string;
  loading?: boolean;
  error?: string | null;
};

const initialAddBudgetState: AddBudgetState = {
  description: "",
  amount: 0,
  category: "",
  dateCreated: new Date().toISOString(),
  loading: false,
  error: null,
};

const deductAmountSlice = createSlice({
  name: "deductAmount",
  initialState: {
    amountToDeduct: 0,
    idToDeductFrom: "",
  },
  reducers: {
    setAmountToDeduct: (state, action: PayloadAction<number>) => {
      state.amountToDeduct = action.payload;
    },
    setIdToDeductFrom: (state, action: PayloadAction<string>) => {
      state.idToDeductFrom = action.payload;
    },
  },
});

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
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/budgets/${budgetData.id}`,
        budgetData
      );
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

export const { setDescription, setAmount, setCategory } =
  AddBudgetSlice.actions;
export const { setAmountToDeduct, setIdToDeductFrom } =
  deductAmountSlice.actions;

export const budgetReducer = AddBudgetSlice.reducer;
export const deductAmountReducer = deductAmountSlice.reducer;
