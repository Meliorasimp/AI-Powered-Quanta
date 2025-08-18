import { createSlice } from "@reduxjs/toolkit";

type InteractionState = {
  isPopupVisible: boolean;
  isLoginFormVisible: boolean;
};

const initialState: InteractionState = {
  isPopupVisible: false,
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
    showLoginForm: (state) => {
      return { ...state, isLoginFormVisible: true };
    },
    hideLoginForm: (state) => {
      return { ...state, isLoginFormVisible: false };
    },
  },
});

export const { showPopup, hidePopup, showLoginForm, hideLoginForm } =
  interactionSlice.actions;

export default interactionSlice.reducer;
