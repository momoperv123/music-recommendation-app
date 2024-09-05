import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MusicPlayer from './MusicPlayer';

const RecommendationCarousel = ({ selectedMood, currentTrackId, setCurrentTrackId, genreSeed }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('spotifyToken');
        if (!token) {
          console.error('No Spotify token found in localStorage.');
          window.location.href = '/'; 
          return;
        }

        const moodToGenreMap = {
          happy: 'happy',
          chill: 'chill',
          sad: 'sad',
          romantic: 'romance',
          focus: 'ambient',
          workout: 'rock',
        };

        const genre = genreSeed || moodToGenreMap[selectedMood] || 'pop';

        const response = await axios.get('https://api.spotify.com/v1/recommendations', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit: 30,
            seed_genres: genre,
          }
        });

        const filteredTracks = response.data.tracks.filter(track => track.preview_url);
        console.log(`Filtered ${filteredTracks.length} tracks for genre "${genre}".`);

        if (filteredTracks.length === 0) {
          console.warn('No tracks with a preview_url found for the selected genre.');
        }

        setRecommendations(filteredTracks);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Token expired or invalid. Redirecting to login...');
          localStorage.removeItem('spotifyToken');
          window.location.href = '/';
        } else {
          console.error('Error fetching recommendations:', error.response ? error.response.data : error.message);
        }
      }
    };

    fetchRecommendations();
  }, [selectedMood, genreSeed]);

  const handleCardClick = (trackId) => {
    if (currentTrackId === trackId) {
      setCurrentTrackId(null);
    } else {
      setCurrentTrackId(trackId);
    }
  };

  return (
    <div className="grid-container">
      {recommendations.length > 0 ? (
        recommendations.map((track) => (
          <div
            key={track.id}
            className={`grid-item ${currentTrackId === track.id ? 'playing' : ''}`}
            onClick={() => handleCardClick(track.id)}
          >
            <img src={track.album.images[0].url} alt={track.name} />
            <p className="text-lg font-semibold text-white">{track.name}</p>
            <p className="text-sm text-white">{track.artists[0].name}</p>
            <MusicPlayer
              trackUrl={track.preview_url}
              isPlaying={currentTrackId === track.id}
              stop={currentTrackId !== track.id}
              songTitle={track.name}
              artistName={track.artists[0].name}
            />
          </div>
        ))
      ) : (
        <div className="w-full col-span-full flex justify-center items-center">
          <p className="text-center text-xl font-semibold text-gray-400">No recommendations found.</p>
        </div>
      )}
    </div>
  );
};

export default RecommendationCarousel;
