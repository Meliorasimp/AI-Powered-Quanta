import { configureStore } from "@reduxjs/toolkit";
import interactionReducer from "./modules/Interaction.ts/index";
import {
  loginReducer,
  registerReducer,
} from "./modules/Api/Users/userslice.ts";

const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    register: registerReducer,
    login: loginReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
