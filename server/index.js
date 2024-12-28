import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv';


const app = express();
const PORT = 3000;

app.use(cors({
    rigin: 'http://localhost:5173', // Vite's default URL, change if necessary
    methods: ['GET', 'POST'], // Add other methods as needed
    allowedHeaders: ['Content-Type', 'Authorization'] // Add other headers as needed
}));

dotenv.config();
const apiKey = process.env.MY_SECRET_API_KEY;


app.get('/', (req, res) => {
    res.send("good");
})

app.get('/get', (req, res) => {
    fetch(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${apiKey}&artist=Cher&album=Believe&format=json`)
    .then(response => response.json())
    .then(data => res.json(data))
})

app.get('/artistInfo', (req, res) => {
    let Artist = "Justin Bieber";
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${Artist}&api_key=${apiKey}&format=json`)
    .then(response => response.json())
    .then(data => res.json(data))
})

app.get('/topTracks', (req, res) => {
    let Artist = "Justin Beiber";
    fetch(`http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${Artist}&autocorrect=1&api_key=${apiKey}&format=json`)
    .then(response=> response.json())
    .then(data => res.json(data));
})


app.listen(PORT, () => {
    console.log('Server running on ', PORT);
})