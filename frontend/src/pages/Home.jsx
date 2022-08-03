import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  getStories,
  reset,
  loadMoreStories,
} from '../features/stories/storiesSlice';
import StoryCard from '../components/StoryCard';
import StoryCardPlaceholder from '../components/StoryCardPlaceholder';
import { toast } from 'react-toastify';
import { FaArrowCircleDown } from 'react-icons/fa';

function Home() {
  const { isLoading, stories, isError, message, moreStories, isLoadingMore } =
    useSelector((state) => state.stories);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('from home');
    if (isError) toast.error(message);
    return () => dispatch(reset());
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (stories.length === 0) {
      dispatch(getStories());
      console.log('home getting stories');
    }
    return () => dispatch(reset());
  }, [stories, dispatch]);

  const getMoreStories = () => {
    dispatch(loadMoreStories({ limit: 2 }));
  };
  const createPlaceholders = (amount) => {
    return Array.from({ length: amount }).map((_, i) => (
      <StoryCardPlaceholder key={i} />
    ));
  };

  if (isLoading || stories.length === 0) return createPlaceholders(5);
  return (
    <>
      {stories.map((story, i) => (
        <StoryCard story={story} key={i} />
      ))}
      {isLoadingMore && createPlaceholders(3)}
      {moreStories && !isLoadingMore && (
        <Button
          onClick={getMoreStories}
          style={{
            alignContent: 'baseline',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
          className="text-muted"
        >
          <FaArrowCircleDown /> LOAD MORE
        </Button>
      )}
      {!moreStories && <p>No More Stories</p>}
    </>
  );
}

export default Home;
