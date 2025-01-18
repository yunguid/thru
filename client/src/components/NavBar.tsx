import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-4xl mx-auto flex gap-8">
        <Link 
          to="/" 
          className={`font-serif text-lg transition-colors duration-200 ${
            isActive('/') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Home
        </Link>
        <Link 
          to="/cover" 
          className={`font-serif text-lg transition-colors duration-200 ${
            isActive('/cover') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Cover Letter
        </Link>
        <Link 
          to="/stats" 
          className={`font-serif text-lg transition-colors duration-200 ${
            isActive('/stats') 
              ? 'text-blue-600 font-medium' 
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          Stats
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
