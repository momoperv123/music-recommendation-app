import React from 'react';

const SpotifyLogin = () => {
  const handleLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
    const scope = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyRefreshToken');
    localStorage.removeItem('spotifyTokenExpiration');

    window.location.href = authUrl;
  };

  return (
    <button 
      onClick={handleLogin}
      className="flex items-center bg-black text-white font-semibold px-3 py-2 rounded-md hover:bg-gray-300 hover:text-black transition focus:outline-none"
    >
      Log in with Spotify
      <img src="/images/spotifyLogo.png" alt="Spotify Logo" className="h-9 w-12" />
    </button>
  );
};

export default SpotifyLogin;
