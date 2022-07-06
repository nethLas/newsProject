import React from 'react';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { signup } from '../features/auth/authSlice';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });
  const { name, email, password, passwordConfirm } = formData;
  const dispatch = useDispatch();
  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
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
        <p className="forgot-password text-right">Already registered</p>
      </form>
    </>
  );
}

export default Signup;
