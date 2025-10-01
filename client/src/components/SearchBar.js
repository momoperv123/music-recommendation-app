import React, { useState, useEffect, useRef } from 'react';
import { spotifyApi } from '../spotifyClient';
import { useToast } from './ToastProvider';

const SearchBar = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { notifyError } = useToast();
  const searchBarRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const token = localStorage.getItem('spotifyToken');
          if (!token) {
            console.error('No Spotify token found in localStorage.');
            return;
          }

          const response = await spotifyApi.get('/v1/search', {
            params: {
              q: query,
              type: 'track,artist',
              limit: 10,
            }
          });

          if (response && response.data) {
            const artistIds = response.data.artists?.items.map(artist => artist.id) || [];
            const trackResults = response.data.tracks?.items.filter(track => track.preview_url) || [];

            const artistTracksPromises = artistIds.map(id =>
              spotifyApi.get(`/v1/artists/${id}/top-tracks`, {
                params: { market: 'US' }
              })
            );

            const artistTracksResponses = await Promise.all(artistTracksPromises);
            const validArtists = response.data.artists?.items.filter((artist, index) => {
              return artistTracksResponses[index]?.data.tracks.some(track => track.preview_url);
            }) || [];

            setSearchResults([...trackResults, ...validArtists]);
          } else {
            notifyError('Unexpected Spotify response while searching');
          }
        } catch (error) {
          notifyError('Error searching Spotify');
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
  };

  const handleSelect = async (result) => {
    if (result.type === 'track') {
      onSelect(result);
    } else if (result.type === 'artist') {
      try {
        const token = localStorage.getItem('spotifyToken');
        if (!token) {
          console.error('No Spotify token found in localStorage.');
          return;
        }

        const response = await spotifyApi.get(`/v1/artists/${result.id}/top-tracks`, {
          params: { market: 'US' }
        });

        if (response && response.data) {
          const artistTracks = response.data.tracks.filter(track => track.preview_url);
          onSelect({ type: 'artist', tracks: artistTracks, artistName: result.name });
        } else {
          console.error("Failed to fetch artist's top tracks:", response);
        }
      } catch (error) {
        console.error('Error fetching artist top tracks:', error.response ? error.response.data : error.message);
      }
    }

    setSearchResults([]); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        handleSelect(searchResults[0]);
      }
    }
  };

  return (
    <div ref={searchBarRef} className="search-bar relative">
      <input
        type="text"
        placeholder="Search for songs or artists..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="search-input w-full p-2 rounded border border-gray-300"
      />
      {searchResults.length > 0 && (
        <div className="search-results absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="search-result-item px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(result)}
            >
              {result.type === 'track' ? (
                <>
                  🎵 {result.name} - {result.artists[0].name}
                </>
              ) : (
                <>
                  🎤 {result.name} (Artist)
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
