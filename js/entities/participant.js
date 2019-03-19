const Participant = () => {
  const participant = Object.assign({}, _draw()); 
  participant.id = null;
  participant.pose = null; 
  participant.color = [100]; 

  participant.update = () => {
    _findPosition();
    let pose = participant.pose; 
    participant.drawPose(pose); 
  }

  const _findPosition = () => { 
    firebase
    .database()
    .ref(`users/${_id}`)
    .once('value')
    .then(snapshot => {
      participant.pose = snapshot.val().pose;
    });  
  }

  return { participant }
}