import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav style={{
      backgroundColor: '#001f3f',
      color: '#F5F5DC',
      padding: '0.75rem',
      display: 'flex',
      gap: '1rem'
    }}>
      <Link to="/" style={{color: '#F5F5DC', textDecoration: 'none'}}>Home</Link>
      <Link to="/cover" style={{color: '#F5F5DC', textDecoration: 'none'}}>Cover Letter</Link>
      <Link to="/stats" style={{color: '#F5F5DC', textDecoration: 'none'}}>Stats</Link>
    </nav>
  );
};

export default NavBar;
