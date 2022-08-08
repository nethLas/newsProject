import React from 'react';
import { Stack, Image, Badge } from 'react-bootstrap';
import { FaTrash, FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import StoryBadge from './StoryBadge';
const options = { year: 'numeric', month: 'long', day: 'numeric' };
function StoryCard({ story, onEdit, onDelete }) {
  const navigate = useNavigate();
  return (
    <>
      <hr />
      {onEdit && onDelete && (
        <div className="d-flex mb-2">
          <FaPen
            style={{ fontSize: '1.25em' }}
            className="ms-auto"
            onClick={() => onEdit(story.slug)}
          />
          <FaTrash
            style={{ color: 'red', fontSize: '1.25em', marginLeft: '1rem' }}
            onClick={() => onDelete(story.id)}
          />
        </div>
      )}
      <Stack
        direction="horizontal"
        className="d-flex justify-content-between"
        style={{ textAlign: 'left', alignItems: 'center' }}
      >
        <div
          className=""
          onClick={() => navigate(`/story/${story.slug}`)}
          style={{ overflow: 'clip' }}
        >
          <h3 className="fw-bold">{story.title}</h3>
          {story.summary && (
            <p className="d-none d-md-block">{story.summary}</p>
          )}
          <span className="text-muted">
            {new Date(story.createdAt).toLocaleDateString('en-US', options)} |{' '}
            {story?.author?.name}
            <br />
          </span>
          {story.ratingsAverage > 0 && story.ratingsQuantity > 0 && (
            <StoryBadge
              numRatings={story.ratingsQuantity}
              rating={story.ratingsAverage}
            />
          )}
          {story.distance && (
            <>
              <br />
              <label className="fs-6">
                {story.distance.toFixed(1)} km from you
              </label>
            </>
          )}
        </div>

        <div
          className="d-none d-sm-block"
          style={{
            height: '136px',
            width: '200px',
            marginLeft: '2rem',
          }}
        >
          <Image //change image size based on screen size
            style={{ objectFit: 'cover', height: '136px', width: '200px' }}
            src={story.imageCoverUrl}
            alt=""
          />
        </div>

        <Image
          className="d-sm-none"
          src={story.imageCoverUrl}
          alt=""
          style={{
            height: '100px',
            width: '100px',
            objectFit: 'cover',
            marginLeft: '1rem',
          }}
        />
      </Stack>
    </>
  );
}

export default StoryCard;
