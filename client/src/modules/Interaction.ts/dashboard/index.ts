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

export interface Message {
  id: string;
  role: "user" | "AI";
  content: string;
}

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
  greeting: string;
  isAiPopupVisible?: boolean;
  messages: Message[];
  isLoading: boolean;
  amountAllocated?: number;
  error: string | null;
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
  greeting: "",
  isAiPopupVisible: false,
  messages: [],
  isLoading: false,
  amountAllocated: 0,
  error: null,
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
    setGreeting: (state, action: PayloadAction<string>) => {
      state.greeting = action.payload;
    },
    toggleAiPopup: (state) => {
      state.isAiPopupVisible = !state.isAiPopupVisible;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessages: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAiSummary.pending, (state) => {
      state.summarization = "Qwen 4b is thinking...";
    });
    builder.addCase(getAiSummary.fulfilled, (state, action) => {
      state.summarization = action.payload.summary;
    });
    builder.addCase(getAiSummary.rejected, (state) => {
      state.summarization = "Failed to load summary.";
    });
    builder.addCase(allocateAmountToGoal.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const getAiSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (userId: string) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/ai/summarize/${userId}`
    );
    return response.data;
  }
);

export const allocateAmountToGoal = createAsyncThunk(
  "dashboard/allocateAmountToGoal",
  async ({ goalId, amount }: { goalId: string; amount: number }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/goals/allocate/${goalId}`,
      { amount }
    );
    console.log("Allocation response data:", response.data);
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
  setGreeting,
  toggleAiPopup,
  addMessages,
  setMessages,
} = dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
