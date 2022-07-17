import React from 'react';
import { activateUser, reset } from '../../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

function ActivateUser() {
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    //causing problems because of strict mode should be ok in prod
    dispatch(activateUser(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('Sign-up Complete!');
      dispatch(reset());
      navigate('/');
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
      navigate('/');
    }
  }, [isError, isSuccess, navigate, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }
  return <div>ActivateUser</div>;
}

export default ActivateUser;
