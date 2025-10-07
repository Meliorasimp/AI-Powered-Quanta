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
  isMobileOpen: boolean;
  isFinanceOpen: boolean;
  isProfileOpen: boolean;
  SelectFilterByAll: boolean;
  selectFilterByIncome: boolean;
  selectFilterByExpense: boolean;
  selectFilterByTransfer: boolean;
  selectFilterByPending: boolean;
  selectFilterByCleared: boolean;
  isGoalPopupVisible: boolean;
  isAllocatePopupVisible?: boolean;
  goalId: string | null;
  amountToAllocate?: number | undefined;
  isDeleteGoalPopupVisible?: boolean;
  isDeductBudgetPopupVisible?: boolean;
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
  isMobileOpen: false,
  isFinanceOpen: false,
  isProfileOpen: false,
  SelectFilterByAll: false,
  selectFilterByIncome: false,
  selectFilterByExpense: false,
  selectFilterByTransfer: false,
  selectFilterByPending: false,
  selectFilterByCleared: false,
  isGoalPopupVisible: false,
  isAllocatePopupVisible: false,
  goalId: null,
  amountToAllocate: 0,
  isDeleteGoalPopupVisible: false,
  isDeductBudgetPopupVisible: false,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileOpen = action.payload;
    },
    setFinanceOpen: (state, action: PayloadAction<boolean>) => {
      state.isFinanceOpen = action.payload;
    },
    setProfileOpen: (state, action: PayloadAction<boolean>) => {
      state.isProfileOpen = action.payload;
    },
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
    setSelectFilterByAll: (state) => {
      return {
        ...state,
        SelectFilterByAll: true,
        selectFilterByIncome: false,
        selectFilterByExpense: false,
        selectFilterByTransfer: false,
        selectFilterByPending: false,
        selectFilterByCleared: false,
      };
    },
    setSelectFilterByIncome: (state) => {
      return {
        ...state,
        SelectFilterByAll: false,
        selectFilterByIncome: true,
        selectFilterByExpense: false,
        selectFilterByTransfer: false,
        selectFilterByPending: false,
        selectFilterByCleared: false,
      };
    },
    setSelectFilterByExpense: (state) => {
      return {
        ...state,
        SelectFilterByAll: false,
        selectFilterByIncome: false,
        selectFilterByExpense: true,
        selectFilterByTransfer: false,
        selectFilterByPending: false,
        selectFilterByCleared: false,
      };
    },
    setSelectFilterByTransfer: (state) => {
      return {
        ...state,
        SelectFilterByAll: false,
        selectFilterByIncome: false,
        selectFilterByExpense: false,
        selectFilterByTransfer: true,
        selectFilterByPending: false,
        selectFilterByCleared: false,
      };
    },
    setSelectFilterByPending: (state) => {
      return {
        ...state,
        SelectFilterByAll: false,
        selectFilterByIncome: false,
        selectFilterByExpense: false,
        selectFilterByTransfer: false,
        selectFilterByPending: true,
        selectFilterByCleared: false,
      };
    },
    setSelectFilterByCleared: (state) => {
      return {
        ...state,
        SelectFilterByAll: false,
        selectFilterByIncome: false,
        selectFilterByExpense: false,
        selectFilterByTransfer: false,
        selectFilterByPending: false,
        selectFilterByCleared: true,
      };
    },
    showGoalPopup: (state) => {
      return { ...state, isGoalPopupVisible: true };
    },
    hideGoalPopup: (state) => {
      return { ...state, isGoalPopupVisible: false };
    },
    setIsAllocatePopupVisible: (state, action: PayloadAction<boolean>) => {
      state.isAllocatePopupVisible = action.payload;
    },
    setGoalId: (state, action: PayloadAction<string | null>) => {
      state.goalId = action.payload;
    },
    setAmountToAllocate: (state, action: PayloadAction<number>) => {
      state.amountToAllocate = action.payload;
    },
    setIsDeleteGoalPopupVisible: (state, action: PayloadAction<boolean>) => {
      state.isDeleteGoalPopupVisible = action.payload;
    },
    setIsDeductBudgetPopupVisible: (state, action: PayloadAction<boolean>) => {
      state.isDeductBudgetPopupVisible = action.payload;
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
  setMobileOpen,
  setFinanceOpen,
  setProfileOpen,
  setSelectFilterByAll,
  setSelectFilterByIncome,
  setSelectFilterByExpense,
  setSelectFilterByTransfer,
  setSelectFilterByPending,
  setSelectFilterByCleared,
  showGoalPopup,
  hideGoalPopup,
  setIsAllocatePopupVisible,
  setGoalId,
  setAmountToAllocate,
  setIsDeleteGoalPopupVisible,
  setIsDeductBudgetPopupVisible,
} = interactionSlice.actions;

export default interactionSlice.reducer;
