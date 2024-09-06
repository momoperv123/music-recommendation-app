import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const fetchLyrics = async (songTitle, artistName) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/lyrics`, {
      params: { song: songTitle, artist: artistName }
    });

    if (response.data.url) {
      return response.data.url;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    return null;
  }
};

const MusicPlayer = ({ trackUrl, isPlaying, stop, songTitle, artistName }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyricsUrl, setLyricsUrl] = useState('');

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    if (isPlaying && !stop) {
      audio.play().catch((error) => {
        console.error('Failed to play the track:', error);
      });
    } else {
      audio.pause();
    }

    const fetchAndSetLyrics = async () => {
      const url = await fetchLyrics(songTitle, artistName);
      setLyricsUrl(url);
    };

    if (songTitle && artistName) {
      fetchAndSetLyrics();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, [isPlaying, stop, songTitle, artistName]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleLyricsClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src={trackUrl}></audio>
      <input
        type="range"
        value={progress}
        max="100"
        onChange={handleSeek}
        style={{ width: '100%' }}
      />
      <div className="time-display">
        <span>{Math.floor(progress / 100 * duration / 60)}:{Math.floor(progress / 100 * duration % 60).toString().padStart(2, '0')}</span>
        <span> / </span>
        <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
      </div>
      {lyricsUrl && (
        <a 
          href={lyricsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white font-semibold px-4 py-2 mt-2 rounded-md hover:bg-purple-700 transition"
          onClick={handleLyricsClick}
        >
          View Lyrics
        </a>
      )}
    </div>
  );
};

export default MusicPlayer;
