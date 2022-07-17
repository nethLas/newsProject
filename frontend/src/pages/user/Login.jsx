import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, reset } from '../../features/auth/authSlice';
import AuthModal from '../../components/AuthModal';
import Spinner from '../../components/Spinner';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  //useEffects
  useEffect(() => {
    if (isError && message.startsWith('You are not verified')) {
      setModalShow(true);
    } else if (isError) {
      toast.error(message);
    }
    //redirect when logged in
    if (isSuccess && user) {
      navigate('/');
    }
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Log in</h3>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-dark btn-lg btn-block ">
          Login
        </button>
        <p className="forgot-password text-right">
          Forgot your password?{' '}
          <Link to={'/forgot-password'}>Reset it here</Link>
        </p>
        <p className="forgot-password text-right">
          Dont have an account? <Link to={'/signup'}>sign up here</Link>
        </p>
      </form>
      <AuthModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          navigate('/');
        }}
        email={email}
      />
    </>
  );
}

export default Login;
