import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Spinner } from 'react-bootstrap';
import {
  getReview,
  sendReview,
  reset as revReset,
  resetAfterExit,
} from '../features/reviews/reviewsSlice';
import { reset } from '../features/stories/storiesSlice';
import { toast } from 'react-toastify';

function ReviewForm({ storyId }) {
  const [current, setCurrent] = useState('');
  const [sent, setSent] = useState(false);
  const { story, isLoading, isError, isSuccess } = useSelector(
    (state) => state.stories
  );
  const { user } = useSelector((state) => state.auth);
  const {
    review,
    isSuccess: revSuccess,
    isLoading: revLoading,
    hasReviewed: hasRev,
  } = useSelector((state) => state.reviews);

  const dispatch = useDispatch();
  useEffect(() => {
    if (revSuccess && hasRev && !sent) setCurrent(review.rating);
  }, [revSuccess, hasRev, sent, review, dispatch]);

  useEffect(() => {
    dispatch(getReview(storyId));
  }, [storyId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetAfterExit());
    };
  }, [dispatch]);
  const onClick = function (e) {
    if (story.author.id === user.id) {
      toast.error('cannot rate your own story');
      return;
    }
    setCurrent(+e.target.value);
    dispatch(sendReview({ storyId: story._id, review: +e.target.value }));
    setSent(true);
  };

  if (user === null) return;
  if (revLoading && !hasRev && !sent)
    //dont want so show spinner between submits
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner />
      </div>
    );
  return (
    <div style={{ textAlign: 'center' }}>
      {/*A little weird but doesnt really matter */}
      <Card
        style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
        className="rounded-pill d-inline-flex"
      >
        <Card.Title className="fs-4">Rate this Story's fiabilty</Card.Title>
        <Card.Body>
          <FormButton
            variant="danger"
            text="very low"
            current={current}
            value={1}
            onClick={onClick}
          />
          <FormButton
            variant="warning"
            text="low"
            current={current}
            value={2}
            onClick={onClick}
          />
          <FormButton
            variant="info"
            text="medium"
            current={current}
            value={3}
            onClick={onClick}
          />
          <FormButton
            variant="primary"
            text="high"
            current={current}
            value={4}
            onClick={onClick}
          />
          <FormButton
            variant="success"
            text="very high"
            current={current}
            value={5}
            onClick={onClick}
          />
        </Card.Body>
      </Card>
    </div>
  );
}

function FormButton({ variant, text, current, value, onClick }) {
  return (
    <Button
      className="rounded-pill mx-1"
      variant={`${current === value ? '' : 'outline-'}${variant}`}
      type="submit"
      value={value}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

export default ReviewForm;
