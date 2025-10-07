import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import interactionReducer from "./modules/Interaction.ts/index";
import {
  loginReducer,
  registerReducer,
  userReducer,
} from "./modules/Api/Users/userslice.ts";
import {
  emailReducer,
  fullNameReducer,
  passwordReducer,
  profilePictureReducer,
} from "./modules/Api/Users/userprofile.ts";
import { budgetReducer } from "./modules/Api/Budgets/addbudget.ts";
import { userBudgetReducer } from "./modules/Api/Budgets/displaybudget.ts";
import { transactionReducer } from "./modules/Api/transaction/addtransaction.ts";
import { displayTransactionsReducer } from "./modules/Api/transaction/displaytransaction.ts";
import { dashboardReducer } from "./modules/Interaction.ts/dashboard/index.ts";
import { goalsReducer } from "./modules/Api/Goals/goalSlice";
import { displayGoalSlice } from "./modules/Api/Goals/displayGoal.ts";
import { deductAmountReducer } from "./modules/Api/Budgets/addbudget.ts";

const rootReducer = combineReducers({
  interaction: interactionReducer,
  register: registerReducer,
  login: loginReducer,
  profile: profilePictureReducer,
  fullname: fullNameReducer,
  email: emailReducer,
  password: passwordReducer,
  user: userReducer,
  budget: budgetReducer,
  userbudget: userBudgetReducer,
  deductAmount: deductAmountReducer,
  transaction: transactionReducer,
  usertransaction: displayTransactionsReducer,
  dashboard: dashboardReducer,
  goals: goalsReducer,
  displayGoal: displayGoalSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
