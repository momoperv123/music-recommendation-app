import React, { useEffect, useState, useRef } from 'react';
import { spotifyApi } from '../spotifyClient';
import { useToast } from './ToastProvider';
import MusicPlayer from './MusicPlayer';

const RecommendationCarousel = ({ selectedMood, currentTrackId, setCurrentTrackId, genreSeed }) => {
  const [recommendations, setRecommendations] = useState([]);
  const availableGenresRef = useRef(null);
  const { notifyError } = useToast();

  useEffect(() => {
    const ensureAvailableGenres = async () => {
      if (availableGenresRef.current) return availableGenresRef.current;
      try {
        const seedsResp = await spotifyApi.get('/v1/recommendations/available-genre-seeds');
        const list = Array.isArray(seedsResp.data?.genres) ? seedsResp.data.genres : [];
        availableGenresRef.current = new Set(list);
        return availableGenresRef.current;
      } catch (e) {
        availableGenresRef.current = new Set(['pop']);
        return availableGenresRef.current;
      }
    };

    const tryByGenre = async (genre) => {
      const response = await spotifyApi.get('/v1/recommendations', {
        params: {
          limit: 30,
          seed_genres: genre,
          market: 'US'
        }
      });
      const tracks = Array.isArray(response.data?.tracks) ? response.data.tracks : [];
      return tracks.filter(track => track.preview_url);
    };

    const tryBySeedTracks = async (seedTrackIds) => {
      const response = await spotifyApi.get('/v1/recommendations', {
        params: {
          limit: 30,
          seed_tracks: seedTrackIds.slice(0, 5).join(','),
          market: 'US'
        }
      });
      const tracks = Array.isArray(response.data?.tracks) ? response.data.tracks : [];
      return tracks.filter(track => track.preview_url);
    };

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

        const desiredGenre = genreSeed || moodToGenreMap[selectedMood] || 'pop';
        const available = await ensureAvailableGenres();
        const genre = available.has(desiredGenre) ? desiredGenre : 'pop';

        let filteredTracks = [];
        try {
          filteredTracks = await tryByGenre(genre);
        } catch (e) {
          // ignore and try fallback below
        }

        if (filteredTracks.length === 0) {
          try {
            const searchResp = await spotifyApi.get('/v1/search', {
              params: { q: genre, type: 'track', limit: 5, market: 'US' }
            });
            const seedTrackIds = (searchResp.data?.tracks?.items || [])
              .filter(t => t && t.id)
              .map(t => t.id);
            if (seedTrackIds.length > 0) {
              filteredTracks = await tryBySeedTracks(seedTrackIds);
            }
          } catch (e) {
            // swallow; will notify below
          }
        }

        setRecommendations(filteredTracks);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('Token expired or invalid. Redirecting to login...');
          localStorage.removeItem('spotifyToken');
          window.location.href = '/';
        } else {
          notifyError('Error fetching recommendations');
        }
      }
    };

    fetchRecommendations();
  }, [selectedMood, genreSeed, notifyError]);

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
            <img src={track.album?.images?.[0]?.url || '/images/logo.png'} alt={track.name} />
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
