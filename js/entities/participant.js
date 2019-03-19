const Participant = () => {
  //initialize participant and give it extra powers
  const participant = Object.assign(
    { id: null, pose: null, color: [100]}, _draw()); 

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