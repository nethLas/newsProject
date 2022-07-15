import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import AuthModal from '../components/AuthModal';

function Signup() {
  const { isError, isSuccess, user, message, isLoading } = useSelector(
    (state) => state.auth
  );
  const [modalShow, setModalShow] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, email, password, passwordConfirm } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    //redirect when logged in
    if (isSuccess) {
      setModalShow(true);
    }
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      passwordConfirm,
    };
    dispatch(signup(userData));
  };
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Register</h3>

        <div className="form-group">
          <label>User Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="username"
            name="name"
            value={name}
            onChange={onChange}
            minLength={10}
            required
          />
        </div>
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
        <div className="form-group">
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
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label>Password Confirmation</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-dark btn-lg btn-block ">
          Register
        </button>
        <p className="forgot-password text-right">
          Already registered? <Link to={'/login'}>Login here</Link>
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

export default Signup;
