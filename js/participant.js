const Participant = () => {
  const participant = {}; 
  participant.id = null;
  participant.pose = null; 
  participant.color = [100]; 

  participant.update = () => {
    _findPosition()
  }

  const _findPosition = () => { 
    firebase
    .database()
    .ref(`users/${_id}`)
    .once('value')
    .then(snapshot => {
      _pose = snapshot.val().pose;
    });  
  }

  return Object.assign( participant, _draw()); 
}