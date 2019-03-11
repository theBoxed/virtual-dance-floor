const app = require('express'); 
const router = app.Router(); 

router.post('/:person', (req, res) => { 
  //TODO: Post the person's position to storage
  res.send('....'); 
}); 

router.get('/', (req, res) => {{ 
  //TODO: Get all of the people's position who are active in the session
  res.send('....'); 
}}); 

router.get('/test', (req, res) => res.send('Test Route'));

module.exports = router; 
