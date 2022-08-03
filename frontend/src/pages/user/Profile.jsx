import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPen, FaArrowRight } from 'react-icons/fa';
import { Form, Stack, Image, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { updateUser, reset } from '../../features/auth/authSlice';
import {
  deleteStory,
  getUserStories,
  reset as storyReset,
} from '../../features/stories/storiesSlice';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import Spinner from '../../components/Spinner';
import { Spinner as SpinnerComp } from 'react-bootstrap';
import StoryCard from '../../components/StoryCard';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import compress from '../../utils/compress';
import userIcon from '../../assests/user.png';

function Profile() {
  //implement chnage name and change password add all stroeis cards and stuff with photo
  const { user, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
  );
  const { userStories, isLoadingUserStories } = useSelector(
    (state) => state.stories
  );
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, passwordCurrent, password, passwordConfirm } = formData;
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) toast.success(message);
    dispatch(reset());
  }, [isError, isSuccess, user, message, dispatch]);

  useEffect(() => {
    if (userStories.length === 0) dispatch(getUserStories());
    else dispatch(storyReset());
  }, [userStories, dispatch]);

  const onChange = function (e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const onChangeName = function (e) {
    e.preventDefault();
    try {
      if (name.length < 10)
        return toast.error('name must be at least 10 characters');
      if (user.name !== name) {
        dispatch(updateUser({ name }));
      }
    } catch (error) {
      toast.error('Could not update profile');
    }
  };

  const onChangePassword = function (e) {
    e.preventDefault();
    try {
      if (password !== passwordConfirm)
        return toast.error('passwords do not match');
      const userData = {
        passwordCurrent,
        password,
        passwordConfirm,
      };
      dispatch(updateUser(userData));
    } catch (error) {
      toast.error('Could not change password');
    }
  };

  const uploadUserPhoto = async () => {
    try {
      const file = fileInputRef.current.files[0];
      if (!file) return toast.error('please upload a file');
      const photo = await compress(file, {
        maxSize: 3 * 1024 * 1024,
        quality: 0.8,
      });
      photo.originalname = file.name;
      const form = new FormData();
      form.append('photo', photo);
      dispatch(updateUser(form));
    } catch (error) {
      toast.error(message || error.message);
    }
  };

  const onDelete = (storyId) => {
    if (!window.confirm(`You sure you want to delete this story ${storyId}`))
      return;
    dispatch(deleteStory(storyId));
  };
  const onEdit = (slug) => {
    navigate(`/edit-story/${slug}`);
  };

  if (isLoading) return <Spinner />;
  return (
    <Stack gap={2}>
      <Image
        roundedCircle
        className="mx-auto"
        style={{ width: '125px', height: '125px', objectFit: 'cover' }}
        src={user.profileUrl || userIcon}
        alt="user"
      />
      <div className="d-flex  mb-4">
        <span className="fs-4 fw-bold me-auto">Your Profile</span>
        <div>
          <Button
            className="rounded-pill"
            style={{ marginRight: '1rem' }}
            variant="outline-success"
            onClick={() => fileInputRef.current.click()}
          >
            Select
          </Button>
          <input
            id="input-file"
            max={1}
            ref={fileInputRef}
            className="d-none"
            type="file"
            accept=".jpg,.png,.jpeg"
          />
          <Button
            className="rounded-pill"
            variant="success"
            onClick={uploadUserPhoto}
          >
            Upload
          </Button>
        </div>
      </div>

      <Form style={{ maxWidth: '30rem', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="text-muted">Personal Details</span>
          <Button
            className="rounded-pill"
            variant="info"
            onClick={(e) => {
              changeDetails && onChangeName(e);
              setChangeDetails(!changeDetails);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </Button>
        </div>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly disabled value={user.email} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Name
          </Form.Label>
          <Col sm="10">
            <Form.Control
              disabled={!changeDetails}
              type="text"
              id="name"
              plaintext={!changeDetails}
              value={name}
              onChange={onChange}
            />
          </Col>
        </Form.Group>
      </Form>
      <Button
        as={Link}
        to="/create-story"
        variant="dark"
        className="d-flex justify-content-between align-items-center"
        style={{ maxWidth: '30rem' }}
      >
        <FaPen className="fa-lg" />
        Write A Story
        <FaArrowRight />
      </Button>
      <hr />
      <div style={{ textAlign: 'left' }}>
        <span className="fs-4 fw-bold ">Your Stories</span>
        {userStories.length === 0 && !isLoadingUserStories && (
          <h5 className="fs-3 ">Your Don't have any stories yet</h5>
        )}
        {isLoadingUserStories && (
          <SpinnerComp animation="border" style={{ textAlign: 'center' }} />
        )}
        {userStories.length > 0 &&
          userStories.map((story) => (
            <StoryCard
              story={story}
              key={story.id}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
      </div>

      <hr />
      <div className="d-flex justify-content-between mb-4">
        <span className="fs-4 fw-bold">Change Password</span>
      </div>
      <Form
        style={{ maxWidth: '40rem', textAlign: 'left' }}
        onSubmit={onChangePassword}
      >
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            Current Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="password"
              id="passwordCurrent"
              value={passwordCurrent}
              onChange={onChange}
              required
              minLength={8}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            New Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              minLength={8}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="3">
            Confirm Password
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={onChange}
              required
              minLength={8}
            />
          </Col>
        </Form.Group>
        <Button type="submit">Save Password</Button>
        <p className="forgot-password text-right">
          Forgot your password?{' '}
          <Link to={'/forgot-password'}>Reset it here</Link>
        </p>
      </Form>
    </Stack>
  );
}

export default Profile;
