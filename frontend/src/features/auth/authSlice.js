import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import errorMessage from '../../utils/errorMessage';
const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: true,
  message: '',
};
export const signup = createAsyncThunk(
  'auth/signup',
  async function (user, thunkAPI) {
    try {
      console.log('hello');
      return await authService.signup(user);
    } catch (error) {
      const message = 'Could not sign up please try again';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const login = createAsyncThunk(
  'auth/login',
  async function (user, thunkAPI) {
    try {
      return await authService.login(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async function (_, thunkAPI) {
    try {
      return await authService.logout();
    } catch (error) {
      const message = 'Something went wrong with logging out';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async function (userData, thunkAPI) {
    try {
      return await authService.updateUser(userData);
    } catch (error) {
      // const message = 'Something went wrong with updating your details';
      errorMessage(error, thunkAPI);
    }
  }
);
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async function (userData, thunkAPI) {
    try {
      return await authService.resetPassword(userData);
    } catch (error) {
      // const message = 'Something went wrong with updating your details';
      errorMessage(error, thunkAPI);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async function (userData, thunkAPI) {
    try {
      return await authService.forgotPassword(userData);
    } catch (error) {
      // const message = 'Something went wrong with updating your details';
      let message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      //dont want to leak information
      message =
        message === 'There is no user with that email address.'
          ? 'Something went wrong'
          : message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const activateUser = createAsyncThunk(
  'auth/activateUser',
  async function (token, thunkAPI) {
    try {
      return await authService.activateUser(token);
    } catch (error) {
      errorMessage(error, thunkAPI);
    }
  }
);
export const checkUser = createAsyncThunk(
  'auth/chekUser',
  async function (_, thunkAPI) {
    try {
      console.log('checking...');
      return await authService.checkUser();
    } catch (error) {
      errorMessage(error, thunkAPI);
    }
  }
);
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        //this causes problems
        // state.isSuccess = true;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        //this causes problems we will log instead
        console.log(action.payload);
        // state.isError = true;
        state.message = action.payload;
      })
      .addCase(checkUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.isLoading = false;
        // state.isError = true;
        // state.message = action.payload;
        state.user = null;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(activateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export default authSlice.reducer;
export const { reset, removeUserStory, updateUserStory } = authSlice.actions;
