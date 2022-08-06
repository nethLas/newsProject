import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentsService from './commentsService';
import errorMessage from '../../utils/errorMessage';

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  comments: [],
};
export const getComments = createAsyncThunk(
  'comments/get',
  async function (storyId, thunkAPI) {
    try {
      return await commentsService.getComments(storyId);
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
export const createComment = createAsyncThunk(
  'comments/create',
  async function ({ storyId, comment }, thunkAPI) {
    try {
      const user = thunkAPI.getState().auth.user;
      const newComment = await commentsService.createComment(
        user._id,
        storyId,
        comment
      );
      newComment.user = user;
      return newComment;
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
const commentSlice = createSlice({
  name: 'comments',
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
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export default commentSlice.reducer;
export const { reset, resetAfterExit } = commentSlice.actions;
