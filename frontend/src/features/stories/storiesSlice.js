import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storiesService from './storiesService';
import errorMessage from '../../utils/errorMessage';
const initialState = {
  story: {},
  stories: [],
  userStories: [],
  moreStories: true, //are there more stories to load
  isLoadingMore: false,
  isLoadingUserStories: false,
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
      return errorMessage(error, thunkAPI);
    }
  }
);
export const updateStory = createAsyncThunk(
  'stories/update',
  async function ({ formData, storyId }, thunkAPI) {
    try {
      return await storiesService.updateStory(formData, storyId);
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
export const getStory = createAsyncThunk(
  'story/get',
  async function (slug, thunkAPI) {
    try {
      //if story already in context no need for trip to db
      // const found = thunkAPI
      //   .getState()
      //   .stories.stories.find((story) => story.slug === slug);
      // if (found) return found;
      //NOT TRUE!!! WHAT IF STORIES CHANGED
      return await storiesService.getStory(slug);
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
export const getUserStories = createAsyncThunk(
  'story/getUsers',
  async function (_, thunkAPI) {
    try {
      const userId = thunkAPI.getState().auth.user.id;
      return await storiesService.getUserStories(userId);
    } catch (error) {
      console.log(error);
      return errorMessage(error, thunkAPI);
    }
  }
);
export const deleteStory = createAsyncThunk(
  'story/delete',
  async function (storyId, thunkAPI) {
    try {
      return await storiesService.deleteStory(storyId);
    } catch (error) {
      thunkAPI.rejectWithValue('Couldnt delete story');
      // return errorMessage(error, thunkAPI);
    }
  }
);
export const getStories = createAsyncThunk(
  'stories/get',
  async function (options, thunkAPI) {
    try {
      return await storiesService.getStories(options ? options : {});
    } catch (error) {
      return errorMessage(error, thunkAPI);
    }
  }
);
export const loadMoreStories = createAsyncThunk(
  'stories/loadMore',
  async function (options, thunkAPI) {
    try {
      const ops = { skip: thunkAPI.getState().stories.stories.length };
      if (options.limit) ops.limit = options.limit;
      return await storiesService.loadMoreStories(ops);
    } catch (error) {
      return errorMessage(error, thunkAPI);
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
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetAfterLogout: (state) => {
      state.userStories = [];
      // state.isLoadingUserStories = false;
    },
    resetAfterExit: (state) => {
      state.story = {};
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
        state.stories.unshift(action.payload);
        state.userStories.unshift(action.payload);
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
        console.log('rejected get story'); //doesnt wait for end of builder to fire
        state.message = action.payload;
      })
      .addCase(getUserStories.pending, (state) => {
        state.isLoadingUserStories = true;
      })
      .addCase(getUserStories.fulfilled, (state, action) => {
        state.isLoadingUserStories = false;
        state.isSuccess = true;
        state.userStories = action.payload;
      })
      .addCase(getUserStories.rejected, (state, action) => {
        state.isLoadingUserStories = false;
        state.isError = true;
        console.log('rejected'); //doesnt wait for end of builder to fire
        state.message = action.payload;
      })
      .addCase(deleteStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stories = state.stories.filter((story) => {
          return story.id !== action.payload;
        });
        state.userStories = state.userStories.filter((story) => {
          return story.id !== action.payload;
        });
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateStory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.story = action.payload;
        //update stories in home
        const storyIdx = state.stories.findIndex(
          (story) => story.id === action.payload.id
        );
        if (storyIdx !== -1) state.stories[storyIdx] = action.payload;
        //update user stories
        const userStoryIdx = state.userStories.findIndex(
          (story) => story.id === action.payload.id
        );
        if (userStoryIdx !== -1)
          state.userStories[userStoryIdx] = action.payload;
      })
      .addCase(updateStory.rejected, (state, action) => {
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
      })
      .addCase(loadMoreStories.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(loadMoreStories.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        state.isSuccess = true;
        state.stories = [...state.stories, ...action.payload[0]];
        state.moreStories = action.payload[1];
      })
      .addCase(loadMoreStories.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});
export default storiesSlice.reducer;
export const { reset, setLoading, resetAfterLogout, resetAfterExit } =
  storiesSlice.actions;
