import React from 'react';

import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import StoryCard from '../components/StoryCard';

function Home() {
  const { story } = useSelector((state) => state.stories);
  return (
    <>
      <StoryCard story={story} />
    </>
  );
}

export default Home;
