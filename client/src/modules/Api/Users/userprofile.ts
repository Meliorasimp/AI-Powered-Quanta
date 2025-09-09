import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type ProfilePictureState = {
  profilepicture: string;
  loading: boolean;
  error: string | null;
};

type FullNameState = {
  firstname: string;
  lastname: string;
  loading: boolean;
  error: string | null;
};

type EmailState = {
  email: string;
  loading: boolean;
  error: string | null;
};

type PasswordState = {
  currentpasswordInput: string;
  newpasswordInput: string;
  loading: boolean;
  error: string | null;
};

type FullNamePayload = {
  firstname: string;
  lastname: string;
  id: string;
};

type EmailPayload = {
  email: string;
  id: string;
};

type PasswordPayload = {
  currentpassword: string;
  newpassword: string;
  id: string;
};

const initialProfilePictureState: ProfilePictureState = {
  profilepicture: "",
  loading: false,
  error: null,
};

const initialFullNameState: FullNameState = {
  firstname: "",
  lastname: "",
  loading: false,
  error: null,
};

const initialEmailState: EmailState = {
  email: "",
  loading: false,
  error: null,
};

const initialPasswordState: PasswordState = {
  currentpasswordInput: "",
  newpasswordInput: "",
  loading: false,
  error: null,
};

export const profilePictureSlice = createSlice({
  name: "profilepicture",
  initialState: initialProfilePictureState,
  reducers: {
    setProfilePicture(state, action: PayloadAction<string>) {
      state.profilepicture = action.payload;
    },
  },
});

export const fullNameSlice = createSlice({
  name: "fullname",
  initialState: initialFullNameState,
  reducers: {
    setFirstName(state, action: PayloadAction<string>) {
      state.firstname = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastname = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateFullName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFullName.fulfilled, (state, action) => {
        state.loading = false;
        state.firstname = action.payload.firstname;
        state.lastname = action.payload.lastname;
      })
      .addCase(updateFullName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update full name";
      });
  },
});

export const emailSlice = createSlice({
  name: "email",
  initialState: initialEmailState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload.email;
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update email";
      });
  },
});

export const passwordSlice = createSlice({
  name: "password",
  initialState: initialPasswordState,
  reducers: {
    setCurrentPassword(state, action: PayloadAction<string>) {
      state.currentpasswordInput = action.payload;
    },
    setNewPassword(state, action: PayloadAction<string>) {
      state.newpasswordInput = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.currentpasswordInput = action.payload.currentpassword;
        state.newpasswordInput = action.payload.newpassword;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update password";
      });
  },
});

export const uploadProfilePicture = createAsyncThunk(
  "user/uploadProfilePicture",
  async ({ id, formData }: { id: string; formData: FormData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/users/uploadProfilePicture/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

export const updateFullName = createAsyncThunk(
  "user/updateFullName",
  async (fullNameData: FullNamePayload) => {
    const response = await axios.put(
      `http://localhost:5000/api/users/updateFullName/${fullNameData.id}`,
      fullNameData
    );
    return response.data;
  }
);

export const updateEmail = createAsyncThunk(
  "user/updateEmail",
  async (emailData: EmailPayload) => {
    const response = await axios.put(
      `http://localhost:5000/api/users/updateEmail/${emailData.id}`,
      emailData
    );
    return response.data;
  }
);

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData: PasswordPayload) => {
    const response = await axios.put(
      `http://localhost:5000/api/users/updatePassword/${passwordData.id}`,
      passwordData
    );
    return response.data;
  }
);

export const { setFirstName, setLastName } = fullNameSlice.actions;
export const { setEmail } = emailSlice.actions;
export const { setCurrentPassword, setNewPassword } = passwordSlice.actions;
export const { setProfilePicture } = profilePictureSlice.actions;

export const fullNameReducer = fullNameSlice.reducer;
export const emailReducer = emailSlice.reducer;
export const passwordReducer = passwordSlice.reducer;
export const profilePictureReducer = profilePictureSlice.reducer;
