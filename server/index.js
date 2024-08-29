// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Spotify OAuth Route
app.get('/auth/spotify', (req, res) => {
  const scopes = 'user-read-private user-read-email user-top-read playlist-read-private';
  res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/callback&scope=${scopes}`);
});

app.post('/auth/spotify/token', async (req, res) => {
  const { code } = req.body;
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  try {
    const response = await axios.post(tokenEndpoint, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:3000/callback',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.json(response.data); // Send the token data back to the client
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
