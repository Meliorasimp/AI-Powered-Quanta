import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InteractionState = {
  isBudgetPopupVisible: boolean;
  isTransactionPopupVisible: boolean;
  isRegisterFormVisible: boolean;
  isLoginFormVisible: boolean;
  isUserLoggedIn: boolean;
  isThemePurple: boolean;
  isThemeDark: boolean;
  isThemeLight: boolean;
  activeButtonId: string | null;
};

const initialState: InteractionState = {
  isBudgetPopupVisible: false,
  isTransactionPopupVisible: false,
  isRegisterFormVisible: false,
  isLoginFormVisible: false,
  isUserLoggedIn: false,
  isThemePurple: true,
  isThemeDark: false,
  isThemeLight: false,
  activeButtonId: null,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setActiveButton: (state, action: PayloadAction<string>) => {
      state.activeButtonId = action.payload;
    },
    showTransactionPopup: (state) => {
      return { ...state, isTransactionPopupVisible: true };
    },
    hideTransactionPopup: (state) => {
      return { ...state, isTransactionPopupVisible: false };
    },
    showBudgetPopup: (state) => {
      return { ...state, isBudgetPopupVisible: true };
    },
    hideBudgetPopup: (state) => {
      return { ...state, isBudgetPopupVisible: false };
    },
    showRegisterForm: (state) => {
      return { ...state, isRegisterFormVisible: true };
    },
    hideRegisterForm: (state) => {
      return { ...state, isRegisterFormVisible: false };
    },
    showLoginForm: (state) => {
      return { ...state, isLoginFormVisible: true };
    },
    hideLoginForm: (state) => {
      return { ...state, isLoginFormVisible: false };
    },
    switchToLoginForm: (state) => {
      return {
        ...state,
        isRegisterFormVisible: false,
        isLoginFormVisible: true,
      };
    },
    switchToRegisterForm: (state) => {
      return {
        ...state,
        isLoginFormVisible: false,
        isRegisterFormVisible: true,
      };
    },
    LoginUser: (state) => {
      return {
        ...state,
        isUserLoggedIn: true,
      };
    },
    LogoutUser: (state) => {
      return {
        ...state,
        isUserLoggedIn: false,
      };
    },
    switchToDarkTheme: (state) => {
      return {
        ...state,
        isThemePurple: false,
        isThemeDark: true,
        isThemeLight: false,
      };
    },
    switchToLightTheme: (state) => {
      return {
        ...state,
        isThemePurple: false,
        isThemeDark: false,
        isThemeLight: true,
      };
    },
    switchToPurpleTheme: (state) => {
      return {
        ...state,
        isThemePurple: true,
        isThemeDark: false,
        isThemeLight: false,
      };
    },
  },
});

export const {
  showTransactionPopup,
  hideTransactionPopup,
  showBudgetPopup,
  hideBudgetPopup,
  showRegisterForm,
  hideRegisterForm,
  showLoginForm,
  hideLoginForm,
  switchToLoginForm,
  LoginUser,
  LogoutUser,
  switchToDarkTheme,
  switchToLightTheme,
  switchToPurpleTheme,
  setActiveButton,
} = interactionSlice.actions;

export default interactionSlice.reducer;
