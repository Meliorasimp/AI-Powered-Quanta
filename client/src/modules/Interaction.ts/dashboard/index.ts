import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ChartData } from "chart.js";

const emptyChartData: ChartData<"bar", number[], string> = {
  labels: [] as string[],
  datasets: [
    {
      label: "",
      data: [] as number[],
      backgroundColor: "rgba(0,0,0,0.1)",
      borderColor: "rgba(0,0,0,0.3)",
      borderWidth: 1,
    },
  ],
};

type dashboardState = {
  remainingBalance: number;
  totalExpense: number;
  totalBudgetAmount: number;
  totalTransfersMade: number;
  totalIncome: number;
  graphMode: "Monthly" | "Daily";
  monthlyDashboardData: ChartData<"bar", number[], string>;
  dailyDashboardData: ChartData<"bar", number[], string>;
  summarization: string;
};

const initialDashboardState: dashboardState = {
  remainingBalance: 0,
  totalExpense: 0,
  totalBudgetAmount: 0,
  totalTransfersMade: 0,
  totalIncome: 0,
  graphMode: "Monthly",
  monthlyDashboardData: emptyChartData,
  dailyDashboardData: emptyChartData,
  summarization: "",
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
    setTotalIncome: (state, action) => {
      state.totalIncome = action.payload;
    },
    setGraphMode: (state, action: PayloadAction<"Monthly" | "Daily">) => {
      state.graphMode = action.payload;
    },
    setMonthlyData: (
      state,
      action: PayloadAction<ChartData<"bar", number[], string>>
    ) => {
      return { ...state, monthlyDashboardData: action.payload };
    },
    setDailyData: (
      state,
      action: PayloadAction<ChartData<"bar", number[], string>>
    ) => {
      return { ...state, dailyDashboardData: action.payload };
    },
    setSummarization: (state, action: PayloadAction<string>) => {
      state.summarization = action.payload;
    },
  },
});

export const getAiSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (userId: string) => {
    const response = await axios.get(
      `http://localhost:5000/hf/summarize/${userId}`
    );
    return response.data;
  }
);

export const {
  setRemainingBalance,
  setTotalExpense,
  setTotalBudgetAmount,
  setTotalTransfersMade,
  setTotalIncome,
  setGraphMode,
  setMonthlyData,
  setDailyData,
  setSummarization,
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
