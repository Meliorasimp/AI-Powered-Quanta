import { configureStore } from "@reduxjs/toolkit";
import interactionReducer from "./modules/Interaction.ts/index";
import {
  loginReducer,
  registerReducer,
} from "./modules/Api/Users/userslice.ts";
import {
  emailReducer,
  fullNameReducer,
  passwordReducer,
} from "./modules/Api/Users/userprofile.ts";

const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    register: registerReducer,
    login: loginReducer,
    fullname: fullNameReducer,
    email: emailReducer,
    password: passwordReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
