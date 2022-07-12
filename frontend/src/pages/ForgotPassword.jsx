import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function ForgotPassword() {
  const { user, isSuccess, isError, isLoading, message } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || '');
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(forgotPassword({ email }));
    } catch (error) {
      toast.error(message);
    }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      navigate('/');
    }
    if (isError) {
      toast.error(message);
    }
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  if (isLoading) return <Spinner />;
  return (
    <>
      <Card className="mb-4">
        <Card.Body style={{ textAlign: 'left' }}>
          <Card.Title>Forgot your password?</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Change your password in three easy steps. This will help you to
            secure your password!
          </Card.Subtitle>
          <Card.Text>
            1. Enter your email address below. <br /> 2. Our system will send
            you a temporary link <br /> 3. Use the link to reset your password
          </Card.Text>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body style={{ textAlign: 'left' }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                value={email}
                required
              />
              <Form.Text className="text-muted">
                Enter the email address you used when you signed up. Then we'll
                email a link to this address.
              </Form.Text>
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              style={{ marginRight: '1rem' }}
            >
              Send Email
            </Button>
            <Button as={Link} to={user ? '/profile' : '/login'}>
              Back to {user ? 'Profile' : 'Login'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default ForgotPassword;
