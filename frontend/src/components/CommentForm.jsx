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
              'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
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
