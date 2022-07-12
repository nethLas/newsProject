import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Stack, Image, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { updateUser, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';

function Profile() {
  //implement chnage name and change password add all stroeis cards and stuff with photo
  const { user, isError, isSuccess, message, isLoading } = useSelector(
    (state) => state.auth
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
  useEffect(() => {
    dispatch(reset());
  }, [isError, isSuccess, user, message, dispatch]);

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
  const uploadUserPhoto = () => {
    try {
      console.log(fileInputRef.current.files[0]);
      if (fileInputRef.current.files.length === 0)
        return toast.error('please upload a file');
      const form = new FormData();
      form.append('photo', fileInputRef.current.files[0]);
      dispatch(updateUser(form));
    } catch (error) {
      toast.error(message);
    }
  };
  if (isLoading) return <Spinner />;
  return (
    <Stack gap={2}>
      <Image
        roundedCircle
        className="mx-auto"
        style={{ width: '125px', height: '125px' }}
        src={
          user.profileUrl ||
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMGF2YXRhcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60'
        }
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
            Select Photo
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
            Upload Photo
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
