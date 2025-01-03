import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv';


const app = express();
app.use(express.json())
const PORT = 3000;
let ArtistName = "Drake";

app.use(cors({
    origin: 'http://localhost:5173', // Vite's default URL, change if necessary
    methods: ['GET', 'POST'], // Add other methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'] // Add other headers as needed
}));

dotenv.config();
const apiKey = process.env.MY_SECRET_API_KEY;


app.get('/', (req, res) => {
    res.json({ artist: ArtistName });
});

app.get('/get', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=Cher&album=Believe&format=json`)
    .then(response => response.json())
    .then(data => res.json(data))
});

app.get('/artistInfo/:artist', (req, res) => {
    // let Artist = ArtistName;
    const { artist } = req.params;

    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
    .then(data => res.json(data))
});

app.get('/topTracks/:artist', async (req, res) => {
    const { artist } = req.params;

    try {
      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${artist}&autocorrect=1&api_key=${apiKey}&format=json`);
      if (!response.ok) {
        throw new Error(`Error fetching top tracks: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Failed to fetch top tracks' });
    }
  });

app.get('/topAlbums/:artist', (req, res) => {
    // let Artist = "Justin Bieber";
    // let Artist = ArtistName;
    const { artist } = req.params;

    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${artist}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => res.json(data));
});

app.get('/similarArtists/:artist', (req, res) => {
    // let Artist = "Justin Bieber";
    const { artist } = req.params;

    let Artist = ArtistName;
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artist}&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => res.send(data));
});
app.post('/setArtist', (req, res) => {
    let { name } = req.body;
    ArtistName = name;
    // res.json({ message: `Set artist as ${name}` });
});

app.get('/chartTopTracks', (req, res) => {
    fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`)
        .then(response => response.json())
        .then(data => res.send(data))
})
app.get('/artists1', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&page=1`)
        .then(response => response.json())
        .then(data => res.send(data.artists));
})
app.get('/artists2', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&page=2`)
        .then(response => response.json())
        .then(data => res.send(data.artists));
})
app.get('/artists3', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&page=3`)
        .then(response => response.json())
        .then(data => res.send(data.artists));
})

app.listen(PORT, () => {
    console.log('Server running on ', PORT);
});