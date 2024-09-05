import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecommendationCarousel from '../components/RecommendationCarousel';
import SearchBar from '../components/SearchBar';
import MusicPlayer from '../components/MusicPlayer';

const moodButtonStyles = {
  happy: 'bg-yellow-400 hover:bg-yellow-600',
  chill: 'bg-blue-400 hover:bg-blue-600',
  sad: 'bg-gray-400 hover:bg-gray-600',
  romantic: 'bg-pink-400 hover:bg-pink-600',
  focus: 'bg-green-400 hover:bg-green-600',
  workout: 'bg-orange-400 hover:bg-orange-600',
};

const darkModeTextColor = 'dark:text-black';

const LandingPage = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [artistTracks, setArtistTracks] = useState(null);
  const [artistName, setArtistName] = useState('');
  const navigate = useNavigate();

  const handleMoodChange = (mood) => {
    setSelectedMood(mood);
    setSelectedTrack(null);
    setCurrentTrackId(null);
    setArtistTracks(null);
    navigate('/');
  };

  const handleSelectTrackOrArtist = (result) => {
    if (result.type === 'track') {
      if (result.id === currentTrackId) {
        setCurrentTrackId(null);
      } else {
        setSelectedTrack(result);
        setCurrentTrackId(result.id);
        setArtistTracks(null);
      }
    } else if (result.type === 'artist') {
      setSelectedTrack(null);
      setCurrentTrackId(null);
      setArtistTracks(result.tracks);
      setArtistName(result.artistName);
    }
  };

  const handleTrackClick = (track) => {
    if (track.id === currentTrackId) {
      setCurrentTrackId(null);
    } else {
      setCurrentTrackId(track.id);
    }
  };

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <div className="bubble-container">
          <span className="bubble">🎵</span>
          <span className="bubble">🎶</span>
          <span className="bubble">🎷</span>
          <span className="bubble">🎸</span>
          <span className="bubble">🎻</span>
          <span className="bubble">🎤</span>
          <span className="bubble">🎧</span>
        </div>
      </div>

      <div className="navbar relative z-10">
        <SearchBar onSelect={handleSelectTrackOrArtist} />
      </div>

      <div className="mood-filters flex justify-center my-4 relative z-10">
        {Object.keys(moodButtonStyles).map((mood) => (
          <button 
            key={mood} 
            onClick={() => handleMoodChange(mood)} 
            className={`m-2 p-2 rounded ${moodButtonStyles[mood]} opacity-75 hover:opacity-100 ${darkModeTextColor} transition duration-300 ease-in-out`}
          >
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </button>
        ))}
      </div>

      {selectedTrack ? (
        <div className="relative z-10">
          <div className="flex justify-center items-center">
            <div
              id="song-card"
              className={`grid-item ${currentTrackId === selectedTrack.id ? 'playing' : ''}`}
              onClick={() => handleTrackClick(selectedTrack)}
            >
              <img src={selectedTrack.album.images[0].url} alt={selectedTrack.name} />
              <p className="text-lg font-semibold text-white">{selectedTrack.name}</p>
              <p className="text-sm text-white">{selectedTrack.artists[0].name}</p>
              <MusicPlayer 
                trackUrl={selectedTrack.preview_url} 
                isPlaying={currentTrackId === selectedTrack.id} 
                stop={currentTrackId !== selectedTrack.id} 
                songTitle={selectedTrack.name}
                artistName={selectedTrack.artists[0].name}
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-center mt-8">Songs Like This</h2>
          <div className="similar-tracks-container">
            <RecommendationCarousel 
              selectedMood={selectedMood} 
              currentTrackId={currentTrackId}
              setCurrentTrackId={setCurrentTrackId} 
            />
          </div>
        </div>
      ) : artistTracks ? (
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-center mt-8">Top Tracks by {artistName}</h2>
          <div className="grid-container">
            {artistTracks.map((track) => (
              <div 
                key={track.id} 
                className={`grid-item ${currentTrackId === track.id ? 'playing' : ''}`}
                onClick={() => handleTrackClick(track)} 
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
            ))}
          </div>
        </div>
      ) : (
        <div className="relative z-10">
          <RecommendationCarousel 
            selectedMood={selectedMood} 
            currentTrackId={currentTrackId}
            setCurrentTrackId={setCurrentTrackId} 
          />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
