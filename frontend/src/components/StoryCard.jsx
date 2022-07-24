import React from 'react';
import { Stack, Image } from 'react-bootstrap';
const options = { year: 'numeric', month: 'long', day: 'numeric' };
function StoryCard({ story }) {
  return (
    <>
      <hr />
      <Stack
        direction="horizontal"
        className="d-flex "
        style={{ textAlign: 'left', alignItems: 'flex-start' }}
      >
        <div className="">
          <h3 className="fw-bold">{story.title}</h3>
          {story.summary && (
            <p className="d-none d-md-block">{story.summary}</p>
          )}
          <span className="text-muted">
            {new Date(story.createdAt).toLocaleDateString('en-US', options)} |{' '}
            {story.author.name}
          </span>
        </div>
        <Image //change image size based on screen size
          className="ms-auto d-none d-sm-block"
          // className="ms-auto"
          src={story.imageCoverUrl}
          alt=""
          style={{ height: '136', width: '200px', objectFit: 'cover' }}
          // loading="lazy"
        />
        <Image
          className="d-sm-none ms-auto"
          src={story.imageCoverUrl}
          alt=""
          style={{ height: '100px', width: '100px', objectFit: 'cover' }}
        />
      </Stack>
    </>
  );
}

export default StoryCard;
