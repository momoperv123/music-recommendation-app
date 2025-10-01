import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { spotifyApi } from '../spotifyClient';
import { useToast } from './ToastProvider';

const SpotifyCallback = ({ setIsLoggedIn, setAvatarUrl, setUserName }) => {
  const navigate = useNavigate();
  const { notifyError } = useToast();
  const hasExchangedRef = useRef(false);

  useEffect(() => {
    const fetchTokenAndProfile = async () => {
      if (hasExchangedRef.current) {
        return;
      }

      hasExchangedRef.current = true;

      const tokenInStorage = localStorage.getItem('spotifyToken');
      if (tokenInStorage) {
        setIsLoggedIn(true);
        navigate('/');
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        notifyError('No authorization code found in the URL');
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          notifyError('Missing API URL configuration');
          return;
        }

        const response = await axios.post(`${apiUrl}/auth/spotify/token`, { code });
        const { access_token, refresh_token, expires_in } = response.data;

        if (access_token) {
          localStorage.setItem('spotifyToken', access_token);
          localStorage.setItem('spotifyRefreshToken', refresh_token);

          const expirationTime = new Date().getTime() + expires_in * 1000;
          localStorage.setItem('spotifyTokenExpiration', expirationTime);

          const profileResponse = await spotifyApi.get('/v1/me');

          const profileData = profileResponse.data;
          setAvatarUrl(profileData.images?.[0]?.url || null);
          setUserName(profileData.display_name || null);
          setIsLoggedIn(true);

          navigate('/');
        } else {
          notifyError('No access token received from Spotify');
        }
      } catch (error) {
        if (error.response && error.response.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          notifyError('Rate limited by Spotify. Retrying shortly...');
          setTimeout(fetchTokenAndProfile, retryAfter * 1000);
        } else {
          notifyError('Error during Spotify login');

          if (error.response && error.response.data.error === 'invalid_grant') {
            notifyError('Authorization code expired or invalid');
            window.location.href = '/';
          }
        }
      }
    };

    fetchTokenAndProfile();
  }, [navigate, setIsLoggedIn, setAvatarUrl, setUserName, notifyError]);

  return (
    <div className="w-full col-span-full flex justify-center items-center mt-10">
      <p className="text-center text-xl font-semibold text-gray-400">Logging In With Spotify...</p>
    </div>
  );
};

export default SpotifyCallback;
