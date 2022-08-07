import React from 'react';
import { Badge } from 'react-bootstrap';
function StoryBadge({ rating, numRatings }) {
  const ratings = ['very low', 'low', 'medium', 'high', 'very high'];
  const colors = ['danger', 'warning', 'info', 'primary', 'success'];
  const color = colors[Math.trunc(rating) - 1];
  const score = ratings[Math.trunc(rating) - 1];
  return (
    <div>
      <Badge bg={color}>{score} reliability</Badge>{' '}
      <span className="text-muted fs-8">
        As ranked by {numRatings} user{numRatings > 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default StoryBadge;
