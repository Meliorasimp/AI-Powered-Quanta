import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
// Define the Types for login and register
type LoginState = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
};

type RegisterState = {
  email: string;
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
};

type RegisterPayload = {
  email: string;
  username: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type userState = {
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  id: string;
  photo?: string;
};

// Define the initial states for the user informations
const initialLoginState: LoginState = {
  email: "",
  password: "",
  loading: false,
  error: null,
};

const initialRegisterState: RegisterState = {
  email: "",
  username: "",
  password: "",
  loading: false,
  error: null,
};

const initialUserState: userState = {
  firstname: "",
  lastname: "",
  email: "",
  username: "",
  id: "",
  photo: "",
};

// Define the login slice
const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    resetLoginForm(state) {
      state.email = "";
      state.password = "";
      state.loading = false;
      state.error = null;
    },
    setLoginEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setLoginPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setLoginLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setLoginError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.password = action.payload.password;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to login";
      });
  },
});

// Define the register slice

const registerSlice = createSlice({
  name: "register",
  initialState: initialRegisterState,
  reducers: {
    resetRegisterForm(state) {
      state.email = "";
      state.username = "";
      state.password = "";
      state.loading = false;
      state.error = null;
    },
    setRegisterEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setRegisterUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setRegisterPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setRegisterLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setRegisterError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
        state.username = action.payload.username;
        state.password = action.payload.password;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to register";
      });
  },
});

//State to hold the user information after login, note that this is needed for some backend operations
const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUser(state, action: PayloadAction<userState>) {
      return { ...state, ...action.payload };
    },
  },
});

//function for the Extrareducers
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData: LoginPayload) => {
    const response = await axios.post(
      "http://localhost:5000/api/users/login",
      userData
    );
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData: RegisterPayload) => {
    const response = await axios.post(
      "http://localhost:5000/api/users/register",
      userData
    );
    return response.data;
  }
);

export const {
  setRegisterEmail,
  setRegisterUsername,
  setRegisterPassword,
  setRegisterLoading,
  setRegisterError,
  resetRegisterForm,
} = registerSlice.actions;

export const {
  setLoginEmail,
  setLoginPassword,
  setLoginLoading,
  setLoginError,
  resetLoginForm,
} = loginSlice.actions;

export const { setUser } = userSlice.actions;

export const registerReducer = registerSlice.reducer;
export const loginReducer = loginSlice.reducer;
export const userReducer = userSlice.reducer;
