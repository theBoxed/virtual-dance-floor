function updateDancer(currDancer){ 
  if (currDancer.isReady && currDancer.pose.length > 0){ 
    currDancer.update(); 
  }
}

function initializeParticipants(){ 
  let participants = []; 
  firebase
    .database()
    .ref('users/')
    .once('value')
    .then(world => { 
      for(let user in world.val()){
        if(user !== dancer.id)   {
          let currParticipant = Participant(); 
          //sets id
          currParticipant.id = user; 
          //initializes starting pose
          currParticipant.pose = world.val()[user].pose; 
          participants.push(currParticipant);
        }
      }
      return participants;
    }); 
}

function updateParticipants(participants){ 
  if (!participants || participants.length === 0) return; 
  for(let i = 0; i < participants.length; i++){
    if(participants[i].getUserId !== null) {
      participants[i].update();
    }
  }
}
