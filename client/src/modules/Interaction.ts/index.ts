import { createSlice } from "@reduxjs/toolkit";

type InteractionState = {
  isPopupVisible: boolean;
};

const initialState: InteractionState = {
  isPopupVisible: false,
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
  },
});

export const { showPopup, hidePopup } = interactionSlice.actions;

export default interactionSlice.reducer;
