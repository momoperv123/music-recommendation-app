const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (res) => {
  res.send('Welcome to the Spotify and Genius Auth Server');
});

app.post('/auth/spotify/token', async (req, res) => {
  const { code } = req.body;

  console.log('Received a POST request at /auth/spotify/token with code:', code);

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Spotify access token response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching access token from Spotify:', error.response ? error.response.data : error.message);
    res.status(500).send('Authentication failed');
  }
});

app.get('/api/lyrics', async (req, res) => {
  const { song, artist } = req.query;

  try {
    const token = process.env.GENIUS_API_TOKEN;
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(song)} ${encodeURIComponent(artist)}`;
    
    const response = await axios.get(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const hits = response.data.response.hits;
    if (hits.length > 0) {
      const lyricsUrl = hits[0].result.url;
      res.json({ url: lyricsUrl });
    } else {
      res.status(404).json({ error: 'Lyrics not found' });
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching lyrics');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
