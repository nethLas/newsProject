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
              'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
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
