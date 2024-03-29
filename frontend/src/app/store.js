import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import storiesReducer from '../features/stories/storiesSlice';
import reviewsReducer from '../features/reviews/reviewsSlice';
import commentsReducer from '../features/comments/commentsSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    stories: storiesReducer,
    reviews: reviewsReducer,
    comments: commentsReducer,
  },
});
