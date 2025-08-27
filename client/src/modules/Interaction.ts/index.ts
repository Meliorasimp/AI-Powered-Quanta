import { createSlice } from "@reduxjs/toolkit";

type InteractionState = {
  isPopupVisible: boolean;
  isRegisterFormVisible: boolean;
  isLoginFormVisible: boolean;
  isUserLoggedIn: boolean;
  isThemePurple: boolean;
  isThemeDark: boolean;
  isThemeLight: boolean;
};

const initialState: InteractionState = {
  isPopupVisible: false,
  isRegisterFormVisible: false,
  isLoginFormVisible: false,
  isUserLoggedIn: false,
  isThemePurple: true,
  isThemeDark: false,
  isThemeLight: false,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    showPopup: (state) => {
      return { ...state, isPopupVisible: true };
    },
    hidePopup: (state) => {
      return { ...state, isPopupVisible: false };
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
  showPopup,
  hidePopup,
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
} = interactionSlice.actions;

export default interactionSlice.reducer;
