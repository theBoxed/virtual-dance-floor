function updateDancer(currDancer){ 
  if (currDancer.isReady && currDancer.pose.length > 0){ 
    currDancer.update(); 
  }
}

function initializeParticipants(){ 
  return new Promise((resolve, reject) => { 
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
        resolve(participants);
      })
      .catch(err => console.error('err:', err));  
  })
 
}

function updateParticipants(participants){ 
  if (!participants || participants.length === 0) return; 
  for(let i = 0; i < participants.length; i++){
    console.log('hello'); 
    if(participants[i].getUserId !== null) {
      participants[i].update();
    }
  }
}
