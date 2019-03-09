const express = require('express'); 
const app = express(); 

const { PORT, CLIENT_ORIGIN } = require('./config'); 

app.get('/api/test', (req, res) => res.send('Test Route')); 

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 