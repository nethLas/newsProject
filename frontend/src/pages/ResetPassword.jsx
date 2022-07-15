import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
function ResetPassword() {
  const { isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    password: '',
    passwordConfirm: '',
  });
  const { token } = useParams();
  const { password, passwordConfirm } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      toast.success('Succesfully reset password');
      navigate('/');
    }
    if (isError) {
      toast.error(message);
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);
  const onChange = function (e) {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (password !== passwordConfirm) {
        return toast.error("passwords don't match");
      }
      dispatch(resetPassword({ ...formData, token }));
    } catch (error) {
      toast.error(message);
    }
  };
  if (isLoading) return <Spinner />;
  return (
    <Form style={{ textAlign: 'left' }} onSubmit={handleSubmit}>
      <Form.Group>
        <h3>Create New Password</h3>
        <span className="text-muted fs-4">
          Your new password must be different from your previous password
        </span>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          required
          id="password"
          value={password}
          minLength={8}
          onChange={onChange}
        />
        <Form.Text className="text-muted">
          Must be at least 8 characters{' '}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          required
          minLength={8}
          id="passwordConfirm"
          onChange={onChange}
          value={passwordConfirm}
        />
        <Form.Text className="text-muted">Passwords must match</Form.Text>{' '}
      </Form.Group>
      <Button type="submit" style={{ backgroundColor: 'purple' }}>
        Reset password
      </Button>
    </Form>
  );
}

export default ResetPassword;
