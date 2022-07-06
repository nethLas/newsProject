import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/Signup';

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
        {user && <h1>logged in</h1>}
      </Router>
    </>
  );
}

export default App;
