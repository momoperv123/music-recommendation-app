import React from 'react';

const SpotifyLogin = () => {
  const handleLogin = () => {
    const clientId = '8d135e71b2af4b30a8c2679c4a135b5b';
    const redirectUri = 'http://localhost:3000/callback';
    const scope = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

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
