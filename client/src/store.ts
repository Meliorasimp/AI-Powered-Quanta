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
} from "./modules/Api/Users/userprofile.ts";
import { budgetReducer } from "./modules/Api/Budgets/addbudget.ts";

const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    register: registerReducer,
    login: loginReducer,
    fullname: fullNameReducer,
    email: emailReducer,
    password: passwordReducer,
    user: userReducer,
    budget: budgetReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
