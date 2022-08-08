import React from 'react';
import { Stack, Image } from 'react-bootstrap';
import TimeAgo from 'timeago-react';

function Comment({ comment }) {
  return (
    <div className="mb-2">
      <Stack gap={2} direction="horizontal" className="mb-2">
        <div style={{ alignContent: 'center' }}>
          <Image
            roundedCircle
            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
            src={
              comment.user.profileUrl ||
              'https://miro.medium.com/fit/c/48/48/1*dmbNkD5D-u45r44go_cf0g.png'
            }
            alt="user"
            className="me-2"
          />
        </div>
        <div>
          <span className="fs-6">{comment.user?.name}</span>
          <br />
          <TimeAgo
            className="text-muted"
            datetime={comment.createdAt}
            locale="'en-US'"
          />
        </div>
      </Stack>
      <p>{comment.comment}</p>
    </div>
  );
}

export default Comment;
