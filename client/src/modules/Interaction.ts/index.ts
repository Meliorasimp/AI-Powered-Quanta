import { createSlice } from "@reduxjs/toolkit";

type InteractionState = {
  isPopupVisible: boolean;
  isRegisterFormVisible: boolean;
  isLoginFormVisible: boolean;
};

const initialState: InteractionState = {
  isPopupVisible: false,
  isRegisterFormVisible: false,
  isLoginFormVisible: false,
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
} = interactionSlice.actions;

export default interactionSlice.reducer;
