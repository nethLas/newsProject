import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stack, Image, Form, Button } from 'react-bootstrap';
import { createComment } from '../features/comments/commentsSlice';
import { useState } from 'react';
function CommentForm({ storyId }) {
  const [comment, setComment] = useState('');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async () => {
    dispatch(createComment({ storyId, comment }));
  };
  return (
    <div className="mb-2">
      <Stack gap={2} direction="vertical" className="mb-1">
        <div style={{ alignContent: 'center' }}>
          <Image
            roundedCircle
            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
            src={
              user.profileUrl ||
              'https://miro.medium.com/fit/c/48/48/1*dmbNkD5D-u45r44go_cf0g.png'
            }
            alt="user"
            className="me-2"
          />
          <span className=" fs-5"> {user?.name}</span>
        </div>
      </Stack>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          as="textarea"
          type="text"
          placeholder="What are your thoughts?"
          minLength={1}
          maxLength={250}
          value={comment}
          onChange={onChange}
          style={{ border: 'none' }}
          required
          className="mb-1"
        />
        <div className="d-flex ">
          <Button
            className="rounded-pill ms-auto"
            variant="success"
            type="submit"
          >
            Comment
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CommentForm;
