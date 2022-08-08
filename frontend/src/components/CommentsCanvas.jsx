import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Offcanvas, Button, Spinner } from 'react-bootstrap';
import useViewSize from '../hooks/useViewSize';
import {
  getComments,
  resetAfterExit,
} from '../features/comments/commentsSlice';
import Comment from './Comment';
import CommentForm from './CommentForm';
function CommentsCanvas({ storyId }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isDesktop] = useViewSize();

  const { comments, isSuccess, isError, isLoading } = useSelector(
    (state) => state.comments
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getComments(storyId));
  }, [storyId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetAfterExit());
    };
  }, [dispatch]);

  return (
    <>
      <Button className="w-100 rounded-pill" onClick={handleShow}>
        Discussion
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement={isDesktop ? 'start' : 'bottom'}
        scroll
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Responses {isLoading ? '' : `(${comments?.length})`}
          </Offcanvas.Title>
        </Offcanvas.Header>
        {isLoading && (
          <Spinner
            variant="dark"
            className="mx-auto my-auto"
            animation="border"
          />
        )}
        {!isLoading && (
          <Offcanvas.Body>
            {user !== null && <CommentForm storyId={storyId} />}
            {comments.length > 0 ? (
              comments.map((comment) => {
                return <Comment comment={comment} key={comment._id} />;
              })
            ) : (
              <span className="fs-4">No comments yet</span>
            )}
          </Offcanvas.Body>
        )}
      </Offcanvas>
    </>
  );
}

export default CommentsCanvas;
