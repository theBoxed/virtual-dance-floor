const Participant = () => {
  //initialize participant and give it extra powers
  const participant = Object.assign(
    { id: null, pose: null, color: [100]}, _draw()); 

  participant.update = () => {
    _findPosition();
    participant.drawPose(participant.pose); 
  }

  const _findPosition = () => { 
    firebase
      .database()
      .ref(`users/${participant.id}`)
      .once('value')
      .then(snapshot => {
        participant.pose = snapshot.val().pose;
      });  
  }

  return participant; 
}