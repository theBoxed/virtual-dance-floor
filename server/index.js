const express = require('express'); 
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const cors = require('cors'); 
const app = express(); 

const { PORT, CLIENT_ORIGIN } = require('./config'); 

app.use(bodyParser.json());
app.use(cors({origin: CLIENT_ORIGIN})); 
app.use(morgan('dev')); 

app.get('/api/test', (req, res) => res.send('Test Route')); 

app.post('/api/position/:person', (req, res) => { 
  //TODO: Post the person's position to storage
  res.send('....'); 
}); 

app.get('/api/position', (req, res) => {{ 
  //TODO: Get all of the people's position who are active in the session
  res.send('....'); 
}}); 

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 