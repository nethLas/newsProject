import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { isLoading, user } = useSelector((state) => state.auth);
  if (isLoading) return <Spinner />;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
