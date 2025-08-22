import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

const registerSlice = createSlice({
  name: "register",
  initialState: initialRegisterState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setEmail: setRegisterEmail,
  setUsername: setRegisterUsername,
  setPassword: setRegisterPassword,
  setLoading: setRegisterLoading,
  setError: setRegisterError,
} = registerSlice.actions;

export const {
  setEmail: setLoginEmail,
  setPassword: setLoginPassword,
  setLoading: setLoginLoading,
  setError: setLoginError,
} = loginSlice.actions;

export const registerReducer = registerSlice.reducer;
export const loginReducer = loginSlice.reducer;
