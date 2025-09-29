import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Goal {
  _id?: string;
  name: string;
  target: string;
  current: string;
  deadline: string;
  category: string;
  priority: string;
  frequency: string;
  notes: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GoalsState {
  items: Goal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  items: [],
  loading: false,
  error: null,
};

export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (
    payload: { userId: string; goal: Omit<Goal, "_id"> },
    { rejectWithValue }
  ) => {
    try {
      const { userId, goal } = payload;
      const response = await axios.post(
        `http://localhost:5000/goals/post/${userId}`,
        goal,
        {
          withCredentials: true,
        }
      );
      return response.data.goal as Goal;
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const anyErr = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(
          anyErr.response?.data?.message || "Failed to create goal"
        );
      }
      return rejectWithValue("Failed to create goal");
    }
  }
);

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    addGoalOptimistic: (state, action: PayloadAction<Goal>) => {
      state.items.unshift(action.payload);
    },
    clearGoals: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to create goal";
      });
  },
});

export const { addGoalOptimistic, clearGoals } = goalsSlice.actions;
export const goalsReducer = goalsSlice.reducer;
