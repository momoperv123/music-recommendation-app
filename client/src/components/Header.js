import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BsMoon, BsSun, BsThreeDotsVertical } from 'react-icons/bs';

const Header = ({ avatarUrl, userName, isLoggedIn }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('spotifyToken');
    window.location.href = '/';
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (event) => {
    event.stopPropagation();
    setDropdownVisible((prev) => !prev);
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('darkMode', !isDarkMode);
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, []);

  return (
    <header className="header bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-md flex items-center justify-between">
      <div className="logo flex items-center">
        <Link to="/" className="flex items-center" onClick={handleLogoClick}>
          <img src="/images/logo.png" alt="Rhythm Logo" className="h-16 w-16" />
          <h1 className="text-white text-3xl font-bold">Rhythm</h1>
        </Link>
      </div>

      {isLoggedIn && (
        <div className="flex items-center ml-auto relative">
          <button
            className="md:hidden flex items-center focus:outline-none"
            onClick={handleDropdownToggle}
          >
            <BsThreeDotsVertical className="text-white text-2xl" />
          </button>

          {/* User Profile */}
          <div className="hidden md:flex items-center">
            <button
              className="flex items-center focus:outline-none"
              onClick={handleDropdownToggle}
            >
              {userName && (
                <span className="text-white text-xl font-semibold mr-2">{userName}</span>
              )}
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="User Profile"
                  className="border border-white h-12 w-12 rounded-full object-cover"
                  style={{ objectPosition: 'center', imageRendering: 'auto' }}
                />
              )}
            </button>
          </div>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50"
              style={{ top: '2.5rem' }}
            >
              <div className="md:hidden flex items-center px-4 py-2 border-b border-gray-200">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="User Profile"
                    className="h-10 w-10 rounded-full object-cover mr-2"
                    style={{ objectPosition: 'center', imageRendering: 'auto' }}
                  />
                )}
                {userName && (
                  <span className="text-gray-700 text-lg font-semibold">{userName}</span>
                )}
              </div>
              <div className="flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer" onClick={toggleDarkMode}>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                {isDarkMode ? <BsSun className="text-xl" /> : <BsMoon className="text-xl" />}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
