import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewsService from './reviewsService';
import errorMessage from '../../utils/errorMessage';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  hasReviewed: false,
  review: null,
};
export const getReview = createAsyncThunk(
  'reviews/get',
  async function (storyId, thunkAPI) {
    try {
      const userId = thunkAPI.getState().auth.user?._id;
      return await reviewsService.getReview(userId, storyId);
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
export const sendReview = createAsyncThunk(
  'reviews/send',
  async function ({ storyId, review }, thunkAPI) {
    try {
      const userId = thunkAPI.getState().auth.user?._id;
      const isNew = !thunkAPI.getState().reviews.hasReviewed;
      if (isNew) {
        return await reviewsService.createReview(userId, storyId, review);
      } else {
        const reviewId = thunkAPI.getState().reviews.review?._id;
        return await reviewsService.updateReview(
          userId,
          storyId,
          review,
          reviewId
        );
      }
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    resetAfterExit: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
      state.hasReviewed = false;
      state.review = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.review = action.payload;
        state.hasReviewed = state.review ? true : false;
      })
      .addCase(getReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.review = action.payload;
        state.hasReviewed = true;
      })
      .addCase(sendReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export default reviewsSlice.reducer;
export const { reset, setLoading, resetAfterExit } = reviewsSlice.actions;
