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
      const story = await storiesService.createStory(formData);
      story.author = {
        name: thunkAPI.getState().auth.user.name,
        id: story.author,
      };
      return story;
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
export const getStory = createAsyncThunk(
  'story/get',
  async function (storyId, thunkAPI) {
    try {
      //if story already in context no need for trip to db
      const found = thunkAPI
        .getState()
        .stories.stories.find((story) => story.id === storyId);
      if (found) return found;
      return await storiesService.getStory(storyId);
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
export const getStories = createAsyncThunk(
  'stories/get',
  async function (options, thunkAPI) {
    try {
      return await storiesService.getStories(options ? options : {});
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
    setLoading: (state) => {
      state.isLoading = true;
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
      })
      .addCase(getStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.story = action.payload;
      })
      .addCase(getStory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getStories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stories = action.payload;
      })
      .addCase(getStories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export default storiesSlice.reducer;
export const { reset, setLoading } = storiesSlice.actions;
