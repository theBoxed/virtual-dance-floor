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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 