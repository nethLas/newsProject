import { Button, Container, Nav, Navbar as NavbarBs } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //this is terrible doesnt do anything
  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };
  return (
    <NavbarBs sticky="top" className="bg-white shadow-sm mb-3">
      <Container>
        <Nav className="me-auto">
          <Nav.Link to="/" as={NavLink}>
            Home
          </Nav.Link>
          <Nav.Link to="/store" as={NavLink}>
            Stories
          </Nav.Link>
          <Nav.Link to="/about" as={NavLink}>
            About
          </Nav.Link>
        </Nav>
        {user ? (
          <>
            <Button variant="dark" onClick={handleLogout}>
              Logout
            </Button>
            <Link to="/profile" style={{ marginLeft: '0.5rem' }}>
              <Button variant="primary">Profile</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup">
              <Button variant="primary">Signup</Button>
            </Link>
            <Link to="/login" style={{ marginLeft: '0.5rem' }}>
              <Button variant="outline-secondary">Login</Button>
            </Link>
          </>
        )}
      </Container>
    </NavbarBs>
  );
}
export default Navbar;
