const manageUsers = () => { 
  const checkForUpdates = () => { 
    let timeToInvoke = 3000; 
    //reads users from fire base every x milliseconds
    const intervalVar  = setInterval(_checkUserList, timeToInvoke);     
  }

  const _checkUserList = () => { 
    firebase
      .database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        console.log('users', snapshot.val()); 
        //go through participants 
        //go through keys in snap shot
        //if a key is in snapshot but not participants
        _addUser(); 
        //if a key is in participants but not snapshot
        _removeUser(); 
      });  
  }

  const _addUser = () => { 
    //add user to array of participants
  }

  const _removeUser = () => { 
    //remove user from array of participants
  }

  return { checkForUpdates }
}