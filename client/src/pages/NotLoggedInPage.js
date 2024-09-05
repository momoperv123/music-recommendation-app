import React from 'react';
import SpotifyLogin from '../components/SpotifyLogin'; 

const NotLoggedInPage = () => {
  console.log('NotLoggedInPage is rendering');

  return (
    <div className="not-logged-in-page h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden">
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

      <div className="bg-white p-8 rounded-lg shadow-lg text-center z-10 max-w-2xl w-full">
        <img 
          src="/images/logo.png" 
          alt="Rhythm Logo" 
          className="h-24 w-24 mx-auto mb-2"
        />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          🎵 Welcome to Rhythm: Your Ultimate Music Companion! 🎶
        </h1>
        <p className="text-gray-700 mb-6">
          Dive into a world of personalized music recommendations! Log in with your Spotify account and let the rhythm guide you to your next favorite song. 🎧
        </p>

        <div className="flex justify-center">
          <SpotifyLogin />
        </div>
      </div>
    </div>
  );
};

export default NotLoggedInPage;
