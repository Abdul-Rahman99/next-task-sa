import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse, User } from "@/types";
import { AuthService } from "@/lib/services/auth.service";
import { ProfileFormData } from "@/lib/validations/profile";
import { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

interface AuthState {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  user: User;
  access_token: string;
}

// Get initial state from localStorage if available
const { access_token, user } = AuthService.getStoredAuth();

const initialState: AuthState = {
  user,
  access_token,
  isAuthenticated: !!access_token && !!user,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginFormData) => {
    const response = await AuthService.login(credentials);
    // State might not be updating before redirect
    return {
      user: response.data.user,
      access_token: response.data.access_token,
    };
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData) => {
    const response = await AuthService.register(data);
    return {
      user: response.data.user,
      access_token: response.data.access_token,
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.access_token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.isAuthenticated = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
