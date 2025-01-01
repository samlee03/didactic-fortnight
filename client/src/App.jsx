import { useState, useEffect } from 'react'
import './App.css'
import Tracks from './components/Tracks';

function App() {
  const [artist, setArtist] = useState();

  const [topTracks, setTopTracks] = useState([]);
  const [topAlbums, setTopAlbums] = useState(null);
  const [similarArtists, setSimilarArtists] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_MY_SECRET_API_KEY;
  const [allArtists, setAllArtists] = useState([]);

  // const allArtists = ["Justin Bieber", "Zayn", "Taylor Swift", "Post Malone", "Drake"];

  useEffect(() => {
    const fetchArtist = async () => {
      const response = await fetch('http://localhost:3000/');
      const data = await response.json();
      setArtist(data.artist);
    }
    fetchArtist();

    const retrieveArtists = async (num) => {
      const response = await fetch(`http://localhost:3000/artists${num}`)
      const data = await response.json()
      setAllArtists((prev) => [...prev, ...data.artist.map((e) => e.name)]);
    }
    retrieveArtists(1);
    retrieveArtists(2);
    retrieveArtists(3);
  }, [])

  useEffect(() => {
    if (!artist) return;
    setLoading(true);

    const fetchTopTracks = async () => {
      try {
        const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&autocorrect=1&api_key=${apiKey}&format=json`);
        if (!response.ok) {
          throw new Error(`Error fetching top tracks: ${response.status}`);
        }
        const data = await response.json();
        const top3Tracks = data.toptracks.track.slice(0, 3).map((track) => track.name);
        setTopTracks(top3Tracks);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch top tracks' });
      }
    }

    // Must fix functions below
    const fetchTopAlbum = async () => {
      try {
        const response = await fetch(`http://localhost:3000/topAlbums/${artist}`);
        const data = await response.json();
        setTopAlbums(data);
      } catch (err) {
        console.error('Error fetching top albums:', err);
      }
    };

    const fetchSimilarArtists = async () => {
      try {
        const response = await fetch(`http://localhost:3000/similarArtists/${artist}`);
        const data = await response.json();
        const cleanData = data?.similarartists?.artist?.length
          ? data.similarartists.artist[0].name.split(/[,&]\s*/).map(item => item.trim())
          : [];
        setSimilarArtists(cleanData);
      } catch (err) {
        console.error('Error fetching similar artists:', err);
        setSimilarArtists([]);
      }
    };

    fetchTopTracks();
    fetchTopAlbum();
    fetchSimilarArtists();

    setLoading(false);
  }, [artist]);

  // Function to change the artist (POST request to set it)
  const changeArtist = (artistName) => {
    fetch('http://localhost:3000/setArtist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: artistName,
      }),
    })
      .then(response => response.json())
      .then(data => console.log('Response:', data))
      .catch(error => console.error('Error:', error));
  };

  // Function to randomize the artist
  const randomizeArtist = () => {
    // Randomly select an artist from the list
    const random = Math.floor(Math.random() * allArtists.length);
    const randomArtist = allArtists[random];
    console.log('Randomly selected ', randomArtist);
    changeArtist(randomArtist);
    setArtist(randomArtist);
  };

  return (
    <>
      <div>
        <h2>Artist: {artist}</h2>
        <input/><button onClick={randomizeArtist}>Hint?</button>
        <h4>Top Tracks</h4>
        {/* <Tracks tracks={data.toptracks.track.slice(0, 3)}/> */}
        {/* {!data ? <></> : <Tracks tracks={data?.toptracks?.track.slice(0, 3)}/>} */}
        {/* {!topTracks ? <></> : <p>{topTracks}</p>} */}
        {!topTracks ? (
          <></>
        ) : (
          <ul>
            {topTracks.map((track, index) => (
              <li key={index}>{track}</li>
            ))}
          </ul>
        )}
        <h4>Top Albums</h4>
        {!topAlbums ? <></> : <p>Album Name: {topAlbums.topalbums.album[0].name}</p>}
        {/* {!similarArtists ? <></> : <p>Similar Artists: {similarArtists.similarartists.artist[0].name}</p>} */}
        <h4>Similar Artists</h4>
        {!similarArtists ? <></> : <p>Similar Artists: {similarArtists.filter(e => e != artist).map((artist, index) => (<li key={index}>{artist}</li>))}</p>}
      </div>  
    </>
  )
}

export default App
