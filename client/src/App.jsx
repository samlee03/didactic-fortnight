import { useState, useEffect } from 'react'
import './App.css'
import Tracks from './components/Tracks';

function App() {
  const [artist, setArtist] = useState();
  const [artistInfo, setArtistInfo] = useState();
  const [artistPicture, setArtistPicture] = useState();

  const [topTracks, setTopTracks] = useState([]);
  const [topAlbums, setTopAlbums] = useState(null);
  const [similarArtists, setSimilarArtists] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hints, setHints] = useState([false, false, false, false]);
  const [selectedHint, setSelectedHint] = useState(0);

  const apiKey = import.meta.env.VITE_MY_SECRET_API_KEY;
  const [allArtists, setAllArtists] = useState([]);

  const [displayStats, setDisplayStats] = useState(false);
  const [inputText, setInputText] = useState("");

  // Initial Fetch
  useEffect(() => {
    const fetchArtist = async () => {
      const response = await fetch('http://localhost:3000/');
      const data = await response.json();
      setArtist(data.artist);
    }
    let myArtist = "Post Malone"
    setArtist(myArtist);
    // fetchArtist();
    const retrieveArtists = async (num) => {
      const response = await fetch(`http://localhost:3000/artists${num}`)
      const data = await response.json()
      setAllArtists((prev) => [...prev, ...data.artist.map((e) => e.name)]);
    }
    retrieveArtists(1);
    retrieveArtists(2);
    retrieveArtists(3);
    // allArtists ? setArtist(allArtists[Math.floor(Math.random() * allArtists.length)]) : setArtist("Post Malone");
    // setArtist(allArtists[Math.floor(Math.random() * allArtists.length)]);
  }, [])

  // 
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

    
    const fetchTopAlbum = async () => {
      try {
        const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${apiKey}&format=json`);
        if (!response.ok) {
          throw new Error(`Error fetching top tracks: ${response.status}`);
        }
        const data = await response.json();
        setTopAlbums(data);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch top tracks' });
      }
    };

    const fetchSimilarArtists = async () => {
      try {
        const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${apiKey}&format=json`);
        if (!response.ok) {
          throw new Error(`Error fetching top tracks: ${response.status}`);
        }
        const data = await response.json();
        const cleanData = data.similarartists.artist[0].name.split(/[,&]\s*/).map((e) => e.trim()).filter(e => e != artist);
        setSimilarArtists(cleanData);
      } catch (error) {
        setSimilarArtists([]);
      }
    };

    const fetchInfo = async() => {
      // const response = await fetch(`http://localhost:3000/artistInfo/${artist}`);
      // const data = await response.json();
      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${apiKey}&format=json`)
      const data = await response.json();

      setArtistInfo(data);
      // console.log(artistInfo);    
    }
      const fetchArtistPicture = async () => {
        try {
          const response = await fetch(`http://localhost:3000/artistImage/${artist}`);
          if (!response.ok) {
            throw new Error(`Error fetching top tracks: ${response.status}`);
          }
          const data = await response.json();
          // console.log("Good")
          // console.log(data);
          setArtistPicture(data.imageUrl);
          // setArtistPicture("https://placehold.co/300x300");
          // setArtistPicture(data.data[0].artist.picture);
        } catch (error) {
          console.error(error);
          setArtistPicture("https://placehold.co/150x150");
        }
      }
    fetchTopTracks();
    fetchTopAlbum();
    fetchSimilarArtists();
    fetchInfo();
    fetchArtistPicture();
    setLoading(false);
  }, [artist]);

  // Function to randomize the artist
  const randomizeArtist = () => {
    // Randomly select an artist from the list
    const random = Math.floor(Math.random() * allArtists.length);
    const randomArtist = allArtists[random];
    const newArr = allArtists.filter((e) => e != randomArtist);
    setAllArtists(newArr);
    console.log('Randomly selected ', randomArtist);
    setArtist(randomArtist);  
    setDisplayStats(false);
    setHints([false, false, false, false])
    setSelectedHint(0);
  };

  const getHint = () => {
    setHints(prev => {
      let copy = [...prev];
      copy[selectedHint] = true;
      
      return copy;
    });
    if (selectedHint < 3) {
      setSelectedHint(prev => prev + 1);
    }
  }

  const submitArtist = () => {
    if (inputText.toLowerCase() == artist.toLowerCase()){
      setDisplayStats(true);
      setInputText("");
    }
    // console.log("submited", inputText, " ,  while artist is ", artist);
  }

  const revealArtist = () => {
    setDisplayStats(true);
    setInputText("");
  }

  return (
    <>
      <div className="App">
        <div className="container">
        {displayStats 
          ?
            
            <div className='bio-card'>
              <h2> Artist: {artist} </h2>
              {!artistPicture ? <></> : <img src={artistPicture}/>}
              <p className='bio'>
                
                {!artistInfo ? (
                  <></>  // Render nothing if artistInfo is not available
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: artistInfo.artist.bio.summary,
                    }}
                  ></span>
                )}
              </p>
              <p>Listeners: {!artistInfo ? <></> : Intl.NumberFormat('en-US').format(artistInfo.artist.stats.listeners)}</p>
              <p>Play Count: {!artistInfo ? <></> : Intl.NumberFormat('en-US').format(artistInfo.artist.stats.playcount)}</p>
              <button onClick={randomizeArtist}>Guess Another Artist!</button>
            </div>
          :
          <>
            <h2>Guess the Artist! </h2>
            <input placeholder="Guess the artist.." value={inputText} onChange={(e) => setInputText(e.target.value)}/><button onClick={submitArtist}>Submit</button>
            <h3>Top Tracks</h3>
            {!topTracks ? (
              <></>
            ) : (
              <ul>
                {topTracks.map((track, index) => (
                  <li key={index}>{track}</li>
                ))}
              </ul>
            )}
            <h3>Top Albums</h3>
            {(!topAlbums || !hints[0]) ? <span>???</span> : <p>Album Name: {topAlbums.topalbums.album[0].name}</p>}
            <h3>Similar Artists</h3>
            {!similarArtists || !hints[1]? <span>???</span> : <p>Similar Artists: {similarArtists.filter(e => e != artist).map((artist, index) => (<li key={index}>{artist}</li>))}</p>}
            <div>
              <button className='big-buttons' onClick={getHint}>Hint?</button> <button className='big-buttons' onClick={revealArtist}>New Artist</button>
            </div>
          </>
        }
        </div>
      </div>  
    </>
  )
}

export default App
