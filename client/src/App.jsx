import { useState, useEffect } from 'react'
import './App.css'
import Tracks from './components/Tracks';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:3000/topTracks')
      .then(response => response.json())
      .then(data => {
        console.log('Data from backend:', data); // Check if this matches the structure you're expecting
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log("error");
        setLoading(false);
      });
  }, []);

  
  return (
    <>
      <div>
        <h2>Artist: ???</h2>
        <input/><button>Hint?</button>
        <h3>Top Tracks</h3>
        {!data ? <></> : <Tracks tracks={data?.toptracks?.track.slice(0, 3)}/>}
      </div>  
    </>
  )
}

export default App
