import { createSlice } from "@reduxjs/toolkit";

type dashboardState = {
  remainingBalance: number;
  totalExpense: number;
  totalBudgetAmount: number;
  totalTransfersMade: number;
};

const initialDashboardState: dashboardState = {
  remainingBalance: 0,
  totalExpense: 0,
  totalBudgetAmount: 0,
  totalTransfersMade: 0,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialDashboardState,
  reducers: {
    setRemainingBalance: (state, action) => {
      state.remainingBalance = action.payload;
    },
    setTotalExpense: (state, action) => {
      state.totalExpense = action.payload;
    },
    setTotalBudgetAmount: (state, action) => {
      state.totalBudgetAmount = action.payload;
    },
    setTotalTransfersMade: (state, action) => {
      state.totalTransfersMade = action.payload;
    },
  },
});

export const {
  setRemainingBalance,
  setTotalExpense,
  setTotalBudgetAmount,
  setTotalTransfersMade,
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
