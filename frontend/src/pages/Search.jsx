import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import StoryCard from '../components/StoryCard';
import StoryCardPlaceholder from '../components/StoryCardPlaceholder';
import { reset } from '../features/stories/storiesSlice';
function Search() {
  const { isLoading, searchResults, noneFound } = useSelector(
    (state) => state.stories
  );
  const dispatch = useDispatch();
  useEffect(() => {
    return () => dispatch(reset());
  });
  const createPlaceholders = (amount) => {
    return Array.from({ length: amount }).map((_, i) => (
      <StoryCardPlaceholder key={i} />
    ));
  };
  return (
    <div>
      <SearchBar />
      {isLoading && createPlaceholders(5)}
      {!isLoading &&
        searchResults.map((story, i) => <StoryCard story={story} key={i} />)}
      {noneFound && <h1>Couldn't find results for your search</h1>}
    </div>
  );
}

export default Search;
