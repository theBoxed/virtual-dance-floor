
function initializeParticipants(){ 
  firebase
  .database()
  .ref('users/')
  .once('value')
  .then((world)=> {
    for(let user in world.val()){ 
      if(user !== dancer.id) {
        let currParticipant = Object.assign(Participant(), _draw());
        currParticipant.pose = world.val()[user].pose; 
        currParticipant.id = user; 
        participants.push(currParticipant);
      }
    }
    return participants;
  })
}