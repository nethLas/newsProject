import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storiesService from './storiesService';

const initialState = {
  story: {},
  stories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};
export const createStory = createAsyncThunk(
  'stories/create',
  async function (formData, thunkAPI) {
    try {
      return await storiesService.createStory(formData);
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
const storiesSlice = createSlice({
  name: 'stories',
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
      .addCase(createStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.story = action.payload;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export default storiesSlice.reducer;
export const { reset } = storiesSlice.actions;
