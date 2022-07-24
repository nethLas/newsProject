import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkUser, reset } from './features/auth/authSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/user/Signup';
import Login from './pages/user/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Profile from './pages/user/Profile';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import ActivateUser from './pages/user/ActivateUser';
import CreateStory from './pages/CreateStory';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);
  return (
    <>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/create-story" element={<PrivateRoute />}>
              <Route path="/create-story" element={<CreateStory />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/activate-user/:token" element={<ActivateUser />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
