import React, { useEffect, useState } from 'react';
import StoryCard from '../components/StoryCard';
import StoryCardPlaceholder from '../components/StoryCardPlaceholder';
import { useSelector, useDispatch } from 'react-redux';
import { getStoriesNearMe, reset } from '../features/stories/storiesSlice';
import { useNavigate } from 'react-router-dom';
function NearMe() {
  const [geoEnabled, setGeoEnabled] = useState(false);
  const { nearMeStories, isLoadingNearMeStories } = useSelector(
    (state) => state.stories
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const getLocation = () => {
      return navigator.geolocation.getCurrentPosition(
        function (position) {
          setGeoEnabled(true);
          // return position.coords;
          dispatch(getStoriesNearMe(position.coords));
        },
        function () {
          alert('Allow geolocation in order to get stories near you');
          navigate('/');
        }
      );
    };

    getLocation();
    return () => dispatch(reset());
  }, [dispatch, navigate]);
  const createPlaceholders = (amount) => {
    return Array.from({ length: amount }).map((_, i) => (
      <StoryCardPlaceholder key={i} />
    ));
  };
  if (!geoEnabled) return;
  if (isLoadingNearMeStories || nearMeStories.length === 0)
    return createPlaceholders(5);
  return (
    <>
      <h1>Top 10 Stories closest to you</h1>
      {nearMeStories.map((story, i) => (
        <StoryCard story={story} key={i} />
      ))}
    </>
  );
}

export default NearMe;
