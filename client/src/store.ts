import { configureStore } from "@reduxjs/toolkit";
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

const store = configureStore({
  reducer: {
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
    transaction: transactionReducer,
    usertransaction: displayTransactionsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
