import React from 'react';

import { Button } from 'react-bootstrap';
import { useRef } from 'react';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
const data = {
  _id: '62d9772637f0e90fc4b2ee9f',
  title: 'The war in Ukraine continues',
  author: {
    _id: '62c5dbe3edd99e159a2e8818',
    name: 'Nethanel Lasry',
    id: '62c5dbe3edd99e159a2e8818',
  },
  text: 'Volodymyr Horbenko is the latest official to lose his job after Mr Zelensky said bosses failed to root out pro-Russian elements in the agency',
  imageCover: 'story-img-1658418981466.jpeg',
  images: [],
  createdAt: '2022-07-21T15:56:08.667Z',
  sources: [
    'https://www.bbc.com/news/world-62223264',
    'https://www.theguardian.com/world/live/2022/jul/19/russia-ukraine-war-live-news-putin-and-erdogan-to-meet-us-weaponry-stabilising-frontlines-ukraine-military-chief-says',
  ],
  summary:
    'On an unofficial visit, the Ukrainian first lady represents her country in more ways than one',
  locations: [
    {
      type: 'Point',
      coordinates: [-122.479887, 38.510312],
      description: 'boutcha',
      _id: '62d9772637f0e90fc4b2eea0',
    },
    {
      type: 'Point',
      coordinates: [-122.582948, 38.585707],
      description: 'kyiv',
      _id: '62d9772637f0e90fc4b2eea1',
    },
  ],
  slug: 'the-war-in-ukraine-continues',
  imageCoverUrl:
    'https://news-app-profile-pictures.s3.amazonaws.com/story-img-1658418981466.jpeg?AWSAccessKeyId=AKIAWJOR446PHMQZ42SM&Expires=1658608455&Signature=PMoK6ljwSKfRu2bYGpcxH4PP9H4%3D',
  id: '62d9772637f0e90fc4b2ee9f',
};
function Home() {
  return (
    <>
      <StoryCard story={data} />
      <StoryCard story={data} />
      <StoryCard story={data} />
      <StoryCard
        story={{
          ...data,
          imageCoverUrl:
            'https://news-app-profile-pictures.s3.amazonaws.com/story-img-1658246217686.jpeg?AWSAccessKeyId=AKIAWJOR446PHMQZ42SM&Expires=1658609039&Signature=ktRTuHeLR7KIDZ%2Fd7MUgEmbcs5M%3D',
        }}
      />
    </>
  );
}

export default Home;
