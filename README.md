# Rhythm Music App

## Project Description

Rhythm is a dynamic and interactive music application that allows users to search for their favorite songs, discover similar tracks based on moods, and enjoy a seamless music playback experience. The app integrates with the Spotify API and Genius API to provide real-time music recommendations, detailed song information, and lyrics.

## Features

- **Search Functionality**: Users can search for songs or artists and receive detailed information about the selected track or artist.
- **Mood-Based Recommendations**: Users can select a mood (e.g., Happy, Chill, Sad, etc.), and the app will recommend songs that match the selected mood.
- **Music Playback**: Integrated music player that allows users to play, pause, and seek through tracks.
- **Artist Track Listing**: When an artist is selected, the app displays a list of the artist's top tracks.
- **Lyrics Integration**: Fetch and display song lyrics using the Genius API.
- **Responsive UI**: The app features a responsive user interface, including a hamburger menu that adapts to different screen sizes.

## Installation

To get started with the Rhythm Music App, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MohammadP123/music-recommendation-app.git
   cd music-recommendation-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add your Spotify and Genius API credentials:
     ```plaintext
     REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
     REACT_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     GENIUS_API_KEY=your_genius_api_key
     ```

4. **Start the server**:
   - The backend server is powered by Express.js and runs on port `5000` by default. You can change the port by setting the `PORT` environment variable.
   - Start the server with the following command:
     ```bash
     npm run server
     ```

5. **Start the development server**:
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000`.

## Usage

1. **Search for a song or artist**: Use the search bar to find your favorite music.
2. **Select a mood**: Choose a mood from the mood filters to discover songs that match your current vibe.
3. **Play music**: Click on a track to start playing it. You can control playback using the built-in music player.
4. **Explore artists**: Click on an artist to view their top tracks.
5. **View Lyrics**: When a track is playing, click the "View Lyrics" button to see the lyrics fetched from the Genius API.

## Technologies Used

- **React.js**: Front-end library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Spotify API**: Integrated to fetch song, artist, and recommendation data.
- **Genius API**: Integrated to fetch song lyrics.
- **Express.js**: Backend server framework.
- **React Router**: For handling in-app navigation.
- **Axios**: For making HTTP requests to the APIs.
- **CORS**: Cross-Origin Resource Sharing enabled on the server to allow the frontend to make API requests.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## Contact Information

For any questions or inquiries, please contact [momoperv123@gmail.com]