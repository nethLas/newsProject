import React from 'react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getStories, reset } from '../features/stories/storiesSlice';
import StoryCard from '../components/StoryCard';
import StoryCardPlaceholder from '../components/StoryCardPlaceholder';
import { toast } from 'react-toastify';
import { useState } from 'react';

function Home() {
  const { isLoading, stories, isError, message } = useSelector(
    (state) => state.stories
  );
  const [lastStoryIdx, setLastStoryIdx] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isError) toast.error(message);
    dispatch(getStories());

    return () => dispatch(reset());
  }, [dispatch, isError, message]);

  if (isLoading || stories.length === 0)
    return Array.from({ length: 5 }).map((_, i) => (
      <StoryCardPlaceholder key={i} />
    ));
  return (
    <>
      {stories.map((story, i) => (
        <StoryCard story={story} key={i} />
      ))}
      <Button onClick={() => dispatch(getStories({ page: 2, limit: 2 }))}>
        press me
      </Button>
    </>
  );
}

export default Home;
