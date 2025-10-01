import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const spotifyApi = axios.create({ baseURL: 'https://api.spotify.com' });

export function setupSpotifyAxios() {
  spotifyApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('spotifyToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  }, (err) => {
    return Promise.reject(err);
  });

  spotifyApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config || {};
      const status = error.response?.status;
      const isSpotify = true;

      if (isSpotify && status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return spotifyApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
        }

        isRefreshing = true;

        const refreshToken = localStorage.getItem('spotifyRefreshToken');
        if (!refreshToken) {
          isRefreshing = false;
          processQueue(new Error('Missing refresh token'));
          localStorage.removeItem('spotifyToken');
          localStorage.removeItem('spotifyTokenExpiration');
          window.location.href = '/';
          return Promise.reject(error);
        }

        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const response = await axios.post(`${apiUrl}/auth/spotify/refresh`, { refresh_token: refreshToken });

          const newAccessToken = response.data.access_token;
          const expiresIn = response.data.expires_in;

          if (newAccessToken) {
            localStorage.setItem('spotifyToken', newAccessToken);
            if (expiresIn) {
              const expirationTime = new Date().getTime() + expiresIn * 1000;
              localStorage.setItem('spotifyTokenExpiration', expirationTime);
            }

            spotifyApi.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            processQueue(null, newAccessToken);
            return spotifyApi(originalRequest);
          }

          throw new Error('Failed to refresh token');
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('spotifyToken');
          localStorage.removeItem('spotifyRefreshToken');
          localStorage.removeItem('spotifyTokenExpiration');
          window.location.href = '/';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
}


