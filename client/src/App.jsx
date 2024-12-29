import { useState, useEffect } from 'react'
import './App.css'
import Tracks from './components/Tracks';

function App() {
  const [data, setData] = useState(null);
  const [topAlbums, setTopAlbums] = useState(null);
  const [similarArtists, setSimilarArtists] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:3000/topTracks')
      .then(response => response.json())
      .then(data => {
        // console.log('Data from backend:', data); // Check if this matches the structure you're expecting
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("error");
        setLoading(false);
      });
  }, []);

  const fetchTopAlbum = async (artist) => {
    fetch('http://localhost:3000/topAlbums')
      .then(response => response.json())
      .then (data => setTopAlbums(data));
  }

  const fetchSimilarArtists = async(artist) => {
    fetch('http://localhost:3000/similarArtists')
      .then(response => response.json())
      .then(data => setSimilarArtists(data));
  }
  fetchSimilarArtists();
  
  return (
    <>
      <div>
        <h2>Artist: ???</h2>
        <input/><button onClick={fetchTopAlbum}>Hint?</button>
        <h3>Top Tracks</h3>
        {!data ? <></> : <Tracks tracks={data?.toptracks?.track.slice(0, 3)}/>}
        {!topAlbums ? <></> : <p>Album Name: {topAlbums.topalbums.album[0].name}</p>}
        {!similarArtists ? <></> : <p>Similar Artists: {similarArtists.similarartists.artist[0].name}</p>}
      </div>  
    </>
  )
}

export default App
