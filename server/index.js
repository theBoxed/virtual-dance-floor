const express = require('express'); 
const app = express(); 
const port = 3000; 

app.get('/api/test', (req, res) => res.send('Test Route')); 

app.listen(port, () => console.log(`Listening on port ${port}`)); 