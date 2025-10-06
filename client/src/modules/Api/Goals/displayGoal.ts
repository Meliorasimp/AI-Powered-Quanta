import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface DisplayGoal {
  userId: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category?: string;
  priority?: string;
  frequency?: string;
  notes?: string;
  _id?: string;
}

export interface GoalDisplayState {
  goals: DisplayGoal[];
  loading: boolean;
  error: string | null;
}

const initialGoalState: GoalDisplayState = {
  goals: [],
  loading: false,
  error: null,
};

export const displayGoalSlice = createSlice({
  name: "displayGoal",
  initialState: initialGoalState,
  reducers: {
    setDisplayGoal: (state, action: PayloadAction<DisplayGoal>) => {
      state.goals.unshift(action.payload);
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserGoal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserGoal.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.goals = action.payload.goals;
    });
    builder.addCase(fetchUserGoal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const fetchUserGoal = createAsyncThunk(
  "displayGoal/fetchUserGoal",
  async (userId: string, { rejectWithValue }) => {
    if (!userId) return rejectWithValue("User ID not available yet");
    try {
      const response = await axios.get(
        `http://localhost:5000/goals/get/${userId}`,
        { withCredentials: true }
      );
      const raw = response.data.goal;
      const goalsArray: DisplayGoal[] = Array.isArray(raw)
        ? raw
            .filter(
              (g: unknown): g is Partial<DisplayGoal> =>
                typeof g === "object" && g !== null
            )
            .map((g) => ({
              _id: String(g._id ?? ""),
              userId: String(g.userId ?? userId),
              name: String(g.name ?? ""),
              target: String(g.target ?? ""),
              current: String(g.current ?? ""),
              deadline: String(g.deadline ?? ""),
              category: String(g.category ?? ""),
              priority: String(g.priority ?? ""),
              frequency: String(g.frequency ?? ""),
              notes: String(g.notes ?? ""),
            }))
        : raw
        ? [
            {
              _id: raw._id,
              userId: raw.userId,
              name: raw.name,
              target: raw.target,
              current: raw.current,
              deadline: raw.deadline,
              category: raw.category,
              priority: raw.priority,
              frequency: raw.frequency,
              notes: raw.notes,
            },
          ]
        : [];

      if (goalsArray.length === 0) {
        return rejectWithValue("No goals found for user");
      }

      return { goals: goalsArray } as { goals: DisplayGoal[] };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return rejectWithValue("No goals found (404)");
        }
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch user goals"
        );
      }
      return rejectWithValue("Failed to fetch user goals");
    }
  }
);

export const { setDisplayGoal, removeGoal } = displayGoalSlice.actions;

export default displayGoalSlice.reducer;
