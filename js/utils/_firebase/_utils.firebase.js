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

function updateDancer(dancer){ 
  dancer.update();
  dancer.draw._drawPose(dancer.pose, {color: [100]})
}

function updateParticipants(participants){ 
  for(let i = 0; i < participants.length; i++){
    if(participants[i].getUserId !== null) {
      participants[i].update();
      participants[i].draw._drawPose(participants[i].pose, {color: [100]})
    }
  }
}