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
        `${import.meta.env.REACT_APP_API_URL}/goals/post/${userId}`,
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

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (goalId: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.REACT_APP_API_URL}/goals/delete/${goalId}`,
        {
          withCredentials: true,
        }
      );
      return goalId; // ✅ return the id we know we deleted
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const anyErr = err as { response?: { data?: { message?: string } } };
        return rejectWithValue(
          anyErr.response?.data?.message || "Failed to delete goal"
        );
      }
      return rejectWithValue("Failed to delete goal");
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
    removeGoal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((goal) => goal._id !== action.payload);
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
      })
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((goal) => goal._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to delete goal";
      });
  },
});

export const { addGoalOptimistic, clearGoals, removeGoal } = goalsSlice.actions;
export const goalsReducer = goalsSlice.reducer;
