import express from 'express'
import fetch from 'node-fetch'

const app = express();
const PORT = 3000;


app.get('/', (req, res) => {
    
})

app.listen(PORT, () => {
    console.log('Server running on ', PORT);
})