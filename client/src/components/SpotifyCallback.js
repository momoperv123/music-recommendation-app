import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SpotifyCallback = ({ setIsLoggedIn, setAvatarUrl, setUserName }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokenAndProfile = async () => {
      const tokenInStorage = localStorage.getItem('spotifyToken');
      if (tokenInStorage) {
        console.log('Token already exists, skipping code exchange');
        setIsLoggedIn(true);
        navigate('/'); 
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        console.error('No authorization code found in the URL.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/auth/spotify/token', { code });
        const { access_token, refresh_token, expires_in } = response.data;

        if (access_token) {
          localStorage.setItem('spotifyToken', access_token);
          localStorage.setItem('spotifyRefreshToken', refresh_token);

          const expirationTime = new Date().getTime() + expires_in * 1000;
          localStorage.setItem('spotifyTokenExpiration', expirationTime);

          const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` }
          });

          const profileData = profileResponse.data;
          setAvatarUrl(profileData.images?.[0]?.url || null);
          setUserName(profileData.display_name || null);
          setIsLoggedIn(true); 

          navigate('/'); 
        } else {
          console.error('No access token received from Spotify.');
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          console.warn(`Rate limit exceeded. Retrying in ${retryAfter} seconds...`);

          setTimeout(fetchTokenAndProfile, retryAfter * 1000);
        } else {
          console.error('Error during token exchange or profile fetch:', error.response ? error.response.data : error.message);

          if (error.response && error.response.data.error === 'invalid_grant') {
            console.error('Authorization code has expired or is invalid.');
            window.location.href = '/';
          }
        }
      }
    };

    fetchTokenAndProfile();
  }, [navigate, setIsLoggedIn, setAvatarUrl, setUserName]);

  return <div className="w-full col-span-full flex justify-center items-center mt-10">
  <p className="text-center text-xl font-semibold text-gray-400">Logging In With Spotify...</p>
</div>
};

export default SpotifyCallback;
