import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import SpotifyCallback from './components/SpotifyCallback';
import NotLoggedInPage from './pages/NotLoggedInPage'; // Ensure this path is correct
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('spotifyToken');

    if (token) {
      axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        setIsLoggedIn(true);
        setUserName(response.data.display_name);
        setAvatarUrl(response.data.images[0]?.url || '');
      }).catch((error) => {
        console.error('Error fetching user data', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('spotifyToken');
          setIsLoggedIn(false);
          window.location.href = '/login';
        }
      });
    }
  }, []);

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} userName={userName} avatarUrl={avatarUrl} />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <LandingPage /> : <NotLoggedInPage />
          }
        />
        <Route
          path="/callback"
          element={<SpotifyCallback
            setIsLoggedIn={setIsLoggedIn}
            setAvatarUrl={setAvatarUrl}
            setUserName={setUserName}
          />}
        />
      </Routes>
    </Router>
  );
}

export default App;
